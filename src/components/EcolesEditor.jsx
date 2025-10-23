import React, { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FIELDS = [
  { key: 'titre', label: 'Titre principal de la page', type: 'text', group: 'header' },
  { key: 'services_section_titre', label: 'Titre de la section services', type: 'text', group: 'header', placeholder: 'Ex: Services Périscolaires, Activités Extrascolaires, etc.' },
  { key: 'services_section_emoji', label: 'Emoji de la section services', type: 'text', group: 'header', placeholder: 'Ex: 🎨, 🎯, 🏫, ⚽' },
  { key: 'info_transport', label: 'Infos transport scolaire', type: 'textarea', group: 'infos' },
  { key: 'transport_fluo68_pdf', label: 'PDF inscription Fluo 68', type: 'file', accept: '.pdf', group: 'infos', placeholder: 'URL du PDF Fluo 68' },
  { key: 'calendrier', label: 'Calendrier scolaire (texte ou HTML)', type: 'textarea', group: 'infos' },
  { key: 'calendrier_pdf_url', label: 'Lien PDF/Image du calendrier', type: 'file', accept: '.pdf,image/*', group: 'infos' },
  { key: 'calendrier_url', label: 'Lien externe (site officiel)', type: 'text', group: 'infos' },
];

const GROUPS = [
  { key: 'header', icon: '🏫', title: 'En-tête' },
  { key: 'infos', icon: 'ℹ️', title: 'Infos pratiques' },
];

// --- CRUD Documents utiles ---
function DocumentsCrud() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ id: null, label: '', url: '', emoji: '📄', type: 'url' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const persistDocuments = async (list) => {
    const res = await fetch('/api/pageContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'ecoles', documents_json: list })
    });
    if (!res.ok) throw new Error('Failed to persist documents');
  };

  const genId = () =>
    (typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `doc-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/pageContent?page=ecoles');
        const data = await response.json();
        const obj = data?.[0] || {};
        
        let arr = Array.isArray(obj.documents_json) ? obj.documents_json : [];
        
        if (arr.length === 0) {
          const legacy = [];
          for (let i = 1; i <= 4; i++) {
            if (obj[`doc_${i}_label`] && obj[`doc_${i}_url`]) {
              legacy.push({
                id: genId(),
                label: obj[`doc_${i}_label`],
                url: obj[`doc_${i}_url`],
                emoji: '📄'
              });
            }
          }
          if (legacy.length > 0) {
            arr = legacy;
            try {
              await persistDocuments(arr);
              toast.info('Migration des documents réussie');
            } catch {
              toast.error('Erreur lors de la migration des documents');
            }
          }
        }
        
        const withIds = arr.map((d) => ({ ...d, id: d?.id || genId() }));
        setItems(withIds);

        if (withIds.some((d, i) => !arr[i]?.id)) {
          try {
            await persistDocuments(withIds);
          } catch {
            toast.error('Synchronisation automatique des documents impossible');
          }
        }
      } catch {
        setItems([]);
      }
    };

    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const reset = () => {
    setForm({ id: null, label: '', url: '', emoji: '📄', type: 'url' });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.label.trim() || !form.url.trim()) {
      toast.error('Nom et lien sont obligatoires');
      return;
    }

    const next = form.id
      ? items.map((it) => (it.id === form.id ? { ...it, ...form } : it))
      : [...items, { id: genId(), ...form }];

    setSaving(true);
    const toastId = toast.loading(form.id ? 'Modification...' : 'Ajout...');
    try {
      await persistDocuments(next);
      setItems(next);
      toast.update(toastId, { 
        render: form.id ? 'Document enregistré' : 'Document ajouté', 
        type: 'success', 
        isLoading: false, 
        autoClose: 2000 
      });
      reset();
    } catch {
      toast.update(toastId, { 
        render: "Erreur lors de l'enregistrement", 
        type: 'error', 
        isLoading: false, 
        autoClose: 3000 
      });
    } finally {
      setSaving(false);
    }
  };

  const edit = (it) => {
    setForm({ ...it });
  };

  const delIt = async (id) => {
    const doc = items.find(it => it.id === id);
    if (!doc) return;

    toast.info(
      <div>
        <p>Supprimer "{doc.label}" ?</p>
        <div className="buttons mt-3">
          <button
            className="button is-danger is-small"
            onClick={async () => {
              toast.dismiss();
              const toastId = toast.loading('Suppression...');
              const next = items.filter((it) => it.id !== id);
              setSaving(true);

              try {
                await persistDocuments(next);
                setItems(next);
                if (form.id === id) reset();
                toast.update(toastId, {
                  render: 'Document supprimé',
                  type: 'success',
                  isLoading: false,
                  autoClose: 2000
                });
              } catch {
                toast.update(toastId, {
                  render: 'Erreur lors de la suppression',
                  type: 'error',
                  isLoading: false,
                  autoClose: 3000
                });
              } finally {
                setSaving(false);
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
      { autoClose: false, closeButton: false, closeOnClick: false }
    );
  };

  const moveUp = async (index) => {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    const toastId = toast.loading('Déplacement...');
    try {
      await persistDocuments(next);
      setItems(next);
      toast.update(toastId, { 
        render: 'Document déplacé', 
        type: 'success', 
        isLoading: false, 
        autoClose: 1500 
      });
    } catch {
      toast.update(toastId, { 
        render: 'Erreur', 
        type: 'error', 
        isLoading: false, 
        autoClose: 2000 
      });
    }
  };

  const moveDown = async (index) => {
    if (index === items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    const toastId = toast.loading('Déplacement...');
    try {
      await persistDocuments(next);
      setItems(next);
      toast.update(toastId, { 
        render: 'Document déplacé', 
        type: 'success', 
        isLoading: false, 
        autoClose: 1500 
      });
    } catch {
      toast.update(toastId, { 
        render: 'Erreur', 
        type: 'error', 
        isLoading: false, 
        autoClose: 2000 
      });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.warn('Fichier trop lourd (> 5 Mo)');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    const toastId = toast.loading('Envoi du fichier...');
    try {
      const res = await fetch('/api/upload_doc', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Erreur upload');
      const { fileUrl } = await res.json();
      setForm((s) => ({ ...s, url: fileUrl, type: 'pdf' }));
      toast.update(toastId, { 
        render: 'Fichier envoyé !', 
        type: 'success', 
        isLoading: false, 
        autoClose: 2000 
      });
    } catch (err) {
      toast.update(toastId, { 
        render: 'Erreur lors de l\'upload', 
        type: 'error', 
        isLoading: false, 
        autoClose: 3000 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="box mt-5" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
      <h3 className="subtitle is-5 mb-3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 22 }}>📚</span> Documents utiles
      </h3>
      
      <form onSubmit={submit} className="box mb-3" style={{ background: '#f9fbfd', borderRadius: 8, border: '1px solid #e0e7ef' }}>
        <div className="field is-horizontal">
          <div className="field-body">
            <div className="field" style={{ maxWidth: 100 }}>
              <label className="label is-small">Emoji</label>
              <div className="control">
                <input 
                  className="input has-text-centered" 
                  name="emoji" 
                  value={form.emoji} 
                  onChange={handleChange} 
                  placeholder="📄" 
                  style={{ fontSize: 24 }} 
                />
              </div>
            </div>
            <div className="field is-expanded">
              <label className="label is-small">Nom du document</label>
              <div className="control">
                <input 
                  className="input" 
                  name="label" 
                  value={form.label} 
                  onChange={handleChange} 
                  placeholder="Ex: Fiche d'inscription cantine" 
                  required 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="field">
          <label className="label is-small">Type de lien</label>
          <div className="control">
            <label className="radio mr-4">
              <input 
                type="radio" 
                name="type" 
                value="url" 
                checked={form.type === 'url'} 
                onChange={handleChange}
              />
              {' '}URL externe
            </label>
            <label className="radio">
              <input 
                type="radio" 
                name="type" 
                value="pdf" 
                checked={form.type === 'pdf'} 
                onChange={handleChange}
              />
              {' '}Fichier PDF
            </label>
          </div>
        </div>

        {form.type === 'url' ? (
          <div className="field">
            <label className="label is-small">Lien URL</label>
            <div className="control">
              <input 
                className="input" 
                name="url" 
                value={form.url} 
                onChange={handleChange} 
                placeholder="https://..." 
                required 
              />
            </div>
          </div>
        ) : (
          <div className="field">
            <label className="label is-small">Fichier PDF</label>
            <div className="file has-name is-fullwidth">
              <label className="file-label">
                <input 
                  className="file-input" 
                  type="file" 
                  accept=".pdf,application/pdf" 
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <span className="file-cta">
                  <span className="file-icon">📎</span>
                  <span className="file-label">Choisir un PDF…</span>
                </span>
                <span className="file-name">{form.url ? 'Fichier sélectionné' : 'Aucun fichier'}</span>
              </label>
            </div>
            {form.url && (
              <p className="help is-success mt-2">✓ Fichier prêt : {form.url}</p>
            )}
          </div>
        )}

        <div className="field is-grouped mt-3">
          <div className="control">
            <button 
              className={`button is-link${saving || uploading ? ' is-loading' : ''}`} 
              type="submit" 
              disabled={saving || uploading || !form.url} 
              style={{ borderRadius: 8 }}
            >
              {form.id ? '💾 Enregistrer' : '➕ Ajouter'}
            </button>
          </div>
          {form.id && (
            <div className="control">
              <button type="button" className="button is-light" onClick={reset} disabled={saving} style={{ borderRadius: 8 }}>
                ❌ Annuler
              </button>
            </div>
          )}
        </div>
      </form>

      {items.length === 0 ? (
        <div className="notification is-light is-info is-size-7 py-2 px-3" style={{ borderRadius: 8 }}>
          Aucun document enregistré
        </div>
      ) : (
        <div>
          {items.map((it, index) => (
            <div key={it.id || index} className="box mb-2 py-2 px-3" style={{ background: '#f9fbfd', borderRadius: 8, border: '1px solid #e0e7ef' }}>
              <div className="is-flex is-align-items-center">
                <span style={{ fontSize: 24, marginRight: 12 }}>{it.emoji || '📄'}</span>
                <div style={{ flex: 1 }}>
                  <div className="has-text-weight-semibold">{it.label}</div>
                  <div className="is-size-7 has-text-grey" style={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <a href={it.url} target="_blank" rel="noopener noreferrer" className="has-text-link">
                      {it.url}
                    </a>
                  </div>
                </div>
                <div className="buttons are-small mb-0">
                  <button className="button is-white" onClick={() => moveUp(index)} disabled={index === 0 || saving} title="Monter">
                    <span className="icon is-small">▲</span>
                  </button>
                  <button className="button is-white" onClick={() => moveDown(index)} disabled={index === items.length - 1 || saving} title="Descendre">
                    <span className="icon is-small">▼</span>
                  </button>
                  <button className="button is-small is-info" onClick={() => edit(it)} disabled={saving} title="Modifier">
                    <span role="img" aria-label="Modifier">✏️</span>
                  </button>
                  <button className="button is-danger" onClick={() => delIt(it.id)} disabled={saving} title="Supprimer">
                    <span role="img" aria-label="Supprimer">🗑️</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- CRUD Vacances scolaires ---
function VacancesCrud() {
  const [vacances, setVacances] = useState([]);
  const [form, setForm] = useState({ titre: '', debut: '', fin: '', id: null });
  const [loading, setLoading] = useState(false);

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
    if (!form.titre.trim() || !form.debut.trim() || !form.fin.trim()) {
      toast.error('Tous les champs sont obligatoires');
      return;
    }

    setLoading(true);
    const toastId = toast.loading(form.id ? 'Modification...' : 'Ajout...');
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
      toast.update(toastId, { 
        render: form.id ? 'Période modifiée' : 'Période ajoutée', 
        type: 'success', 
        isLoading: false, 
        autoClose: 2000 
      });
      setForm({ titre: '', debut: '', fin: '', id: null });
    } catch (err) {
      toast.update(toastId, { 
        render: 'Erreur lors de la sauvegarde', 
        type: 'error', 
        isLoading: false, 
        autoClose: 3000 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = v => setForm(v);

  const handleDelete = async id => {
    const vacance = vacances.find(v => v.id === id);
    if (!vacance) return;

    toast.info(
      <div>
        <p>Supprimer "{vacance.titre}" ?</p>
        <div className="buttons mt-3">
          <button
            className="button is-danger is-small"
            onClick={async () => {
              toast.dismiss();
              const toastId = toast.loading('Suppression...');
              const next = vacances.filter(v => v.id !== id);
              try {
                await persistVacances(next);
                setVacances(next);
                toast.update(toastId, {
                  render: 'Période supprimée',
                  type: 'success',
                  isLoading: false,
                  autoClose: 2000
                });
              } catch (err) {
                toast.update(toastId, {
                  render: 'Erreur lors de la suppression',
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
      { autoClose: false, closeButton: false, closeOnClick: false }
    );
  };

  return (
    <div className="box mt-5" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
      <h3 className="subtitle is-5 mb-3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 22 }}>📅</span> Vacances scolaires
      </h3>
      
      <form onSubmit={handleSubmit} className="box mb-3" style={{ background: '#f9fbfd', borderRadius: 8, border: '1px solid #e0e7ef' }}>
        <div className="field is-grouped">
          <div className="control is-expanded">
            <label className="label is-small">Nom des vacances</label>
            <input className="input" name="titre" placeholder="Ex: Vacances de Noël" value={form.titre} onChange={handleChange} required />
          </div>
          <div className="control is-expanded">
            <label className="label is-small">Date de début</label>
            <input className="input" name="debut" placeholder="Ex: 20/12/2024" value={form.debut} onChange={handleChange} required />
          </div>
          <div className="control is-expanded">
            <label className="label is-small">Date de fin</label>
            <input className="input" name="fin" placeholder="Ex: 06/01/2025" value={form.fin} onChange={handleChange} required />
          </div>
          <div className="control" style={{ paddingTop: 26 }}>
            <button className={`button is-link${loading ? ' is-loading' : ''}`} type="submit" style={{ borderRadius: 8 }}>
              {form.id ? '💾 Modifier' : '➕ Ajouter'}
            </button>
          </div>
          {form.id && (
            <div className="control" style={{ paddingTop: 26 }}>
              <button className="button is-light" type="button" onClick={() => setForm({ titre: '', debut: '', fin: '', id: null })} style={{ borderRadius: 8 }}>
                ❌ Annuler
              </button>
            </div>
          )}
        </div>
      </form>

      {vacances.length === 0 ? (
        <div className="notification is-light is-info is-size-7 py-2 px-3" style={{ borderRadius: 8 }}>
          Aucune période de vacances enregistrée
        </div>
      ) : (
        <table className="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>Vacances</th>
              <th>Début</th>
              <th>Fin</th>
              <th className="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vacances.map(v => (
              <tr key={v.id}>
                <td>{v.titre}</td>
                <td>{v.debut}</td>
                <td>{v.fin}</td>
                <td className="has-text-right">
                  <div className="buttons are-small is-right mb-0">
                    <button className="button is-small is-info" onClick={() => handleEdit(v)} title="Modifier">
                      <span role="img" aria-label="Modifier">✏️</span>
                    </button>
                    <button className="button is-danger" onClick={() => handleDelete(v.id)} title="Supprimer">
                      <span role="img" aria-label="Supprimer">🗑️</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// --- CRUD Écoles ---
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
      toast.warn('Image trop lourde (> 2 Mo). Utilisez une URL ou compressez l\'image.');
      return;
    }

    // Vérifier que c'est bien une image
    if (!f.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image (JPG, PNG, etc.)');
      return;
    }

    const formData = new FormData();
    formData.append('file', f);

    const toastId = toast.loading('Envoi du fichier...');
    try {
      const res = await fetch('/api/upload_doc', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Erreur upload');
      const { fileUrl } = await res.json();
      setPreview(fileUrl);
      setForm((s) => ({ ...s, image: fileUrl }));
      toast.update(toastId, { 
        render: 'Image envoyée !', 
        type: 'success', 
        isLoading: false, 
        autoClose: 2000 
      });
    } catch (err) {
      toast.update(toastId, { 
        render: 'Erreur lors de l\'upload', 
        type: 'error', 
        isLoading: false, 
        autoClose: 3000 
      });
    }
  };

  const reset = () => {
    setForm({ id: null, nom: '', partenaire: '', niveau: 'elementaire', adresse: '', tel: '', email: '', site: '', image: '' });
    setPreview('');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nom.trim()) {
      toast.error('Le nom est obligatoire');
      return;
    }

    const next = form.id
      ? items.map((it) => (it.id === form.id ? { ...it, ...form } : it))
      : [...items, { id: genId(), ...form }];

    setSaving(true);
    const toastId = toast.loading(form.id ? 'Modification...' : 'Ajout...');
    try {
      await persistEcoles(next);
      setItems(next);
      toast.update(toastId, { 
        render: form.id ? 'École enregistrée' : 'École ajoutée', 
        type: 'success', 
        isLoading: false, 
        autoClose: 2000 
      });
      reset();
    } catch {
      toast.update(toastId, { 
        render: 'Erreur lors de l\'enregistrement de l\'école', 
        type: 'error', 
        isLoading: false, 
        autoClose: 3000 
      });
    } finally {
      setSaving(false);
    }
  };

  const edit = (it) => {
    setForm({ ...it });
    setPreview(it.image || '');
  };

  const delIt = async (id, index) => {
    const current = typeof index === 'number' ? items[index] : null;
    const ecole = current || items.find(it => it.id === id);
    if (!ecole) return;

    toast.info(
      <div>
        <p>Supprimer l'école "{ecole.nom}" ?</p>
        <div className="buttons mt-3">
          <button
            className="button is-danger is-small"
            onClick={async () => {
              toast.dismiss();
              const toastId = toast.loading('Suppression...');
              const next = items.filter((it, i) => (id ? it.id !== id : i !== index));
              setSaving(true);

              try {
                await persistEcoles(next);
                setItems(next);
                if (form.id && (form.id === id || (current && form.id === current.id))) {
                  reset();
                }
                toast.update(toastId, {
                  render: 'École supprimée',
                  type: 'success',
                  isLoading: false,
                  autoClose: 2000
                });
              } catch {
                toast.update(toastId, {
                  render: 'Erreur lors de la suppression',
                  type: 'error',
                  isLoading: false,
                  autoClose: 3000
                });
              } finally {
                setSaving(false);
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
      { autoClose: false, closeButton: false, closeOnClick: false }
    );
  };

  return (
    <div className="box mt-5" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
      <h3 className="subtitle is-5 mb-3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 22 }}>🏫</span> Écoles
      </h3>

      <form onSubmit={submit} className="box mb-4" style={{ background: '#f9fbfd', borderRadius: 8, border: '1px solid #e0e7ef' }}>
        <div className="columns">
          <div className="column is-7">
            <div className="field mb-3">
              <label className="label is-small">Nom</label>
              <input className="input" name="nom" value={form.nom} onChange={handleChange} required />
            </div>

            <div className="field mb-3">
              <label className="label is-small">Texte partenaire / mention (ligne en italique)</label>
              <input className="input" name="partenaire" value={form.partenaire} onChange={handleChange} placeholder="Ex: En partenariat avec la commune d'Altkirch" />
            </div>

            <div className="field is-grouped mb-3">
              <div className="control is-expanded">
                <label className="label is-small">Adresse</label>
                <input className="input" name="adresse" value={form.adresse} onChange={handleChange} />
              </div>
              <div className="control is-expanded">
                <label className="label is-small">Téléphone</label>
                <input className="input" name="tel" value={form.tel} onChange={handleChange} />
              </div>
            </div>

            <div className="field is-grouped">
              <div className="control is-expanded">
                <label className="label is-small">Email</label>
                <input className="input" type="email" name="email" value={form.email} onChange={handleChange} />
              </div>
              <div className="control is-expanded">
                <label className="label is-small">Site web</label>
                <input className="input" name="site" value={form.site} onChange={handleChange} placeholder="https://..." />
              </div>
            </div>
          </div>

          <div className="column is-5">
            <label className="label is-small">Image / Logo</label>
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
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button className={`button is-link${saving ? ' is-loading' : ''}`} type="submit" disabled={saving} style={{ borderRadius: 8 }}>
              {form.id ? '💾 Enregistrer les modifications' : '➕ Ajouter'}
            </button>
          </div>
          {form.id && (
            <div className="control">
              <button type="button" className="button is-light" onClick={reset} disabled={saving} style={{ borderRadius: 8 }}>
                ❌ Annuler
              </button>
            </div>
          )}
        </div>
      </form>

      {items.length === 0 ? (
        <div className="notification is-light is-info is-size-7 py-2 px-3" style={{ borderRadius: 8 }}>
          Aucune école enregistrée
        </div>
      ) : (
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
                  <div className="buttons are-small is-right mb-0">
                    <button className="button is-small is-info" onClick={() => edit(it)} disabled={saving} title="Modifier">
                      <span role="img" aria-label="Modifier">✏️</span>
                    </button>
                    <button className="button is-danger" onClick={() => delIt(it.id, index)} disabled={saving} title="Supprimer">
                      <span role="img" aria-label="Supprimer">🗑️</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// --- CRUD Services Périscolaires ---
function ServicesCrud() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    id: null,
    titre: '',
    emoji: '🎨',
    horaires: '',
    description: '',
    btnLabel: '',
    btnUrl: '',
    lienType: 'externe',
    image: ''
  });
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState('');

  const persistServices = async (list) => {
    const res = await fetch('/api/pageContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'ecoles', services_json: list })
    });
    if (!res.ok) throw new Error('Failed to persist services');
  };

  const genId = () =>
    (typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `service-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/pageContent?page=ecoles');
        const data = await response.json();
        const obj = data?.[0] || {};
        const arr = Array.isArray(obj.services_json) ? obj.services_json : [];
        const withIds = arr.map((s) => ({ ...s, id: s?.id || genId() }));
        setItems(withIds);

        if (withIds.some((s, i) => !arr[i]?.id)) {
          try {
            await persistServices(withIds);
          } catch {
            toast.error('Synchronisation automatique des services impossible');
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
      toast.warn('Image trop lourde (> 2 Mo)');
      return;
    }

    // Vérifier que c'est bien une image
    if (!f.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image (JPG, PNG, etc.)');
      return;
    }

    const formData = new FormData();
    formData.append('file', f);

    const toastId = toast.loading('Envoi du fichier...');
    try {
      const res = await fetch('/api/upload_doc', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Erreur upload');
      const { fileUrl } = await res.json();
      setPreview(fileUrl);
      setForm((s) => ({ ...s, image: fileUrl }));
      toast.update(toastId, { 
        render: 'Image envoyée !', 
        type: 'success', 
        isLoading: false, 
        autoClose: 2000 
      });
    } catch (err) {
      toast.update(toastId, { 
        render: 'Erreur lors de l\'upload', 
        type: 'error', 
        isLoading: false, 
        autoClose: 3000 
      });
    }
  };

  const handleFileLien = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.warn('Fichier trop lourd (> 5 Mo)');
      return;
    }

    // Vérifier que c'est bien un PDF
    if (file.type !== 'application/pdf') {
      toast.error('Veuillez sélectionner un fichier PDF');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const toastId = toast.loading('Envoi du fichier...');
    try {
      const res = await fetch('/api/upload_doc', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Erreur upload');
      const { fileUrl } = await res.json();
      setForm((s) => ({ ...s, btnUrl: fileUrl }));
      toast.update(toastId, { 
        render: 'Fichier envoyé !', 
        type: 'success', 
        isLoading: false, 
        autoClose: 2000 
      });
    } catch (err) {
      toast.update(toastId, { 
        render: 'Erreur lors de l\'upload', 
        type: 'error', 
        isLoading: false, 
        autoClose: 3000 
      });
    }
  };

  const reset = () => {
    setForm({ id: null, titre: '', emoji: '🎨', horaires: '', description: '', btnLabel: '', btnUrl: '', lienType: 'externe', image: '' });
    setPreview('');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.titre.trim()) {
      toast.error('Le titre est obligatoire');
      return;
    }

    const next = form.id
      ? items.map((it) => (it.id === form.id ? { ...it, ...form } : it))
      : [...items, { id: genId(), ...form }];

    setSaving(true);
    const toastId = toast.loading(form.id ? 'Modification...' : 'Ajout...');
    try {
      await persistServices(next);
      setItems(next);
      toast.update(toastId, { 
        render: form.id ? 'Service enregistré' : 'Service ajouté', 
        type: 'success', 
        isLoading: false, 
        autoClose: 2000 
      });
      reset();
    } catch {
      toast.update(toastId, { 
        render: 'Erreur lors de l\'enregistrement du service', 
        type: 'error', 
        isLoading: false, 
        autoClose: 3000 
      });
    } finally {
      setSaving(false);
    }
  };

  const edit = (it) => {
    setForm({ ...it });
    setPreview(it.image || '');
  };

  const delIt = async (id) => {
    const service = items.find(it => it.id === id);
    if (!service) return;

    toast.info(
      <div>
        <p>Supprimer "{service.titre}" ?</p>
        <div className="buttons mt-3">
          <button
            className="button is-danger is-small"
            onClick={async () => {
              toast.dismiss();
              const toastId = toast.loading('Suppression...');
              const next = items.filter((it) => it.id !== id);
              setSaving(true);

              try {
                await persistServices(next);
                setItems(next);
                if (form.id === id) reset();
                toast.update(toastId, {
                  render: 'Service supprimé',
                  type: 'success',
                  isLoading: false,
                  autoClose: 2000
                });
              } catch {
                toast.update(toastId, {
                  render: 'Erreur lors de la suppression',
                  type: 'error',
                  isLoading: false,
                  autoClose: 3000
                });
              } finally {
                setSaving(false);
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
      { autoClose: false, closeButton: false, closeOnClick: false }
    );
  };

  const moveUp = async (index) => {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    const toastId = toast.loading('Déplacement...');
    try {
      await persistServices(next);
      setItems(next);
      toast.update(toastId, { 
        render: 'Service déplacé', 
        type: 'success', 
        isLoading: false, 
        autoClose: 1500 
      });
    } catch {
      toast.update(toastId, { 
        render: 'Erreur', 
        type: 'error', 
        isLoading: false, 
        autoClose: 2000 
      });
    }
  };

  const moveDown = async (index) => {
    if (index === items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    const toastId = toast.loading('Déplacement...');
    try {
      await persistServices(next);
      setItems(next);
      toast.update(toastId, { 
        render: 'Service déplacé', 
        type: 'success', 
        isLoading: false, 
        autoClose: 1500 
      });
    } catch {
      toast.update(toastId, { 
        render: 'Erreur', 
        type: 'error', 
        isLoading: false, 
        autoClose: 2000 
      });
    }
  };

  return (
    <div className="box mt-5" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
      <h3 className="subtitle is-5 mb-3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 22 }}>🎨</span> Services
      </h3>
      <div className="notification is-info is-light mb-4" style={{ borderRadius: 10, fontSize: 14 }}>
        <p>💡 <strong>Personnalisation :</strong> Vous pouvez modifier le titre et l'emoji de cette section dans l'onglet <strong>"En-tête"</strong> ci-dessus.</p>
        <p className="mt-2">Par exemple : "Activités Extrascolaires 🎯", "Services aux familles 👨‍👩‍👧", etc.</p>
      </div>

      <form onSubmit={submit} className="box mb-4" style={{ background: '#f9fbfd', borderRadius: 8, border: '1px solid #e0e7ef' }}>
        <div className="columns">
          <div className="column is-8">
            <div className="field is-grouped mb-3">
              <div className="control is-expanded">
                <label className="label is-small">Titre du service</label>
                <input className="input" name="titre" value={form.titre} onChange={handleChange} placeholder="Ex: Cantine scolaire" required />
              </div>
              <div className="control">
                <label className="label is-small">Emoji</label>
                <input className="input has-text-centered" name="emoji" value={form.emoji} onChange={handleChange} placeholder="🍽️" style={{ width: 80, fontSize: 24 }} />
              </div>
            </div>

            <div className="field mb-3">
              <label className="label is-small">Horaires (optionnel)</label>
              <input className="input" name="horaires" value={form.horaires} onChange={handleChange} placeholder="Ex: Lundi au vendredi : 12h - 14h" />
            </div>

            <div className="field mb-3">
              <label className="label is-small">Description</label>
              <textarea className="textarea" name="description" value={form.description} onChange={handleChange} placeholder="Description du service" rows="3"></textarea>
            </div>

            <div className="field mb-3">
              <label className="label is-small">Texte du bouton (optionnel)</label>
              <div className="control">
                <input 
                  className="input" 
                  name="btnLabel" 
                  value={form.btnLabel} 
                  onChange={handleChange} 
                  placeholder="Ex: S'inscrire, Voir les menus, Page Facebook" 
                />
              </div>
            </div>

            <div className="field">
              <label className="label is-small">Type de lien pour le bouton</label>
              <div className="control mb-2">
                <label className="radio mr-4">
                  <input 
                    type="radio" 
                    name="lienType" 
                    value="externe" 
                    checked={form.lienType === 'externe'} 
                    onChange={handleChange}
                  />
                  {' '}URL externe (site web, Facebook, etc.)
                </label>
                <label className="radio">
                  <input 
                    type="radio" 
                    name="lienType" 
                    value="pdf" 
                    checked={form.lienType === 'pdf'} 
                    onChange={handleChange}
                  />
                  {' '}Fichier PDF
                </label>
              </div>

              {form.lienType === 'externe' ? (
                <div className="control">
                  <input 
                    className="input" 
                    name="btnUrl" 
                    value={form.btnUrl} 
                    onChange={handleChange} 
                    placeholder="https://... ou https://facebook.com/..." 
                  />
                </div>
              ) : (
                <div className="file has-name is-fullwidth">
                  <label className="file-label">
                    <input 
                      className="file-input" 
                      type="file" 
                      accept=".pdf,application/pdf" 
                      onChange={handleFileLien}
                    />
                    <span className="file-cta">
                      <span className="file-icon">📎</span>
                      <span className="file-label">Choisir un PDF…</span>
                    </span>
                    <span className="file-name">{form.btnUrl ? 'Fichier sélectionné' : 'Aucun fichier'}</span>
                  </label>
                </div>
              )}
              {form.btnUrl && (
                <p className="help is-success mt-1">✓ Lien : {form.btnUrl}</p>
              )}
            </div>
          </div>

          <div className="column is-4">
            <label className="label is-small">Image / Icône du service</label>
            <div className="file has-name is-fullwidth mb-2">
              <label className="file-label">
                <input className="file-input" type="file" accept="image/*" onChange={handleFile} />
                <span className="file-cta">
                  <span className="file-icon"><i className="fas fa-upload"></i></span>
                  <span className="file-label">Choisir une image...</span>
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
                }}
                placeholder="Ou URL d'image"
              />
            </div>

            {preview && (
              <figure className="image" style={{ maxWidth: 200 }}>
                <img
                  src={preview}
                  alt="Aperçu"
                  style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                  onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/200?text=Service'; }}
                />
              </figure>
            )}
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button className={`button is-link${saving ? ' is-loading' : ''}`} type="submit" disabled={saving} style={{ borderRadius: 8 }}>
              {form.id ? '💾 Enregistrer' : '➕ Ajouter'}
            </button>
          </div>
          {form.id && (
            <div className="control">
              <button type="button" className="button is-light" onClick={reset} disabled={saving} style={{ borderRadius: 8 }}>
                ❌ Annuler
              </button>
            </div>
          )}
        </div>
      </form>

      {items.length === 0 ? (
        <div className="notification is-light is-info is-size-7 py-2 px-3" style={{ borderRadius: 8 }}>
          Aucune école enregistrée
        </div>
      ) : (
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
                  <div className="buttons are-small is-right mb-0">
                    <button className="button is-small is-info" onClick={() => edit(it)} disabled={saving} title="Modifier">
                      <span role="img" aria-label="Modifier">✏️</span>
                    </button>
                    <button className="button is-danger" onClick={() => delIt(it.id, index)} disabled={saving} title="Supprimer">
                      <span role="img" aria-label="Supprimer">🗑️</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// --- Composant principal ---
export default function EcolesEditor() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingSection, setSavingSection] = useState(null);
  const [status, setStatus] = useState('idle');
  const [uploadingFields, setUploadingFields] = useState({});
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
      toast.success('Contenu enregistré avec succès');
    } catch (err) {
      setStatus('error');
      toast.error("Erreur lors de l'enregistrement du contenu");
    } finally {
      setSaving(false);
    }
  };

  const saveSection = async (groupKey) => {
    setSavingSection(groupKey);
    const toastId = toast.loading('Enregistrement en cours...');
    
    try {
      const res = await fetch('/api/pageContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'ecoles', ...form })
      });
      
      if (!res.ok) throw new Error('Bad response');
      
      toast.update(toastId, {
        render: '✓ Section enregistrée !',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });
    } catch (err) {
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

  const queueSave = (payload) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persistForm(payload), 800);
  };

  const handleChange = e => {
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
    // Pas de sauvegarde automatique, seulement sur clic du bouton
  };

  const handleFileUpload = async (fieldKey, file) => {
    if (!file) return;

    const maxSize = fieldKey === 'calendrier_pdf_url' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.warn(`Fichier trop lourd (> ${maxSize / (1024 * 1024)} Mo)`);
      return;
    }

    const accept = FIELDS.find(f => f.key === fieldKey)?.accept;
    if (accept) {
      const validTypes = accept.split(',').map(t => t.trim());
      const isPdf = validTypes.includes('.pdf') && file.type === 'application/pdf';
      const isImage = validTypes.includes('image/*') && file.type.startsWith('image/');
      
      if (!isPdf && !isImage) {
        toast.error('Type de fichier non autorisé');
        return;
      }
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploadingFields(prev => ({ ...prev, [fieldKey]: true }));
    const toastId = toast.loading('Envoi du fichier...');

    try {
      const res = await fetch('/api/upload_doc', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) throw new Error('Erreur upload');
      
      const { fileUrl } = await res.json();
      const next = { ...form, [fieldKey]: fileUrl };
      setForm(next);
      
      toast.update(toastId, { 
        render: 'Fichier envoyé ! N\'oubliez pas d\'enregistrer.', 
        type: 'success', 
        isLoading: false, 
        autoClose: 3000 
      });
    } catch (err) {
      toast.update(toastId, { 
        render: 'Erreur lors de l\'upload', 
        type: 'error', 
        isLoading: false, 
        autoClose: 3000 
      });
    } finally {
      setUploadingFields(prev => ({ ...prev, [fieldKey]: false }));
    }
  };

  return (
    <div className="box" style={{ borderRadius: 14, background: '#fafdff', border: '1.5px solid #e0e7ef', boxShadow: '0 2px 12px #e0e7ef33' }}>
      <div className="is-flex is-align-items-center is-justify-content-space-between mb-4">
        <h2 className="title is-4 has-text-link mb-0" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>🗂️</span> Contenu de la page Écoles
        </h2>
      </div>
      
      <form onSubmit={(e) => e.preventDefault()}>
        {GROUPS.map(group => (
          <div key={group.key} className="box mb-4" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
            <div className="is-flex is-align-items-center is-justify-content-space-between mb-3">
              <h3 className="subtitle is-5 mb-0" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>{group.icon}</span> {group.title}
              </h3>
              <button
                type="button"
                className={`button is-success${savingSection === group.key ? ' is-loading' : ''}`}
                onClick={() => saveSection(group.key)}
                disabled={loading || savingSection === group.key}
                style={{ borderRadius: 8 }}
              >
                <span className="icon">
                  <span role="img" aria-label="Enregistrer">💾</span>
                </span>
                <span>Enregistrer</span>
              </button>
            </div>
            
            {FIELDS.filter(f => f.group === group.key).map((f, idx, arr) => (
              <div className="field" key={f.key} style={{ marginBottom: idx < arr.length - 1 ? 16 : 0 }}>
                <label className="label is-small">{f.label}</label>
                
                {f.type === 'file' ? (
                  <div>
                    <div className="file has-name is-fullwidth mb-2">
                      <label className="file-label">
                        <input 
                          className="file-input" 
                          type="file" 
                          accept={f.accept}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(f.key, file);
                          }}
                          disabled={loading || uploadingFields[f.key]}
                        />
                        <span className="file-cta">
                          <span className="file-icon">
                            {uploadingFields[f.key] ? '⏳' : '📎'}
                          </span>
                          <span className="file-label">
                            {uploadingFields[f.key] ? 'Envoi...' : 'Choisir un fichier…'}
                          </span>
                        </span>
                        <span className="file-name">
                          {form[f.key] ? 'Fichier sélectionné' : 'Aucun fichier'}
                        </span>
                      </label>
                    </div>
                    
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        name={f.key}
                        value={form[f.key] || ''}
                        onChange={handleChange}
                        readOnly={loading || uploadingFields[f.key]}
                        placeholder={f.placeholder || "Ou coller une URL"}
                        style={{ background: loading || uploadingFields[f.key] ? "#f5f5f5" : "white" }}
                      />
                    </div>
                    
                    {form[f.key] && (
                      <p className="help is-success mt-1">
                        ✓ Fichier enregistré : 
                        <a 
                          href={form[f.key]} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-1"
                        >
                          {form[f.key].split('/').pop()}
                        </a>
                      </p>
                    )}
                  </div>
                ) : f.type === 'textarea' ? (
                  <div className="control">
                    <textarea
                      className="textarea"
                      name={f.key}
                      value={form[f.key] || ''}
                      onChange={handleChange}
                      readOnly={loading}
                      placeholder={f.placeholder}
                      style={{ background: loading ? "#f5f5f5" : "white" }}
                    />
                  </div>
                ) : (
                  <div className="control">
                    <input
                      className="input"
                      type={f.type}
                      name={f.key}
                      value={form[f.key] || ''}
                      onChange={handleChange}
                      readOnly={loading}
                      placeholder={f.placeholder}
                      style={{ background: loading ? "#f5f5f5" : "white" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </form>
      
      <EcolesCrud />
      <ServicesCrud />
      <DocumentsCrud />
      <VacancesCrud />

      <ToastContainer position="top-right" autoClose={2500} newestOnTop />
    </div>
  );
}