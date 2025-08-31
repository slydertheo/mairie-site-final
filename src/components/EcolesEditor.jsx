import React, { useState, useEffect } from 'react';

const FIELDS = [
  { key: 'hero_titre', label: 'Titre du bandeau (hero)', type: 'text', group: 'header' },
  { key: 'titre', label: 'Titre principal de la page', type: 'text', group: 'header' },
  { key: 'ecole_maternelle_nom', label: 'Nom école maternelle', type: 'text', group: 'maternelle' },
  { key: 'ecole_maternelle_adresse', label: 'Adresse maternelle', type: 'text', group: 'maternelle' },
  { key: 'ecole_maternelle_tel', label: 'Téléphone maternelle', type: 'text', group: 'maternelle' },
  { key: 'ecole_maternelle_email', label: 'Email maternelle', type: 'text', group: 'maternelle' },
  { key: 'ecole_elementaire_nom', label: 'Nom école élémentaire', type: 'text', group: 'elementaire' },
  { key: 'ecole_elementaire_adresse', label: 'Adresse élémentaire', type: 'text', group: 'elementaire' },
  { key: 'ecole_elementaire_tel', label: 'Téléphone élémentaire', type: 'text', group: 'elementaire' },
  { key: 'ecole_elementaire_email', label: 'Email élémentaire', type: 'text', group: 'elementaire' },
  { key: 'info_transport', label: 'Infos transport scolaire', type: 'textarea', group: 'infos' },
  { key: 'calendrier', label: 'Calendrier scolaire (texte ou HTML)', type: 'textarea', group: 'infos' },
  { key: 'calendrier_pdf_url', label: 'Lien PDF/Image du calendrier', type: 'text', group: 'infos' },
  { key: 'calendrier_url', label: 'Lien externe (site officiel)', type: 'text', group: 'infos' },
  { key: 'cantine_horaires', label: 'Horaires cantine', type: 'text', group: 'perisco' },
  { key: 'cantine_info', label: 'Infos cantine', type: 'textarea', group: 'perisco' },
  { key: 'garderie_horaires', label: 'Horaires garderie', type: 'text', group: 'perisco' },
  { key: 'garderie_info', label: 'Infos garderie', type: 'textarea', group: 'perisco' },
  { key: 'activites_info', label: 'Infos activités extrascolaires', type: 'textarea', group: 'perisco' },
  { key: 'doc_1_label', label: 'Document 1 - Texte', type: 'text', group: 'docs' },
  { key: 'doc_1_url', label: 'Document 1 - Lien', type: 'text', group: 'docs' },
  { key: 'doc_2_label', label: 'Document 2 - Texte', type: 'text', group: 'docs' },
  { key: 'doc_2_url', label: 'Document 2 - Lien', type: 'text', group: 'docs' },
  { key: 'doc_3_label', label: 'Document 3 - Texte', type: 'text', group: 'docs' },
  { key: 'doc_3_url', label: 'Document 3 - Lien', type: 'text', group: 'docs' },
  { key: 'doc_4_label', label: 'Document 4 - Texte', type: 'text', group: 'docs' },
  { key: 'doc_4_url', label: 'Document 4 - Lien', type: 'text', group: 'docs' },
];

const GROUPS = [
  { key: 'header', icon: '🏫', title: 'En-tête' },
  { key: 'maternelle', icon: '🧸', title: 'École maternelle' },
  { key: 'elementaire', icon: '📚', title: 'École élémentaire' },
  { key: 'infos', icon: 'ℹ️', title: 'Infos pratiques' },
  { key: 'perisco', icon: '🍽️', title: 'Périscolaire' },
  { key: 'docs', icon: '📄', title: 'Documents utiles' },
];

// --- CRUD Vacances scolaires ---
function VacancesCrud() {
  const [vacances, setVacances] = useState([]);
  const [form, setForm] = useState({ titre: '', debut: '', fin: '', id: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/vacances')
      .then(res => res.json())
      .then(setVacances);
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/vacances', {
      method: form.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ titre: '', debut: '', fin: '', id: null });
    setLoading(false);
    fetch('/api/vacances').then(res => res.json()).then(setVacances);
  };

  const handleEdit = v => setForm(v);

  const handleDelete = async id => {
    if (!window.confirm('Supprimer cette période ?')) return;
    await fetch('/api/vacances', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    setVacances(vacances.filter(v => v.id !== id));
  };

  return (
    <div className="box mt-5" style={{ background: '#f8fafc', borderRadius: 16 }}>
      <h2 className="title is-5 has-text-primary mb-3">Vacances scolaires (tableau dynamique)</h2>
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="field is-grouped">
          <div className="control">
            <input className="input" name="titre" placeholder="Vacances (ex: Noël)" value={form.titre} onChange={handleChange} required />
          </div>
          <div className="control">
            <input className="input" name="debut" placeholder="Début (ex: 20/12/2024)" value={form.debut} onChange={handleChange} required />
          </div>
          <div className="control">
            <input className="input" name="fin" placeholder="Fin (ex: 06/01/2025)" value={form.fin} onChange={handleChange} required />
          </div>
          <div className="control">
            <button className={`button is-link${loading ? ' is-loading' : ''}`} type="submit">
              {form.id ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
          {form.id && (
            <div className="control">
              <button className="button" type="button" onClick={() => setForm({ titre: '', debut: '', fin: '', id: null })}>Annuler</button>
            </div>
          )}
        </div>
      </form>
      <table className="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Vacances</th>
            <th>Début</th>
            <th>Fin</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {vacances.map(v => (
            <tr key={v.id}>
              <td>{v.titre}</td>
              <td>{v.debut}</td>
              <td>{v.fin}</td>
              <td>
                <button className="button is-small is-info mr-2" onClick={() => handleEdit(v)}>✏️</button>
                <button className="button is-small is-danger" onClick={() => handleDelete(v.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- Composant principal ---
export default function EcolesEditor() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/pageContent?page=ecoles')
      .then(res => res.json())
      .then(data => {
        const initial = {};
        FIELDS.forEach(f => {
          const found = data.find(d => d.section === f.key);
          initial[f.key] = found ? (found.contenu || found.titre) : '';
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
      fetch(`/api/pageContent?page=ecoles&section=${f.key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titre: form[f.key], contenu: form[f.key] })
      })
    ));
    setMsg('Modifications enregistrées !');
    setLoading(false);
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <div className="box" style={{ borderRadius: 14, background: '#fafdff' }}>
      <h2 className="title is-4 mb-4 has-text-link">🗂️ Contenu de la page Écoles</h2>
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
      
      {/* CRUD dynamique des vacances scolaires */}
      <VacancesCrud />
    </div>
  );
}