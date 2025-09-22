import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Choisis la page à éditer ici (exemple : accueil)
const SELECTED_PAGE = 'accueil';

const PAGES = [
  { slug: 'accueil', title: 'Accueil' },
  { slug: 'infos_pratiques', title: 'Infos pratiques' },
  { slug: 'decouvrir_friesen', title: 'Découvrir Friesen' },
  // ...
];

// Regroupe les champs par rubrique pour l'affichage
const FIELD_GROUPS = [

  {
    key: 'maire',
    icon: '👨‍💼',
    title: 'Mot du Maire',
    fields: ['motMaire'],
  },
  {
    key: 'agenda',
    icon: '🗓️',
    title: 'Agenda',
    fields: [], // Nous n'utiliserons plus de champs prédéfinis pour l'agenda
  },
  {
    key: 'infos',
    icon: '🏛️',
    title: 'Infos pratiques',
    fields: ['horaires', 'adresse', 'telephone', 'email'],
  },
  {
    key: 'meteo',
    icon: '🌤️',
    title: 'Météo',
    fields: ['meteo', 'meteo_legende'],
  },
  {
    key: 'reseaux',
    icon: '🌐',
    title: 'Réseaux sociaux',
    fields: ['facebook', 'instagram', 'twitter'],
  },
];

const FIELDS = [
  { key: 'titre', label: 'Titre principal (bandeau)', type: 'text' },
  { key: 'sousTitre', label: 'Sous-titre (bandeau)', type: 'text' },
  { key: 'titre_color', label: 'Couleur du mot "Friesen"', type: 'color' },
  { key: 'motMaire', label: 'Mot du Maire', type: 'textarea' },
  // Réintégrer les champs d'agenda individuels
  { key: 'agenda_titre', label: 'Titre de la section agenda', type: 'text' },
  { key: 'agenda1_title', label: 'Titre événement 1', type: 'text' },
  { key: 'agenda1_date', label: 'Date événement 1', type: 'text' },
  { key: 'agenda2_title', label: 'Titre événement 2', type: 'text' },
  { key: 'agenda2_date', label: 'Date événement 2', type: 'text' },
  { key: 'agenda_link', label: 'Lien agenda complet', type: 'text' },
  { key: 'agenda_lien_label', label: 'Texte du lien "Voir tous les événements"', type: 'text' },
  { key: 'horaires', label: 'Horaires mairie', type: 'textarea' },
  { key: 'adresse', label: 'Adresse mairie', type: 'text' },
  { key: 'telephone', label: 'Téléphone mairie', type: 'text' },
  { key: 'email', label: 'Email mairie', type: 'text' },
  { key: 'meteo', label: 'Widget météo', type: 'text' },
  { key: 'meteo_legende', label: 'Légende météo', type: 'text' },
  { key: 'facebook', label: 'Lien Facebook', type: 'text' },
  { key: 'instagram', label: 'Lien Instagram', type: 'text' },
  { key: 'twitter', label: 'Lien Twitter', type: 'text' },

];

