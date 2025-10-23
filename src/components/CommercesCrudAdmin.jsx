import React, { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CATEGORIES = [
  { value: 'alimentaire', label: '🍎 Commerces alimentaires', emoji: '🍎' },
  { value: 'restauration', label: '🍽️ Restaurants et cafés', emoji: '🍽️' },
  { value: 'services', label: '🛠️ Services', emoji: '🛠️' },
  { value: 'artisanat', label: '🔨 Artisanat local', emoji: '🔨' }
];

export default function CommercesCrud() {
  const [commerces, setCommerces] = useState([]);
  const [form, setForm] = useState({ 
    nom: '', 
    description: '', 
    adresse: '', 
    telephone: '', 
    horaires: '', 
    image: '', 
    site: '', 
    categorie: 'alimentaire', 
    id: null 
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');
  const formRef = useRef(null);

  useEffect(() => {
    loadCommerces();
  }, []);

  const loadCommerces = () => {
    fetch('/api/commerces')
      .then(res => res.json())
      .then(setCommerces)
      .catch(() => toast.error('Erreur lors du chargement des commerces'));
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.warn('Fichier trop lourd (> 5 Mo)');
      return;
    }

    // Vérifier que c'est une image
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image (JPG, PNG, etc.)');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    const toastId = toast.loading('Envoi de l\'image...');

    try {
      const res = await fetch('/api/upload_doc', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Erreur upload');

      const { fileUrl } = await res.json();
      setPreview(fileUrl);
      setForm(prev => ({ ...prev, image: fileUrl }));

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
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!form.nom.trim()) {
      toast.error('Le nom est obligatoire');
      return;
    }

    setLoading(true);
    const toastId = toast.loading(form.id ? 'Modification...' : 'Ajout...');

    try {
      const res = await fetch('/api/commerces', {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Erreur');

      toast.update(toastId, {
        render: form.id ? 'Commerce modifié !' : 'Commerce ajouté !',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });

      resetForm();
      loadCommerces();
    } catch (err) {
      toast.update(toastId, {
        render: 'Erreur lors de l\'enregistrement',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = c => {
    setForm(c);
    setPreview(c.image || '');
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = async (id) => {
    const commerce = commerces.find(c => c.id === id);
    if (!commerce) return;

    toast.info(
      <div>
        <p>Supprimer "{commerce.nom}" ?</p>
        <div className="buttons mt-3">
          <button
            className="button is-danger is-small"
            onClick={async () => {
              toast.dismiss();
              const toastId = toast.loading('Suppression...');

              try {
                await fetch('/api/commerces', {
                  method: 'DELETE',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id })
                });

                toast.update(toastId, {
                  render: 'Commerce supprimé',
                  type: 'success',
                  isLoading: false,
                  autoClose: 2000
                });

                if (form.id === id) resetForm();
                loadCommerces();
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

  const resetForm = () => {
    setForm({ 
      nom: '', 
      description: '', 
      adresse: '', 
      telephone: '', 
      horaires: '', 
      image: '', 
      site: '', 
      categorie: 'alimentaire', 
      id: null 
    });
    setPreview('');
  };

  const getCategoryInfo = (value) => {
    return CATEGORIES.find(cat => cat.value === value) || { label: value, emoji: '🏪' };
  };

  return (
    <div className="box" style={{ 
      borderRadius: 14, 
      background: '#fafdff', 
      border: '1.5px solid #e0e7ef', 
      boxShadow: '0 2px 12px #e0e7ef33' 
    }}>
      <h2 className="title is-4 has-text-link mb-4" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 10 
      }}>
        <span style={{ fontSize: 28 }}>🏪</span> Gestion des commerces
      </h2>

      {/* Formulaire */}
      <form 
        ref={formRef} 
        onSubmit={handleSubmit} 
        className="box mb-4" 
        style={{ 
          background: '#f9fbfd', 
          borderRadius: 8, 
          border: '1px solid #e0e7ef',
          scrollMarginTop: '20px'
        }}
      >
        <h4 className="subtitle is-6 mb-3">
          {form.id ? '✏️ Modifier un commerce' : '➕ Ajouter un commerce'}
        </h4>

        <div className="columns is-multiline">
          <div className="column is-8">
            <div className="field mb-3">
              <label className="label is-small">Nom du commerce *</label>
              <div className="control">
                <input 
                  className="input" 
                  name="nom" 
                  placeholder="Ex: Boulangerie du Village" 
                  value={form.nom} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="field mb-3">
              <label className="label is-small">Description</label>
              <div className="control">
                <textarea 
                  className="textarea" 
                  name="description" 
                  placeholder="Description du commerce..." 
                  value={form.description} 
                  onChange={handleChange}
                  rows="2"
                ></textarea>
              </div>
            </div>

            <div className="field is-grouped mb-3">
              <div className="control is-expanded">
                <label className="label is-small">Adresse</label>
                <input 
                  className="input" 
                  name="adresse" 
                  placeholder="1 rue de la Mairie" 
                  value={form.adresse} 
                  onChange={handleChange} 
                />
              </div>
              <div className="control is-expanded">
                <label className="label is-small">Téléphone</label>
                <input 
                  className="input" 
                  name="telephone" 
                  placeholder="03 XX XX XX XX" 
                  value={form.telephone} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="field is-grouped">
              <div className="control is-expanded">
                <label className="label is-small">Horaires</label>
                <input 
                  className="input" 
                  name="horaires" 
                  placeholder="Lun-Sam : 8h-19h" 
                  value={form.horaires} 
                  onChange={handleChange} 
                />
              </div>
              <div className="control is-expanded">
                <label className="label is-small">Site web</label>
                <input 
                  className="input" 
                  name="site" 
                  placeholder="https://..." 
                  value={form.site} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          <div className="column is-4">
            <div className="field mb-3">
              <label className="label is-small">Catégorie</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select name="categorie" value={form.categorie} onChange={handleChange}>
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <label className="label is-small">Image / Logo</label>
            <div className="file has-name is-fullwidth mb-2">
              <label className="file-label">
                <input 
                  className="file-input" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <span className="file-cta">
                  <span className="file-icon">
                    {uploading ? '⏳' : '📎'}
                  </span>
                  <span className="file-label">
                    {uploading ? 'Envoi...' : 'Choisir une image...'}
                  </span>
                </span>
                <span className="file-name">
                  {preview ? 'Image OK' : 'Aucun fichier'}
                </span>
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
                disabled={uploading}
              />
            </div>

            {preview && (
              <figure className="image" style={{ maxWidth: 200 }}>
                <img
                  src={preview}
                  alt="Aperçu"
                  style={{ 
                    objectFit: 'contain', 
                    borderRadius: 8, 
                    border: '1px solid #eee',
                    background: '#fff'
                  }}
                  onError={(e) => { 
                    e.currentTarget.src = 'https://via.placeholder.com/200?text=Logo'; 
                  }}
                />
              </figure>
            )}
          </div>
        </div>

        <div className="field is-grouped mt-3">
          <div className="control">
            <button 
              className={`button is-link${loading || uploading ? ' is-loading' : ''}`} 
              type="submit" 
              disabled={loading || uploading}
              style={{ borderRadius: 8 }}
            >
              {form.id ? '💾 Enregistrer les modifications' : '➕ Ajouter le commerce'}
            </button>
          </div>
          {form.id && (
            <div className="control">
              <button 
                type="button" 
                className="button is-light" 
                onClick={resetForm} 
                disabled={loading}
                style={{ borderRadius: 8 }}
              >
                ❌ Annuler
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Liste des commerces */}
      <div className="box" style={{ 
        background: '#fff', 
        borderRadius: 12, 
        border: '1.5px solid #e0e7ef' 
      }}>
        <h4 className="subtitle is-6 mb-3">📋 Liste des commerces ({commerces.length})</h4>

        {commerces.length === 0 ? (
          <div className="notification is-light is-info is-size-7 py-2 px-3" style={{ borderRadius: 8 }}>
            Aucun commerce enregistré
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th style={{ width: 80 }}>Image</th>
                  <th>Nom</th>
                  <th>Catégorie</th>
                  <th>Contact</th>
                  <th className="has-text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {commerces.map(c => (
                  <tr key={c.id}>
                    <td>
                      {c.image ? (
                        <figure className="image is-64x64" style={{ margin: 0 }}>
                          <img 
                            src={c.image} 
                            alt={c.nom} 
                            style={{ 
                              objectFit: 'contain', 
                              borderRadius: 6,
                              background: '#fff'
                            }}
                            onError={(e) => { 
                              e.currentTarget.src = 'https://via.placeholder.com/64?text=Logo'; 
                            }}
                          />
                        </figure>
                      ) : (
                        <div style={{ 
                          width: 64, 
                          height: 64, 
                          background: '#f5f5f5', 
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 24
                        }}>
                          {getCategoryInfo(c.categorie).emoji}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="has-text-weight-semibold">{c.nom}</div>
                      {c.description && (
                        <div className="is-size-7 has-text-grey" style={{ 
                          maxWidth: 300, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}>
                          {c.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="tag" style={{ borderRadius: 6 }}>
                        {getCategoryInfo(c.categorie).emoji} {getCategoryInfo(c.categorie).label.replace(/🍎|🍽️|🛠️|🔨/g, '').trim()}
                      </span>
                    </td>
                    <td className="is-size-7">
                      {c.adresse && <div>📍 {c.adresse}</div>}
                      {c.telephone && <div>📞 {c.telephone}</div>}
                      {c.horaires && <div>🕒 {c.horaires}</div>}
                      {c.site && (
                        <div>
                          <a href={c.site} target="_blank" rel="noopener noreferrer" className="has-text-link">
                            🌐 Site web
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="has-text-right">
                      <div className="buttons are-small is-right mb-0">
                        <button 
                          className="button is-small is-info" 
                          onClick={() => handleEdit(c)} 
                          disabled={loading}
                          title="Modifier"
                        >
                          <span role="img" aria-label="Modifier">✏️</span>
                        </button>
                        <button 
                          className="button is-small is-danger" 
                          onClick={() => handleDelete(c.id)} 
                          disabled={loading}
                          title="Supprimer"
                        >
                          <span role="img" aria-label="Supprimer">🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={2500} newestOnTop />
    </div>
  );
}