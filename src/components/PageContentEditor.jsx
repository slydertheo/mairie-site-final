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
    fields: ['motMaire_accroche', 'motMaire', 'motMaire_nom', 'motMaire_titre_signature', 'motMaire_photo'],
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
  { key: 'motMaire_accroche', label: 'Accroche (Chères habitantes...)', type: 'text' },
  { key: 'motMaire', label: 'Mot du Maire', type: 'textarea' },
  { key: 'motMaire_nom', label: 'Nom du Maire', type: 'text' },
  { key: 'motMaire_titre_signature', label: 'Titre de signature', type: 'text' },
  { key: 'motMaire_photo', label: 'Photo du Maire (URL)', type: 'text' },
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
  { key: 'infos_titre', label: 'Titre de la section infos pratiques', type: 'text' },
  { key: 'horaires_titre', label: 'Titre horaires', type: 'text' },
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
  const [msg, setMsg] = useState('');

  // Ajouter un état pour l'aperçu de la photo du maire
  const [mairePreviewImage, setMairePreviewImage] = useState(null);

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

  const saveContent = async (updatedContent) => {
    try {
      const res = await fetch('/api/pageContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: SELECTED_PAGE, ...updatedContent }),
      });
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde');
      toast.success('Contenu sauvegardé');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
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
        setMairePreviewImage(pageContentData.motMaire_photo || null); // Initialiser l'aperçu
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
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        resolve(event.target.result);
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

  const handleMaireImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes('image/')) {
      toast.error('Veuillez sélectionner une image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // Augmenter la limite à 10MB pour l'original
      toast.error('Image trop volumineuse (max 10MB).');
      return;
    }
    const loadingId = toast.loading("Traitement de l'image...");
    try {
      const compressed = await compressImage(file, { quality: 0.9 }); // Qualité plus élevée pour l'original
      setMairePreviewImage(compressed);
      setContent({ ...content, motMaire_photo: compressed });
      toast.update(loadingId, { render: 'Image chargée', type: 'success', isLoading: false, autoClose: 2000 });
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

    if (window.confirm(`Supprimer "${ev.titre}" ?`)) {
      const loadingId = toast.loading('Suppression...');
      const prev = events;
      const next = events.filter((_, i) => i !== idx);
      setEvents(next);
      try {
        persistEvents(next);
        toast.update(loadingId, { render: 'Événement supprimé', type: 'success', isLoading: false, autoClose: 2000 });
      } catch (e) {
        setEvents(prev);
        toast.update(loadingId, { render: 'Erreur lors de la suppression', type: 'error', isLoading: false, autoClose: 3000 });
      }
    }
  };

  // Contact (inchangé)
  const handleContactChange = (e) => setContact({ ...contact, [e.target.name]: e.target.value });
  const handleContactSubmit = (e) => { e.preventDefault(); setContactSent(true); setContact({ nom: '', email: '', message: '' }); };

  // Rendu adapté au style DemarchesEditor
  return (
    <div className="box" style={{ borderRadius: 14, background: '#fafdff' }}>
      <h2 className="title is-4 mb-4 has-text-link">🗓️ Gestion des événements - Page Accueil</h2>
      
      {/* Section spéciale pour Mot du Maire */}
      <div className="box mb-4" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
        <h3 className="subtitle is-5 mb-3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>👨‍💼</span> Mot du Maire
        </h3>
        <div className="columns">
          {/* Colonne pour la photo */}
          <div className="column is-narrow">
            <figure className="image is-128x128" style={{ margin: '0 auto' }}>
              <img
                className="is-rounded"
                src={mairePreviewImage || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=200&q=80"}
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
            <div className="field mt-2">
              <div className="file has-name is-fullwidth mb-2">
                <label className="file-label">
                  <input className="file-input" type="file" accept="image/*" onChange={handleMaireImageUpload} />
                  <span className="file-cta">
                    <span className="file-icon"><i className="fas fa-upload"></i></span>
                    <span className="file-label">Choisir une image...</span>
                  </span>
                  <span className="file-name">
                    {mairePreviewImage ? 'Image sélectionnée' : 'Aucun fichier sélectionné'}
                  </span>
                </label>
              </div>
              {mairePreviewImage && (
                <button 
                  className="button is-danger is-small" 
                  onClick={() => { setMairePreviewImage(null); setContent({ ...content, motMaire_photo: null }); }}
                >
                  Supprimer l'image
                </button>
              )}
            </div>
          </div>
          
          {/* Colonne pour le texte */}
          <div className="column">
            <div className="field mb-3">
              <div className="control">
                <input 
                  className="input" 
                  placeholder="Accroche (Chères habitantes, chers habitants)" 
                  value={content.motMaire_accroche || ''} 
                  onChange={(e) => setContent({ ...content, motMaire_accroche: e.target.value })} 
                />
              </div>
            </div>
            <div className="field mb-3">
              <div className="control">
                <textarea 
                  className="textarea" 
                  rows={4} 
                  placeholder="Mot du Maire" 
                  value={content.motMaire || ''} 
                  onChange={(e) => setContent({ ...content, motMaire: e.target.value })} 
                />
              </div>
            </div>
            <div className="has-text-right mt-4">
              <div className="field mb-2">
                <div className="control">
                  <input 
                    className="input" 
                    placeholder="Nom du Maire" 
                    value={content.motMaire_nom || ''} 
                    onChange={(e) => setContent({ ...content, motMaire_nom: e.target.value })} 
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input 
                    className="input" 
                    placeholder="Titre de signature" 
                    value={content.motMaire_titre_signature || ''} 
                    onChange={(e) => setContent({ ...content, motMaire_titre_signature: e.target.value })} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="field is-grouped mt-4">
          <div className="control">
            <button className="button is-link" onClick={() => saveContent(content)}>Sauvegarder</button>
          </div>
        </div>
      </div>

      {/* Section spéciale pour Infos pratiques */}
      <div className="box mb-4" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
        <h3 className="subtitle is-5 mb-3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>🏛️</span> Infos pratiques
        </h3>
        <div className="field mb-3">
          <label className="label">Horaires</label>
          <div className="control">
            <textarea 
              className="textarea" 
              rows={3} 
              placeholder="Horaires d'ouverture" 
              value={content.horaires || ''} 
              onChange={(e) => setContent({ ...content, horaires: e.target.value })} 
            />
          </div>
        </div>
        <div className="field mb-3">
          <label className="label">Adresse</label>
          <div className="control">
            <textarea 
              className="textarea" 
              rows={2} 
              placeholder="Adresse mairie" 
              value={content.adresse || ''} 
              onChange={(e) => setContent({ ...content, adresse: e.target.value })} 
            />
          </div>
        </div>
        <div className="field mb-3">
          <label className="label">Téléphone</label>
          <div className="control">
            <input 
              className="input" 
              placeholder="Téléphone mairie" 
              value={content.telephone || ''} 
              onChange={(e) => setContent({ ...content, telephone: e.target.value })} 
            />
          </div>
        </div>
        <div className="field mb-3">
          <label className="label">Email</label>
          <div className="control">
            <input 
              className="input" 
              type="email" 
              placeholder="Email mairie" 
              value={content.email || ''} 
              onChange={(e) => setContent({ ...content, email: e.target.value })} 
            />
          </div>
        </div>
        <div className="field is-grouped mt-4">
          <div className="control">
            <button className="button is-link" onClick={() => saveContent(content)}>Sauvegarder</button>
          </div>
        </div>
      </div>

      {/* Section formulaire d'ajout/modification */}
      <div className="box mb-4" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
        <h3 className="subtitle is-5 mb-3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>📝</span> 
          {editMode ? 'Modifier un événement' : 'Ajouter un événement'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="columns">
            <div className="column is-7">
              <div className="field mb-3">
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

              <div className="field is-grouped mb-3">
                <div className="control is-expanded">
                  <label className="label is-small">Date</label>
                  <input 
                    className="input" 
                    type="date" 
                    name="date" 
                    value={formatDateForInput(form.date)} 
                    onChange={handleChange} 
                    required 
                    readOnly={loading}
                    style={{ background: loading ? "#f5f5f5" : "white" }}
                  />
                </div>
                <div className="control is-expanded">
                  <label className="label is-small">Lieu</label>
                  <input 
                    className="input" 
                    name="lieu" 
                    value={form.lieu} 
                    onChange={handleChange} 
                    placeholder="Ex: Salle des fêtes" 
                    readOnly={loading}
                    style={{ background: loading ? "#f5f5f5" : "white" }}
                  />
                </div>
              </div>

              <div className="field mb-3">
                <label className="label is-small">Description</label>
                <div className="control">
                  <textarea 
                    className="textarea" 
                    name="description" 
                    rows={4} 
                    value={form.description} 
                    onChange={handleChange} 
                    readOnly={loading}
                    style={{ background: loading ? "#f5f5f5" : "white" }}
                  />
                </div>
              </div>
            </div>

            <div className="column is-5">
              <label className="label is-small">Image</label>
              <div className="file has-name is-fullwidth mb-2">
                <label className="file-label">
                  <input className="file-input" type="file" accept="image/*" onChange={handleImageUpload} disabled={loading} />
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
                  readOnly={loading}
                  style={{ background: loading ? "#f5f5f5" : "white" }}
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
                <button type="button" className="button is-light" onClick={resetForm} disabled={loading}>Annuler</button>
              </div>
            )}
            {msg && (
              <div className={`notification is-light ${msg.includes('Erreur') ? 'is-danger' : 'is-success'} py-2 px-3 ml-3`}>
                {msg}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Section liste des événements */}
      <div className="box mb-4" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
        <h3 className="subtitle is-5 mb-3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>📋</span> Liste des événements
        </h3>

        {events.length === 0 ? (
          <div className="notification is-light is-info is-size-7 py-2 px-3 mb-3">
            Aucun événement ajouté.
          </div>
        ) : (
          <div style={{ paddingRight: '5px' }}>
            {events.map((ev, idx) => (
              <div 
                key={ev.id || idx}
                className="box mb-3 pt-3 pb-3" 
                style={{ background: '#f9fbfd', borderRadius: 8 }}
              >
                <div className="is-flex is-justify-content-space-between mb-2">
                  <span className="tag is-info is-light">Événement #{idx + 1}</span>
                  <button 
                    type="button" 
                    className="delete" 
                    onClick={() => handleDelete(idx)}
                    disabled={loading}
                  />
                </div>

                <div className="columns is-mobile">
                  <div className="column is-narrow" style={{ width: 90 }}>
                    {ev.image && (
                      <img
                        src={ev.image}
                        alt={ev.titre}
                        style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 4 }}
                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/80x50?text=Img'; }}
                      />
                    )}
                  </div>
                  <div className="column">
                    <div className="columns is-mobile">
                      <div className="column">
                        <p className="is-size-7 has-text-grey mb-1">Date</p>
                        <p className="has-text-weight-medium">{ev.date}</p>
                      </div>
                      <div className="column">
                        <p className="is-size-7 has-text-grey mb-1">Titre</p>
                        <p className="has-text-weight-semibold">{ev.titre || ev.title}</p>
                      </div>
                      <div className="column">
                        <p className="is-size-7 has-text-grey mb-1">Lieu</p>
                        <p>{ev.lieu}</p>
                      </div>
                    </div>
                    {ev.description && (
                      <div className="mt-2">
                        <p className="is-size-7 has-text-grey mb-1">Description</p>
                        <p className="is-size-7">{ev.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="field is-grouped mt-3">
                  <div className="control">
                    <button className="button is-info is-small" type="button" onClick={() => handleEdit(idx)} disabled={loading}>
                      <span className="icon"><i className="fas fa-edit"></i></span>
                      <span>Modifier</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} newestOnTop />
    </div>
  );
}