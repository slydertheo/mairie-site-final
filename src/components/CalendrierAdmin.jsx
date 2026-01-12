import React, { useEffect, useState, useRef } from 'react';
import 'bulma/css/bulma.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Utilitaires pour normaliser les événements (comme dans PageContentEditor.jsx)
const normalizeEvents = (pageContentData) => {
  if (pageContentData?.agendaItems_json) {
    try {
      const raw = typeof pageContentData.agendaItems_json === 'string'
        ? JSON.parse(pageContentData.agendaItems_json)
        : pageContentData.agendaItems_json;
      if (Array.isArray(raw)) {
        return raw.map((item, idx) => ({
          id: item.id || `event-${idx}-${Date.now()}`,
          titre: item.titre ?? item.title ?? '',
          date: item.date ?? '',
          description: item.description ?? '',
          image: item.image ?? '',
          lieu: item.lieu ?? ''
        }));
      }
    } catch (e) {
      console.error('Erreur parsing agendaItems_json:', e);
    }
  }
  return [];
};

const persistEvents = async (eventsToSave) => {
  const res = await fetch('/api/pageContent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      page: 'accueil',
      agendaItems_json: JSON.stringify(eventsToSave)
    })
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Erreur serveur (${res.status}): ${t || 'POST /api/pageContent a échoué'}`);
  }
  return res.json().catch(() => ({}));
};

function Calendar({ events, onDayClick, currentMonth, currentYear, onMonthChange }) {
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay() || 7; // Lundi = 1

  function getEventsForDay(day) {
    const d = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(ev => ev.date === d);
  }

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const rows = [];
  let cells = [];
  let dayNum = 1;

  // Jours vides avant le premier jour
  for (let i = 1; i < firstDay; i++) {
    cells.push(<td key={`empty-${i}`}></td>);
  }

  // Jours du mois
  for (let i = firstDay; i <= 7; i++) {
    if (dayNum <= daysInMonth) {
      const dayEvents = getEventsForDay(dayNum);
      cells.push(
        <td
          key={dayNum}
          className={`has-text-centered ${dayEvents.length ? 'has-background-info-light' : ''}`}
          style={{
            cursor: dayEvents.length ? 'pointer' : 'default',
            padding: '8px',
            border: '1px solid #e0e7ef',
            borderRadius: 4
          }}
          onClick={() => dayEvents.length && onDayClick(dayEvents)}
        >
          <div className="has-text-weight-bold">{dayNum}</div>
          {dayEvents.map(ev => (
            <div key={ev.id} className="is-size-7 has-text-link" style={{ marginTop: 2 }}>
              {ev.titre}
            </div>
          ))}
        </td>
      );
      dayNum++;
    }
  }
  rows.push(<tr key="row-1">{cells}</tr>);

  // Semaines suivantes
  while (dayNum <= daysInMonth) {
    cells = [];
    for (let i = 0; i < 7; i++) {
      if (dayNum <= daysInMonth) {
        const dayEvents = getEventsForDay(dayNum);
        cells.push(
          <td
            key={dayNum}
            className={`has-text-centered ${dayEvents.length ? 'has-background-info-light' : ''}`}
            style={{
              cursor: dayEvents.length ? 'pointer' : 'default',
              padding: '8px',
              border: '1px solid #e0e7ef',
              borderRadius: 4
            }}
            onClick={() => dayEvents.length && onDayClick(dayEvents)}
          >
            <div className="has-text-weight-bold">{dayNum}</div>
            {dayEvents.map(ev => (
              <div key={ev.id} className="is-size-7 has-text-link" style={{ marginTop: 2 }}>
                {ev.titre}
              </div>
            ))}
          </td>
        );
        dayNum++;
      } else {
        cells.push(<td key={`empty-${dayNum + i}`}></td>);
      }
    }
    rows.push(<tr key={`row-${dayNum}`}>{cells}</tr>);
  }

  return (
    <div className="box" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
      <div className="level mb-4">
        <div className="level-left">
          <button className="button" onClick={() => onMonthChange(-1)} style={{ fontSize: '1.5em', padding: '0.5em 1em' }}>
            <span>←</span>
          </button>
        </div>
        <div className="level-item">
          <h3 className="title is-5 has-text-link">{monthNames[currentMonth]} {currentYear}</h3>
        </div>
        <div className="level-right">
          <button className="button" onClick={() => onMonthChange(1)} style={{ fontSize: '1.5em', padding: '0.5em 1em' }}>
            <span>→</span>
          </button>
        </div>
      </div>
      <table className="table is-fullwidth is-bordered" style={{ borderRadius: 8 }}>
        <thead>
          <tr className="has-background-link has-text-white">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(j => (
              <th key={j} className="has-text-centered">{j}</th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export default function EvenementAdmin() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ titre: '', date: '', description: '', lieu: '' });
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const formRef = useRef(null);

  useEffect(() => {
    // Charger les événements depuis pageContent ET les actualités marquées pour le calendrier
    Promise.all([
      fetch('/api/pageContent?page=accueil').then(res => res.ok ? res.json() : []),
      fetch('/api/actualites?afficherDans=calendrier').then(res => res.ok ? res.json() : [])
    ])
      .then(([pageContent, actualites]) => {
        const pageContentData = pageContent?.[0] || {};
        const pageEvents = normalizeEvents(pageContentData);
        
        // Convertir les actualités en événements
        const actualitesAsEvents = actualites.map(actu => ({
          id: `actu-${actu.id}`,
          titre: actu.title,
          date: actu.date,
          description: actu.description || '',
          lieu: '',
          source: 'actualite' // Marquer la source pour affichage différencié
        }));
        
        // Combiner les deux sources
        setEvents([...pageEvents, ...actualitesAsEvents]);
      })
      .catch(error => console.error('Erreur lors du chargement des données:', error));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async e => {
    e.preventDefault();
    setLoading(true);
    const newEvent = { id: `event-${Date.now()}`, ...form };
    const updatedEvents = [...events, newEvent];
    try {
      await persistEvents(updatedEvents);
      setEvents(updatedEvents);
      setForm({ titre: '', date: '', description: '', lieu: '' });
      toast.success('Événement ajouté');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const ev = events.find(e => e.id === id);
    if (!ev) return;
    
    // Ne pas permettre l'édition des événements venant des actualités
    if (ev.source === 'actualite') {
      toast.warning('Cet événement provient du carrousel. Modifiez-le depuis la gestion du carrousel.');
      return;
    }
    
    setEditMode(true);
    setEditId(id);
    setForm({
      titre: ev.titre || '',
      date: ev.date || '',
      description: ev.description || '',
      lieu: ev.lieu || ''
    });
    // Scroll to the form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    let updatedEvents;
    if (editMode && editId) {
      updatedEvents = events.map(ev => ev.id === editId ? { ...ev, ...form } : ev);
    } else {
      const newEvent = { id: `event-${Date.now()}`, ...form };
      updatedEvents = [...events, newEvent];
    }
    
    // Filtrer seulement les événements qui ne viennent pas des actualités
    const pageEvents = updatedEvents.filter(ev => !ev.source || ev.source !== 'actualite');
    
    try {
      await persistEvents(pageEvents);
      
      // Recharger tous les événements (pageContent + actualités)
      const [pageContent, actualites] = await Promise.all([
        fetch('/api/pageContent?page=accueil').then(res => res.json()),
        fetch('/api/actualites?afficherDans=calendrier').then(res => res.json())
      ]);
      
      const pageContentData = pageContent?.[0] || {};
      const pageEventsRefreshed = normalizeEvents(pageContentData);
      const actualitesAsEvents = actualites.map(actu => ({
        id: `actu-${actu.id}`,
        titre: actu.title,
        date: actu.date,
        description: actu.description || '',
        lieu: '',
        source: 'actualite'
      }));
      
      setEvents([...pageEventsRefreshed, ...actualitesAsEvents]);
      setForm({ titre: '', date: '', description: '', lieu: '' });
      setEditMode(false);
      setEditId(null);
      toast.success(editMode ? 'Événement modifié' : 'Événement ajouté');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    const ev = events.find(e => e.id === id);
    
    // Ne pas permettre la suppression des événements venant des actualités
    if (ev && ev.source === 'actualite') {
      toast.warning('Cet événement provient du carrousel. Supprimez-le depuis la gestion du carrousel.');
      return;
    }
    
    // Afficher toast de confirmation avec bouton
    toast.info(
      <div>
        <p>Voulez-vous vraiment supprimer cet événement?</p>
        <div className="buttons mt-3">
          <button 
            className="button is-danger is-small" 
            onClick={async () => {
              toast.dismiss();
              
              // Afficher toast de chargement
              const loadingToastId = toast.loading("Suppression en cours...");
              setLoading(true);
              
              try {
                const pageEvents = events.filter(ev => (!ev.source || ev.source !== 'actualite') && ev.id !== id);
                await persistEvents(pageEvents);
                
                // Recharger tous les événements
                const [pageContent, actualites] = await Promise.all([
                  fetch('/api/pageContent?page=accueil').then(res => res.json()),
                  fetch('/api/actualites?afficherDans=calendrier').then(res => res.json())
                ]);
                
                const pageContentData = pageContent?.[0] || {};
                const pageEventsRefreshed = normalizeEvents(pageContentData);
                const actualitesAsEvents = actualites.map(actu => ({
                  id: `actu-${actu.id}`,
                  titre: actu.title,
                  date: actu.date,
                  description: actu.description || '',
                  lieu: '',
                  source: 'actualite'
                }));
                
                setEvents([...pageEventsRefreshed, ...actualitesAsEvents]);
                
                // Remplacer toast de chargement par toast de succès
                toast.update(loadingToastId, { 
                  render: "Événement supprimé avec succès", 
                  type: "success",
                  isLoading: false,
                  autoClose: 3000
                });
              } catch (error) {
                // Toast d'erreur
                toast.update(loadingToastId, { 
                  render: "Erreur lors de la suppression", 
                  type: "error",
                  isLoading: false,
                  autoClose: 3000
                });
                console.error("Erreur de suppression:", error);
              } finally {
                setLoading(false);
              }
            }}
          >
            Confirmer
          </button>
          <button 
            className="button is-light is-small" 
            onClick={() => toast.dismiss()}
          >
            Annuler
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false,
        pauseOnFocusLoss: false,
        pauseOnHover: false,
      }
    );
  };

  const handleDayClick = (dayEvents) => {
    setSelectedDayEvents(dayEvents);
    setShowModal(true);
  };

  const handleMonthChange = (direction) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <div className="box" style={{ borderRadius: 14, background: '#fafdff' }}>
      <h2 className="title is-4 mb-4 has-text-link">🗓️ Gestion du calendrier des événements</h2>
      
      {/* Notification d'information sur le partage */}
      <div className="notification is-success is-light mb-4">
        <div className="content">
          <p className="has-text-weight-bold mb-2">
            📅 Événements partagés depuis le carrousel
          </p>
          <p className="is-size-7 mb-2">
            Les actualités marquées pour le <strong>calendrier</strong> s'affichent automatiquement ici.
            Vous pouvez aussi créer des événements spécifiques au calendrier.
          </p>
          <p className="is-size-7">
            <span className="tag is-warning is-light">🎠</span> = Événement partagé depuis le carrousel (modification uniquement depuis le carrousel)
          </p>
        </div>
      </div>
      
      {/* Modal pour afficher les événements du jour */}
      <div className={`modal ${showModal ? 'is-active' : ''}`}>
        <div className="modal-background" onClick={() => setShowModal(false)}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Événements du jour</p>
            <button className="delete" aria-label="close" onClick={() => setShowModal(false)}></button>
          </header>
          <section className="modal-card-body">
            {selectedDayEvents.length === 0 ? (
              <p>Aucun événement pour ce jour.</p>
            ) : (
              selectedDayEvents.map(ev => (
                <div key={ev.id} className="box mb-2" style={{ 
                  borderRadius: 8, 
                  background: ev.source === 'actualite' ? '#fff3cd' : '#f9fbfd',
                  borderLeft: ev.source === 'actualite' ? '4px solid #ffc107' : '4px solid #3273dc'
                }}>
                  {ev.source === 'actualite' && (
                    <span className="tag is-warning is-light mb-2">
                      🎠 Depuis le carrousel
                    </span>
                  )}
                  <h4 className="title is-6 has-text-link">{ev.titre}</h4>
                  <p className="is-size-7"><strong>Date:</strong> {ev.date}</p>
                  <p className="is-size-7"><strong>Lieu:</strong> {ev.lieu || 'N/A'}</p>
                  <p className="is-size-7"><strong>Description:</strong> {ev.description || 'Aucune'}</p>
                </div>
              ))
            )}
          </section>
          <footer className="modal-card-foot">
            <button className="button is-link" onClick={() => setShowModal(false)}>Fermer</button>
          </footer>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="box mb-4" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
        <h3 className="subtitle is-5 mb-3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>📝</span> {editMode ? 'Modifier un événement' : 'Ajouter un événement'}
        </h3>
        <div className="field">
          <label className="label is-small">Titre</label>
          <div className="control">
            <input 
              className="input" 
              name="titre" 
              value={form.titre} 
              onChange={handleChange} 
              required 
              readOnly={loading}
              style={{ background: loading ? "#f5f5f5" : "white" }}
            />
          </div>
        </div>
        <div className="field">
          <label className="label is-small">Date</label>
          <div className="control">
            <input 
              className="input" 
              type="date" 
              name="date" 
              value={form.date} 
              onChange={handleChange} 
              required 
              readOnly={loading}
              style={{ background: loading ? "#f5f5f5" : "white" }}
            />
          </div>
        </div>
        <div className="field">
          <label className="label is-small">Description</label>
          <div className="control">
            <textarea 
              className="textarea" 
              name="description" 
              rows={3} 
              value={form.description} 
              onChange={handleChange} 
              readOnly={loading}
              style={{ background: loading ? "#f5f5f5" : "white" }}
            />
          </div>
        </div>
        <div className="field">
          <label className="label is-small">Lieu</label>
          <div className="control">
            <input 
              className="input" 
              name="lieu" 
              value={form.lieu} 
              onChange={handleChange} 
              readOnly={loading}
              style={{ background: loading ? "#f5f5f5" : "white" }}
            />
          </div>
        </div>
        <div className="field is-grouped mt-4">
          <div className="control">
            <button className={`button is-link${loading ? ' is-loading' : ''}`} type="submit" disabled={loading}>
              {editMode ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
          {editMode && (
            <div className="control">
              <button type="button" className="button is-light" onClick={() => { setEditMode(false); setEditId(null); setForm({ titre: '', date: '', description: '', lieu: '' }); }} disabled={loading}>
                Annuler
              </button>
            </div>
          )}
        </div>
      </form>

      <Calendar 
        events={events} 
        onDayClick={handleDayClick} 
        currentMonth={currentMonth} 
        currentYear={currentYear} 
        onMonthChange={handleMonthChange} 
      />

      <div className="box mt-4" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
        <h3 className="subtitle is-5 mb-3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>📋</span> Liste des événements
        </h3>
        <table className="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Titre</th>
              <th>Description</th>
              <th>Lieu</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {events.map(ev => (
              <tr key={ev.id} style={{ 
                background: ev.source === 'actualite' ? '#fffbf0' : 'transparent' 
              }}>
                <td>
                  {ev.date}
                  {ev.source === 'actualite' && (
                    <span className="tag is-warning is-light is-small ml-2">🎠</span>
                  )}
                </td>
                <td>{ev.titre}</td>
                <td>{ev.description}</td>
                <td>{ev.lieu}</td>
                <td>
                  {ev.source === 'actualite' ? (
                    <span className="tag is-light is-small" title="Événement partagé depuis le carrousel">
                      📍 Partagé
                    </span>
                  ) : (
                    <div className="buttons are-small">
                      <button className="button is-info" onClick={() => handleEdit(ev.id)} disabled={loading}>
                        ✏️
                      </button>
                      <button className="button is-danger" onClick={() => handleDelete(ev.id)} disabled={loading}>
                        🗑️
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-right" autoClose={3000} newestOnTop />
    </div>
  );
}