export default function PageAcceuil() {
  const [contact, setContact] = useState({ nom: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);
  const [content, setContent] = useState({});
  const [events, setEvents] = useState([]);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAllEventsModal, setShowAllEventsModal] = useState(false);
  const [actualites, setActualites] = useState([]);

  // Formulaire style "Actualité"
  const [form, setForm] = useState({ titre: '', date: '', description: '', image: '', lieu: '' });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Utilitaires
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
    const out = [];
    if (pageContentData?.agenda1_title || pageContentData?.agenda1_date) {
      out.push({
        id: 'event-0',
        titre: pageContentData.agenda1_title || '',
        date: pageContentData.agenda1_date || '',
        description: pageContentData.agenda1_description || '',
        image: '',
        lieu: ''
      });
    }
    if (pageContentData?.agenda2_title || pageContentData?.agenda2_date) {
      out.push({
        id: 'event-1',
        titre: pageContentData.agenda2_title || '',
        date: pageContentData.agenda2_date || '',
        description: pageContentData.agenda2_description || '',
        image: '',
        lieu: ''
      });
    }
    return out;
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

  // Charger contenu + events
  useEffect(() => {
    let cancelled = false;
    fetch('/api/pageContent?page=accueil')
      .then(res => res.ok ? res.json() : Promise.reject(new Error('Impossible de charger le contenu')))
      .then(pageContent => {
        if (cancelled) return;
        const pageContentData = pageContent?.[0] || {};
        setContent(pageContentData);
        setEvents(normalizeEvents(pageContentData));
      })
      .catch(error => console.error('Erreur lors du chargement des données:', error));
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    fetch('/api/actualites')
      .then(res => res.ok ? res.json() : [])
      .then(setActualites)
      .catch(() => {});
  }, []);

  // Handlers "comme Actualité"
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const compressImage = (file, options = {}) => {
    return new Promise((resolve, reject) => {
      const maxWidth = options.maxWidth || 1200;
      const maxHeight = options.maxHeight || 1200;
      const quality = options.quality || 0.7;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL(file.type, quality);
          resolve(compressedBase64);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes('image/')) {
      toast.error('Veuillez sélectionner une image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image trop volumineuse (max 5MB).');
      return;
    }
    const loadingId = toast.loading("Traitement de l'image...");
    try {
      const compressed = await compressImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.7 });
      setPreviewImage(compressed);
      setForm(prev => ({ ...prev, image: compressed }));
      toast.update(loadingId, { render: 'Image optimisée', type: 'success', isLoading: false, autoClose: 2000 });
    } catch (err) {
      toast.update(loadingId, { render: "Erreur d'image", type: 'error', isLoading: false, autoClose: 3000 });
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    try {
      const d = new Date(dateString);
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const resetForm = () => {
    setForm({ titre: '', date: '', description: '', image: '', lieu: '' });
    setPreviewImage(null);
    setEditMode(false);
    setEditIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titre.trim() || !form.date.trim()) {
      toast.error('Titre et date sont obligatoires.');
      return;
    }
    // Base64 guard (optionnel)
    if (form.image && form.image.length > 800000) {
      toast.error("L'image est trop volumineuse après compression.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading(editMode ? 'Modification en cours...' : 'Ajout en cours...');
    try {
      const next = [...events];
      if (editMode && editIndex != null) {
        const id = next[editIndex]?.id;
        next[editIndex] = { id, ...form };
      } else {
        next.push({ id: `event-${crypto?.randomUUID?.() || Date.now()}`, ...form });
      }
      setEvents(next);
      await persistEvents(next);
      toast.update(toastId, { render: editMode ? 'Événement modifié' : 'Événement ajouté', type: 'success', isLoading: false, autoClose: 2000 });
      resetForm();
    } catch (err) {
      console.error(err);
      toast.update(toastId, { render: 'Erreur lors de la sauvegarde', type: 'error', isLoading: false, autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (idx) => {
    const ev = events[idx];
    if (!ev) return;
    setEditMode(true);
    setEditIndex(idx);
    setForm({
      titre: ev.titre || '',
      date: ev.date || '',
      description: ev.description || '',
      image: ev.image || '',
      lieu: ev.lieu || ''
    });
    setPreviewImage(ev.image || null);
  };

  const handleDelete = (idx) => {
    const ev = events[idx];
    if (!ev) return;

    const confirmToastId = `confirm-delete-${ev.id || idx}`;

    toast.info(
      <div>
        <p>Supprimer “{ev.titre}” ?</p>
        <div className="buttons mt-3">
          <button
            className="button is-danger is-small"
            onClick={async () => {
              // Fermer uniquement le toast de confirmation
              toast.dismiss(confirmToastId);

              const loadingId = toast.loading('Suppression...');
              const prev = events;
              const next = events.filter((_, i) => i !== idx);
              setEvents(next);
              try {
                await persistEvents(next);
                toast.update(loadingId, { render: 'Événement supprimé', type: 'success', isLoading: false, autoClose: 2000 });
              } catch (e) {
                setEvents(prev);
                toast.update(loadingId, { render: 'Erreur lors de la suppression', type: 'error', isLoading: false, autoClose: 3000 });
              }
            }}
          >
            Confirmer
          </button>
          <button
            className="button is-light is-small"
            onClick={() => toast.dismiss(confirmToastId)}
          >
            Annuler
          </button>
        </div>
      </div>,
      { toastId: confirmToastId, autoClose: false, closeButton: false, closeOnClick: false, draggable: false }
    );
  };

  // Contact (inchangé)
  const handleContactChange = (e) => setContact({ ...contact, [e.target.name]: e.target.value });
  const handleContactSubmit = (e) => { e.preventDefault(); setContactSent(true); setContact({ nom: '', email: '', message: '' }); };

  // Rendu “comme Actualité”
  return (
    <section className="section">
      <div className="container">
        <div className="box" style={{ borderRadius: 12 }}>
          <h2 className="title is-5">{editMode ? 'Modifier un événement' : 'Ajouter un événement'}</h2>

          <form onSubmit={handleSubmit} className="mb-5">
            <div className="columns">
              <div className="column is-7">
                <div className="field">
                  <label className="label">Titre</label>
                  <div className="control">
                    <input className="input" name="titre" value={form.titre} onChange={handleChange} required />
                  </div>
                </div>

                <div className="field is-grouped">
                  <div className="control is-expanded">
                    <label className="label">Date</label>
                    <input className="input" type="date" name="date" value={formatDateForInput(form.date)} onChange={handleChange} required />
                  </div>
                  <div className="control is-expanded">
                    <label className="label">Lieu</label>
                    <input className="input" name="lieu" value={form.lieu} onChange={handleChange} placeholder="Ex: Salle des fêtes" />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Description</label>
                  <div className="control">
                    <textarea className="textarea" name="description" rows={4} value={form.description} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="column is-5">
                <label className="label">Image</label>
                <div className="file has-name is-fullwidth mb-2">
                  <label className="file-label">
                    <input className="file-input" type="file" accept="image/*" onChange={handleImageUpload} />
                    <span className="file-cta">
                      <span className="file-icon"><i className="fas fa-upload"></i></span>
                      <span className="file-label">Choisir une image...</span>
                    </span>
                    <span className="file-name">
                      {previewImage ? 'Image sélectionnée' : 'Aucun fichier sélectionné'}
                    </span>
                  </label>
                </div>

                <div className="control mb-2">
                  <input
                    className="input"
                    name="image"
                    value={form.image}
                    onChange={(e) => { handleChange(e); setPreviewImage(e.target.value || null); }}
                    placeholder="Ou entrez l'URL d'une image"
                  />
                </div>

                {previewImage && (
                  <div className="mt-2">
                    <p className="is-size-7 mb-1">Aperçu :</p>
                    <img
                      src={previewImage}
                      alt="Aperçu"
                      style={{ maxHeight: '150px', maxWidth: '300px', objectFit: 'cover', border: '1px solid #ddd', borderRadius: 6 }}
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x150?text=Event'; }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="field is-grouped mt-4">
              <div className="control">
                <button className={`button is-link${loading ? ' is-loading' : ''}`} type="submit" disabled={loading}>
                  {editMode ? 'Enregistrer les modifications' : 'Ajouter'}
                </button>
              </div>
              {editMode && (
                <div className="control">
                  <button type="button" className="button is-light" onClick={resetForm}>Annuler</button>
                </div>
              )}
            </div>
          </form>

          <h3 className="title is-5 mt-6 mb-3">Liste des événements</h3>
          <div className="table-container">
            <table className="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th style={{ width: 90 }}>Image</th>
                  <th>Date</th>
                  <th>Titre</th>
                  <th>Lieu</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev, idx) => (
                  <tr key={ev.id || idx}>
                    <td>
                      {ev.image && (
                        <img
                          src={ev.image}
                          alt={ev.titre}
                          style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 4 }}
                          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/80x50?text=Img'; }}
                        />
                      )}
                    </td>
                    <td>{ev.date}</td>
                    <td className="has-text-weight-semibold">{ev.titre || ev.title}</td>
                    <td>{ev.lieu}</td>
                    <td style={{ maxWidth: 360 }} className="is-size-7">{ev.description}</td>
                    <td>
                      <div className="buttons are-small">
                        <button className="button is-info" type="button" onClick={() => handleEdit(idx)}>
                          <span className="icon"><i className="fas fa-edit"></i></span>
                          <span>Modifier</span>
                        </button>
                        <button className="button is-danger" type="button" onClick={() => handleDelete(idx)}>
                          <span className="icon"><i className="fas fa-trash"></i></span>
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan="6" className="has-text-centered">Aucun événement ajouté</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <ToastContainer position="top-right" autoClose={3000} newestOnTop />
      </div>
    </section>
  );
}