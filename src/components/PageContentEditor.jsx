import React, { useState, useEffect, useRef } from 'react';
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

  // Nouveaux états pour le panneau d'affichage
  const [panneauItems, setPanneauItems] = useState([]);
  const [showPanneauModal, setShowPanneauModal] = useState(false);
  const [selectedActualite, setSelectedActualite] = useState(null);
  const [panneauForm, setPanneauForm] = useState({
    categorie: 'arrete',
    dureeAffichage: 7, // en jours
    dateDebut: new Date().toISOString().split('T')[0],
  });

  // AJOUTER ces états après panneauForm (ligne ~108)
  const [showCreatePanneauModal, setShowCreatePanneauModal] = useState(false);
  const [createPanneauForm, setCreatePanneauForm] = useState({
    titre: '',
    description: '',
    pimage: '',
    categorie: 'arrete',
    dateDebut: new Date().toISOString().split('T')[0],
    dureeAffichage: 7
  });
  const [previewPanneauImage, setPreviewPanneauImage] = useState(null);

  // Nouveaux états pour la municipalité
  const [elus, setElus] = useState([]);
  const [eluForm, setEluForm] = useState({
    nom: '',
    prenom: '',
    fonction: '',
    photo: '',
    ordre: 0
  });
  const [editEluMode, setEditEluMode] = useState(false);
  const [editEluIndex, setEditEluIndex] = useState(null);
  const [previewEluImage, setPreviewEluImage] = useState(null);

  // Nouveaux états pour les liens utiles
  const [liensUtiles, setLiensUtiles] = useState([]);
  const [lienForm, setLienForm] = useState({
    titre: '',
    url: '',
    icone: '📄',
    ordre: 0
  });
  const [editLienMode, setEditLienMode] = useState(false);
  const [editLienIndex, setEditLienIndex] = useState(null);

  const formRef = useRef(null);

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

  // Charger les items du panneau
  useEffect(() => {
    fetch('/api/pageContent?page=accueil')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(pageContent => {
        const pageContentData = pageContent?.[0] || {};
        if (pageContentData.panneauItems_json) {
          try {
            const items = typeof pageContentData.panneauItems_json === 'string'
              ? JSON.parse(pageContentData.panneauItems_json)
              : pageContentData.panneauItems_json;
            setPanneauItems(Array.isArray(items) ? items : []);
          } catch (e) {
            console.error('Erreur parsing panneauItems_json:', e);
          }
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Charger les élus
  useEffect(() => {
    fetch('/api/pageContent?page=accueil')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(pageContent => {
        const pageContentData = pageContent?.[0] || {};
        
        // Charger les élus
        if (pageContentData.elus_json) {
          try {
            const elusData = typeof pageContentData.elus_json === 'string'
              ? JSON.parse(pageContentData.elus_json)
              : pageContentData.elus_json;
            setElus(Array.isArray(elusData) ? elusData : []);
          } catch (e) {
            console.error('Erreur parsing elus_json:', e);
          }
        }
        
        // Charger les liens utiles
        if (pageContentData.liensUtiles_json) {
          try {
            const liensData = typeof pageContentData.liensUtiles_json === 'string'
              ? JSON.parse(pageContentData.liensUtiles_json)
              : pageContentData.liensUtiles_json;
            setLiensUtiles(Array.isArray(liensData) ? liensData : []);
          } catch (e) {
            console.error('Erreur parsing liensUtiles_json:', e);
          }
        }
      })
      .catch(err => console.error(err));
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
    // Scroll to the form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = async (idx) => {
    const ev = events[idx];
    if (!ev) return;

    // Use toast for confirmation instead of window.confirm
    toast.info(
      <div>
        <p>Voulez-vous vraiment supprimer "{ev.titre}" ?</p>
        <div className="buttons mt-3">
          <button
            className="button is-danger is-small"
            onClick={async () => {
              toast.dismiss(); // Dismiss the confirmation toast

              setLoading(true); // Prevent multiple clicks
              const loadingId = toast.loading('Suppression en cours...');
              const prev = events;
              const next = events.filter((_, i) => i !== idx);
              setEvents(next);

              try {
                await persistEvents(next);
                toast.update(loadingId, {
                  render: 'Événement supprimé',
                  type: 'success',
                  isLoading: false,
                  autoClose: 2000
                });
              } catch (e) {
                setEvents(prev); // Revert on error
                toast.update(loadingId, {
                  render: 'Erreur lors de la suppression',
                  type: 'error',
                  isLoading: false,
                  autoClose: 3000
                });
              } finally {
                setLoading(false);
              }
            }}
          >
            Confirmer
          </button>
          <button
            className="button is-light is-small"
            onClick={() => toast.dismiss()} // Just dismiss on cancel
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

  // Contact (inchangé)
  const handleContactChange = (e) => setContact({ ...contact, [e.target.name]: e.target.value });
  const handleContactSubmit = (e) => { e.preventDefault(); setContactSent(true); setContact({ nom: '', email: '', message: '' }); };

  // Ajouter après les états existants (ligne ~75)
  const CATEGORIES = [
    { value: 'arrete', label: 'Arrêtés du Maire', icon: '📜', color: '#a97c50' },
    { value: 'compte-rendu', label: 'Comptes rendus', icon: '📋', color: '#1277c6' },
    { value: 'mariage', label: 'Bancs mariages', icon: '💒', color: '#1b9bd7' },
    { value: 'convocation', label: 'Convocations CM+', icon: '📢', color: '#eab308' },
    { value: 'urbanisme', label: 'Urbanisme / Permis', icon: '🏗️', color: '#22c55e' },
    { value: 'eau', label: 'Analyses d\'eau, divers', icon: '💧', color: '#0ea5e9' },
  ];

  // Ajouter après le useEffect existant (ligne ~160)
  const handleAddToPanneau = async () => {
    if (!selectedActualite) {
      toast.error('Veuillez sélectionner une actualité');
      return;
    }

    const loadingId = toast.loading('Ajout au panneau...');
    try {
      const dateFin = new Date(panneauForm.dateDebut);
      dateFin.setDate(dateFin.getDate() + parseInt(panneauForm.dureeAffichage));

      // Trouver l'actualité complète depuis la liste des actualités
      const actualiteComplete = actualites.find(a => a.id === selectedActualite.id) || selectedActualite;

      console.log('Actualité sélectionnée:', actualiteComplete); // Debug
      console.log('Image de l\'actualité:', actualiteComplete.imgSrc || actualiteComplete.image); // Debug

      const newItem = {
        id: `panneau-${Date.now()}`,
        actualiteId: actualiteComplete.id,
        titre: actualiteComplete.title || actualiteComplete.titre || '', // Gérer les deux noms
        date: actualiteComplete.date || '',
        description: actualiteComplete.description || '',
        categorie: panneauForm.categorie,
        dateDebut: panneauForm.dateDebut,
        dateFin: dateFin.toISOString().split('T')[0],
        image: actualiteComplete.imgSrc || actualiteComplete.image || '', // Récupérer imgSrc OU image
      };

      console.log('Item à ajouter au panneau:', newItem); // Debug

      const updatedItems = [...panneauItems, newItem];
      setPanneauItems(updatedItems);

      const res = await fetch('/api/pageContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'accueil',
          panneauItems_json: JSON.stringify(updatedItems)
        })
      });

      if (!res.ok) throw new Error('Erreur serveur');

      toast.update(loadingId, { 
        render: 'Ajouté au panneau', 
        type: 'success', 
        isLoading: false, 
        autoClose: 2000 
      });

      setShowPanneauModal(false);
      setSelectedActualite(null);
      setPanneauForm({
        categorie: 'arrete',
        dureeAffichage: 7,
        dateDebut: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error(err);
      toast.update(loadingId, { 
        render: 'Erreur lors de l\'ajout', 
        type: 'error', 
        isLoading: false, 
        autoClose: 3000 
      });
    }
  };

  const handleRemoveFromPanneau = async (itemId) => {
    toast.info(
      <div>
        <p>Retirer cet élément du panneau d'affichage ?</p>
        <div className="buttons mt-3">
          <button
            className="button is-danger is-small"
            onClick={async () => {
              toast.dismiss();
              const loadingId = toast.loading('Suppression...');
              const updatedItems = panneauItems.filter(item => item.id !== itemId);
              setPanneauItems(updatedItems);

              try {
                await fetch('/api/pageContent', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    page: 'accueil',
                    panneauItems_json: JSON.stringify(updatedItems)
                  })
                });
                toast.update(loadingId, {
                  render: 'Élément retiré',
                  type: 'success',
                  isLoading: false,
                  autoClose: 2000
                });
              } catch (e) {
                toast.update(loadingId, {
                  render: 'Erreur',
                  type: 'error',
                  isLoading: false,
                  autoClose: 3000
                });
              }
            }}
          >
            Confirmer
          </button>
          <button className="button is-light is-small" onClick={() => toast.dismiss()}>
            Annuler
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
      }
    );
  };

  // AJOUTER ces handlers après handleRemoveFromPanneau (ligne ~590)
  const handleCreatePanneauChange = e => {
    setCreatePanneauForm({ ...createPanneauForm, [e.target.name]: e.target.value });
  };

  const handlePanneauImageUpload = async (e) => {
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
      const compressed = await compressImage(file, { maxWidth: 800, maxHeight: 600, quality: 0.8 });
      setPreviewPanneauImage(compressed);
      setCreatePanneauForm(prev => ({ ...prev, image: compressed }));
      toast.update(loadingId, { render: 'Image optimisée', type: 'success', isLoading: false, autoClose: 2000 });
    } catch (err) {
      toast.update(loadingId, { render: "Erreur d'image", type: 'error', isLoading: false, autoClose: 3000 });
    }
  };

  const handleCreatePanneau = async (e) => {
    e.preventDefault();
    if (!createPanneauForm.titre.trim()) {
      toast.error('Le titre est obligatoire');
      return;
    }

    const loadingId = toast.loading('Ajout au panneau...');
    try {
      const dateFin = new Date(createPanneauForm.dateDebut);
      dateFin.setDate(dateFin.getDate() + parseInt(createPanneauForm.dureeAffichage));

      const newItem = {
        id: `panneau-custom-${Date.now()}`,
        titre: createPanneauForm.titre,
        description: createPanneauForm.description,
        image: createPanneauForm.image,
        categorie: createPanneauForm.categorie,
        dateDebut: createPanneauForm.dateDebut,
        dateFin: dateFin.toISOString().split('T')[0],
        date: new Date(createPanneauForm.dateDebut).toLocaleDateString('fr-FR'),
        isCustom: true // Marqueur pour distinguer des actualités du carrousel
      };

      const updatedItems = [...panneauItems, newItem];
      setPanneauItems(updatedItems);

      const res = await fetch('/api/pageContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'accueil',
          panneauItems_json: JSON.stringify(updatedItems)
        })
      });

      if (!res.ok) throw new Error('Erreur serveur');

      toast.update(loadingId, { 
        render: 'Document ajouté au panneau', 
        type: 'success', 
        isLoading: false, 
        autoClose: 2000 
      });

      // Réinitialiser le formulaire
      setShowCreatePanneauModal(false);
      setCreatePanneauForm({
        titre: '',
        description: '',
        image: '',
        categorie: 'arrete',
        dateDebut: new Date().toISOString().split('T')[0],
        dureeAffichage: 7
      });
      setPreviewPanneauImage(null);
    } catch (err) {
      console.error(err);
      toast.update(loadingId, { 
        render: 'Erreur lors de l\'ajout', 
        type: 'error', 
        isLoading: false, 
        autoClose: 3000 
      });
    }
  };

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
            <button className="button is-link" onClick={() => saveContent(content)}>Enregistrer</button>
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
            <button className="button is-link" onClick={() => saveContent(content)}>Enregistrer</button>
          </div>
        </div>
      </div>

      {/* Section formulaire d'ajout/modification */}
      <div ref={formRef} className="box mb-4" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
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
                Enregistrer
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
                  <div className="buttons are-small">
                    <button className="button is-info" onClick={() => handleEdit(idx)} disabled={loading}>
                      ✏️
                    </button>
                    <button className="button is-danger" onClick={() => handleDelete(idx)} disabled={loading}>
                      🗑️
                    </button>
                  </div>
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section Panneau d'affichage - MODIFIER LA SECTION EXISTANTE */}
      <div className="box mb-4" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
        <h3 className="subtitle is-5 mb-3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>🗂️</span> Panneau d'affichage
        </h3>

        <div className="buttons mb-4">
          <button 
            className="button is-link" 
            onClick={() => setShowPanneauModal(true)}
          >
            <span className="icon">
              <i className="fas fa-newspaper"></i>
            </span>
            <span>Ajouter depuis les actualités</span>
          </button>
          
          <button 
            className="button is-success" 
            onClick={() => setShowCreatePanneauModal(true)}
          >
            <span className="icon">
              <i className="fas fa-plus-circle"></i>
            </span>
            <span>Créer un nouveau document</span>
          </button>
        </div>

        {panneauItems.length === 0 ? (
          <div className="notification is-light is-info">
            <p className="has-text-centered">
              <span style={{ fontSize: 48, opacity: 0.3 }}>📋</span>
            </p>
            <p className="has-text-centered">
              Aucun élément sur le panneau d'affichage.<br />
              Ajoutez des actualités existantes ou créez de nouveaux documents.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {panneauItems.map(item => {
              const cat = CATEGORIES.find(c => c.value === item.categorie);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const dateDebut = new Date(item.dateDebut);
              const dateFin = new Date(item.dateFin);
              dateDebut.setHours(0, 0, 0, 0);
              dateFin.setHours(0, 0, 0, 0);
              
              const isActive = dateDebut <= today && dateFin >= today;
              const isPending = dateDebut > today;
              const isExpired = dateFin < today;
              
              const joursRestants = Math.ceil((dateFin - today) / (1000 * 60 * 60 * 24));
              const joursAvantDebut = Math.ceil((dateDebut - today) / (1000 * 60 * 60 * 24));
              
              let statusTag = null;
              if (isPending) {
                statusTag = <span className="tag is-warning is-light">📅 Dans {joursAvantDebut}j</span>;
              } else if (isExpired) {
                statusTag = <span className="tag is-danger is-light">❌ Expiré</span>;
              } else if (isActive) {
                statusTag = <span className="tag is-success is-light">✅ Actif ({joursRestants}j)</span>;
              }
              
              return (
                <div 
                  key={item.id}
                  className="box"
                  style={{ 
                    background: isExpired ? '#fafafa' : '#f9fbfd', 
                    borderRadius: 12,
                    borderLeft: `5px solid ${cat?.color || '#ccc'}`,
                    opacity: isExpired ? 0.6 : 1,
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Badge "Document personnalisé" */}
                  {item.isCustom && (
                    <span 
                      className="tag is-success is-light"
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        fontSize: 10,
                        padding: '3px 8px'
                      }}
                    >
                      ✨ Créé manuellement
                    </span>
                  )}

                  <div className="mb-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span 
                      className="tag is-medium" 
                      style={{ 
                        backgroundColor: `${cat?.color}22`, 
                        color: cat?.color,
                        border: `1px solid ${cat?.color}`,
                        fontWeight: 600
                      }}
                    >
                      {cat?.icon} {cat?.label}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    {statusTag}
                  </div>
                  
                  {item.image && (
                    <figure className="image is-16by9 mb-3">
                      <img 
                        src={item.image} 
                        alt={item.titre}
                        style={{ 
                          objectFit: 'cover', 
                          borderRadius: 8,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        onError={(e) => { 
                          e.currentTarget.src = 'https://via.placeholder.com/400x225?text=Document'; 
                        }}
                      />
                    </figure>
                  )}
                  
                  <p className="has-text-weight-bold mb-2" style={{ fontSize: 16, color: '#333' }}>
                    {item.titre}
                  </p>
                  
                  {item.description && (
                    <p className="is-size-7 has-text-grey mb-2" style={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {item.description}
                    </p>
                  )}
                  
                  {item.date && (
                    <p className="is-size-7 has-text-grey-dark mb-3">
                      📅 Publié le {item.date}
                    </p>
                  )}
                  
                  <div className="is-size-7" style={{ 
                    background: 'white', 
                    padding: 10, 
                    borderRadius: 8,
                    border: '1px solid #e0e7ef'
                  }}>
                    <p className="mb-1">
                      <strong>📅 Affichage :</strong><br />
                      Du {new Date(item.dateDebut).toLocaleDateString('fr-FR')}<br />
                      au {new Date(item.dateFin).toLocaleDateString('fr-FR')}
                    </p>
                    {isActive && (
                      <p className="has-text-success mt-2">
                        ⏰ Expire dans <strong>{joursRestants}</strong> jour{joursRestants > 1 ? 's' : ''}
                      </p>
                    )}
                    {isPending && (
                      <p className="has-text-warning mt-2">
                        ⏳ Débute dans <strong>{joursAvantDebut}</strong> jour{joursAvantDebut > 1 ? 's' : ''}
                      </p>
                    )}
                    {isExpired && (
                      <p className="has-text-danger mt-2">
                        ❌ Expiré depuis {Math.abs(joursRestants)} jour{Math.abs(joursRestants) > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  <button 
                    className="button is-danger is-light is-fullwidth mt-3" 
                    onClick={() => handleRemoveFromPanneau(item.id)}
                  >
                    <span className="icon">
                      <i className="fas fa-trash"></i>
                    </span>
                    <span>Retirer du panneau</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal d'ajout depuis les actualités - CODE EXISTANT */}
      {showPanneauModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowPanneauModal(false)}></div>
          <div className="modal-card" style={{ maxWidth: 700 }}>
            <header className="modal-card-head" style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white'
            }}>
              <p className="modal-card-title" style={{ color: 'white' }}>
                <span className="icon"><i className="fas fa-plus-circle"></i></span>
                <span>Ajouter au panneau d'affichage</span>
              </p>
              <button 
                className="delete" 
                onClick={() => setShowPanneauModal(false)}
                style={{ background: 'rgba(255,255,255,0.3)' }}
              ></button>
            </header>
            
            <section className="modal-card-body">
              <div className="content">
                <p className="has-text-weight-bold is-size-6 mb-3">
                  Sélectionnez une actualité à ajouter au panneau d'affichage :
                </p>

                <div className="box" style={{ borderRadius: 12, border: '1px solid #e0e7ef' }}>
                  <div className="columns is-mobile">
                    <div className="column is-narrow">
                      <figure className="image is-64x64">
                        <img
                          src={selectedActualite?.image || 'https://via.placeholder.com/64x64?text=Image'}
                          alt={selectedActualite?.titre}
                          style={{ borderRadius: 8, objectFit: 'cover' }}
                          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/64x64?text=Image'; }}
                        />
                      </figure>
                    </div>
                    <div className="column">
                      <p className="has-text-weight-medium mb-1" style={{ fontSize: 14 }}>
                        {selectedActualite?.titre}
                      </p>
                      <p className="is-size-7 has-text-grey">
                        {selectedActualite?.date}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="field mt-4">
                  <label className="label">Catégorie</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select
                        value={panneauForm.categorie}
                        onChange={(e) => setPanneauForm({ ...panneauForm, categorie: e.target.value })}
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.icon} {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label className="label">Durée d'affichage (jours)</label>
                  <div className="control">
                    <input
                      className="input"
                      type="number"
                      value={panneauForm.dureeAffichage}
                      onChange={(e) => setPanneauForm({ ...panneauForm, dureeAffichage: e.target.value })}
                      min="1"
                      max="30"
                    />
                  </div>
                  <p className="help">
                    L'élément sera affiché pendant {panneauForm.dureeAffichage} jour{panneauForm.dureeAffichage > 1 ? 's' : ''}.
                  </p>
                </div>

                <div className="field">
                  <label className="label">Date de début</label>
                  <div className="control">
                    <input
                      className="input"
                      type="date"
                      value={panneauForm.dateDebut}
                      onChange={(e) => setPanneauForm({ ...panneauForm, dateDebut: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </section>

            <footer className="modal-card-foot" style={{ justifyContent: 'space-between' }}>
              <button 
                className="button" 
                onClick={() => setShowPanneauModal(false)}
              >
                Annuler
              </button>
              <button 
                className="button is-link" 
                onClick={handleAddToPanneau}
              >
                Ajouter au panneau
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* AJOUTER CETTE NOUVELLE MODAL pour créer un document */}
      {showCreatePanneauModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowCreatePanneauModal(false)}></div>
          <div className="modal-card" style={{ maxWidth: 700 }}>
            <header className="modal-card-head" style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white'
            }}>
              <p className="modal-card-title" style={{ color: 'white' }}>
                <span className="icon"><i className="fas fa-plus-circle"></i></span>
                <span>Créer un nouveau document</span>
              </p>
              <button 
                className="delete" 
                onClick={() => setShowCreatePanneauModal(false)}
                style={{ background: 'rgba(255,255,255,0.3)' }}
              ></button>
            </header>
            
            <section className="modal-card-body">
              <form onSubmit={handleCreatePanneau}>
                <div className="field">
                  <label className="label">
                    Titre du document *
                    <span className="has-text-grey is-size-7 has-text-weight-normal ml-2">
                      (Ex: "Arrêté municipal n°2024-05")
                    </span>
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      name="titre"
                      value={createPanneauForm.titre}
                      onChange={handleCreatePanneauChange}
                      placeholder="Titre du document"
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Description (optionnel)</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      name="description"
                      rows={3}
                      value={createPanneauForm.description}
                      onChange={handleCreatePanneauChange}
                      placeholder="Description du document..."
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Catégorie *</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select
                        name="categorie"
                        value={createPanneauForm.categorie}
                        onChange={handleCreatePanneauChange}
                        required
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.icon} {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label className="label">Image du document (optionnel)</label>
                  
                  <div className="file has-name is-fullwidth mb-2">
                    <label className="file-label">
                      <input
                        className="file-input"
                        type="file"
                        accept="image/*"
                        onChange={handlePanneauImageUpload}
                      />
                      <span className="file-cta">
                        <span className="file-icon">
                          <i className="fas fa-upload"></i>
                        </span>
                        <span className="file-label">Choisir une image...</span>
                      </span>
                      <span className="file-name">
                        {previewPanneauImage ? 'Image sélectionnée' : 'Aucune image'}
                      </span>
                    </label>
                  </div>

                  <div className="control mb-2">
                    <input
                      className="input"
                      name="image"
                      value={createPanneauForm.image}
                      onChange={(e) => {
                        handleCreatePanneauChange(e);
                        setPreviewPanneauImage(e.target.value || null);
                      }}
                      placeholder="Ou entrez l'URL d'une image"
                    />
                  </div>

                  {previewPanneauImage && (
                    <div className="mt-2">
                      <p className="is-size-7 mb-1">Aperçu :</p>
                      <figure className="image is-16by9">
                        <img
                          src={previewPanneauImage}
                          alt="Aperçu"
                          style={{ 
                            objectFit: 'cover', 
                            borderRadius: 8,
                            border: '2px solid #22c55e'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/400x225?text=Document';
                          }}
                        />
                      </figure>
                    </div>
                  )}
                </div>

                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label">Date de début *</label>
                      <div className="control">
                        <input
                          className="input"
                          type="date"
                          name="dateDebut"
                          value={createPanneauForm.dateDebut}
                          onChange={handleCreatePanneauChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="column">
                    <div className="field">
                      <label className="label">Durée d'affichage (jours) *</label>
                      <div className="control">
                        <input
                          className="input"
                          type="number"
                          name="dureeAffichage"
                          min="1"
                          max="365"
                          value={createPanneauForm.dureeAffichage}
                          onChange={handleCreatePanneauChange}
                          required
                        />
                      </div>
                      <p className="help">
                        Fin : {new Date(
                          new Date(createPanneauForm.dateDebut).getTime() + 
                          parseInt(createPanneauForm.dureeAffichage) * 24 * 60 * 60 * 1000
                        ).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Aperçu du document */}
                {createPanneauForm.titre && (
                  <div className="notification is-success is-light mt-4">
                    <p className="has-text-weight-bold mb-2">📋 Aperçu du document :</p>
                    <div style={{
                      background: 'white',
                      padding: 16,
                      borderRadius: 8,
                      borderLeft: `5px solid ${CATEGORIES.find(c => c.value === createPanneauForm.categorie)?.color}`
                    }}>
                      <div className="mb-2">
                        <span 
                          className="tag"
                          style={{
                            backgroundColor: `${CATEGORIES.find(c => c.value === createPanneauForm.categorie)?.color}22`,
                            color: CATEGORIES.find(c => c.value === createPanneauForm.categorie)?.color,
                            border: `1px solid ${CATEGORIES.find(c => c.value === createPanneauForm.categorie)?.color}`
                          }}
                        >
                          {CATEGORIES.find(c => c.value === createPanneauForm.categorie)?.icon}{' '}
                          {CATEGORIES.find(c => c.value === createPanneauForm.categorie)?.label}
                        </span>
                      </div>
                      <p className="has-text-weight-bold">{createPanneauForm.titre}</p>
                      {createPanneauForm.description && (
                        <p className="is-size-7 has-text-grey mt-1">{createPanneauForm.description}</p>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </section>

            <footer className="modal-card-foot" style={{ justifyContent: 'space-between' }}>
              <button 
                className="button" 
                onClick={() => setShowCreatePanneauModal(false)}
              >
                Annuler
              </button>
              <button 
                className="button is-success" 
                onClick={handleCreatePanneau}
              >
                <span className="icon">
                  <i className="fas fa-check"></i>
                </span>
                <span>Créer et ajouter au panneau</span>
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* ...existing code pour les autres sections... */}

      <ToastContainer position="top-right" autoClose={3000} newestOnTop />
    </div>
  );
}