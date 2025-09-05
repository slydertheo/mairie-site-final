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
    key: 'bandeau',
    icon: '🎉',
    title: 'Bandeau principal',
    fields: ['titre', 'sousTitre'],
  },
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
    fields: ['agenda1_title', 'agenda1_date', 'agenda2_title', 'agenda2_date', 'agenda_link'],
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
  { key: 'motMaire', label: 'Mot du Maire', type: 'textarea' },
  { key: 'agenda1_title', label: 'Agenda 1 - Titre', type: 'text' },
  { key: 'agenda1_date', label: 'Agenda 1 - Date', type: 'text' },
  { key: 'agenda2_title', label: 'Agenda 2 - Titre', type: 'text' },
  { key: 'agenda2_date', label: 'Agenda 2 - Date', type: 'text' },
  { key: 'agenda_link', label: 'Lien agenda complet', type: 'text' },
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
      })
      .catch(() => setForm({}))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    await Promise.all(FIELDS.map(f =>
      fetch(`/api/pageContent?section=${f.key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: SELECTED_PAGE,
          titre: form[f.key],
          contenu: form[f.key]
        })
      })
    ));
    setMsg('Modifications enregistrées !');
    setLoading(false);
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <div className="box" style={{ borderRadius: 14, background: '#fafdff' }}>
      <form onSubmit={handleSave}>
        {FIELD_GROUPS.map(group => (
          <div key={group.key} className="box mb-4" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
            <h3 className="subtitle is-5 mb-3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22 }}>{group.icon}</span> {group.title}
            </h3>
            {group.fields.map(fieldKey => {
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
            })}
          </div>
        ))}
        <div className="field is-grouped mt-3">
          <div className="control">
            <button className={`button is-link${loading ? ' is-loading' : ''}`} type="submit" disabled={loading}>
              Enregistrer
            </button>
          </div>
          {msg && <div className="notification is-info is-light py-2 px-3 ml-3">{msg}</div>}
        </div>
      </form>
    </div>
  );
}