import React, { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function IntercommunaliteEditor() {
  const [content, setContent] = useState({
    hero_titre: '',
    titre: '',
    intro: '',
    titre_organismes: '',
    titre_projets: '',
    titre_representants: '',
    organismes: [],
    projets: [],
    representants: [],
    contact: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [editingProj, setEditingProj] = useState(null);
  const [editingRep, setEditingRep] = useState(null);
  const formOrgRef = useRef(null);
  const formProjRef = useRef(null);
  const formRepRef = useRef(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = () => {
    fetch('/api/pageContent?page=intercommunalite')
      .then(res => res.json())
      .then(data => {
        const pageData = data[0] || {};
        setContent({
          hero_titre: pageData.hero_titre || '',
          titre: pageData.titre || '',
          intro: pageData.intro || '',
          titre_organismes: pageData.titre_organismes || '',
          titre_projets: pageData.titre_projets || '',
          titre_representants: pageData.titre_representants || '',
          organismes: pageData.organismes || [],
          projets: pageData.projets || [],
          representants: pageData.representants || [],
          contact: pageData.contact || ''
        });
      })
      .catch(() => toast.error('Erreur lors du chargement'));
  };

  // Handlers généraux
  const handleChange = e => setContent({ ...content, [e.target.name]: e.target.value });

  // Upload d'image
  const handleImageUpload = async (e, type, index = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.warn('Fichier trop lourd (> 5 Mo)');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    const toastId = toast.loading('Upload en cours...');

    try {
      const res = await fetch('/api/upload_doc', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Erreur upload');

      const { fileUrl } = await res.json();

      if (type === 'organisme' && index !== null) {
        handleOrgChange(index, 'logo', fileUrl);
      } else if (type === 'projet' && index !== null) {
        handleProjChange(index, 'image', fileUrl);
      }

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

  // Handlers Organismes
  const handleOrgChange = (i, field, value) => {
    const organismes = [...content.organismes];
    organismes[i][field] = value;
    setContent({ ...content, organismes });
  };

  const addOrg = () => {
    const newOrg = { nom: '', logo: '', description: '', siteWeb: '', competences: [] };
    setContent({ ...content, organismes: [...(content.organismes || []), newOrg] });
    setEditingOrg(content.organismes.length);
    setTimeout(() => {
      formOrgRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const editOrg = (index) => {
    setEditingOrg(index);
    setTimeout(() => {
      formOrgRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const removeOrg = (index) => {
    const org = content.organismes[index];
    toast.info(
      <div>
        <p>Supprimer "{org.nom || 'cet organisme'}" ?</p>
        <div className="buttons mt-3">
          <button
            className="button is-danger is-small"
            onClick={() => {
              toast.dismiss();
              setContent({ ...content, organismes: content.organismes.filter((_, i) => i !== index) });
              if (editingOrg === index) setEditingOrg(null);
              toast.success('Organisme supprimé', { autoClose: 2000 });
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

  const cancelEditOrg = () => setEditingOrg(null);

  // Handlers Projets
  const handleProjChange = (i, field, value) => {
    const projets = [...content.projets];
    projets[i][field] = value;
    setContent({ ...content, projets });
  };

  const addProj = () => {
    const newProj = { titre: '', image: '', structure: '', description: '' };
    setContent({ ...content, projets: [...(content.projets || []), newProj] });
    setEditingProj(content.projets.length);
    setTimeout(() => {
      formProjRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const editProj = (index) => {
    setEditingProj(index);
    setTimeout(() => {
      formProjRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const removeProj = (index) => {
    const proj = content.projets[index];
    toast.info(
      <div>
        <p>Supprimer "{proj.titre || 'ce projet'}" ?</p>
        <div className="buttons mt-3">
          <button
            className="button is-danger is-small"
            onClick={() => {
              toast.dismiss();
              setContent({ ...content, projets: content.projets.filter((_, i) => i !== index) });
              if (editingProj === index) setEditingProj(null);
              toast.success('Projet supprimé', { autoClose: 2000 });
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

  const cancelEditProj = () => setEditingProj(null);

  // Handlers Représentants
  const handleRepChange = (i, field, value) => {
    const representants = [...content.representants];
    representants[i][field] = value;
    setContent({ ...content, representants });
  };

  const addRep = () => {
    const newRep = { structure: '', titulaires: '', suppleants: '' };
    setContent({ ...content, representants: [...(content.representants || []), newRep] });
    setEditingRep(content.representants.length);
    setTimeout(() => {
      formRepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const editRep = (index) => {
    setEditingRep(index);
    setTimeout(() => {
      formRepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const removeRep = (index) => {
    const rep = content.representants[index];
    toast.info(
      <div>
        <p>Supprimer "{rep.structure || 'ce représentant'}" ?</p>
        <div className="buttons mt-3">
          <button
            className="button is-danger is-small"
            onClick={() => {
              toast.dismiss();
              setContent({ ...content, representants: content.representants.filter((_, i) => i !== index) });
              if (editingRep === index) setEditingRep(null);
              toast.success('Représentant supprimé', { autoClose: 2000 });
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

  const cancelEditRep = () => setEditingRep(null);

  // Sauvegarde
  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Enregistrement...');

    try {
      const res = await fetch('/api/pageContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'intercommunalite',
          ...content
        })
      });

      if (!res.ok) throw new Error('Erreur');

      toast.update(toastId, {
        render: 'Modifications enregistrées !',
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
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 32 }}>
      <div className="box" style={{
        borderRadius: 14,
        background: '#fafdff',
        border: '1.5px solid #e0e7ef',
        boxShadow: '0 2px 12px #e0e7ef33'
      }}>
        <h2 className="title is-4 has-text-link mb-4" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 10,
          textAlign: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: 28 }}>🗂️</span> Gestion de la page Intercommunalité
        </h2>

        <form onSubmit={handleSave}>
          {/* Sections générales */}
          <div className="box mb-4" style={{ 
            borderRadius: 12, 
            border: '1.5px solid #e0e7ef', 
            background: '#fff' 
          }}>
            <h3 className="subtitle is-5 mb-3" style={{ color: '#1277c6', fontWeight: 700 }}>
              📄 Sections générales
            </h3>
            <div className="field mb-3">
              <label className="label is-small">Titre Hero</label>
              <input
                className="input"
                name="hero_titre"
                placeholder="Ex: Intercommunalité et partenaires"
                value={content.hero_titre}
                onChange={handleChange}
              />
            </div>
            <div className="field mb-3">
              <label className="label is-small">Titre principal</label>
              <input
                className="input"
                name="titre"
                placeholder="Ex: Intercommunalité et partenaires territoriaux"
                value={content.titre}
                onChange={handleChange}
              />
            </div>
            <div className="field mb-3">
              <label className="label is-small">Introduction</label>
              <textarea
                className="textarea"
                name="intro"
                placeholder="Texte d'introduction..."
                value={content.intro}
                onChange={handleChange}
                rows="4"
              ></textarea>
            </div>
            <div className="field">
              <label className="label is-small">Texte de contact</label>
              <input
                className="input"
                name="contact"
                placeholder="Ex: Pour plus d'informations, contactez la mairie"
                value={content.contact}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ORGANISMES */}
          <div className="box mb-4" style={{ 
            borderRadius: 12, 
            border: '1.5px solid #e0e7ef', 
            background: '#fff' 
          }}>
            <h3 className="subtitle is-5 mb-3" style={{ color: '#1277c6', fontWeight: 700 }}>
              🏢 Organismes intercommunaux
            </h3>
            <div className="field mb-3">
              <label className="label is-small">Titre de la section</label>
              <input
                className="input"
                name="titre_organismes"
                placeholder="Ex: Organismes intercommunaux"
                value={content.titre_organismes}
                onChange={handleChange}
              />
            </div>

            {/* Formulaire d'édition */}
            {editingOrg !== null && (
              <div 
                ref={formOrgRef}
                className="box mb-4" 
                style={{
                  background: '#f0f9ff',
                  borderRadius: 12,
                  border: '2px solid #1277c6',
                  scrollMarginTop: '20px'
                }}
              >
                <h4 className="subtitle is-6 mb-3">
                  {editingOrg === content.organismes.length - 1 && !content.organismes[editingOrg]?.nom
                    ? '➕ Nouvel organisme'
                    : '✏️ Modifier l\'organisme'}
                </h4>

                <div className="columns is-multiline">
                  <div className="column is-8">
                    <div className="field mb-3">
                      <label className="label is-small">Nom de l'organisme *</label>
                      <input
                        className="input"
                        placeholder="Ex: Communauté de Communes du Pays de..."
                        value={content.organismes[editingOrg]?.nom || ''}
                        onChange={e => handleOrgChange(editingOrg, 'nom', e.target.value)}
                        required
                      />
                    </div>

                    <div className="field mb-3">
                      <label className="label is-small">Site web</label>
                      <input
                        className="input"
                        placeholder="https://..."
                        value={content.organismes[editingOrg]?.siteWeb || ''}
                        onChange={e => handleOrgChange(editingOrg, 'siteWeb', e.target.value)}
                      />
                    </div>

                    <div className="field mb-3">
                      <label className="label is-small">Description</label>
                      <textarea
                        className="textarea"
                        placeholder="Description de l'organisme..."
                        value={content.organismes[editingOrg]?.description || ''}
                        onChange={e => handleOrgChange(editingOrg, 'description', e.target.value)}
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="field">
                      <label className="label is-small">Compétences (une par ligne)</label>
                      <textarea
                        className="textarea"
                        placeholder="Gestion des déchets&#10;Développement économique&#10;..."
                        value={content.organismes[editingOrg]?.competences?.join('\n') || ''}
                        onChange={e => handleOrgChange(editingOrg, 'competences', e.target.value.split('\n').filter(c => c.trim()))}
                        rows="4"
                      ></textarea>
                    </div>
                  </div>

                  <div className="column is-4">
                    <label className="label is-small">Logo</label>
                    <div className="file has-name is-fullwidth mb-2">
                      <label className="file-label">
                        <input
                          className="file-input"
                          type="file"
                          accept="image/*"
                          onChange={e => handleImageUpload(e, 'organisme', editingOrg)}
                          disabled={uploading}
                        />
                        <span className="file-cta">
                          <span className="file-icon">{uploading ? '⏳' : '📎'}</span>
                          <span className="file-label">{uploading ? 'Upload...' : 'Choisir...'}</span>
                        </span>
                        <span className="file-name">
                          {content.organismes[editingOrg]?.logo ? 'Image OK' : 'Aucun fichier'}
                        </span>
                      </label>
                    </div>

                    <div className="control mb-2">
                      <input
                        className="input"
                        placeholder="Ou URL d'image"
                        value={content.organismes[editingOrg]?.logo || ''}
                        onChange={e => handleOrgChange(editingOrg, 'logo', e.target.value)}
                        disabled={uploading}
                      />
                    </div>

                    {content.organismes[editingOrg]?.logo && (
                      <figure className="image" style={{ maxWidth: 200 }}>
                        <img
                          src={content.organismes[editingOrg].logo}
                          alt="Logo"
                          style={{
                            objectFit: 'contain',
                            borderRadius: 8,
                            border: '1px solid #eee',
                            background: '#fff',
                            padding: '0.5rem'
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
                      type="button"
                      className="button is-light"
                      onClick={cancelEditOrg}
                      disabled={loading || uploading}
                      style={{ borderRadius: 8 }}
                    >
                      ❌ Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Liste des organismes */}
            <div className="box" style={{ 
              background: '#f8fafc', 
              borderRadius: 12, 
              border: '1.5px solid #e0e7ef' 
            }}>
              <h4 className="subtitle is-6 mb-3">
                📋 Liste des organismes ({content.organismes?.length || 0})
              </h4>

              {(!content.organismes || content.organismes.length === 0) ? (
                <div className="notification is-light is-info is-size-7 py-2 px-3" style={{ borderRadius: 8 }}>
                  Aucun organisme enregistré
                </div>
              ) : (
                <div className="columns is-multiline">
                  {content.organismes.map((org, index) => (
                    <div className="column is-full" key={index}>
                      <div className="box" style={{
                        background: '#ffffff',
                        borderRadius: 12,
                        border: '1px solid #e0e7ef',
                        padding: '1rem'
                      }}>
                        <div className="is-flex is-justify-content-space-between is-align-items-start mb-2">
                          <div className="is-flex is-align-items-center" style={{ gap: '1rem', flex: 1 }}>
                            {org.logo && (
                              <figure className="image" style={{ width: 64, height: 64, flexShrink: 0 }}>
                                <img
                                  src={org.logo}
                                  alt={org.nom}
                                  style={{
                                    objectFit: 'contain',
                                    borderRadius: 8,
                                    border: '1px solid #eee',
                                    background: '#fff',
                                    padding: '0.25rem'
                                  }}
                                />
                              </figure>
                            )}
                            <div>
                              <h3 className="title is-5 has-text-link mb-1">{org.nom}</h3>
                              {org.description && (
                                <p className="is-size-7 has-text-grey">{org.description.substring(0, 100)}...</p>
                              )}
                            </div>
                          </div>
                          <div className="buttons are-small mb-0">
                            <button
                              type="button"
                              className="button is-small is-info"
                              onClick={() => editOrg(index)}
                              disabled={loading}
                              title="Modifier"
                            >
                              <span role="img" aria-label="Modifier">✏️</span>
                            </button>
                            <button
                              type="button"
                              className="button is-small is-danger"
                              onClick={() => removeOrg(index)}
                              disabled={loading}
                              title="Supprimer"
                            >
                              <span role="img" aria-label="Supprimer">🗑️</span>
                            </button>
                          </div>
                        </div>

                        {org.competences && org.competences.length > 0 && (
                          <div className="tags mt-2">
                            {org.competences.slice(0, 3).map((comp, i) => (
                              <span key={i} className="tag is-info is-light is-small">{comp}</span>
                            ))}
                            {org.competences.length > 3 && (
                              <span className="tag is-light is-small">+{org.competences.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="button is-link is-light mt-3"
                onClick={addOrg}
                disabled={loading || uploading}
                style={{ borderRadius: 8 }}
              >
                <span style={{ marginRight: 6 }}>➕</span> Ajouter un organisme
              </button>
            </div>
          </div>

          {/* PROJETS */}
          <div className="box mb-4" style={{ 
            borderRadius: 12, 
            border: '1.5px solid #e0e7ef', 
            background: '#fff' 
          }}>
            <h3 className="subtitle is-5 mb-3" style={{ color: '#1277c6', fontWeight: 700 }}>
              🛠️ Projets intercommunaux
            </h3>
            <div className="field mb-3">
              <label className="label is-small">Titre de la section</label>
              <input
                className="input"
                name="titre_projets"
                placeholder="Ex: Projets intercommunaux en cours"
                value={content.titre_projets}
                onChange={handleChange}
              />
            </div>

            {/* Formulaire d'édition */}
            {editingProj !== null && (
              <div 
                ref={formProjRef}
                className="box mb-4" 
                style={{
                  background: '#f0f9ff',
                  borderRadius: 12,
                  border: '2px solid #1277c6',
                  scrollMarginTop: '20px'
                }}
              >
                <h4 className="subtitle is-6 mb-3">
                  {editingProj === content.projets.length - 1 && !content.projets[editingProj]?.titre
                    ? '➕ Nouveau projet'
                    : '✏️ Modifier le projet'}
                </h4>

                <div className="columns is-multiline">
                  <div className="column is-8">
                    <div className="field mb-3">
                      <label className="label is-small">Titre du projet *</label>
                      <input
                        className="input"
                        placeholder="Ex: Nouvelle déchetterie intercommunale"
                        value={content.projets[editingProj]?.titre || ''}
                        onChange={e => handleProjChange(editingProj, 'titre', e.target.value)}
                        required
                      />
                    </div>

                    <div className="field mb-3">
                      <label className="label is-small">Structure porteuse</label>
                      <input
                        className="input"
                        placeholder="Ex: Communauté de Communes"
                        value={content.projets[editingProj]?.structure || ''}
                        onChange={e => handleProjChange(editingProj, 'structure', e.target.value)}
                      />
                    </div>

                    <div className="field">
                      <label className="label is-small">Description</label>
                      <textarea
                        className="textarea"
                        placeholder="Description du projet..."
                        value={content.projets[editingProj]?.description || ''}
                        onChange={e => handleProjChange(editingProj, 'description', e.target.value)}
                        rows="4"
                      ></textarea>
                    </div>
                  </div>

                  <div className="column is-4">
                    <label className="label is-small">Image du projet</label>
                    <div className="file has-name is-fullwidth mb-2">
                      <label className="file-label">
                        <input
                          className="file-input"
                          type="file"
                          accept="image/*"
                          onChange={e => handleImageUpload(e, 'projet', editingProj)}
                          disabled={uploading}
                        />
                        <span className="file-cta">
                          <span className="file-icon">{uploading ? '⏳' : '📎'}</span>
                          <span className="file-label">{uploading ? 'Upload...' : 'Choisir...'}</span>
                        </span>
                        <span className="file-name">
                          {content.projets[editingProj]?.image ? 'Image OK' : 'Aucun fichier'}
                        </span>
                      </label>
                    </div>

                    <div className="control mb-2">
                      <input
                        className="input"
                        placeholder="Ou URL d'image"
                        value={content.projets[editingProj]?.image || ''}
                        onChange={e => handleProjChange(editingProj, 'image', e.target.value)}
                        disabled={uploading}
                      />
                    </div>

                    {content.projets[editingProj]?.image && (
                      <figure className="image" style={{ maxWidth: 200 }}>
                        <img
                          src={content.projets[editingProj].image}
                          alt="Projet"
                          style={{
                            objectFit: 'cover',
                            borderRadius: 8,
                            border: '1px solid #eee',
                            aspectRatio: '16/9'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/200?text=Projet';
                          }}
                        />
                      </figure>
                    )}
                  </div>
                </div>

                <div className="field is-grouped mt-3">
                  <div className="control">
                    <button
                      type="button"
                      className="button is-light"
                      onClick={cancelEditProj}
                      disabled={loading || uploading}
                      style={{ borderRadius: 8 }}
                    >
                      ❌ Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Liste des projets */}
            <div className="box" style={{ 
              background: '#f8fafc', 
              borderRadius: 12, 
              border: '1.5px solid #e0e7ef' 
            }}>
              <h4 className="subtitle is-6 mb-3">
                📋 Liste des projets ({content.projets?.length || 0})
              </h4>

              {(!content.projets || content.projets.length === 0) ? (
                <div className="notification is-light is-info is-size-7 py-2 px-3" style={{ borderRadius: 8 }}>
                  Aucun projet enregistré
                </div>
              ) : (
                <div className="columns is-multiline">
                  {content.projets.map((proj, index) => (
                    <div className="column is-half" key={index}>
                      <div className="box" style={{
                        background: '#ffffff',
                        borderRadius: 12,
                        border: '1px solid #e0e7ef',
                        padding: '1rem'
                      }}>
                        <div className="is-flex is-justify-content-space-between is-align-items-start mb-2">
                          <div>
                            <h3 className="title is-6 has-text-link mb-1">{proj.titre}</h3>
                            {proj.structure && (
                              <p className="is-size-7 has-text-grey mb-2">{proj.structure}</p>
                            )}
                            {proj.description && (
                              <p className="is-size-7">{proj.description.substring(0, 80)}...</p>
                            )}
                          </div>
                          <div className="buttons are-small mb-0" style={{ marginLeft: '1rem', flexShrink: 0 }}>
                            <button
                              type="button"
                              className="button is-small is-info"
                              onClick={() => editProj(index)}
                              disabled={loading}
                              title="Modifier"
                            >
                              <span role="img" aria-label="Modifier">✏️</span>
                            </button>
                            <button
                              type="button"
                              className="button is-small is-danger"
                              onClick={() => removeProj(index)}
                              disabled={loading}
                              title="Supprimer"
                            >
                              <span role="img" aria-label="Supprimer">🗑️</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="button is-link is-light mt-3"
                onClick={addProj}
                disabled={loading || uploading}
                style={{ borderRadius: 8 }}
              >
                <span style={{ marginRight: 6 }}>➕</span> Ajouter un projet
              </button>
            </div>
          </div>

          {/* REPRÉSENTANTS */}
          <div className="box mb-4" style={{ 
            borderRadius: 12, 
            border: '1.5px solid #e0e7ef', 
            background: '#fff' 
          }}>
            <h3 className="subtitle is-5 mb-3" style={{ color: '#1277c6', fontWeight: 700 }}>
              👥 Représentants
            </h3>
            <div className="field mb-3">
              <label className="label is-small">Titre de la section</label>
              <input
                className="input"
                name="titre_representants"
                placeholder="Ex: Représentants de Friesen"
                value={content.titre_representants}
                onChange={handleChange}
              />
            </div>

            {/* Formulaire d'édition */}
            {editingRep !== null && (
              <div 
                ref={formRepRef}
                className="box mb-4" 
                style={{
                  background: '#f0f9ff',
                  borderRadius: 12,
                  border: '2px solid #1277c6',
                  scrollMarginTop: '20px'
                }}
              >
                <h4 className="subtitle is-6 mb-3">
                  {editingRep === content.representants.length - 1 && !content.representants[editingRep]?.structure
                    ? '➕ Nouveau représentant'
                    : '✏️ Modifier le représentant'}
                </h4>

                <div className="field mb-3">
                  <label className="label is-small">Structure *</label>
                  <input
                    className="input"
                    placeholder="Ex: Communauté de Communes"
                    value={content.representants[editingRep]?.structure || ''}
                    onChange={e => handleRepChange(editingRep, 'structure', e.target.value)}
                    required
                  />
                </div>

                <div className="field mb-3">
                  <label className="label is-small">Délégués titulaires</label>
                  <input
                    className="input"
                    placeholder="Ex: M. Dupont, Mme Martin"
                    value={content.representants[editingRep]?.titulaires || ''}
                    onChange={e => handleRepChange(editingRep, 'titulaires', e.target.value)}
                  />
                </div>

                <div className="field mb-3">
                  <label className="label is-small">Délégués suppléants</label>
                  <input
                    className="input"
                    placeholder="Ex: M. Bernard, Mme Durand"
                    value={content.representants[editingRep]?.suppleants || ''}
                    onChange={e => handleRepChange(editingRep, 'suppleants', e.target.value)}
                  />
                </div>

                <div className="field is-grouped mt-3">
                  <div className="control">
                    <button
                      type="button"
                      className="button is-light"
                      onClick={cancelEditRep}
                      disabled={loading}
                      style={{ borderRadius: 8 }}
                    >
                      ❌ Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Liste des représentants */}
            <div className="box" style={{ 
              background: '#f8fafc', 
              borderRadius: 12, 
              border: '1.5px solid #e0e7ef' 
            }}>
              <h4 className="subtitle is-6 mb-3">
                📋 Liste des représentants ({content.representants?.length || 0})
              </h4>

              {(!content.representants || content.representants.length === 0) ? (
                <div className="notification is-light is-info is-size-7 py-2 px-3" style={{ borderRadius: 8 }}>
                  Aucun représentant enregistré
                </div>
              ) : (
                <div className="table-container">
                  <table className="table is-fullwidth is-hoverable" style={{ background: '#ffffff' }}>
                    <thead>
                      <tr style={{ background: '#f0f9ff' }}>
                        <th>Structure</th>
                        <th>Titulaires</th>
                        <th>Suppléants</th>
                        <th style={{ width: 100 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.representants.map((rep, index) => (
                        <tr key={index}>
                          <td><strong>{rep.structure}</strong></td>
                          <td>{rep.titulaires}</td>
                          <td>{rep.suppleants}</td>
                          <td>
                            <div className="buttons are-small mb-0">
                              <button
                                type="button"
                                className="button is-small is-info"
                                onClick={() => editRep(index)}
                                disabled={loading}
                                title="Modifier"
                              >
                                <span role="img" aria-label="Modifier">✏️</span>
                              </button>
                              <button
                                type="button"
                                className="button is-small is-danger"
                                onClick={() => removeRep(index)}
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

              <button
                type="button"
                className="button is-link is-light mt-3"
                onClick={addRep}
                disabled={loading}
                style={{ borderRadius: 8 }}
              >
                <span style={{ marginRight: 6 }}>➕</span> Ajouter un représentant
              </button>
            </div>
          </div>

          {/* Bouton de sauvegarde */}
          <div className="field is-grouped mt-5" style={{ justifyContent: 'center' }}>
            <div className="control">
              <button 
                className={`button is-link is-medium${loading ? ' is-loading' : ''}`} 
                type="submit" 
                disabled={loading || uploading}
                style={{ borderRadius: 10, fontWeight: 600, padding: '0.75rem 2rem' }}
              >
                <span style={{ marginRight: 8 }}>💾</span>
                Enregistrer toutes les modifications
              </button>
            </div>
          </div>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={2500} newestOnTop />
    </div>
  );
}