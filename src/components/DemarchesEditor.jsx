import React, { useState, useEffect } from 'react';

const FIELDS = [
  { key: 'titre', label: 'Titre principal', type: 'text', group: 'header' },
  { key: 'intro', label: 'Introduction', type: 'textarea', group: 'header' },

  // Démarches rapides
  { key: 'demarche_rapide_1_label', label: 'Démarche rapide 1 - Texte', type: 'text', group: 'rapides' },
  { key: 'demarche_rapide_1_url', label: 'Lien', type: 'text', group: 'rapides' },
  { key: 'demarche_rapide_2_label', label: 'Démarche rapide 2 - Texte', type: 'text', group: 'rapides' },
  { key: 'demarche_rapide_2_url', label: 'Lien', type: 'text', group: 'rapides' },
  { key: 'demarche_rapide_3_label', label: 'Démarche rapide 3 - Texte', type: 'text', group: 'rapides' },
  { key: 'demarche_rapide_3_url', label: 'Lien', type: 'text', group: 'rapides' },
  { key: 'demarche_rapide_4_label', label: 'Démarche rapide 4 - Texte', type: 'text', group: 'rapides' },
  { key: 'demarche_rapide_4_url', label: 'Lien', type: 'text', group: 'rapides' },
  { key: 'demarche_rapide_5_label', label: 'Démarche rapide 5 - Texte', type: 'text', group: 'rapides' },
  { key: 'demarche_rapide_5_url', label: 'Lien', type: 'text', group: 'rapides' },
  { key: 'demarche_rapide_6_label', label: 'Démarche rapide 6 - Texte', type: 'text', group: 'rapides' },
  { key: 'demarche_rapide_6_url', label: 'Lien', type: 'text', group: 'rapides' },
  { key: 'demarche_rapide_7_label', label: 'Démarche rapide 7 - Texte', type: 'text', group: 'rapides' },
  { key: 'demarche_rapide_7_url', label: 'Lien', type: 'text', group: 'rapides' },

  // Urbanisme
  { key: 'urbanisme_1_label', label: 'Urbanisme 1 - Texte', type: 'text', group: 'urbanisme' },
  { key: 'urbanisme_1_url', label: 'Lien', type: 'text', group: 'urbanisme' },
  { key: 'urbanisme_2_label', label: 'Urbanisme 2 - Texte', type: 'text', group: 'urbanisme' },
  { key: 'urbanisme_2_url', label: 'Lien', type: 'text', group: 'urbanisme' },
  { key: 'urbanisme_3_label', label: 'Urbanisme 3 - Texte', type: 'text', group: 'urbanisme' },
  { key: 'urbanisme_3_url', label: 'Lien', type: 'text', group: 'urbanisme' },
  { key: 'urbanisme_4_label', label: 'Urbanisme 4 - Texte', type: 'text', group: 'urbanisme' },
  { key: 'urbanisme_4_url', label: 'Lien', type: 'text', group: 'urbanisme' },

  // Autres démarches utiles
  { key: 'autre_1_label', label: 'Autre démarche 1 - Texte', type: 'text', group: 'autres' },
  { key: 'autre_1_url', label: 'Lien', type: 'text', group: 'autres' },
  { key: 'autre_2_label', label: 'Autre démarche 2 - Texte', type: 'text', group: 'autres' },
  { key: 'autre_2_url', label: 'Lien', type: 'text', group: 'autres' },
  { key: 'autre_3_label', label: 'Autre démarche 3 - Texte', type: 'text', group: 'autres' },
  { key: 'autre_3_url', label: 'Lien', type: 'text', group: 'autres' },
  { key: 'pdf_reglement_label', label: 'Nom du PDF règlement', type: 'text', group: 'autres' },
  { key: 'pdf_reglement_url', label: 'Lien PDF règlement', type: 'text', group: 'autres' },
];

const GROUPS = [
  { key: 'header', icon: '📝', title: 'En-tête de la page' },
  { key: 'rapides', icon: '⚡', title: 'Démarches rapides' },
  { key: 'urbanisme', icon: '🏡', title: 'Urbanisme' },
  { key: 'autres', icon: '🔗', title: 'Autres démarches utiles' },
];

export default function DemarchesEditor() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/pageContent?page=demarches')
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
    await fetch('/api/pageContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: 'demarches',
        ...form
      })
    });
    setMsg('Modifications enregistrées !');
    setLoading(false);
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <div className="box" style={{ borderRadius: 14, background: '#fafdff' }}>
      <h2 className="title is-4 mb-4 has-text-link">🗂️ Contenu de la page Démarches</h2>
      <form onSubmit={handleSave}>
        {GROUPS.map(group => (
          <div key={group.key} className="box mb-4" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
            <h3 className="subtitle is-5 mb-3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22 }}>{group.icon}</span> {group.title}
            </h3>
            {FIELDS.filter(f => f.group === group.key).map((f, idx, arr) => (
              <div className="field" key={f.key} style={{ marginBottom: idx < arr.length - 1 ? 16 : 0 }}>
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
            ))}
          </div>
        ))}
        <div className="field is-grouped mt-4">
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