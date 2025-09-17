import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.min.css';
import Layout from '../components/Layout'; // Import du layout
import QuickBoxEcole from '../components/QuickBoxEcole';
import ActualiteCarousel from '../components/ActualiteCarousel';

export default function PageAcceuil() {
  const [contact, setContact] = useState({ nom: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);
  const [content, setContent] = useState({});
  const [events, setEvents] = useState([]);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [actualites, setActualites] = useState([]);

  useEffect(() => {
    fetch('/api/pageContent?page=accueil')
      .then(res => res.json())
      .then(data => {
        setContent(data[0] || {});
      });
  }, []);

  useEffect(() => {
    fetch('/api/evenements')
      .then(res => res.json())
      .then(setEvents);
  }, []);

  useEffect(() => {
    fetch('/api/actualites')
      .then(res => res.json())
      .then(setActualites);
  }, []);

  function handleContactChange(e) {
    setContact({ ...contact, [e.target.name]: e.target.value });
  }
  function handleContactSubmit(e) {
    e.preventDefault();
    setContactSent(true);
    setContact({ nom: '', email: '', message: '' });
  }

  return (
    <Layout>
      <div className="has-background-light" style={{ minHeight: '100vh' }}>
        {/* Bandeau image + titre */}
        <section className="hero is-primary is-medium" style={{
          backgroundImage: 'linear-gradient(180deg,rgba(10,37,64,0.55),rgba(10,37,64,0.25)),url("village.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '0 0 32px 32px',
          boxShadow: '0 8px 32px #0a254030',
          marginBottom: 32,
        }}>
          <div className="hero-body">
            <div className="container has-text-centered">
              <h1 className="title is-2 has-text-weight-bold" style={{ color: '#fff', textShadow: '0 4px 24px #0a2540a0', letterSpacing: 1 }}>
                {content.hero_titre || <>Bienvenue sur le site officiel de<br />la Mairie de <span style={{ color: '#ffd700', textShadow: '0 2px 8px #1277c6' }}>Friesen</span></>}
                <br />
                <span style={{ fontSize: 24 }}>Site officiel de la commune</span>
              </h1>
            </div>
          </div>
        </section>

        <div className="container" style={{ maxWidth: 1200, margin: '0 auto 40px auto' }}>
          <h2 className="title is-4 has-text-primary mb-5">{content.actualites_titre || "Dernières actualités"}</h2>
          <ActualiteCarousel actualites={actualites} />

          <div className="columns is-variable is-5">
            {/* Colonne 1 : Mot du Maire + Galerie + Panneau d'affichage */}
            <div className="column is-two-thirds">
              <h2 className="title is-5 has-text-primary mb-2 mt-5">{content.motMaire_titre || "Mot du Maire"}</h2>
              <div className="box p-5" style={{ background: '#f8fafc', borderRadius: 12 }}>
                <div className="columns">
                  {/* Colonne pour la photo */}
                  <div className="column is-narrow">
                    <figure className="image is-128x128" style={{ margin: '0 auto' }}>
                      <img
                        className="is-rounded"
                        src={content.motMaire_photo || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=200&q=80"}
                        alt="Maire"
                        style={{ 
                          objectFit: 'cover', 
                          border: '3px solid #1277c6',
                          boxShadow: '0 4px 12px rgba(18, 119, 198, 0.2)',
                          width: '100%',
                          height: '100%'
                        }}
                        onError={e => { e.currentTarget.src = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=200&q=80"; }}
                      />
                    </figure>
                  </div>
                  
                  {/* Colonne pour le texte */}
                  <div className="column">
                    <div className="has-text-link has-text-weight-bold mb-3" style={{ fontSize: '1.1rem' }}>
                      {content.motMaire_accroche || "Chères habitantes, chers habitants"}
                    </div>
                    <div style={{ 
                      fontSize: 16, 
                      color: '#444', 
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.6' 
                    }}>
                      {content.motMaire}
                    </div>
                    <div className="has-text-right mt-4">
                      <div className="has-text-weight-bold">{content.motMaire_nom || "Pierre Durand"}</div>
                      <div className="is-italic" style={{ fontSize: '0.9rem' }}>{content.motMaire_titre_signature || "Maire de Friesen"}</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Ajout du panneau d'affichage ici */}
              <div
                className="box"
                style={{
                  background: 'repeating-linear-gradient(135deg, #c2a77d 0px, #c2a77d 28px, #b3936b 28px, #b3936b 56px)',
                  borderRadius: 18,
                  minHeight: 220,
                  boxShadow: '0 4px 24px #a97c5020',
                  position: 'relative',
                  margin: '32px auto',
                  maxWidth: 900,
                  padding: '32px 24px'
                }}
              >
                <h2 className="title is-4 has-text-dark mb-4" style={{ textShadow: '0 2px 8px #fffbe6', textAlign: 'center', letterSpacing: 1 }}>
                  🗂️ Panneau d’affichage du village
                </h2>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {/* Exemple d'affiche */}
                  <div style={{
                    background: '#fffbe6',
                    border: '2px dashed #a97c50',
                    borderRadius: 12,
                    boxShadow: '0 2px 12px #a97c5030',
                    padding: '18px 22px',
                    minWidth: 180,
                    maxWidth: 220,
                    marginBottom: 12,
                    fontWeight: 500,
                    color: '#a97c50',
                    fontSize: 16,
                    position: 'relative'
                  }}>
                    <span style={{ fontSize: 22, position: 'absolute', top: 8, right: 12 }}>📌</span>
                    <div>Fête du village<br /><b>Samedi 21 septembre</b></div>
                  </div>
                  <div style={{
                    background: '#eaf6ff',
                    border: '2px solid #1277c6',
                    borderRadius: 12,
                    boxShadow: '0 2px 12px #1277c630',
                    padding: '18px 22px',
                    minWidth: 180,
                    maxWidth: 220,
                    marginBottom: 12,
                    fontWeight: 500,
                    color: '#1277c6',
                    fontSize: 16,
                    position: 'relative'
                  }}>
                    <span style={{ fontSize: 22, position: 'absolute', top: 8, right: 12 }}>📌</span>
                    <div>Marché des producteurs<br /><b>Dimanche 6 octobre</b></div>
                  </div>
                  {/* Ajoute d'autres affiches ici */}
                </div>
              </div>
            </div>

            {/* Colonne 2 : Agenda + Infos pratiques + Calendrier + Contact */}
            <div className="column is-one-third">
              <h2 className="title is-5 has-text-primary mb-3">{content.agenda_titre || "Agenda des événements"}</h2>
              <div className="mb-4">
                <AgendaItem title={content.agenda1_title} date={content.agenda1_date} />
                <AgendaItem title={content.agenda2_title} date={content.agenda2_date} />
                <a href={content.agenda_link} className="is-link is-underlined ml-4" style={{ fontWeight: 700, fontSize: 15 }}>
                  {content.agenda_lien_label || "Voir tous les événements"}
                </a>
              </div>
              <h2 className="title is-5 has-text-primary mb-2">{content.infos_titre || "Infos pratiques"}</h2>
              <div className="mb-2"><span style={infoIcon}>🕒</span>
                <b>{content.horaires_titre || "Horaires d’ouverture"}</b><br />
                {(content.horaires || "").split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
              </div>
              <div className="mb-2"><span style={infoIcon}>📍</span>
                {(content.adresse || "").split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
              </div>
              <div className="mb-2"><span style={infoIcon}>📞</span>
                {content.telephone}
              </div>
              <div className="mb-4"><span style={infoIcon}>✉️</span>
                {content.email}
              </div>
              <h2 className="title is-5 has-text-primary mb-2 mt-5">{content.calendrier_titre || "Calendrier"}</h2>
              <div className="box" style={{ background: '#f8fafc', marginBottom: 18 }}>
                <Calendar
                  events={events}
                  onDayClick={evs => { setSelectedDayEvents(evs); setShowModal(true); }}
                />
              </div>
              <h2 className="title is-5 has-text-primary mb-2 mt-5">{content.contact_titre || "Contactez la mairie"}</h2>
              <div className="box" style={{ background: '#f8fafc' }}>
                {contactSent ? (
                  <div className="notification is-success">Votre message a bien été envoyé !</div>
                ) : (
                  <form onSubmit={handleContactSubmit}>
                    <div className="field">
                      <label className="label">Nom</label>
                      <div className="control">
                        <input className="input" type="text" name="nom" value={contact.nom} onChange={handleContactChange} required />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Email</label>
                      <div className="control">
                        <input className="input" type="email" name="email" value={contact.email} onChange={handleContactChange} required />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Message</label>
                      <div className="control">
                        <textarea className="textarea" name="message" value={contact.message} onChange={handleContactChange} required />
                      </div>
                    </div>
                    <div className="field is-grouped is-grouped-right">
                      <div className="control">
                        <button className="button is-link" type="submit">Envoyer</button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Widgets supplémentaires - MODIFIER CETTE PARTIE */}
          <div className="columns mt-6 mb-5">
            <div className="column is-2">
              {/* Widget météo */}
              <div className="box has-text-centered" style={{ background: '#eaf6ff' }}>
                <span style={{ fontSize: 38 }}>🌤️</span>
                <div className="has-text-link has-text-weight-bold mt-2">{content.meteo}</div>
                <div style={{ fontSize: 15 }}>{content.meteo_legende}</div>
              </div>
            </div>
            <div className="column is-2">
              {/* Widget réseaux sociaux */}
              <div className="box has-text-centered" style={{ background: '#f8fafc' }}>
                <div className="has-text-link has-text-weight-bold mb-2">{content.reseaux_titre || "Suivez-nous"}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  {content.facebook && (
                    <a href={content.facebook} target="_blank" rel="noopener noreferrer" 
                      style={{ display: 'inline-block', transition: 'transform 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#3b5998">
                        <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                      </svg>
                    </a>
                  )}
                  {content.intramuros && (
                    <a href={content.intramuros} target="_blank" rel="noopener noreferrer" 
                      style={{ display: 'inline-block', transition: 'transform 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      {/* Utilisation d'une div stylisée pour garantir l'affichage */}
                      <div style={{ 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '50%', 
                        backgroundColor: '#1B9BD7',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: 'white'
                      }}>
                        IM
                      </div>
                    </a>
                  )}
                </div>
                {content.intramuros && (
                  <div className="mt-2" style={{ fontSize: '12px', color: '#666' }}>
                    Application IntraMuros disponible
                  </div>
                )}
              </div>
              {/* Numéros d'urgence */}
              <div className="box mt-4" style={{ background: '#fffbe6' }}>
                <div className="has-text-danger has-text-weight-bold mb-1">{content.urgences_titre || "Urgences"}</div>
                <div style={{ fontSize: 15 }}>
                  🚒 Pompiers : <b>{content.urgence_pompiers}</b><br />
                  🚓 Police : <b>{content.urgence_police}</b><br />
                  🚑 SAMU : <b>{content.urgence_samu}</b>
                </div>
              </div>
            </div>
            {/* Ajoutez d'autres colonnes de widgets si nécessaire */}
          </div>
        </div>

        {showModal && (
          <div className="modal is-active">
            <div className="modal-background" onClick={() => setShowModal(false)}></div>
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">Événements du jour</p>
                <button className="delete" aria-label="close" onClick={() => setShowModal(false)}></button>
              </header>
              <section className="modal-card-body">
                {selectedDayEvents.map(ev => (
                  <div key={ev.id} className="box mb-3">
                    <div className="has-text-weight-bold">{ev.titre}</div>
                    <div className="is-size-7 has-text-link">{ev.date}</div>
                    {ev.lieu && <div className="is-size-7">📍 {ev.lieu}</div>}
                    {ev.description && <div className="mt-2">{ev.description}</div>}
                  </div>
                ))}
              </section>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

// Composant pour une actu
function ActualiteCard({ img, date, title, color }) {
  // Images libres de droits pour chaque actu
  const images = {
    "Fête locale : dates et programme": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&q=80",
    "Travaux de voirie : point d’avancement": "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=400&q=80",
    "Prochain conseil municipal le 15 avril": "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&q=80",
  };
  const defaultImg = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=400&q=80";
  const imgSrc = images[title] || img || defaultImg;

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-image">
        <figure className="image is-4by3">
          <img
            src={imgSrc}
            alt={title}
            style={{ objectFit: 'cover' }}
            onError={e => { e.currentTarget.src = defaultImg; }}
          />
        </figure>
      </div>
      <div className="card-content">
        <p className="has-text-link has-text-weight-bold is-size-7 mb-1">{date}</p>
        <p className="has-text-dark has-text-weight-semibold">{title}</p>
      </div>
    </div>
  );
}



// Composant pour un événement d'agenda
function AgendaItem({ title, date }) {
  // Ajout d'une image illustrative pour chaque événement
  const images = {
    "Exposition à la médiathèque": "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=128&q=80",
    "Marché de producteurs": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=128&q=80",
  };
  const imgSrc = images[title] || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=128&q=80";
  return (
    <div className="box is-flex is-align-items-center mb-2" style={{ background: '#f8fafc', gap: 10, padding: '8px 12px' }}>
      <figure className="image is-48x48">
        <img src={imgSrc} alt={title} style={{ objectFit: 'cover', borderRadius: 8, width: 36, height: 36 }} onError={e => { e.currentTarget.src = "/default.jpg"; }} />
      </figure>
      <div>
        <div className="has-text-weight-semibold has-text-dark">{title}</div>
        <div className="has-text-link is-size-7">{date}</div>
      </div>
    </div>
  );
}

// Petit composant calendrier simple
function Calendar({ events, onDayClick }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function getEventsForDay(day) {
    const d = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(ev => ev.date === d);
  }

  return (
    <table className="table is-bordered is-narrow is-fullwidth has-background-white-ter" style={{ fontSize: 14 }}>
      <thead>
        <tr>
          <th colSpan={7} className="has-background-link has-text-white has-text-centered">
            {today.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
          </th>
        </tr>
        <tr>
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(j => <th key={j} className="has-text-centered">{j}</th>)}
        </tr>
      </thead>
      <tbody>
        {(() => {
          const firstDay = new Date(year, month, 1).getDay() || 7;
          const rows = [];
          let cells = [];
          let dayNum = 1;
          for (let i = 1; i < firstDay; i++) cells.push(<td key={`empty-${i}`}></td>);
          for (let i = firstDay; i <= 7; i++) {
            if (dayNum <= daysInMonth) {
              const dayEvents = getEventsForDay(dayNum);
              cells.push(
                <td
                  key={dayNum}
                  style={{
                    background: dayEvents.length ? '#eaf6ff' : undefined,
                    fontWeight: dayEvents.length ? 700 : 400,
                    cursor: dayEvents.length ? 'pointer' : undefined
                  }}
                  onClick={() => dayEvents.length && onDayClick(dayEvents)}
                >
                  {dayNum}
                  {dayEvents.map(ev => (
                    <div key={ev.id} style={{ fontSize: 10, color: '#1277c6' }}>{ev.titre}</div>
                  ))}
                </td>
              );
              dayNum++;
            }
          }
          rows.push(<tr key="row-1">{cells}</tr>);
          while (dayNum <= daysInMonth) {
            cells = [];
            for (let i = 0; i < 7; i++) {
              if (dayNum <= daysInMonth) {
                const dayEvents = getEventsForDay(dayNum);
                cells.push(
                  <td
                    key={dayNum}
                    style={{
                      background: dayEvents.length ? '#eaf6ff' : undefined,
                      fontWeight: dayEvents.length ? 700 : 400,
                      cursor: dayEvents.length ? 'pointer' : undefined
                    }}
                    onClick={() => dayEvents.length && onDayClick(dayEvents)}
                  >
                    {dayNum}
                    {dayEvents.map(ev => (
                      <div key={ev.id} style={{ fontSize: 10, color: '#1277c6' }}>{ev.titre}</div>
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
          return rows;
        })()}
      </tbody>
    </table>
  );
}

const infoIcon = {
  fontSize: 18,
  color: '#1277c6',
  marginRight: 8,
};