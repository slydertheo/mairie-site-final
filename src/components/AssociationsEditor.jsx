import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AssociationsEditor() {
  const [content, setContent] = useState({
    hero_titre: '',
    page_titre: '',
    notification_titre: '',
    notification_texte: '',
    associations: [],
    events: [],
    subventions: { titre: '', texte: '', date_limite: '', formulaire_url: '', site_web: '' },
    creation: { titre: '', texte: '', permanence: '', contact_url: '' },
    salles: { titre: '', texte: '', liste: [], contact_url: '' },
    forum: { titre: '', date: '', texte: '', image: '' },
    contact: { texte: '', contact_url: '' }
  });
  const [savingSection, setSavingSection] = useState(null);

  useEffect(() => {
    const loadingId = toast.loading('Chargement des données...');
    fetch('/api/pageContent?page=associations')
      .then(res => res.json())
      .then(data => {
        setContent(data[0] || {});
        toast.update(loadingId, { 
          render: 'Données chargées', 
          type: 'success', 
          isLoading: false, 
          autoClose: 2000 
        });
      })
      .catch(err => {
        console.error(err);
        toast.update(loadingId, { 
          render: 'Erreur de chargement', 
          type: 'error', 
          isLoading: false, 
          autoClose: 3000 
        });
      });
  }, []);

  const handleChange = e => setContent({ ...content, [e.target.name]: e.target.value });

  // Sauvegarde par section
  const saveSection = async (section) => {
    setSavingSection(section);
    const toastId = toast.loading('Enregistrement...');

    try {
      const res = await fetch('/api/pageContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'associations', ...content })
      });

      if (!res.ok) throw new Error('Erreur serveur');

      toast.update(toastId, { 
        render: `✅ Section "${section}" enregistrée`, 
        type: 'success', 
        isLoading: false, 
        autoClose: 2000 
      });
    } catch (err) {
      console.error(err);
      toast.update(toastId, { 
        render: 'Erreur lors de l\'enregistrement', 
        type: 'error', 
        isLoading: false, 
        autoClose: 3000 
      });
    } finally {
      setSavingSection(null);
    }
  };

  // Associations CRUD
  const handleAssocChange = (i, field, value) => {
    const associations = [...content.associations];
    associations[i][field] = value;
    setContent({ ...content, associations });
  };
  
  const addAssoc = () => {
    setContent({
      ...content,
      associations: [
        ...(content.associations || []),
        { nom: '', description: '', contact: '', email: '', activites: '', lieu: '', site: '', image: '', categorie: '' }
      ]
    });
    toast.success('Nouvelle association ajoutée', { autoClose: 2000 });
  };
  
  const removeAssoc = i => {
    const assocName = content.associations[i]?.nom || 'cette association';
    
    toast.info(
      <div>
        <p className="mb-2">Supprimer <strong>{assocName}</strong> ?</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="button is-danger is-small"
            onClick={() => {
              toast.dismiss();
              setContent({
                ...content,
                associations: content.associations.filter((_, idx) => idx !== i)
              });
              toast.success('Association supprimée', { autoClose: 2000 });
            }}
          >
            Confirmer
          </button>
          <button className="button is-light is-small" onClick={() => toast.dismiss()}>
            Annuler
          </button>
        </div>
      </div>,
      { autoClose: false, closeButton: false }
    );
  };

  // Events CRUD
  const handleEventChange = (i, field, value) => {
    const events = [...content.events];
    events[i][field] = value;
    setContent({ ...content, events });
  };
  
  const addEvent = () => {
    setContent({
      ...content,
      events: [...(content.events || []), { date: '', titre: '', association: '', lieu: '' }]
    });
    toast.success('Nouvel événement ajouté', { autoClose: 2000 });
  };
  
  const removeEvent = i => {
    const eventName = content.events[i]?.titre || 'cet événement';
    
    toast.info(
      <div>
        <p className="mb-2">Supprimer <strong>{eventName}</strong> ?</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="button is-danger is-small"
            onClick={() => {
              toast.dismiss();
              setContent({
                ...content,
                events: content.events.filter((_, idx) => idx !== i)
              });
              toast.success('Événement supprimé', { autoClose: 2000 });
            }}
          >
            Confirmer
          </button>
          <button className="button is-light is-small" onClick={() => toast.dismiss()}>
            Annuler
          </button>
        </div>
      </div>,
      { autoClose: false, closeButton: false }
    );
  };

  return (
    <div className="container" style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 32 }}>
      <div className="box" style={{
        borderRadius: 16,
        background: '#fafdff',
        boxShadow: '0 2px 16px #e0e7ef',
        padding: '32px 24px'
      }}>
        <h2 className="title is-4 mb-5 has-text-link" style={{ textAlign: 'center', letterSpacing: 1 }}>
          🤝 Paramètres de la page Associations
        </h2>

        {/* Section Général */}
        <div className="box mb-5" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
          <h3 className="subtitle is-5 mb-4" style={{ color: '#1277c6', fontWeight: 700 }}>
            ⚙️ Paramètres généraux
          </h3>
          <div className="field mb-3">
            <label className="label">🖼️ Titre du bandeau</label>
            <input 
              className="input" 
              name="hero_titre" 
              value={content.hero_titre} 
              onChange={handleChange} 
              placeholder="Ex: Les associations de la commune" 
            />
          </div>
          <div className="field mb-3">
            <label className="label">📄 Titre de la page</label>
            <input 
              className="input" 
              name="page_titre" 
              value={content.page_titre} 
              onChange={handleChange} 
              placeholder="Ex: Découvrez les associations locales" 
            />
          </div>
          <div className="field mb-3">
            <label className="label">🔔 Titre notification</label>
            <input 
              className="input" 
              name="notification_titre" 
              value={content.notification_titre} 
              onChange={handleChange} 
              placeholder="Ex: À la une" 
            />
          </div>
          <div className="field mb-4">
            <label className="label">💬 Texte notification</label>
            <textarea 
              className="textarea" 
              name="notification_texte" 
              value={content.notification_texte} 
              onChange={handleChange} 
              placeholder="Message important à afficher en haut de la page" 
              rows={3}
            />
          </div>
          <div className="has-text-right">
            <button 
              className={`button is-link${savingSection === 'general' ? ' is-loading' : ''}`}
              onClick={() => saveSection('general')}
              disabled={savingSection !== null}
              style={{ borderRadius: 10, fontWeight: 600 }}
            >
              <span style={{ marginRight: 8 }}>💾</span>
              Enregistrer cette section
            </button>
          </div>
        </div>

        {/* Section Associations */}
        <div className="box mb-5" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
          <h3 className="subtitle is-5 mb-4" style={{ color: '#1277c6', fontWeight: 700 }}>
            🤝 Associations ({content.associations?.length || 0})
          </h3>
          {(content.associations || []).map((assoc, i) => (
            <div key={i} className="box mb-3" style={{ 
              background: 'linear-gradient(120deg, #f8fafc 80%, #eaf6ff 100%)', 
              borderRadius: 12,
              border: '1px solid #e0e7ef'
            }}>
              <div className="columns is-multiline">
                <div className="column is-half">
                  <label className="label is-small">Nom</label>
                  <input 
                    className="input" 
                    placeholder="Nom de l'association" 
                    value={assoc.nom} 
                    onChange={e => handleAssocChange(i, 'nom', e.target.value)} 
                  />
                </div>
                <div className="column is-half">
                  <label className="label is-small">Contact</label>
                  <input 
                    className="input" 
                    placeholder="Nom du contact" 
                    value={assoc.contact} 
                    onChange={e => handleAssocChange(i, 'contact', e.target.value)} 
                  />
                </div>
                <div className="column is-half">
                  <label className="label is-small">Email</label>
                  <input 
                    className="input" 
                    placeholder="contact@association.fr" 
                    value={assoc.email} 
                    onChange={e => handleAssocChange(i, 'email', e.target.value)} 
                  />
                </div>
                <div className="column is-half">
                  <label className="label is-small">Site web</label>
                  <input 
                    className="input" 
                    placeholder="https://..." 
                    value={assoc.site} 
                    onChange={e => handleAssocChange(i, 'site', e.target.value)} 
                  />
                </div>
                <div className="column is-full">
                  <label className="label is-small">Description</label>
                  <textarea 
                    className="textarea" 
                    placeholder="Décrivez l'association" 
                    value={assoc.description} 
                    onChange={e => handleAssocChange(i, 'description', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="column is-half">
                  <label className="label is-small">Activités</label>
                  <input 
                    className="input" 
                    placeholder="Ex: Football, théâtre..." 
                    value={assoc.activites} 
                    onChange={e => handleAssocChange(i, 'activites', e.target.value)} 
                  />
                </div>
                <div className="column is-half">
                  <label className="label is-small">Lieu</label>
                  <input 
                    className="input" 
                    placeholder="Adresse ou salle" 
                    value={assoc.lieu} 
                    onChange={e => handleAssocChange(i, 'lieu', e.target.value)} 
                  />
                </div>
                <div className="column is-half">
                  <label className="label is-small">Image (URL)</label>
                  <input 
                    className="input" 
                    placeholder="https://..." 
                    value={assoc.image} 
                    onChange={e => handleAssocChange(i, 'image', e.target.value)} 
                  />
                </div>
                <div className="column is-half">
                  <label className="label is-small">Catégorie</label>
                  <div className="select is-fullwidth">
                    <select 
                      value={assoc.categorie || ''} 
                      onChange={e => handleAssocChange(i, 'categorie', e.target.value)}
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      <option value="sport">Sports et loisirs</option>
                      <option value="culture">Culture et patrimoine</option>
                      <option value="social">Social et solidarité</option>
                      <option value="jeunesse">Jeunesse et éducation</option>
                      <option value="environnement">Environnement</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="has-text-right mt-2">
                <button 
                  type="button" 
                  className="button is-small is-danger"
                  onClick={() => removeAssoc(i)}
                  disabled={savingSection !== null}
                  title="Supprimer"
                >
                  <span role="img" aria-label="Supprimer">🗑️</span>
                </button>
              </div>
            </div>
          ))}
          <button 
            type="button" 
            className="button is-link is-light mb-4" 
            onClick={addAssoc}
            disabled={savingSection !== null}
            style={{ borderRadius: 10, fontWeight: 600 }}
          >
            <span role="img" aria-label="Ajouter" style={{ marginRight: 8 }}>➕</span>
            <span>Ajouter une association</span>
          </button>
          <div className="has-text-right">
            <button 
              className={`button is-link${savingSection === 'associations' ? ' is-loading' : ''}`}
              onClick={() => saveSection('associations')}
              disabled={savingSection !== null}
              style={{ borderRadius: 10, fontWeight: 600 }}
            >
              <span style={{ marginRight: 8 }}>💾</span>
              Enregistrer cette section
            </button>
          </div>
        </div>

        {/* Section Événements */}
        <div className="box mb-5" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
          <h3 className="subtitle is-5 mb-4" style={{ color: '#1277c6', fontWeight: 700 }}>
            📅 Événements associatifs ({content.events?.length || 0})
          </h3>
          {(content.events || []).map((event, i) => (
            <div key={i} className="box mb-3" style={{ 
              background: 'linear-gradient(120deg, #fffef5 80%, #fef3c7 100%)', 
              borderRadius: 12,
              border: '1px solid #fde68a'
            }}>
              <div className="columns is-multiline">
                <div className="column is-one-quarter">
                  <label className="label is-small">Date</label>
                  <input 
                    className="input" 
                    placeholder="Ex: 15 juin 2025" 
                    value={event.date} 
                    onChange={e => handleEventChange(i, 'date', e.target.value)} 
                  />
                </div>
                <div className="column is-one-quarter">
                  <label className="label is-small">Association</label>
                  <input 
                    className="input" 
                    placeholder="Nom de l'association" 
                    value={event.association} 
                    onChange={e => handleEventChange(i, 'association', e.target.value)} 
                  />
                </div>
                <div className="column is-one-quarter">
                  <label className="label is-small">Lieu</label>
                  <input 
                    className="input" 
                    placeholder="Lieu de l'événement" 
                    value={event.lieu} 
                    onChange={e => handleEventChange(i, 'lieu', e.target.value)} 
                  />
                </div>
                <div className="column is-one-quarter">
                  <label className="label is-small" style={{ opacity: 0 }}>Action</label>
                  <button 
                    type="button" 
                    className="button is-small is-danger is-fullwidth"
                    onClick={() => removeEvent(i)}
                    disabled={savingSection !== null}
                    title="Supprimer"
                  >
                    <span role="img" aria-label="Supprimer">🗑️</span>
                  </button>
                </div>
                <div className="column is-full">
                  <label className="label is-small">Titre</label>
                  <input 
                    className="input" 
                    placeholder="Titre de l'événement" 
                    value={event.titre} 
                    onChange={e => handleEventChange(i, 'titre', e.target.value)} 
                  />
                </div>
              </div>
            </div>
          ))}
          <button 
            type="button" 
            className="button is-warning is-light mb-4" 
            onClick={addEvent}
            disabled={savingSection !== null}
            style={{ borderRadius: 10, fontWeight: 600 }}
          >
            <span role="img" aria-label="Ajouter" style={{ marginRight: 8 }}>➕</span>
            <span>Ajouter un événement</span>
          </button>
          <div className="has-text-right">
            <button 
              className={`button is-link${savingSection === 'events' ? ' is-loading' : ''}`}
              onClick={() => saveSection('events')}
              disabled={savingSection !== null}
              style={{ borderRadius: 10, fontWeight: 600 }}
            >
              <span style={{ marginRight: 8 }}>💾</span>
              Enregistrer cette section
            </button>
          </div>
        </div>

        {/* Section Subventions */}
        <div className="box mb-5" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
          <h3 className="subtitle is-5 mb-4" style={{ color: '#1277c6', fontWeight: 700 }}>
            💶 Subventions aux associations
          </h3>
          <div className="field mb-3">
            <label className="label is-small">Titre</label>
            <input
              className="input"
              name="subventions_titre"
              value={content.subventions?.titre || ''}
              onChange={e => setContent({ ...content, subventions: { ...content.subventions, titre: e.target.value } })}
              placeholder="Ex: Subventions municipales"
            />
          </div>
          <div className="field mb-3">
            <label className="label is-small">Texte descriptif</label>
            <textarea
              className="textarea"
              name="subventions_texte"
              value={content.subventions?.texte || ''}
              onChange={e => setContent({ ...content, subventions: { ...content.subventions, texte: e.target.value } })}
              placeholder="Description des subventions..."
              rows={3}
            />
          </div>
          <div className="columns">
            <div className="column is-half">
              <div className="field mb-3">
                <label className="label is-small">Date limite de dépôt</label>
                <input
                  className="input"
                  name="subventions_date_limite"
                  value={content.subventions?.date_limite || ''}
                  onChange={e => setContent({ ...content, subventions: { ...content.subventions, date_limite: e.target.value } })}
                  placeholder="Ex: 30 septembre 2025"
                />
              </div>
            </div>
            <div className="column is-half">
              <div className="field mb-3">
                <label className="label is-small">URL du formulaire (PDF)</label>
                <input
                  className="input"
                  name="subventions_formulaire_url"
                  value={content.subventions?.formulaire_url || ''}
                  onChange={e => setContent({ ...content, subventions: { ...content.subventions, formulaire_url: e.target.value } })}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
          <div className="field mb-4">
            <label className="label is-small">Lien vers site web (plus d'infos)</label>
            <input
              className="input"
              name="subventions_site_web"
              value={content.subventions?.site_web || ''}
              onChange={e => setContent({ ...content, subventions: { ...content.subventions, site_web: e.target.value } })}
              placeholder="https://..."
            />
            <p className="help">Lien externe pour plus d'informations sur les subventions</p>
          </div>
          <div className="has-text-right">
            <button 
              className={`button is-link${savingSection === 'subventions' ? ' is-loading' : ''}`}
              onClick={() => saveSection('subventions')}
              disabled={savingSection !== null}
              style={{ borderRadius: 10, fontWeight: 600 }}
            >
              <span style={{ marginRight: 8 }}>💾</span>
              Enregistrer cette section
            </button>
          </div>
        </div>

        {/* Section Permanence conseil */}
        <div className="box mb-5" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
          <h3 className="subtitle is-5 mb-4" style={{ color: '#1277c6', fontWeight: 700 }}>
            📝 Permanence conseil associatif
          </h3>
          <div className="field mb-3">
            <label className="label is-small">Titre</label>
            <input
              className="input"
              name="creation_titre"
              value={content.creation?.titre || ''}
              onChange={e => setContent({ ...content, creation: { ...content.creation, titre: e.target.value } })}
              placeholder="Ex: Permanence conseil pour créer votre association"
            />
          </div>
          <div className="field mb-3">
            <label className="label is-small">Texte descriptif</label>
            <textarea
              className="textarea"
              name="creation_texte"
              value={content.creation?.texte || ''}
              onChange={e => setContent({ ...content, creation: { ...content.creation, texte: e.target.value } })}
              placeholder="Description de l'accompagnement..."
              rows={3}
            />
          </div>
          <div className="field mb-3">
            <label className="label is-small">Horaires de permanence</label>
            <input
              className="input"
              name="creation_permanence"
              value={content.creation?.permanence || ''}
              onChange={e => setContent({ ...content, creation: { ...content.creation, permanence: e.target.value } })}
              placeholder="Ex: Tous les mardis de 14h à 17h"
            />
          </div>
          <div className="field mb-4">
            <label className="label is-small">Lien vers site web (en savoir plus)</label>
            <input
              className="input"
              name="creation_contact_url"
              value={content.creation?.contact_url || ''}
              onChange={e => setContent({ ...content, creation: { ...content.creation, contact_url: e.target.value } })}
              placeholder="https://..."
            />
            <p className="help">Le bouton "En savoir plus" redirigera vers ce lien</p>
          </div>
          <div className="has-text-right">
            <button 
              className={`button is-link${savingSection === 'creation' ? ' is-loading' : ''}`}
              onClick={() => saveSection('creation')}
              disabled={savingSection !== null}
              style={{ borderRadius: 10, fontWeight: 600 }}
            >
              <span style={{ marginRight: 8 }}>💾</span>
              Enregistrer cette section
            </button>
          </div>
        </div>

        {/* Section Salles communales */}
        <div className="box mb-5" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
          <h3 className="subtitle is-5 mb-4" style={{ color: '#1277c6', fontWeight: 700 }}>
            🏛️ Salles communales
          </h3>
          <div className="field mb-3">
            <label className="label is-small">Titre</label>
            <input
              className="input"
              name="salles_titre"
              value={content.salles?.titre || ''}
              onChange={e => setContent({ ...content, salles: { ...content.salles, titre: e.target.value } })}
              placeholder="Ex: Salles communales"
            />
          </div>
          <div className="field mb-3">
            <label className="label is-small">Texte descriptif</label>
            <textarea
              className="textarea"
              name="salles_texte"
              value={content.salles?.texte || ''}
              onChange={e => setContent({ ...content, salles: { ...content.salles, texte: e.target.value } })}
              placeholder="Description des salles disponibles..."
              rows={2}
            />
          </div>
          
          <div className="field mb-3">
            <label className="label is-small">Liste des salles ({content.salles?.liste?.length || 0})</label>
            {(content.salles?.liste || []).map((salle, i) => (
              <div key={i} className="field has-addons mb-2">
                <div className="control is-expanded">
                  <input
                    className="input"
                    value={salle}
                    onChange={e => {
                      const newListe = [...(content.salles?.liste || [])];
                      newListe[i] = e.target.value;
                      setContent({ ...content, salles: { ...content.salles, liste: newListe } });
                    }}
                    placeholder="Ex: Salle polyvalente (capacité 200 personnes)"
                  />
                </div>
                <div className="control">
                  <button
                    type="button"
                    className="button is-danger"
                    onClick={() => {
                      const newListe = (content.salles?.liste || []).filter((_, idx) => idx !== i);
                      setContent({ ...content, salles: { ...content.salles, liste: newListe } });
                      toast.success('Salle supprimée', { autoClose: 2000 });
                    }}
                    disabled={savingSection !== null}
                    title="Supprimer"
                  >
                    <span role="img" aria-label="Supprimer">🗑️</span>
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="button is-info is-light is-small mt-2"
              onClick={() => {
                const newListe = [...(content.salles?.liste || []), ''];
                setContent({ ...content, salles: { ...content.salles, liste: newListe } });
                toast.success('Nouvelle salle ajoutée', { autoClose: 2000 });
              }}
              disabled={savingSection !== null}
              style={{ borderRadius: 8 }}
            >
              <span role="img" aria-label="Ajouter" style={{ marginRight: 6 }}>➕</span>
              <span>Ajouter une salle</span>
            </button>
          </div>

          <div className="field mb-4">
            <label className="label is-small">Lien de réservation</label>
            <input
              className="input"
              name="salles_contact_url"
              value={content.salles?.contact_url || ''}
              onChange={e => setContent({ ...content, salles: { ...content.salles, contact_url: e.target.value } })}
              placeholder="/contact ou https://..."
            />
            <p className="help">Le bouton "Réserver une salle" redirigera vers ce lien</p>
          </div>
          <div className="has-text-right">
            <button 
              className={`button is-link${savingSection === 'salles' ? ' is-loading' : ''}`}
              onClick={() => saveSection('salles')}
              disabled={savingSection !== null}
              style={{ borderRadius: 10, fontWeight: 600 }}
            >
              <span style={{ marginRight: 8 }}>💾</span>
              Enregistrer cette section
            </button>
          </div>
        </div>

        {/* Section Forum */}
        <div className="box mb-5" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
          <h3 className="subtitle is-5 mb-4" style={{ color: '#1277c6', fontWeight: 700 }}>
            🗣️ Forum des associations
          </h3>
          <div className="field mb-3">
            <label className="label is-small">Titre du forum</label>
            <input
              className="input"
              name="forum_titre"
              value={content.forum?.titre || ''}
              onChange={e => setContent({ ...content, forum: { ...content.forum, titre: e.target.value } })}
              placeholder="Ex: Forum des associations 2025"
            />
          </div>
          <div className="field mb-3">
            <label className="label is-small">Date et horaire</label>
            <input
              className="input"
              name="forum_date"
              value={content.forum?.date || ''}
              onChange={e => setContent({ ...content, forum: { ...content.forum, date: e.target.value } })}
              placeholder="Ex: Le samedi 6 septembre 2025 de 10h à 17h"
            />
          </div>
          <div className="field mb-3">
            <label className="label is-small">Texte descriptif</label>
            <textarea
              className="textarea"
              name="forum_texte"
              value={content.forum?.texte || ''}
              onChange={e => setContent({ ...content, forum: { ...content.forum, texte: e.target.value } })}
              placeholder="Description de l'événement..."
              rows={3}
            />
          </div>
          <div className="field mb-4">
            <label className="label is-small">URL de l'image</label>
            <input
              className="input"
              name="forum_image"
              value={content.forum?.image || ''}
              onChange={e => setContent({ ...content, forum: { ...content.forum, image: e.target.value } })}
              placeholder="https://..."
            />
          </div>
          <div className="has-text-right">
            <button 
              className={`button is-link${savingSection === 'forum' ? ' is-loading' : ''}`}
              onClick={() => saveSection('forum')}
              disabled={savingSection !== null}
              style={{ borderRadius: 10, fontWeight: 600 }}
            >
              <span style={{ marginRight: 8 }}>💾</span>
              Enregistrer cette section
            </button>
          </div>
        </div>

        {/* Section Contact */}
        <div className="box mb-5" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
          <h3 className="subtitle is-5 mb-4" style={{ color: '#1277c6', fontWeight: 700 }}>
            📧 Section Contact
          </h3>
          <div className="field mb-3">
            <label className="label is-small">Texte d'introduction</label>
            <textarea
              className="textarea"
              name="contact_texte"
              value={content.contact?.texte || ''}
              onChange={e => setContent({ ...content, contact: { ...content.contact, texte: e.target.value } })}
              placeholder="Ex: Vous souhaitez en savoir plus sur la vie associative..."
              rows={2}
            />
          </div>
          <div className="field mb-4">
            <label className="label is-small">URL de contact</label>
            <input
              className="input"
              name="contact_contact_url"
              value={content.contact?.contact_url || ''}
              onChange={e => setContent({ ...content, contact: { ...content.contact, contact_url: e.target.value } })}
              placeholder="/contact"
            />
          </div>
          <div className="has-text-right">
            <button 
              className={`button is-link${savingSection === 'contact' ? ' is-loading' : ''}`}
              onClick={() => saveSection('contact')}
              disabled={savingSection !== null}
              style={{ borderRadius: 10, fontWeight: 600 }}
            >
              <span style={{ marginRight: 8 }}>💾</span>
              Enregistrer cette section
            </button>
          </div>
        </div>

        <ToastContainer position="top-right" autoClose={2500} newestOnTop />
      </div>
    </div>
  );
}