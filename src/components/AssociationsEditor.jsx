import React, { useState, useEffect } from 'react';

export default function AssociationsEditor() {
  const [content, setContent] = useState({
    hero_titre: '',
    page_titre: '',
    notification_titre: '',
    notification_texte: '',
    associations: [],
    events: [],
    subventions: { titre: '', texte: '', date_limite: '', formulaire_url: '' },
    creation: { titre: '', texte: '', permanence: '', contact_url: '' },
    salles: { titre: '', texte: '', liste: [], contact_url: '' },
    forum: { titre: '', date: '', texte: '', image: '' },
    contact: { texte: '', contact_url: '' }
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/pageContent?page=associations')
      .then(res => res.json())
      .then(data => setContent(data[0] || {}));
  }, []);

  const handleChange = e => setContent({ ...content, [e.target.name]: e.target.value });

  // Associations CRUD
  const handleAssocChange = (i, field, value) => {
    const associations = [...content.associations];
    associations[i][field] = value;
    setContent({ ...content, associations });
  };
  const addAssoc = () => setContent({
    ...content,
    associations: [
      ...(content.associations || []),
      { nom: '', description: '', contact: '', email: '', activites: '', lieu: '', site: '', image: '', categorie: '' }
    ]
  });
  const removeAssoc = i => setContent({
    ...content,
    associations: content.associations.filter((_, idx) => idx !== i)
  });

  // Events CRUD
  const handleEventChange = (i, field, value) => {
    const events = [...content.events];
    events[i][field] = value;
    setContent({ ...content, events });
  };
  const addEvent = () => setContent({
    ...content,
    events: [...(content.events || []), { date: '', titre: '', association: '', lieu: '' }]
  });
  const removeEvent = i => setContent({
    ...content,
    events: content.events.filter((_, idx) => idx !== i)
  });

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/pageContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'associations', ...content })
    });
    setLoading(false);
    setMsg('Modifications enregistrées !');
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <div className="container" style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 32 }}>
      <div className="box" style={{
        borderRadius: 16,
        background: '#fafdff',
        boxShadow: '0 2px 16px #e0e7ef',
        padding: '32px 24px'
      }}>
        <form onSubmit={handleSave}>
          <h2 className="title is-4 mb-4 has-text-link" style={{ textAlign: 'center', letterSpacing: 1 }}>
            🤝 Paramètres de la page Associations
          </h2>
          <div className="box mb-4">
            <label className="label">🖼️ Titre du bandeau</label>
            <input className="input mb-2" name="hero_titre" value={content.hero_titre} onChange={handleChange} placeholder="Ex: Les associations de la commune" />
            <label className="label">📄 Titre de la page</label>
            <input className="input mb-2" name="page_titre" value={content.page_titre} onChange={handleChange} placeholder="Ex: Découvrez les associations locales" />
            <label className="label">🔔 Titre notification</label>
            <input className="input mb-2" name="notification_titre" value={content.notification_titre} onChange={handleChange} placeholder="Ex: À la une" />
            <label className="label">💬 Texte notification</label>
            <textarea className="textarea mb-2" name="notification_texte" value={content.notification_texte} onChange={handleChange} placeholder="Message important à afficher en haut de la page" />
          </div>

          {/* Associations */}
          <fieldset className="box mb-4">
            <legend className="subtitle is-5 mb-2 has-text-link">
              🤝 Associations ({content.associations?.length || 0})
            </legend>
            {(content.associations || []).map((assoc, i) => (
              <div key={i} className="box mb-3" style={{ background: "#fafdff", borderRadius: 10 }}>
                <div className="columns is-multiline">
                  <div className="column is-half">
                    <label className="label">Nom</label>
                    <input className="input mb-2" placeholder="Nom de l'association" value={assoc.nom} onChange={e => handleAssocChange(i, 'nom', e.target.value)} />
                  </div>
                  <div className="column is-half">
                    <label className="label">Contact</label>
                    <input className="input mb-2" placeholder="Nom du contact" value={assoc.contact} onChange={e => handleAssocChange(i, 'contact', e.target.value)} />
                  </div>
                  <div className="column is-half">
                    <label className="label">Email</label>
                    <input className="input mb-2" placeholder="Email" value={assoc.email} onChange={e => handleAssocChange(i, 'email', e.target.value)} />
                  </div>
                  <div className="column is-half">
                    <label className="label">Site web</label>
                    <input className="input mb-2" placeholder="https://..." value={assoc.site} onChange={e => handleAssocChange(i, 'site', e.target.value)} />
                  </div>
                  <div className="column is-full">
                    <label className="label">Description</label>
                    <textarea className="textarea mb-2" placeholder="Décrivez l'association" value={assoc.description} onChange={e => handleAssocChange(i, 'description', e.target.value)} />
                  </div>
                  <div className="column is-half">
                    <label className="label">Activités</label>
                    <input className="input mb-2" placeholder="Ex: Football, théâtre..." value={assoc.activites} onChange={e => handleAssocChange(i, 'activites', e.target.value)} />
                  </div>
                  <div className="column is-half">
                    <label className="label">Lieu</label>
                    <input className="input mb-2" placeholder="Adresse ou salle" value={assoc.lieu} onChange={e => handleAssocChange(i, 'lieu', e.target.value)} />
                  </div>
                  <div className="column is-half">
                    <label className="label">Image (URL)</label>
                    <input className="input mb-2" placeholder="Lien vers une image" value={assoc.image} onChange={e => handleAssocChange(i, 'image', e.target.value)} />
                  </div>
                  <div className="column is-half">
                    <label className="label">Catégorie</label>
                    <div className="select mb-2">
                      <select value={assoc.categorie || ''} onChange={e => handleAssocChange(i, 'categorie', e.target.value)}>
                        <option value="">Catégorie</option>
                        <option value="sport">Sports et loisirs</option>
                        <option value="culture">Culture et patrimoine</option>
                        <option value="social">Social et solidarité</option>
                        <option value="jeunesse">Jeunesse et éducation</option>
                        <option value="environnement">Environnement</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button type="button" className="button is-danger is-small mt-2" onClick={() => removeAssoc(i)}>
                  <span role="img" aria-label="delete">🗑️</span> Supprimer
                </button>
              </div>
            ))}
            <button type="button" className="button is-link is-light is-small" onClick={addAssoc}>
              <span role="img" aria-label="add">➕</span> Ajouter une association
            </button>
          </fieldset>

          {/* Events */}
          <fieldset className="box mb-4">
            <legend className="subtitle is-5 mb-2 has-text-link">📅 Événements associatifs</legend>
            {(content.events || []).map((event, i) => (
              <div key={i} className="box mb-3" style={{ background: "#fafdff", borderRadius: 10 }}>
                <input className="input mb-2" placeholder="Date" value={event.date} onChange={e => handleEventChange(i, 'date', e.target.value)} />
                <input className="input mb-2" placeholder="Titre" value={event.titre} onChange={e => handleEventChange(i, 'titre', e.target.value)} />
                <input className="input mb-2" placeholder="Association" value={event.association} onChange={e => handleEventChange(i, 'association', e.target.value)} />
                <input className="input mb-2" placeholder="Lieu" value={event.lieu} onChange={e => handleEventChange(i, 'lieu', e.target.value)} />
                <button type="button" className="button is-danger is-small mt-2" onClick={() => removeEvent(i)}>Supprimer</button>
              </div>
            ))}
            <button type="button" className="button is-link is-light is-small" onClick={addEvent}>Ajouter un événement</button>
          </fieldset>

          <fieldset className="box mb-4">
            <legend className="subtitle is-5 mb-2 has-text-link">🗣️ Forum des associations</legend>
            <input
              className="input mb-2"
              name="forum_titre"
              value={content.forum?.titre || ''}
              onChange={e => setContent({ ...content, forum: { ...content.forum, titre: e.target.value } })}
              placeholder="Titre du forum"
            />
            <input
              className="input mb-2"
              name="forum_date"
              value={content.forum?.date || ''}
              onChange={e => setContent({ ...content, forum: { ...content.forum, date: e.target.value } })}
              placeholder="Date et horaire"
            />
            <textarea
              className="textarea mb-2"
              name="forum_texte"
              value={content.forum?.texte || ''}
              onChange={e => setContent({ ...content, forum: { ...content.forum, texte: e.target.value } })}
              placeholder="Texte descriptif"
            />
            <input
              className="input mb-2"
              name="forum_image"
              value={content.forum?.image || ''}
              onChange={e => setContent({ ...content, forum: { ...content.forum, image: e.target.value } })}
              placeholder="URL de l'image"
            />
          </fieldset>

          <fieldset className="box mb-4">
            <legend className="subtitle is-5 mb-2 has-text-link">💶 Subventions aux associations</legend>
            <input
              className="input mb-2"
              name="subventions_titre"
              value={content.subventions?.titre || ''}
              onChange={e => setContent({ ...content, subventions: { ...content.subventions, titre: e.target.value } })}
              placeholder="Titre"
            />
            <textarea
              className="textarea mb-2"
              name="subventions_texte"
              value={content.subventions?.texte || ''}
              onChange={e => setContent({ ...content, subventions: { ...content.subventions, texte: e.target.value } })}
              placeholder="Texte descriptif"
            />
            <input
              className="input mb-2"
              name="subventions_date_limite"
              value={content.subventions?.date_limite || ''}
              onChange={e => setContent({ ...content, subventions: { ...content.subventions, date_limite: e.target.value } })}
              placeholder="Date limite de dépôt"
            />
            <input
              className="input mb-2"
              name="subventions_formulaire_url"
              value={content.subventions?.formulaire_url || ''}
              onChange={e => setContent({ ...content, subventions: { ...content.subventions, formulaire_url: e.target.value } })}
              placeholder="URL du formulaire (PDF)"
            />
          </fieldset>

          <fieldset className="box mb-4">
            <legend className="subtitle is-5 mb-2 has-text-link">📝 Créer une association</legend>
            <input
              className="input mb-2"
              name="creation_titre"
              value={content.creation?.titre || ''}
              onChange={e => setContent({ ...content, creation: { ...content.creation, titre: e.target.value } })}
              placeholder="Titre"
            />
            <textarea
              className="textarea mb-2"
              name="creation_texte"
              value={content.creation?.texte || ''}
              onChange={e => setContent({ ...content, creation: { ...content.creation, texte: e.target.value } })}
              placeholder="Texte descriptif"
            />
            <input
              className="input mb-2"
              name="creation_permanence"
              value={content.creation?.permanence || ''}
              onChange={e => setContent({ ...content, creation: { ...content.creation, permanence: e.target.value } })}
              placeholder="Permanence conseil"
            />
            <input
              className="input mb-2"
              name="creation_contact_url"
              value={content.creation?.contact_url || ''}
              onChange={e => setContent({ ...content, creation: { ...content.creation, contact_url: e.target.value } })}
              placeholder="URL de contact"
            />
          </fieldset>

          <button className="button is-link" type="submit" disabled={loading}>Enregistrer</button>
          {msg && <div className="notification is-info is-light py-2 px-3 ml-3">{msg}</div>}
        </form>
      </div>
    </div>
  );
}