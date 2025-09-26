import React, { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FIELDS = [
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

// Retire les groupes "maternelle" et "elementaire"
const GROUPS = [
  { key: 'header', icon: '🏫', title: 'En-tête' },
  { key: 'infos', icon: 'ℹ️', title: 'Infos pratiques' },
  { key: 'perisco', icon: '🍽️', title: 'Périscolaire' },
  { key: 'docs', icon: '📄', title: 'Documents utiles' },
];

// --- CRUD Vacances scolaires ---
function VacancesCrud() {
  const [vacances, setVacances] = useState([]);
  const [form, setForm] = useState({ titre: '', debut: '', fin: '', id: null });
  const [loading, setLoading] = useState(false);

  // Helper: persiste la section vacances_json
  const persistVacances = async (list) => {
    await fetch('/api/pageContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'ecoles', vacances_json: list })
    });
  };

  useEffect(() => {
    fetch('/api/pageContent?page=ecoles')
      .then(res => res.json())
      .then(data => {
        const obj = data?.[0] || {};
        setVacances(Array.isArray(obj.vacances_json) ? obj.vacances_json : []);
      });
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.titre.trim() || !form.debut.trim() || !form.fin.trim()) return;

    setLoading(true);
    const next = [...vacances];
    if (form.id) {
      const idx = next.findIndex(v => v.id === form.id);
      if (idx !== -1) next[idx] = { ...next[idx], ...form };
    } else {
      next.push({ id: Date.now().toString(), titre: form.titre, debut: form.debut, fin: form.fin });
    }
    try {
      await persistVacances(next);
      setVacances(next);
      toast.success(form.id ? 'Période modifiée' : 'Période ajoutée');
      setForm({ titre: '', debut: '', fin: '', id: null });
    } catch (err) {
      toast.error('Erreur lors de la sauvegarde des vacances');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = v => setForm(v);

  const handleDelete = async id => {
    if (!window.confirm('Supprimer cette période ?')) return;
    const next = vacances.filter(v => v.id !== id);
    try {
      await persistVacances(next);
      setVacances(next);
      toast.success('Période supprimée');
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
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

// --- CRUD Écoles (admin) — mise en forme compatible avec l’affichage public ---
function EcolesCrud() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nom: '',
    partenaire: '',
    niveau: 'elementaire',
    adresse: '',
    tel: '',
    email: '',
    site: '',
    image: ''
  });
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState('');

  const persistEcoles = async (list) => {
    const res = await fetch('/api/pageContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'ecoles', ecoles_json: list })
    });
    if (!res.ok) throw new Error('Failed to persist schools');
  };

  const genId = (suffix = '') =>
    (typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `ecole-${Date.now()}-${Math.random().toString(36).slice(2)}${suffix}`);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/pageContent?page=ecoles');
        const data = await response.json();
        const obj = data?.[0] || {};
        const arr = Array.isArray(obj.ecoles_json) ? obj.ecoles_json : [];
        const withIds = arr.map((e, idx) => ({ ...e, id: e?.id || genId(`-${idx}`) }));
        setItems(withIds);

        if (withIds.some((e, i) => !arr[i]?.id)) {
          try {
            await persistEcoles(withIds);
          } catch {
            toast.error('Synchronisation automatique des écoles impossible');
          }
        }
      } catch {
        setItems([]);
      }
    };

    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (f.size > 2 * 1024 * 1024) {
      toast.warn('Image trop lourde (> 2 Mo). Utilisez une URL ou compressez l’image.');
      return;
    }

    const formData = new FormData();
    formData.append('file', f);

    try {
      toast.info('Envoi du fichier...');
      const res = await fetch('/api/upload_doc', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Erreur upload');
      const { fileUrl } = await res.json();
      setPreview(fileUrl);
      setForm((s) => ({ ...s, image: fileUrl }));
      toast.success('Image envoyée !');
    } catch (err) {
      toast.error('Erreur lors de l’upload');
    }
  };

  const reset = () => {
    setForm({ id: null, nom: '', partenaire: '', niveau: 'elementaire', adresse: '', tel: '', email: '', site: '', image: '' });
    setPreview('');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nom.trim()) return;

    const next = form.id
      ? items.map((it) => (it.id === form.id ? { ...it, ...form } : it))
      : [...items, { id: genId(), ...form }];

    setSaving(true);
    try {
      await persistEcoles(next);
      setItems(next);
      toast.success(form.id ? 'École enregistrée' : 'École ajoutée');
      reset();
    } catch {
      toast.error('Erreur lors de l’enregistrement de l’école');
    } finally {
      setSaving(false);
    }
  };

  const edit = (it) => {
    setForm({ ...it });
    setPreview(it.image || '');
  };

  const delIt = async (id, index) => {
    if (!confirm('Supprimer cette école ?')) return;

    const current = typeof index === 'number' ? items[index] : null;
    const next = items.filter((it, i) => (id ? it.id !== id : i !== index));

    setSaving(true);
    try {
      await persistEcoles(next);
      setItems(next);
      if (form.id && (form.id === id || (current && form.id === current.id))) {
        reset();
      }
      toast.warn('École supprimée');
    } catch {
      toast.error('Erreur lors de la suppression');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="box mt-5" style={{ background: '#f8fafc', borderRadius: 16 }}>
      <h2 className="title is-5 has-text-primary mb-3">Écoles (CRUD)</h2>

      <form onSubmit={submit} className="mb-5">
        <div className="columns">
          <div className="column is-7">
            <div className="field">
              <label className="label">Nom</label>
              <input className="input" name="nom" value={form.nom} onChange={handleChange} required />
            </div>

            <div className="field">
              <label className="label">Texte partenaire / mention (ligne en italique)</label>
              <input className="input" name="partenaire" value={form.partenaire} onChange={handleChange} placeholder='Ex: En partenariat avec la commune d’Altkirch' />
            </div>

            <div className="field is-grouped">
              <div className="control is-expanded">
                <label className="label">Adresse</label>
                <input className="input" name="adresse" value={form.adresse} onChange={handleChange} />
              </div>
              <div className="control is-expanded">
                <label className="label">Téléphone</label>
                <input className="input" name="tel" value={form.tel} onChange={handleChange} />
              </div>
            </div>

            <div className="field is-grouped">
              <div className="control is-expanded">
                <label className="label">Email</label>
                <input className="input" type="email" name="email" value={form.email} onChange={handleChange} />
              </div>
              <div className="control is-expanded">
                <label className="label">Site web</label>
                <input className="input" name="site" value={form.site} onChange={handleChange} placeholder="https://..." />
              </div>
            </div>
          </div>

          <div className="column is-5">
            <label className="label">Image / Logo</label>
            <div className="file has-name is-fullwidth mb-2">
              <label className="file-label">
                <input className="file-input" type="file" accept="image/*" onChange={handleFile} />
                <span className="file-cta">
                  <span className="file-icon"><i className="fas fa-upload"></i></span>
                  <span className="file-label">Choisir une image…</span>
                </span>
                <span className="file-name">{preview ? 'Image sélectionnée' : 'Aucun fichier'}</span>
              </label>
            </div>

            <div className="control mb-2">
              <input
                className="input"
                name="image"
                value={form.image}
                onChange={(e) => {
                  const url = e.target.value;
                  setForm({ ...form, image: url });
                  setPreview(url);
                  if (form.id) {
                    setItems(prev => prev.map(it => it.id === form.id ? ({ ...it, image: url }) : it));
                    toast.info('Image mise à jour (à enregistrer)');
                  }
                }}
                placeholder="Ou URL d'image"
              />
            </div>

            {preview && (
              <figure className="image" style={{ maxWidth: 240 }}>
                <img
                  src={preview}
                  alt="Aperçu"
                  style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                  onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/240x140?text=Logo'; }}
                />
              </figure>
            )}

            <p className="help is-info mt-2">Après modification, cliquez sur “Enregistrer les écoles”.</p>
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button className={`button is-link${saving ? ' is-loading' : ''}`} type="submit" disabled={saving}>
              {form.id ? 'Enregistrer les modifications' : 'Enregistrer'}
            </button>
          </div>
          {form.id && (
            <div className="control">
              <button type="button" className="button" onClick={reset} disabled={saving}>
                Annuler
              </button>
            </div>
          )}
        </div>
      </form>

      <table className="table is-fullwidth is-striped is-hoverable">
        <thead>
          <tr>
            <th style={{ width: 84 }}>Logo</th>
            <th>Nom</th>
            <th>Adresse</th>
            <th>Contact</th>
            <th className="has-text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, index) => (
            <tr key={it.id || index}>
              <td>
                {it.image && (
                  <img
                    src={it.image}
                    alt={it.nom}
                    style={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 6 }}
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/72x48?text=Logo'; }}
                  />
                )}
              </td>
              <td className="has-text-weight-semibold">
                {it.nom}
                {it.partenaire && <div style={{ fontStyle: 'italic', fontSize: 14 }} className="has-text-grey mt-1">{it.partenaire}</div>}
              </td>
              <td className="is-size-7">{it.adresse}</td>
              <td className="is-size-7">
                {it.tel && <>📞 {it.tel}<br /></>}
                {it.email && <>✉️ {it.email}<br /></>}
                {it.site && <a href={it.site} target="_blank" rel="noopener noreferrer">🌐 Site</a>}
              </td>
              <td className="has-text-right">
                <div className="buttons are-small is-right">
                  <button className="button is-info" onClick={() => edit(it)} disabled={saving}>✏️</button>
                  <button className="button is-danger" onClick={() => delIt(it.id, index)} disabled={saving}>🗑️</button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan="5" className="has-text-centered has-text-grey">Aucune école enregistrée</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// --- Composant principal ---
export default function EcolesEditor() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('idle');
  const saveTimer = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/pageContent?page=ecoles')
      .then(res => res.json())
      .then(data => {
        const obj = data[0] || {};
        const initial = {};
        FIELDS.forEach(f => {
          initial[f.key] = obj[f.key] || '';
        });
        setForm(initial);
        setStatus('saved');
      })
      .catch(() => {
        setForm({});
        setStatus('error');
      })
      .finally(() => setLoading(false));
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const persistForm = async (payload) => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    setSaving(true);
    setStatus('saving');
    try {
      const res = await fetch('/api/pageContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'ecoles', ...payload })
      });
      if (!res.ok) throw new Error('Bad response');
      setStatus('saved');
    } catch (err) {
      setStatus('error');
      toast.error('Erreur lors de l’enregistrement du contenu');
    } finally {
      setSaving(false);
    }
  };

  const queueSave = (payload) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persistForm(payload), 800);
  };

  const handleChange = e => {
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
    queueSave(next);
  };

  return (
    <div className="box" style={{ borderRadius: 14, background: '#fafdff' }}>
      <div className="is-flex is-align-items-center is-justify-content-space-between mb-4">
        <h2 className="title is-4 has-text-link mb-0">🗂️ Contenu de la page Écoles</h2>
        <span className={`tag ${status === 'saving' ? 'is-info' : status === 'error' ? 'is-danger' : 'is-success'}`}>
          {status === 'saving' ? 'Sauvegarde…' : status === 'error' ? 'Erreur' : 'Enregistré'}
        </span>
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
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
          {status === 'error' && (
            <div className="notification is-danger is-light py-2 px-3">
              Dernière sauvegarde en échec (réessaie après modification).
            </div>
          )}
        </div>
      </form>
      
      {/* CRUD Écoles dynamique */}
      <EcolesCrud />

      {/* CRUD Vacances scolaires */}
      <VacancesCrud />

      <ToastContainer position="top-right" autoClose={2500} newestOnTop />
    </div>
  );
}