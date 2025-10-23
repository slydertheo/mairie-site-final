import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MarchesCrud() {
  const [marches, setMarches] = useState([]);
  const [form, setForm] = useState({ 
    titre: '', 
    texte: '', 
    adresse: '', 
    jour: '', 
    horaires: '', 
    produits: '', 
    image: '', 
    id: null 
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    loadMarches();
  }, []);

  const loadMarches = () => {
    fetch('/api/marches')
      .then(res => res.json())
      .then(setMarches)
      .catch(() => toast.error('Erreur lors du chargement des marchés'));
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.warn('Fichier trop lourd (> 5 Mo)');
      return;
    }

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

    if (!form.titre.trim()) {
      toast.error('Le titre est obligatoire');
      return;
    }

    setLoading(true);
    const toastId = toast.loading(form.id ? 'Modification...' : 'Ajout...');

    try {
      const res = await fetch('/api/marches', {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Erreur');

      toast.update(toastId, {
        render: form.id ? 'Marché modifié !' : 'Marché ajouté !',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });

      resetForm();
      loadMarches();
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

  const handleEdit = m => {
    setForm(m);
    setPreview(m.image || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const marche = marches.find(m => m.id === id);
    if (!marche) return;

    toast.info(
      <div>
        <p>Supprimer "{marche.titre}" ?</p>
        <div className="buttons mt-3">
          <button
            className="button is-danger is-small"
            onClick={async () => {
              toast.dismiss();
              const toastId = toast.loading('Suppression...');

              try {
                await fetch('/api/marches', {
                  method: 'DELETE',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id })
                });

                toast.update(toastId, {
                  render: 'Marché supprimé',
                  type: 'success',
                  isLoading: false,
                  autoClose: 2000
                });

                if (form.id === id) resetForm();
                loadMarches();
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
      titre: '', 
      texte: '', 
      adresse: '', 
      jour: '', 
      horaires: '', 
      produits: '', 
      image: '', 
      id: null 
    });
    setPreview('');
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
        <span style={{ fontSize: 28 }}>🛒</span> Gestion des marchés
      </h2>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="box mb-4" style={{ 
        background: '#f9fbfd', 
        borderRadius: 8, 
        border: '1px solid #e0e7ef' 
      }}>
        <h4 className="subtitle is-6 mb-3">
          {form.id ? '✏️ Modifier un marché' : '➕ Ajouter un marché'}
        </h4>

        <div className="columns is-multiline">
          <div className="column is-8">
            <div className="field mb-3">
              <label className="label is-small">Titre du marché *</label>
              <div className="control">
                <input 
                  className="input" 
                  name="titre" 
                  placeholder="Ex: Marché hebdomadaire de Friesen" 
                  value={form.titre} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="field mb-3">
              <label className="label is-small">Description / Introduction</label>
              <div className="control">
                <textarea 
                  className="textarea" 
                  name="texte" 
                  placeholder="Description du marché..." 
                  value={form.texte} 
                  onChange={handleChange}
                  rows="2"
                ></textarea>
              </div>
            </div>

            <div className="field is-grouped mb-3">
              <div className="control is-expanded">
                <label className="label is-small">📍 Adresse</label>
                <input 
                  className="input" 
                  name="adresse" 
                  placeholder="Place de la Mairie" 
                  value={form.adresse} 
                  onChange={handleChange} 
                />
              </div>
              <div className="control is-expanded">
                <label className="label is-small">🗓️ Jour</label>
                <input 
                  className="input" 
                  name="jour" 
                  placeholder="Tous les mercredis" 
                  value={form.jour} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="field mb-3">
              <label className="label is-small">🕒 Horaires</label>
              <div className="control">
                <input 
                  className="input" 
                  name="horaires" 
                  placeholder="8h00 - 13h00" 
                  value={form.horaires} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="field">
              <label className="label is-small">🛍️ Produits proposés</label>
              <div className="control">
                <textarea 
                  className="textarea" 
                  name="produits" 
                  placeholder="Fruits et légumes, fromages, viandes, pains..." 
                  value={form.produits} 
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="column is-4">
            <label className="label is-small">Image du marché</label>
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
              <figure className="image" style={{ maxWidth: 250 }}>
                <img
                  src={preview}
                  alt="Aperçu"
                  style={{ 
                    objectFit: 'cover', 
                    borderRadius: 8, 
                    border: '1px solid #eee',
                    aspectRatio: '16/9'
                  }}
                  onError={(e) => { 
                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Marché'; 
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
              {form.id ? '💾 Enregistrer les modifications' : '➕ Ajouter le marché'}
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

      {/* Liste des marchés */}
      <div className="box" style={{ 
        background: '#fff', 
        borderRadius: 12, 
        border: '1.5px solid #e0e7ef' 
      }}>
        <h4 className="subtitle is-6 mb-3">📋 Liste des marchés ({marches.length})</h4>

        {marches.length === 0 ? (
          <div className="notification is-light is-info is-size-7 py-2 px-3" style={{ borderRadius: 8 }}>
            Aucun marché enregistré
          </div>
        ) : (
          <div className="columns is-multiline">
            {marches.map(m => (
              <div className="column is-full" key={m.id}>
                <div className="box" style={{ 
                  background: '#f9fbfd', 
                  borderRadius: 8, 
                  border: '1px solid #e0e7ef',
                  padding: '1rem'
                }}>
                  <div className="columns is-vcentered">
                    {m.image && (
                      <div className="column is-4">
                        <figure className="image is-16by9" style={{ borderRadius: 8, overflow: 'hidden' }}>
                          <img 
                            src={m.image} 
                            alt={m.titre} 
                            style={{ 
                              objectFit: 'cover', 
                              width: '100%',
                              height: '100%'
                            }}
                            onError={(e) => { 
                              e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Marché'; 
                            }}
                          />
                        </figure>
                      </div>
                    )}
                    <div className={`column ${m.image ? 'is-8' : 'is-full'}`}>
                      <div className="is-flex is-justify-content-space-between is-align-items-start mb-2">
                        <h3 className="title is-5 has-text-link mb-0">{m.titre}</h3>
                        <div className="buttons are-small mb-0">
                          <button 
                            className="button is-small is-info" 
                            onClick={() => handleEdit(m)} 
                            disabled={loading}
                            title="Modifier"
                          >
                            <span role="img" aria-label="Modifier">✏️</span>
                          </button>
                          <button 
                            className="button is-small is-danger" 
                            onClick={() => handleDelete(m.id)} 
                            disabled={loading}
                            title="Supprimer"
                          >
                            <span role="img" aria-label="Supprimer">🗑️</span>
                          </button>
                        </div>
                      </div>

                      {m.texte && (
                        <p className="mb-2 has-text-grey-dark">{m.texte}</p>
                      )}

                      <div className="content is-small">
                        {m.adresse && (
                          <p className="mb-1">
                            <span style={{ fontSize: 16, marginRight: 6 }}>📍</span>
                            <strong>Lieu :</strong> {m.adresse}
                          </p>
                        )}
                        {m.jour && (
                          <p className="mb-1">
                            <span style={{ fontSize: 16, marginRight: 6 }}>🗓️</span>
                            <strong>Jour :</strong> {m.jour}
                          </p>
                        )}
                        {m.horaires && (
                          <p className="mb-1">
                            <span style={{ fontSize: 16, marginRight: 6 }}>🕒</span>
                            <strong>Horaires :</strong> {m.horaires}
                          </p>
                        )}
                        {m.produits && (
                          <div className="notification is-success is-light mt-2 mb-0" style={{ 
                            borderRadius: 6, 
                            padding: '0.75rem' 
                          }}>
                            <p className="mb-0">
                              <span style={{ fontSize: 16, marginRight: 6 }}>🛍️</span>
                              <strong>Produits proposés :</strong> {m.produits}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={2500} newestOnTop />
    </div>
  );
}