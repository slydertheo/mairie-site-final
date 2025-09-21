import React, { useState, useEffect } from 'react';

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
  {
    key: 'urgence',
    icon: '🚨',
    title: 'Numéros d\'urgence',
    fields: ['urgence_pompiers', 'urgence_police', 'urgence_samu'],
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
  { key: 'urgence_pompiers', label: 'Numéro Pompiers', type: 'text' },
  { key: 'urgence_police', label: 'Numéro Police', type: 'text' },
  { key: 'urgence_samu', label: 'Numéro SAMU', type: 'text' },
];

export default function PageContentEditor() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [agendaItems, setAgendaItems] = useState([]);
  const [currentAgendaItem, setCurrentAgendaItem] = useState(null);
  const [showAgendaForm, setShowAgendaForm] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/pageContent?page=${SELECTED_PAGE}`)
      .then(res => res.json())
      .then(data => {
        const obj = data[0] || {};
        const initial = {};
        FIELDS.forEach(f => {
          initial[f.key] = obj[f.key] || '';
        });
        setForm(initial);
        
        // Initialiser agendaItems à partir des champs individuels et du tableau existant
        let items = [];
        
        // Ajouter les événements à partir des champs individuels s'ils existent
        if (obj.agenda1_title || obj.agenda1_date) {
          items.push({
            title: obj.agenda1_title || '',
            date: obj.agenda1_date || ''
          });
        }
        
        if (obj.agenda2_title || obj.agenda2_date) {
          items.push({
            title: obj.agenda2_title || '',
            date: obj.agenda2_date || ''
          });
        }
        
        // MODIFICATION ICI: Vérifier d'abord obj.agendaItems (qui sera parsé automatiquement par l'API)
        if (obj.agendaItems && Array.isArray(obj.agendaItems) && obj.agendaItems.length > 0) {
          if (items.length > 0) {
            const additionalItems = obj.agendaItems.slice(items.length);
            items = [...items, ...additionalItems];
          } else {
            items = [...obj.agendaItems];
          }
        }
        // Puis essayer avec agendaItems_json comme fallback
        else if (obj.agendaItems_json) {
          try {
            const parsedItems = JSON.parse(obj.agendaItems_json);
            if (items.length > 0) {
              const additionalItems = parsedItems.slice(items.length);
              items = [...items, ...additionalItems];
            } else {
              items = [...parsedItems];
            }
          } catch (e) {
            console.error('Erreur lors du parsing de agendaItems_json:', e);
          }
        }
        
        setAgendaItems(items);
      })
      .catch(() => {
        setForm({});
        setAgendaItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Modifier la fonction handleSave pour corriger les problèmes d'enregistrement
  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    
    try {
      // Créer une copie des données du formulaire
      const formData = { ...form };
      
      // Convertir les événements d'agenda en format compatible avec votre API
      if (agendaItems.length > 0) {
        formData.agenda1_title = agendaItems[0].title || '';
        formData.agenda1_date = agendaItems[0].date || '';
        formData.agenda1_description = agendaItems[0].description || '';
      } else {
        formData.agenda1_title = '';
        formData.agenda1_date = '';
        formData.agenda1_description = '';
      }
      
      if (agendaItems.length > 1) {
        formData.agenda2_title = agendaItems[1].title || '';
        formData.agenda2_date = agendaItems[1].date || '';
        formData.agenda2_description = agendaItems[1].description || '';
      } else {
        formData.agenda2_title = '';
        formData.agenda2_date = '';
        formData.agenda2_description = '';
      }
      
      // MODIFICATION: Envoyer également une version JSON stringifiée
      formData.agendaItems_json = JSON.stringify(agendaItems);
      // Garder également l'objet pour la compatibilité
      formData.agendaItems = agendaItems;
      
      console.log('Tentative d\'enregistrement avec les données:', {
        page: SELECTED_PAGE,
        ...formData
      });
      
      // Envoyer la requête
      const response = await fetch(`/api/pageContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: SELECTED_PAGE,
          ...formData
        })
      });
      
      // Vérification explicite du succès
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Erreur serveur (${response.status}): ${errorData}`);
      }
      
      const result = await response.json();
      console.log('Réponse du serveur:', result);
      
      setMsg('✅ Modifications enregistrées !');
      
      // Notification explicite
      alert('Les modifications ont été enregistrées avec succès. La page va se rafraîchir.');
      
      // Rafraîchir la page pour voir les changements
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      setMsg(`❌ Erreur: ${error.message}`);
      alert(`Une erreur est survenue: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fonctions CRUD pour l'agenda
  const handleAddAgendaItem = () => {
    setCurrentAgendaItem({ title: '', date: '', description: '' });
    setShowAgendaForm(true);
  };

  const handleEditAgendaItem = (item, index) => {
    setCurrentAgendaItem({ ...item, index });
    setShowAgendaForm(true);
  };

  const handleDeleteAgendaItem = (index) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement?')) {
      const newItems = [...agendaItems];
      newItems.splice(index, 1);
      setAgendaItems(newItems);
    }
  };

  const handleAgendaFormSubmit = (e) => {
    e.preventDefault();
    
    // Vérifier que le titre et la date sont remplis
    if (!currentAgendaItem.title.trim() || !currentAgendaItem.date.trim()) {
      alert("Le titre et la date sont obligatoires");
      return;
    }
    
    // Nettoyer les données
    const cleanedItem = {
      title: currentAgendaItem.title.trim(),
      date: currentAgendaItem.date.trim(),
      description: currentAgendaItem.description?.trim() || '',
      // Ajouter un identifiant unique pour chaque élément
      id: currentAgendaItem.id || `event-${Date.now()}`
    };
    
    // Log pour le débogage
    console.log("Événement à ajouter/modifier:", cleanedItem);
    
    if (currentAgendaItem.index !== undefined) {
      // Mode édition
      const newItems = [...agendaItems];
      newItems[currentAgendaItem.index] = cleanedItem;
      setAgendaItems(newItems);
      console.log("Événements après modification:", newItems);
    } else {
      // Mode ajout
      const newItems = [...agendaItems, cleanedItem];
      setAgendaItems(newItems);
      console.log("Événements après ajout:", newItems);
    }
    
    setShowAgendaForm(false);
    setCurrentAgendaItem(null);
  };

  // Rendu du composant
  return (
    <div className="container" style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 32 }}>
      <div className="box" style={{
        borderRadius: 16,
        background: '#fafdff',
        boxShadow: '0 2px 16px #e0e7ef'
      }}>
        <form onSubmit={handleSave}>
          <h2 className="title is-4 mb-4 has-text-link" style={{ textAlign: 'center', letterSpacing: 1 }}>
            ⚙️ Paramètres de la page
          </h2>
          {FIELD_GROUPS.map(group => (
            <div key={group.key} className="box mb-4" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
              <h3 className="subtitle is-5 mb-3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>{group.icon}</span> {group.title}
              </h3>
              
              {group.key === 'agenda' ? (
                // Interface CRUD pour l'agenda
                <div className="agenda-crud">
                  {/* Titre de la section agenda */}
                  <div className="field">
                    <label className="label">Titre de la section agenda</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        name="agenda_titre"
                        value={form.agenda_titre || ''}
                        onChange={handleChange}
                        placeholder="Agenda des événements"
                        readOnly={loading}
                        style={{ background: loading ? "#f5f5f5" : "white" }}
                      />
                    </div>
                  </div>

                  {/* Liste des événements existants */}
                  {agendaItems.length > 0 ? (
                    <table className="table is-fullwidth is-striped">
                      <thead>
                        <tr>
                          <th>Titre</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agendaItems.map((item, index) => (
                          <tr key={index}>
                            <td>{item.title}</td>
                            <td>{item.date}</td>
                            <td>
                              <div className="buttons are-small">
                                <button 
                                  type="button" 
                                  className="button is-info" 
                                  onClick={() => handleEditAgendaItem(item, index)}
                                >
                                  <span className="icon">✏️</span>
                                </button>
                                <button 
                                  type="button" 
                                  className="button is-danger" 
                                  onClick={() => handleDeleteAgendaItem(index)}
                                >
                                  <span className="icon">🗑️</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="has-text-grey has-text-centered my-4">Aucun événement dans l'agenda</p>
                  )}
                  
                  <button 
                    type="button" 
                    className="button is-primary my-2" 
                    onClick={handleAddAgendaItem}
                  >
                    <span className="icon">➕</span>
                    <span>Ajouter un événement</span>
                  </button>
                  
                  {/* Formulaire pour ajouter/modifier un événement */}
                  {showAgendaForm && currentAgendaItem && (
                    <div className="box mt-4" style={{ background: '#f7f9fc' }}>
                      <h4 className="subtitle is-6">
                        {currentAgendaItem.index !== undefined ? 'Modifier l\'événement' : 'Nouvel événement'}
                      </h4>
                      <form onSubmit={handleAgendaFormSubmit}>
                        <div className="field">
                          <label className="label">Titre</label>
                          <div className="control">
                            <input 
                              className="input" 
                              type="text" 
                              value={currentAgendaItem.title} 
                              onChange={e => setCurrentAgendaItem({...currentAgendaItem, title: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="field">
                          <label className="label">Date</label>
                          <div className="control">
                            <input 
                              className="input" 
                              type="text" 
                              value={currentAgendaItem.date} 
                              onChange={e => setCurrentAgendaItem({...currentAgendaItem, date: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="field">
                          <label className="label">Description</label>
                          <div className="control">
                            <textarea 
                              className="textarea" 
                              value={currentAgendaItem.description || ''} 
                              onChange={e => setCurrentAgendaItem({...currentAgendaItem, description: e.target.value})}
                            ></textarea>
                          </div>
                        </div>
                        
                        <div className="field is-grouped">
                          <div className="control">
                            <button className="button is-success" type="submit">
                              Enregistrer
                            </button>
                          </div>
                          <div className="control">
                            <button 
                              className="button is-text" 
                              type="button"
                              onClick={() => {
                                setShowAgendaForm(false);
                                setCurrentAgendaItem(null);
                              }}
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}
                  
                  {/* Champ pour le lien et son libellé */}
                  <div className="columns mt-4">
                    <div className="column is-8">
                      <div className="field">
                        <label className="label">Lien vers l'agenda complet</label>
                        <div className="control">
                          <input
                            className="input"
                            type="text"
                            name="agenda_link"
                            value={form.agenda_link || ''}
                            onChange={handleChange}
                            readOnly={loading}
                            style={{ background: loading ? "#f5f5f5" : "white" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="column is-4">
                      <div className="field">
                        <label className="label">Texte du lien</label>
                        <div className="control">
                          <input
                            className="input"
                            type="text"
                            name="agenda_lien_label"
                            value={form.agenda_lien_label || ''}
                            onChange={handleChange}
                            placeholder="Voir tous les événements"
                            readOnly={loading}
                            style={{ background: loading ? "#f5f5f5" : "white" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Autres groupes de champs (non-agenda)
                group.fields.map(fieldKey => {
                  const f = FIELDS.find(ff => ff.key === fieldKey);
                  if (!f) return null;
                  return (
                    <div className="field" key={f.key} style={{ marginBottom: 16 }}>
                      <label className="label">{f.label}</label>
                      <div className="control">
                        {f.type === 'textarea' ? (
                          <textarea
                            className="textarea"
                            name={f.key}
                            value={form[f.key] || ''}
                            onChange={handleChange}
                            readOnly={loading}
                            style={{ background: loading ? "#f5f5f5" : "white" }}
                          />
                        ) : (
                          <input
                            className="input"
                            type={f.type}
                            name={f.key}
                            value={form[f.key] || ''}
                            onChange={handleChange}
                            readOnly={loading}
                            style={{ background: loading ? "#f5f5f5" : "white" }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ))}
          <div className="field is-grouped mt-3" style={{ justifyContent: 'center' }}>
            <div className="control">
              <button className={`button is-link${loading ? ' is-loading' : ''}`} type="submit" disabled={loading}>
                Enregistrer
              </button>
            </div>
            {msg && <div className="notification is-info is-light py-2 px-3 ml-3">{msg}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}