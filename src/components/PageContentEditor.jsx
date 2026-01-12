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
  const [selectedDates, setSelectedDates] = useState([]); // Pour gérer les dates multiples
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
  const [showArchived, setShowArchived] = useState(false); // Nouvel état pour afficher/masquer les archives

  // AJOUTER ces états après panneauForm (ligne ~108)
  const [showCreatePanneauModal, setShowCreatePanneauModal] = useState(false);
  const [editPanneauMode, setEditPanneauMode] = useState(false);
  const [editPanneauIndex, setEditPanneauIndex] = useState(null);
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
  const elusSectionRef = useRef(null);

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
    // Charger les items du panneau depuis pageContent ET les actualités marquées pour le panneau
    Promise.all([
      fetch('/api/pageContent?page=accueil').then(res => res.ok ? res.json() : []),
      fetch('/api/actualites?afficherDans=panneau').then(res => res.ok ? res.json() : [])
    ])
      .then(([pageContent, actualites]) => {
        const pageContentData = pageContent?.[0] || {};
        let pageItems = [];
        
        // Récupérer les items existants de pageContent
        if (pageContentData.panneauItems_json) {
          try {
            const items = typeof pageContentData.panneauItems_json === 'string'
              ? JSON.parse(pageContentData.panneauItems_json)
              : pageContentData.panneauItems_json;
            pageItems = Array.isArray(items) ? items.map(item => ({
              ...item,
              archived: item.archived || false // S'assurer que le champ archived existe
            })) : [];
          } catch (e) {
            console.error('Erreur parsing panneauItems_json:', e);
          }
        }
        
        // Convertir les actualités en items de panneau
        const actualitesAsPanneauItems = actualites.map(actu => ({
          id: `actu-${actu.id}`,
          titre: actu.title,
          description: actu.description || '',
          image: actu.imgSrc || actu.pdfUrl || '',
          categorie: 'divers', // Catégorie par défaut, vous pouvez ajouter un champ dans actualites si besoin
          dateDebut: actu.date,
          dureeAffichage: 30, // Durée par défaut
          source: 'actualite' // Marquer la source
        }));
        
        // Auto-archiver les éléments expirés
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let itemsModified = false;
        const itemsWithAutoArchive = pageItems.map(item => {
          // Si l'item n'est pas déjà archivé et a une date de fin
          if (!item.archived && item.dateFin) {
            const dateFin = new Date(item.dateFin);
            dateFin.setHours(0, 0, 0, 0);
            
            // Si la date de fin est dépassée, archiver automatiquement
            if (dateFin < today) {
              console.log(`🗄️ Auto-archivage de: ${item.titre} (expiré le ${item.dateFin})`);
              itemsModified = true;
              return { ...item, archived: true };
            }
          }
          return item;
        });
        
        // Si des items ont été archivés, sauvegarder automatiquement
        if (itemsModified) {
          fetch('/api/pageContent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              page: 'accueil',
              panneauItems_json: JSON.stringify(itemsWithAutoArchive)
            })
          })
          .then(res => res.json())
          .then(() => {
            console.log('✅ Éléments expirés archivés automatiquement');
            toast.success('🗄️ Éléments expirés archivés automatiquement');
          })
          .catch(err => console.error('❌ Erreur sauvegarde auto-archivage:', err));
        }
        
        // Fusionner les deux sources
        setPanneauItems([...itemsWithAutoArchive, ...actualitesAsPanneauItems]);
      })
      .catch(err => console.error('Erreur chargement panneau:', err));
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
            
            // Trier par nom de famille (ordre alphabétique)
            const elusSorted = Array.isArray(elusData) 
              ? elusData.sort((a, b) => {
                  const nomA = (a.nom || '').toLowerCase();
                  const nomB = (b.nom || '').toLowerCase();
                  return nomA.localeCompare(nomB, 'fr');
                })
              : [];
            
            setElus(elusSorted);
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
    const loadingId = toast.loading("Envoi de l'image...");
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await fetch('/api/upload_doc', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadRes.ok) {
        throw new Error('Upload failed');
      }
      
      const { fileUrl } = await uploadRes.json();
      setPreviewImage(fileUrl);
      setForm(prev => ({ ...prev, image: fileUrl }));
      toast.update(loadingId, { render: '✅ Image envoyée !', type: 'success', isLoading: false, autoClose: 2000 });
    } catch (err) {
      toast.update(loadingId, { render: "❌ Erreur lors de l'upload", type: 'error', isLoading: false, autoClose: 3000 });
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
    const loadingId = toast.loading("Envoi de l'image...");
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await fetch('/api/upload_doc', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadRes.ok) {
        throw new Error('Upload failed');
      }
      
      const { fileUrl } = await uploadRes.json();
      setMairePreviewImage(fileUrl);
      setContent({ ...content, motMaire_photo: fileUrl });
      toast.update(loadingId, { render: '✅ Image envoyée !', type: 'success', isLoading: false, autoClose: 2000 });
    } catch (err) {
      toast.update(loadingId, { render: "❌ Erreur lors de l'upload", type: 'error', isLoading: false, autoClose: 3000 });
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
    setSelectedDates([]);
    setPreviewImage(null);
    setEditMode(false);
    setEditIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation : si des dates multiples sont sélectionnées, on les utilise, sinon on utilise la date unique
    const datesToUse = selectedDates.length > 0 ? selectedDates : (form.date.trim() ? [form.date] : []);
    
    if (!form.titre.trim() || datesToUse.length === 0) {
      toast.error('Titre et au moins une date sont obligatoires.');
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
        // Créer un événement pour chaque date sélectionnée
        datesToUse.forEach(date => {
          next.push({ 
            id: `event-${crypto?.randomUUID?.() || Date.now()}-${date}`, 
            ...form,
            date: date 
          });
        });
      }
      setEvents(next);
      await persistEvents(next);
      const message = editMode ? 'Événement modifié' : (datesToUse.length > 1 ? `${datesToUse.length} événements ajoutés` : 'Événement ajouté');
      toast.update(toastId, { render: message, type: 'success', isLoading: false, autoClose: 2000 });
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
    setSelectedDates([]); // Réinitialiser les dates multiples en mode édition
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
    { value: 'eau', label: 'Analyses d\'eau', icon: '💧', color: '#0ea5e9' },
    { value: 'divers', label: 'Divers', icon: '�', color: '#a855f7' },
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
    // Vérifier si c'est un item partagé depuis une actualité
    const item = panneauItems.find(i => i.id === itemId);
    if (item && item.source === 'actualite') {
      toast.warning(
        <div>
          <p className="mb-2">❌ Cet élément provient du carrousel</p>
          <p className="is-size-7">Pour le retirer du panneau, modifiez l'actualité depuis la <strong>Gestion du carrousel</strong> et décochez "Panneau d'affichage".</p>
        </div>,
        { autoClose: 5000 }
      );
      return;
    }
    
    toast.info(
      <div>
        <p>Retirer cet élément du panneau d'affichage ?</p>
        <div className="buttons mt-3">
          <button
            className="button is-danger is-small"
            onClick={async () => {
              toast.dismiss();
              const loadingId = toast.loading('Suppression...');
              
              // Filtrer seulement les items qui ne viennent pas des actualités
              const updatedItems = panneauItems.filter(item => 
                item.id !== itemId && (!item.source || item.source !== 'actualite')
              );
              
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
                
                // Recharger tous les items (pageContent + actualités)
                const [pageContent, actualites] = await Promise.all([
                  fetch('/api/pageContent?page=accueil').then(res => res.json()),
                  fetch('/api/actualites?afficherDans=panneau').then(res => res.json())
                ]);
                
                const pageContentData = pageContent?.[0] || {};
                let pageItems = [];
                if (pageContentData.panneauItems_json) {
                  const items = typeof pageContentData.panneauItems_json === 'string'
                    ? JSON.parse(pageContentData.panneauItems_json)
                    : pageContentData.panneauItems_json;
                  pageItems = Array.isArray(items) ? items : [];
                }
                
                const actualitesAsPanneauItems = actualites.map(actu => ({
                  id: `actu-${actu.id}`,
                  titre: actu.title,
                  description: actu.description || '',
                  pimage: actu.imgSrc || actu.pdfUrl || '',
                  categorie: 'divers',
                  dateDebut: actu.date,
                  dureeAffichage: 30,
                  source: 'actualite'
                }));
                
                setPanneauItems([...pageItems, ...actualitesAsPanneauItems]);
                
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

  // Fonction pour archiver/désarchiver un item du panneau
  const handleToggleArchive = async (itemId) => {
    const item = panneauItems.find(i => i.id === itemId);
    
    if (!item) return;
    
    // Vérifier si c'est une actualité partagée (non modifiable)
    if (item.source === 'actualite') {
      toast.warning("⚠️ Impossible d'archiver une actualité partagée. Gérez-la depuis le carrousel.", {
        position: "top-center",
        autoClose: 4000,
      });
      return;
    }
    
    const updatedItems = panneauItems.map(i => 
      i.id === itemId ? { ...i, archived: !i.archived } : i
    );
    
    // Filtrer les actualités (source = 'actualite') avant de sauvegarder
    const itemsToSave = updatedItems.filter(i => i.source !== 'actualite');
    
    console.log('Items à sauvegarder:', itemsToSave);
    
    try {
      const response = await fetch('/api/pageContent', {
        method: 'POST',  // Utiliser POST au lieu de PUT
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: SELECTED_PAGE,
          panneauItems_json: JSON.stringify(itemsToSave)
        })
      });
      
      const data = await response.json();
      console.log('Réponse API:', data);
      
      if (response.ok && data.success) {
        setPanneauItems(updatedItems);
        toast.success(item.archived ? '📂 Élément désarchivé' : '📦 Élément archivé', {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        console.error('Erreur API:', response.status, data);
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      toast.error(`❌ Erreur lors de l'archivage: ${error.message}`);
    }
  };

  // AJOUTER ces handlers après handleRemoveFromPanneau (ligne ~590)
  const handleCreatePanneauChange = e => {
    setCreatePanneauForm({ ...createPanneauForm, [e.target.name]: e.target.value });
  };

  const handlePanneauImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Accepter images ET PDF
    const isImage = file.type.includes('image/');
    const isPDF = file.type === 'application/pdf';
    
    if (!isImage && !isPDF) {
      toast.error('Veuillez sélectionner une image ou un PDF.');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Fichier trop volumineux (max 10MB).');
      return;
    }
    
    const loadingId = toast.loading("Envoi du fichier...");
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await fetch('/api/upload_doc', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadRes.ok) {
        throw new Error('Upload failed');
      }
      
      const { fileUrl } = await uploadRes.json();
      setPreviewPanneauImage(fileUrl);
      setCreatePanneauForm(prev => ({ ...prev, image: fileUrl, isPDF: isPDF }));
      toast.update(loadingId, { 
        render: isPDF ? '✅ PDF envoyé !' : '✅ Image envoyée !', 
        type: 'success', 
        isLoading: false, 
        autoClose: 2000 
      });
    } catch (err) {
      toast.update(loadingId, { render: "❌ Erreur lors de l'upload", type: 'error', isLoading: false, autoClose: 3000 });
    }
  };

  const handleCreatePanneau = async (e) => {
    e.preventDefault();
    if (!createPanneauForm.titre.trim()) {
      toast.error('Le titre est obligatoire');
      return;
    }

    const loadingId = toast.loading(editPanneauMode ? 'Modification en cours...' : 'Ajout au panneau...');
    try {
      const dateFin = new Date(createPanneauForm.dateDebut);
      dateFin.setDate(dateFin.getDate() + parseInt(createPanneauForm.dureeAffichage));

      const itemData = {
        titre: createPanneauForm.titre,
        description: createPanneauForm.description,
        image: createPanneauForm.image,
        isPDF: createPanneauForm.isPDF || false,
        categorie: createPanneauForm.categorie,
        dateDebut: createPanneauForm.dateDebut,
        dateFin: dateFin.toISOString().split('T')[0],
        date: new Date(createPanneauForm.dateDebut).toLocaleDateString('fr-FR'),
        isCustom: true
      };

      let updatedItems;
      if (editPanneauMode && editPanneauIndex !== null) {
        // Mode édition : mettre à jour l'élément existant
        updatedItems = [...panneauItems];
        updatedItems[editPanneauIndex] = {
          ...updatedItems[editPanneauIndex],
          ...itemData
        };
      } else {
        // Mode création : ajouter un nouvel élément
        updatedItems = [...panneauItems, {
          id: `panneau-custom-${Date.now()}`,
          ...itemData
        }];
      }

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
        render: editPanneauMode ? '✅ Document modifié' : '✅ Document ajouté au panneau', 
        type: 'success', 
        isLoading: false, 
        autoClose: 2000 
      });

      // Réinitialiser le formulaire
      setShowCreatePanneauModal(false);
      setEditPanneauMode(false);
      setEditPanneauIndex(null);
      setCreatePanneauForm({
        titre: '',
        description: '',
        image: '',
        isPDF: false,
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

  const handleEditPanneau = (index) => {
    const item = panneauItems[index];
    if (!item) return;
    
    // Ne pas permettre l'édition des items partagés depuis une actualité
    if (item.source === 'actualite') {
      toast.warning(
        <div>
          <p className="mb-2">❌ Cet élément provient du carrousel</p>
          <p className="is-size-7">Modifiez-le depuis la <strong>Gestion du carrousel</strong>.</p>
        </div>,
        { autoClose: 5000 }
      );
      return;
    }

    // Calculer la durée d'affichage
    const dateDebut = new Date(item.dateDebut);
    const dateFin = new Date(item.dateFin);
    const dureeAffichage = Math.ceil((dateFin - dateDebut) / (1000 * 60 * 60 * 24));

    setEditPanneauMode(true);
    setEditPanneauIndex(index);
    setCreatePanneauForm({
      titre: item.titre || '',
      description: item.description || '',
      image: item.image || '',
      isPDF: item.isPDF || false,
      categorie: item.categorie || 'arrete',
      dateDebut: item.dateDebut || new Date().toISOString().split('T')[0],
      dureeAffichage: dureeAffichage
    });
    setPreviewPanneauImage(item.image || null);
    setShowCreatePanneauModal(true);
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
                  🗑️
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
                  <label className="label is-small">
                    {editMode ? 'Date' : 'Date (ou ajoutez plusieurs dates ci-dessous)'}
                  </label>
                  <input 
                    className="input" 
                    type="date" 
                    name="date" 
                    value={formatDateForInput(form.date)} 
                    onChange={handleChange} 
                    required={editMode || selectedDates.length === 0}
                    readOnly={loading}
                    style={{ background: loading ? "#f5f5f5" : "white" }}
                  />
                </div>
                {!editMode && (
                  <div className="control">
                    <label className="label is-small">&nbsp;</label>
                    <button 
                      type="button"
                      className="button is-success"
                      onClick={() => {
                        if (form.date && !selectedDates.includes(form.date)) {
                          setSelectedDates([...selectedDates, form.date].sort());
                          toast.success(`Date ajoutée : ${new Date(form.date).toLocaleDateString('fr-FR')}`);
                        } else if (selectedDates.includes(form.date)) {
                          toast.warning('Cette date est déjà ajoutée');
                        }
                      }}
                      disabled={!form.date || loading}
                      title="Ajouter cette date"
                    >
                      ➕ Ajouter
                    </button>
                  </div>
                )}
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

              {/* Affichage des dates sélectionnées */}
              {!editMode && selectedDates.length > 0 && (
                <div className="field mb-3">
                  <label className="label is-small">Dates sélectionnées ({selectedDates.length})</label>
                  <div className="tags">
                    {selectedDates.map((date, idx) => (
                      <span key={idx} className="tag is-success is-medium">
                        {new Date(date).toLocaleDateString('fr-FR')}
                        <button
                          type="button"
                          className="delete is-small"
                          onClick={() => {
                            setSelectedDates(selectedDates.filter(d => d !== date));
                            toast.info('Date retirée');
                          }}
                          disabled={loading}
                        />
                      </span>
                    ))}
                  </div>
                  <p className="help is-success">
                    Un événement sera créé pour chaque date sélectionnée
                  </p>
                </div>
              )}

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
                    <button className="button is-small is-info" onClick={() => handleEdit(idx)} disabled={loading}>
                      ✏️
                    </button>
                    <button className="button is-small is-danger" onClick={() => handleDelete(idx)} disabled={loading}>
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
            <span>Ajouter depuis le carrousel </span>
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
          
          {/* Bouton pour afficher/masquer les archives */}
          <button 
            className={`button ${showArchived ? 'is-warning' : 'is-light'}`}
            onClick={() => setShowArchived(!showArchived)}
          >
            <span className="icon">
              <i className={`fas fa-${showArchived ? 'eye' : 'archive'}`}></i>
            </span>
            <span>{showArchived ? 'Masquer les archives' : 'Afficher les archives'}</span>
          </button>
        </div>

        {panneauItems.filter(item => showArchived ? item.archived : !item.archived).length === 0 ? (
          <div className="notification is-light is-info">
            <p className="has-text-centered">
              <span style={{ fontSize: 48, opacity: 0.3 }}>📋</span>
            </p>
            <p className="has-text-centered">
              {showArchived 
                ? 'Aucun élément archivé.'
                : 'Aucun élément sur le panneau d\'affichage.'}<br />
              {!showArchived && 'Ajoutez des actualités existantes ou créez de nouveaux documents.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {panneauItems
              .filter(item => showArchived ? item.archived : !item.archived)
              .map((item, index) => {
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
                statusTag = <span className="tag is-warning">📅 Dans {joursAvantDebut}j</span>;
              } else if (isExpired) {
                statusTag = <span className="tag is-danger">❌ Expiré</span>;
              } else if (isActive) {
                statusTag = <span className="tag is-success">✅ Actif ({joursRestants}j)</span>;
              }
              
              return (
                <div 
                  key={item.id}
                  className="box"
                  style={{ 
                    background: item.archived ? '#f0f0f0' : (isExpired ? '#f5f5f5' : 'white'), 
                    borderRadius: 16,
                    borderLeft: `6px solid ${item.archived ? '#888' : (cat?.color || '#ccc')}`,
                    opacity: item.archived ? 0.6 : (isExpired ? 0.7 : 1),
                    position: 'relative',
                    boxShadow: isExpired ? '0 2px 8px rgba(0,0,0,0.05)' : '0 4px 12px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Badge "Archivé" */}
                  {item.archived && (
                    <span 
                      className="tag is-dark"
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        fontSize: 11,
                        padding: '4px 10px',
                        zIndex: 10
                      }}
                    >
                      📦 Archivé
                    </span>
                  )}
                  
                  {/* Badge "Document personnalisé" */}
                  {item.isCustom && !item.archived && (
                    <span 
                      className="tag is-success is-light"
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        fontSize: 10,
                        padding: '3px 8px',
                        zIndex: 10
                      }}
                    >
                      ✨ Personnalisé
                    </span>
                  )}

                  <div className="mb-3" style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    flexWrap: 'wrap', 
                    gap: 8,
                    paddingRight: item.isCustom ? '120px' : '0'
                  }}>
                    <span 
                      className="tag is-medium" 
                      style={{ 
                        backgroundColor: `${cat?.color}33`, 
                        color: cat?.color,
                        border: `2px solid ${cat?.color}`,
                        fontWeight: 700,
                        fontSize: 13
                      }}
                    >
                      {cat?.icon} {cat?.label}
                    </span>
                    {statusTag}
                  </div>
                  
                  {item.image && (
                    item.isPDF ? (
                      <div className="mb-3" style={{ textAlign: 'center' }}>
                        <iframe
                          src={item.image}
                          style={{
                            width: '100%',
                            height: '400px',
                            border: '2px solid #ddd',
                            borderRadius: 8,
                            marginBottom: 10
                          }}
                          title={item.titre}
                        />
                        <a 
                          href={item.image} 
                          download={`${item.titre}.pdf`}
                          className="button is-info is-small"
                        >
                          <span className="icon">
                            <i className="fas fa-download"></i>
                          </span>
                          <span>Télécharger le PDF</span>
                        </a>
                      </div>
                    ) : (
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
                    )
                  )}
                  
                  <p className="has-text-weight-bold mb-2" style={{ fontSize: 16, color: '#333' }}>
                    {item.titre}
                    {item.source === 'actualite' && (
                      <span className="tag is-warning is-light ml-2" style={{ verticalAlign: 'middle' }}>
                        🎠 Carrousel
                      </span>
                    )}
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

                  <div className="buttons mt-3">
                    {item.source === 'actualite' ? (
                      <div className="notification is-warning is-light p-3">
                        <p className="is-size-7">
                          🎠 <strong>Élément partagé depuis le carrousel</strong><br />
                          Modifiez-le depuis la gestion du carrousel
                        </p>
                      </div>
                    ) : (
                      <>
                        <button 
                          className="button is-info is-light is-fullwidth" 
                          onClick={() => handleEditPanneau(panneauItems.indexOf(item))}
                        >
                          <span className="icon">
                            <i className="fas fa-edit"></i>
                          </span>
                          <span>Modifier</span>
                        </button>
                        
                        <button 
                          className={`button is-fullwidth ${item.archived ? 'is-success' : 'is-warning'}`}
                          onClick={() => handleToggleArchive(item.id)}
                        >
                          <span className="icon">
                            <i className={`fas fa-${item.archived ? 'box-open' : 'archive'}`}></i>
                          </span>
                          <span>{item.archived ? 'Désarchiver' : 'Archiver'}</span>
                        </button>
                        
                        <button 
                          className="button is-danger is-fullwidth" 
                          onClick={() => handleRemoveFromPanneau(item.id)}
                        >
                          <span className="icon">🗑️</span>
                        </button>
                      </>
                    )}
                  </div>
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
                <span className="icon">
                  <i className={`fas fa-${editPanneauMode ? 'edit' : 'plus-circle'}`}></i>
                </span>
                <span>{editPanneauMode ? 'Modifier le document' : 'Créer un nouveau document'}</span>
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
                  <label className="label">Image ou PDF du document (optionnel)</label>
                  
                  <div className="file has-name is-fullwidth mb-2">
                    <label className="file-label">
                      <input
                        className="file-input"
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handlePanneauImageUpload}
                      />
                      <span className="file-cta">
                        <span className="file-icon">
                          <i className="fas fa-upload"></i>
                        </span>
                        <span className="file-label">Choisir image ou PDF...</span>
                      </span>
                      <span className="file-name">
                        {previewPanneauImage ? (createPanneauForm.isPDF ? '📄 PDF sélectionné' : '🖼️ Image sélectionnée') : 'Aucun fichier'}
                      </span>
                    </label>
                  </div>

                  <div className="control mb-2">
                    <input
                      className="input"
                      name="image"
                      value={createPanneauForm.image && !createPanneauForm.isPDF ? createPanneauForm.image : ''}
                      onChange={(e) => {
                        handleCreatePanneauChange(e);
                        setPreviewPanneauImage(e.target.value || null);
                        setCreatePanneauForm(prev => ({ ...prev, isPDF: false }));
                      }}
                      placeholder="Ou entrez l'URL d'une image"
                      disabled={createPanneauForm.isPDF}
                    />
                  </div>

                  {previewPanneauImage && (
                    <div className="mt-2">
                      <p className="is-size-7 mb-1">Aperçu :</p>
                      {createPanneauForm.isPDF ? (
                        <div className="notification is-info is-light" style={{ textAlign: 'center', padding: '2rem' }}>
                          <p style={{ fontSize: 48 }}>📄</p>
                          <p className="has-text-weight-bold">Fichier PDF chargé</p>
                          <p className="is-size-7 has-text-grey mt-2">Le PDF sera disponible au téléchargement</p>
                        </div>
                      ) : (
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
                      )}
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
                onClick={() => {
                  setShowCreatePanneauModal(false);
                  setEditPanneauMode(false);
                  setEditPanneauIndex(null);
                  setCreatePanneauForm({
                    titre: '',
                    description: '',
                    image: '',
                    isPDF: false,
                    categorie: 'arrete',
                    dateDebut: new Date().toISOString().split('T')[0],
                    dureeAffichage: 7
                  });
                  setPreviewPanneauImage(null);
                }}
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
                <span>{editPanneauMode ? 'Enregistrer les modifications' : 'Créer et ajouter au panneau'}</span>
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* ...existing code pour les autres sections... */}

      {/* Section Gestion des Élus */}
      <div className="box mb-4" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
        <h3 className="subtitle is-5 mb-3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>👥</span> Gestion des Élus
        </h3>

        <div className="notification is-info is-light mb-3" style={{ padding: '0.75rem 1rem' }}>
          <p className="is-size-7">
            ℹ️ <strong>Tri automatique :</strong> Les élus seront automatiquement triés par ordre alphabétique du nom de famille lors de l'enregistrement.
          </p>
        </div>

        <button 
          className="button is-link mb-4" 
          onClick={() => {
            setElus([...elus, { nom: '', prenom: '', fonction: '', photo: '', email: '', telephone: '' }]);
            toast.info('➕ Nouvel élu ajouté à la liste');
            // Scroll vers le nouvel élu après un court délai
            setTimeout(() => {
              if (elusSectionRef.current) {
                const lastElu = elusSectionRef.current.lastElementChild;
                if (lastElu) {
                  lastElu.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }
            }, 100);
          }}
        >
          <span className="icon"><i className="fas fa-plus"></i></span>
          <span>Ajouter un élu</span>
        </button>

        {elus.length === 0 ? (
          <div className="notification is-light is-info">
            <p className="has-text-centered">
              <span style={{ fontSize: 48, opacity: 0.3 }}>👥</span>
            </p>
            <p className="has-text-centered">
              Aucun élu ajouté. Cliquez sur "Ajouter un élu" pour commencer.
            </p>
          </div>
        ) : (
          <div ref={elusSectionRef}>
            {elus.map((elu, index) => (
              <div key={index} className="box mb-3" style={{ background: '#f9fbfd', borderRadius: 8 }}>
                <div className="is-flex is-justify-content-space-between mb-3">
                  <span className="tag is-info">Élu #{index + 1}</span>
                  <button 
                    className="button is-danger is-small" 
                    onClick={() => {
                      toast.info(
                        <div>
                          <p>Voulez-vous vraiment supprimer cet élu ?</p>
                          <div className="buttons mt-3">
                            <button
                              className="button is-danger is-small"
                              onClick={() => {
                                toast.dismiss();
                                const newElus = elus.filter((_, i) => i !== index);
                                setElus(newElus);
                                toast.success('🗑️ Élu supprimé');
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
                        }
                      );
                    }}
                  >
                    🗑️
                  </button>
                </div>

                <div className="columns">
                  <div className="column is-one-third">
                    <label className="label is-small">Photo de l'élu</label>
                    <figure className="image is-128x128" style={{ margin: '0 auto 1rem' }}>
                      <img
                        src={elu.photo || 'https://via.placeholder.com/128x128?text=Photo'}
                        alt={`${elu.prenom} ${elu.nom}`}
                        style={{ 
                          borderRadius: '50%', 
                          objectFit: 'cover',
                          border: '3px solid #1277c6',
                          width: '100%',
                          height: '100%'
                        }}
                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/128x128?text=Photo'; }}
                      />
                    </figure>

                    <div className="file has-name is-fullwidth mb-2">
                      <label className="file-label">
                        <input 
                          className="file-input" 
                          type="file" 
                          accept="image/*" 
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (!file.type.includes('image/')) {
                              toast.error('❌ Veuillez sélectionner une image.');
                              return;
                            }
                            if (file.size > 5 * 1024 * 1024) {
                              toast.error('❌ Image trop volumineuse (max 5MB).');
                              return;
                            }
                            
                            const loadingId = toast.loading("🖼️ Envoi de l'image...");
                            
                            // Utiliser l'API d'upload au lieu de base64
                            const formData = new FormData();
                            formData.append('file', file);
                            
                            try {
                              const uploadRes = await fetch('/api/upload_doc', {
                                method: 'POST',
                                body: formData,
                              });
                              
                              if (!uploadRes.ok) {
                                throw new Error('Upload failed');
                              }
                              
                              const { fileUrl } = await uploadRes.json();
                              
                              const newElus = [...elus];
                              newElus[index].photo = fileUrl;
                              setElus(newElus);
                              
                              toast.update(loadingId, { 
                                render: '✅ Image chargée avec succès', 
                                type: 'success', 
                                isLoading: false, 
                                autoClose: 2000 
                              });
                            } catch (err) {
                              console.error('Upload error:', err);
                              toast.update(loadingId, { 
                                render: "❌ Erreur lors de l'upload de l'image", 
                                type: 'error', 
                                isLoading: false, 
                                autoClose: 3000 
                              });
                            }
                          }}
                        />
                        <span className="file-cta">
                          <span className="file-icon">
                            <i className="fas fa-upload"></i>
                          </span>
                          <span className="file-label">Choisir une image...</span>
                        </span>
                        <span className="file-name">
                          {elu.photo ? 'Image sélectionnée' : 'Aucune image'}
                        </span>
                      </label>
                    </div>

                    <div className="field">
                      <div className="control">
                        <input
                          className="input is-small"
                          type="text"
                          placeholder="Ou URL de la photo"
                          value={elu.photo || ''}
                          onChange={(e) => {
                            const newElus = [...elus];
                            newElus[index].photo = e.target.value;
                            setElus(newElus);
                          }}
                        />
                      </div>
                    </div>

                    {elu.photo && (
                      <button 
                        className="button is-danger is-small is-fullwidth mt-2" 
                        onClick={() => {
                          const newElus = [...elus];
                          newElus[index].photo = '';
                          setElus(newElus);
                          toast.info('🖼️ Photo supprimée');
                        }}
                      >
                        🗑️
                      </button>
                    )}
                  </div>

                  <div className="column">
                    <div className="columns">
                      <div className="column">
                        <div className="field">
                          <label className="label is-small">Prénom</label>
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              placeholder="Prénom"
                              value={elu.prenom || ''}
                              onChange={(e) => {
                                const newElus = [...elus];
                                newElus[index].prenom = e.target.value;
                                setElus(newElus);
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="column">
                        <div className="field">
                          <label className="label is-small">Nom</label>
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              placeholder="Nom"
                              value={elu.nom || ''}
                              onChange={(e) => {
                                const newElus = [...elus];
                                newElus[index].nom = e.target.value;
                                setElus(newElus);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="field">
                      <label className="label is-small">Fonction</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          placeholder="Maire, Adjoint au Maire, Conseiller municipal..."
                          value={elu.fonction || ''}
                          onChange={(e) => {
                            const newElus = [...elus];
                            newElus[index].fonction = e.target.value;
                            setElus(newElus);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="field is-grouped mt-4">
              <div className="control">
                <button 
                  className="button is-link" 
                  onClick={async () => {
                    // Validation avant enregistrement
                    const invalidElus = elus.filter(e => !e.nom || !e.prenom || !e.fonction);
                    if (invalidElus.length > 0) {
                      toast.error('⚠️ Veuillez remplir au minimum le nom, prénom et fonction pour tous les élus');
                      return;
                    }

                    // Trier par nom de famille avant enregistrement
                    const elusSorted = [...elus].sort((a, b) => {
                      const nomA = (a.nom || '').toLowerCase();
                      const nomB = (b.nom || '').toLowerCase();
                      return nomA.localeCompare(nomB, 'fr');
                    });

                    const loadingId = toast.loading('💾 Enregistrement en cours...');
                    try {
                      console.log('Enregistrement des élus (triés par nom):', elusSorted);
                      
                      const res = await fetch('/api/pageContent', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          page: 'accueil',
                          elus_json: elusSorted // Liste triée par nom de famille
                        })
                      });

                      console.log('Réponse serveur:', res.status);
                      
                      if (res.ok) {
                        const data = await res.json();
                        console.log('Données enregistrées:', data);
                        
                        // Mettre à jour l'état local avec la liste triée
                        setElus(elusSorted);
                        
                        toast.update(loadingId, {
                          render: '✅ Élus enregistrés avec succès (triés par nom) !',
                          type: 'success',
                          isLoading: false,
                          autoClose: 2000
                        });
                      } else {
                        const errorText = await res.text();
                        console.error('Erreur serveur:', errorText);
                        toast.update(loadingId, {
                          render: `❌ Erreur: ${errorText.substring(0, 50)}`,
                          type: 'error',
                          isLoading: false,
                          autoClose: 3000
                        });
                      }
                    } catch (err) {
                      console.error('Erreur lors de l\'enregistrement:', err);
                      toast.update(loadingId, {
                        render: `❌ Erreur: ${err.message}`,
                        type: 'error',
                        isLoading: false,
                        autoClose: 3000
                      });
                    }
                  }}
                >
                  <span className="icon"><i className="fas fa-save"></i></span>
                  <span>Enregistrer tous les élus</span>
                </button>
              </div>
              <div className="control">
                <p className="help mt-2">
                  💡 N'oubliez pas de cliquer sur "Enregistrer" après vos modifications
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} newestOnTop />
    </div>
  );
}