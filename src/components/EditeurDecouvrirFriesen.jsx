import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditeurDecouvrirFriesen() {
  const [content, setContent] = useState({
    introVillage: "",
    guideBouton: "",
    guidePlan: "",
    accrocheVillage: "",
    infosVisiteGuidee: [],
    titrePedestre: "",
    textePedestre: "",
    circuitsPedestres: [],
    titreVTT: "",
    texteVTT: "",
    circuitsVTT: [],
    locationVTT: "",
    locationVTTInfos: [],
    consignesTitre: "",
    consignes: [],
    titreInstallations: "",
    texteInstallations: "",
    installationsSportives: [],
    equipementsSportifs: "",
    equipementsSportifsInfos: [],
    officeTourisme: {
      adresse: "",
      tel: "",
      email: "",
      horaires: "",
      site: "",
      image: ""
    },
    infosPratiques: [],
    pointsInteret: [],
    lienInfosPratiques: ""
  });
  const [loading, setLoading] = useState(false);
  const [savingSection, setSavingSection] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetch('/api/pageContent?page=decouvrir_friesen')
      .then(res => res.json())
      .then(data => {
        setContent({ ...content, ...(data[0] || {}) });
      })
      .catch(() => toast.error('Erreur lors du chargement'));
    // eslint-disable-next-line
  }, []);

  const handleListChange = (section, idx, field, value) => {
    const arr = [...content[section]];
    arr[idx][field] = value;
    setContent({ ...content, [section]: arr });
  };
  
  const addListItem = (section, template) => {
    setContent({ ...content, [section]: [...content[section], template] });
  };
  
  const removeListItem = (section, idx, itemName) => {
    toast.info(
      <div>
        <p className="mb-2">Supprimer <strong>{itemName}</strong> ?</p>
        <div className="buttons mt-3">
          <button
            className="button is-danger is-small"
            onClick={() => {
              toast.dismiss();
              setContent({ ...content, [section]: content[section].filter((_, i) => i !== idx) });
              toast.success('Élément supprimé', { autoClose: 2000 });
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

  // Upload d'image
  const handleImageUpload = async (section, index, field) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image trop volumineuse (max 5MB)');
        return;
      }

      setUploadingImage(true);
      const toastId = toast.loading('Upload de l\'image...');

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload_doc', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.fileUrl) {
          handleListChange(section, index, field, data.fileUrl);
          toast.update(toastId, {
            render: '✅ Image uploadée !',
            type: 'success',
            isLoading: false,
            autoClose: 2000
          });
        } else {
          throw new Error('Erreur upload');
        }
      } catch (error) {
        console.error('Erreur upload:', error);
        toast.update(toastId, {
          render: '❌ Erreur lors de l\'upload',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        });
      } finally {
        setUploadingImage(false);
      }
    };

    input.click();
  };

  // Upload d'image pour l'office du tourisme
  const handleOfficeTourismeImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image trop volumineuse (max 5MB)');
        return;
      }

      setUploadingImage(true);
      const toastId = toast.loading('Upload de l\'image...');

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload_doc', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.fileUrl) {
          setContent({ 
            ...content, 
            officeTourisme: { 
              ...content.officeTourisme, 
              image: data.fileUrl 
            } 
          });
          toast.update(toastId, {
            render: '✅ Image uploadée !',
            type: 'success',
            isLoading: false,
            autoClose: 2000
          });
        } else {
          throw new Error('Erreur upload');
        }
      } catch (error) {
        console.error('Erreur upload:', error);
        toast.update(toastId, {
          render: '❌ Erreur lors de l\'upload',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        });
      } finally {
        setUploadingImage(false);
      }
    };

    input.click();
  };

  const saveSection = async (section) => {
    setSavingSection(section);
    const toastId = toast.loading('Enregistrement...');

    try {
      const res = await fetch('/api/pageContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'decouvrir_friesen',
          ...content
        })
      });

      if (!res.ok) throw new Error('Erreur');

      toast.update(toastId, {
        render: '✅ Section enregistrée !',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });
    } catch (err) {
      toast.update(toastId, {
        render: '❌ Erreur lors de l\'enregistrement',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setSavingSection(null);
    }
  };

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Enregistrement global...');

    try {
      await fetch('/api/pageContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'decouvrir_friesen',
          ...content
        })
      });

      toast.update(toastId, {
        render: '✅ Modifications enregistrées !',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });
    } catch (err) {
      toast.update(toastId, {
        render: '❌ Erreur lors de l\'enregistrement',
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
        borderRadius: 16,
        background: '#fafdff',
        boxShadow: '0 2px 16px #e0e7ef',
        padding: '32px 24px'
      }}>
        <h1 className="title is-4 has-text-link mb-5" style={{ textAlign: 'center', letterSpacing: 1 }}>
          🏞️ Éditeur - Découvrir Friesen
        </h1>
        <form onSubmit={handleSave}>
          {/* Guide de visite */}
          <div className="box mb-6">
            <h2 className="title is-4 has-text-link mb-4">🏞️ Guide de visite</h2>
            <label className="label">Accroche village</label>
            <input className="input mb-2" value={content.accrocheVillage} onChange={e => setContent({ ...content, accrocheVillage: e.target.value })} />
            <label className="label">Texte d'introduction</label>
            <textarea className="textarea mb-2" value={content.introVillage} onChange={e => setContent({ ...content, introVillage: e.target.value })} />
            <label className="label">Infos visites guidées (une ligne par info)</label>
            <textarea className="textarea mb-2" value={(content.infosVisiteGuidee || []).join('\n')}
              onChange={e => setContent({ ...content, infosVisiteGuidee: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })} rows={6} />
            <label className="label">Texte bouton PDF</label>
            <input className="input mb-2" value={content.guideBouton} onChange={e => setContent({ ...content, guideBouton: e.target.value })} />
            <label className="label">Texte bouton plan</label>
            <input className="input mb-2" value={content.guidePlan} onChange={e => setContent({ ...content, guidePlan: e.target.value })} />
          </div>

          {/* Informations pratiques */}
          <div className="box mb-6">
            <h2 className="title is-4 has-text-grey mb-4">ℹ️ Informations pratiques</h2>
            <label className="label">Lien du bouton "Toutes les informations pratiques" (optionnel)</label>
            <input 
              className="input mb-4" 
              value={content.lienInfosPratiques || ''} 
              onChange={e => setContent({ ...content, lienInfosPratiques: e.target.value })} 
              placeholder="/infos-pratiques ou https://..."
            />
            {content.infosPratiques.map((info, i) => (
              <div key={i} className="box mb-3" style={{ background: "#f9fbfd", borderRadius: 12, border: '1.5px solid #e0e7ef' }}>
                <div className="is-flex is-justify-content-space-between mb-2">
                  <span className="tag is-info is-light">Info #{i + 1}</span>
                  <button 
                    type="button" 
                    className="button is-small is-danger"
                    onClick={() => removeListItem('infosPratiques', i, info.titre || 'cette information')}
                    disabled={savingSection !== null}
                    title="Supprimer"
                  >
                    <span role="img" aria-label="Supprimer">🗑️</span>
                  </button>
                </div>
                <label className="label">Emoji (optionnel)</label>
                <input 
                  className="input mb-2" 
                  value={info.emoji || ''} 
                  onChange={e => handleListChange('infosPratiques', i, 'emoji', e.target.value)} 
                  placeholder="ℹ️"
                />
                <label className="label">Titre</label>
                <input 
                  className="input mb-2" 
                  value={info.titre} 
                  onChange={e => handleListChange('infosPratiques', i, 'titre', e.target.value)} 
                />
                <label className="label">Texte</label>
                <textarea 
                  className="textarea mb-2" 
                  value={info.texte} 
                  onChange={e => handleListChange('infosPratiques', i, 'texte', e.target.value)} 
                />
                <label className="label">Lien de redirection (optionnel)</label>
                <input 
                  className="input mb-2" 
                  value={info.lien || ''} 
                  onChange={e => handleListChange('infosPratiques', i, 'lien', e.target.value)} 
                  placeholder="/contact ou https://..."
                />
              </div>
            ))}
            <div className="has-text-centered">
              <button 
                type="button" 
                className="button is-link is-light" 
                onClick={() => addListItem('infosPratiques', { emoji: "ℹ️", titre: "", texte: "", lien: "" })}
                style={{ borderRadius: 8 }}
              >
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
                <span>Ajouter une info pratique</span>
              </button>
            </div>
            <div className="has-text-centered mt-3">
              <button 
                type="button" 
                className={`button is-link${savingSection === 'infosPratiques' ? ' is-loading' : ''}`}
                onClick={() => saveSection('infosPratiques')}
                disabled={savingSection !== null}
                style={{ borderRadius: 8 }}
              >
                <span style={{ marginRight: 8 }}>💾</span>
                Enregistrer cette section
              </button>
            </div>
          </div>

          {/* Points d'intérêt */}
          <div className="box mb-6">
            <h2 className="title is-4 has-text-primary mb-4">📍 Page : Points d'intérêt</h2>
            {(content.pointsInteret || []).map((point, i) => (
              <div key={i} className="box mb-3" style={{ background: "#f9fbfd", borderRadius: 12, border: '1.5px solid #e0e7ef' }}>
                <div className="is-flex is-justify-content-space-between mb-2">
                  <span className="tag is-primary is-light">Point #{i + 1}</span>
                  <button 
                    type="button" 
                    className="button is-small is-danger"
                    onClick={() => removeListItem('pointsInteret', i, point.nom || 'ce point d\'intérêt')}
                    disabled={savingSection !== null}
                    title="Supprimer"
                  >
                    <span role="img" aria-label="Supprimer">🗑️</span>
                  </button>
                </div>
                <label className="label">Nom</label>
                <input className="input mb-2" value={point.nom} onChange={e => handleListChange('pointsInteret', i, 'nom', e.target.value)} />
                <label className="label">Catégorie</label>
                <input className="input mb-2" value={point.categorie} onChange={e => handleListChange('pointsInteret', i, 'categorie', e.target.value)} />
                <label className="label">Description</label>
                <textarea className="textarea mb-2" value={point.description} onChange={e => handleListChange('pointsInteret', i, 'description', e.target.value)} />
                <label className="label">Adresse</label>
                <input className="input mb-2" value={point.adresse} onChange={e => handleListChange('pointsInteret', i, 'adresse', e.target.value)} />
                <label className="label">Horaires</label>
                <input className="input mb-2" value={point.horaires} onChange={e => handleListChange('pointsInteret', i, 'horaires', e.target.value)} />
                <label className="label">Image (URL)</label>
                <div className="field has-addons mb-2">
                  <div className="control is-expanded">
                    <input 
                      className="input" 
                      value={point.image} 
                      onChange={e => handleListChange('pointsInteret', i, 'image', e.target.value)}
                      placeholder="URL de l'image" 
                    />
                  </div>
                  <div className="control">
                    <button
                      type="button"
                      className="button is-info"
                      onClick={() => handleImageUpload('pointsInteret', i, 'image')}
                      disabled={uploadingImage}
                    >
                      <span className="icon">
                        <i className="fas fa-upload"></i>
                      </span>
                      <span>Upload</span>
                    </button>
                  </div>
                </div>
                {point.image && (
                  <figure className="image is-128x128 mb-2">
                    <img src={point.image} alt="Aperçu" style={{ objectFit: 'cover', borderRadius: 8 }} />
                  </figure>
                )}
              </div>
            ))}
            <div className="has-text-centered">
              <button 
                type="button" 
                className="button is-link is-light" 
                onClick={() => addListItem('pointsInteret', { nom: "", categorie: "", description: "", adresse: "", horaires: "", image: "" })}
                style={{ borderRadius: 8 }}
              >
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
                <span>Ajouter un point d'intérêt</span>
              </button>
            </div>
            <div className="has-text-centered mt-3">
              <button 
                type="button" 
                className={`button is-link${savingSection === 'pointsInteret' ? ' is-loading' : ''}`}
                onClick={() => saveSection('pointsInteret')}
                disabled={savingSection !== null}
                style={{ borderRadius: 8 }}
              >
                <span style={{ marginRight: 8 }}>💾</span>
                Enregistrer cette section
              </button>
            </div>
          </div>

          {/* Circuits pédestres */}
          <div className="box mb-6">
            <h2 className="title is-4 has-text-success mb-4">🚶‍♂️ Circuits pédestres</h2>
            <label className="label">Titre section circuits pédestres</label>
            <input className="input mb-2" value={content.titrePedestre} onChange={e => setContent({ ...content, titrePedestre: e.target.value })} />
            <label className="label">Texte d'intro circuits pédestres</label>
            <textarea className="textarea mb-2" value={content.textePedestre} onChange={e => setContent({ ...content, textePedestre: e.target.value })} rows={3} />
            {(content.circuitsPedestres || []).map((circuit, i) => (
              <div key={i} className="box mb-3" style={{ background: "#f9fbfd", borderRadius: 12, border: '1.5px solid #e0e7ef' }}>
                <div className="is-flex is-justify-content-space-between mb-2">
                  <span className="tag is-success is-light">Circuit #{i + 1}</span>
                  <button 
                    type="button" 
                    className="button is-small is-danger"
                    onClick={() => removeListItem('circuitsPedestres', i, circuit.nom || 'ce circuit')}
                    disabled={savingSection !== null}
                    title="Supprimer"
                  >
                    <span role="img" aria-label="Supprimer">🗑️</span>
                  </button>
                </div>
                <label className="label">Nom</label>
                <input className="input mb-2" value={circuit.nom} onChange={e => handleListChange('circuitsPedestres', i, 'nom', e.target.value)} />
                <label className="label">Distance</label>
                <input className="input mb-2" value={circuit.distance} onChange={e => handleListChange('circuitsPedestres', i, 'distance', e.target.value)} />
                <label className="label">Durée</label>
                <input className="input mb-2" value={circuit.duree} onChange={e => handleListChange('circuitsPedestres', i, 'duree', e.target.value)} />
                <label className="label">Difficulté</label>
                <input className="input mb-2" value={circuit.difficulte} onChange={e => handleListChange('circuitsPedestres', i, 'difficulte', e.target.value)} />
                <label className="label">Départ</label>
                <input className="input mb-2" value={circuit.depart} onChange={e => handleListChange('circuitsPedestres', i, 'depart', e.target.value)} />
                <label className="label">Description</label>
                <textarea className="textarea mb-2" value={circuit.description} onChange={e => handleListChange('circuitsPedestres', i, 'description', e.target.value)} />
                <label className="label">Points d'intérêt (séparés par une virgule)</label>
                <input className="input mb-2" value={(circuit.points || []).join(", ")} onChange={e => handleListChange('circuitsPedestres', i, 'points', e.target.value.split(",").map(s => s.trim()))} />
                <label className="label">Image (URL)</label>
                <div className="field has-addons mb-2">
                  <div className="control is-expanded">
                    <input 
                      className="input" 
                      value={circuit.image} 
                      onChange={e => handleListChange('circuitsPedestres', i, 'image', e.target.value)}
                      placeholder="URL de l'image" 
                    />
                  </div>
                  <div className="control">
                    <button
                      type="button"
                      className="button is-info"
                      onClick={() => handleImageUpload('circuitsPedestres', i, 'image')}
                      disabled={uploadingImage}
                    >
                      <span className="icon">
                        <i className="fas fa-upload"></i>
                      </span>
                      <span>Upload</span>
                    </button>
                  </div>
                </div>
                {circuit.image && (
                  <figure className="image is-128x128 mb-2">
                    <img src={circuit.image} alt="Aperçu" style={{ objectFit: 'cover', borderRadius: 8 }} />
                  </figure>
                )}
              </div>
            ))}
            <div className="has-text-centered">
              <button 
                type="button" 
                className="button is-link is-light" 
                onClick={() => addListItem('circuitsPedestres', { nom: "", distance: "", duree: "", difficulte: "", depart: "", description: "", points: [""], image: "" })}
                style={{ borderRadius: 8 }}
              >
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
                <span>Ajouter un circuit pédestre</span>
              </button>
            </div>
            {/* Sous-section consignes */}
            <div className="notification is-warning is-light mt-4" style={{ borderRadius: 12 }}>
              <strong>⚠️ Consignes de sécurité</strong>
              <label className="label">Titre consignes</label>
              <input className="input mb-2" value={content.consignesTitre} onChange={e => setContent({ ...content, consignesTitre: e.target.value })} />
              <label className="label">Liste des consignes (une ligne par consigne)</label>
              <textarea className="textarea mb-2" value={(content.consignes || []).join('\n')}
                onChange={e => setContent({ ...content, consignes: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })} rows={5} />
            </div>
            <div className="has-text-centered mt-3">
              <button 
                type="button" 
                className={`button is-link${savingSection === 'circuitsPedestres' ? ' is-loading' : ''}`}
                onClick={() => saveSection('circuitsPedestres')}
                disabled={savingSection !== null}
                style={{ borderRadius: 8 }}
              >
                <span style={{ marginRight: 8 }}>💾</span>
                Enregistrer cette section
              </button>
            </div>
          </div>

          {/* Circuits VTT */}
          <div className="box mb-6">
            <h2 className="title is-4 has-text-warning mb-4">🚵‍♂️ Circuits VTT</h2>
            <label className="label">Titre section circuits VTT</label>
            <input className="input mb-2" value={content.titreVTT} onChange={e => setContent({ ...content, titreVTT: e.target.value })} />
            <label className="label">Texte d'intro circuits VTT</label>
            <textarea className="textarea mb-2" value={content.texteVTT} onChange={e => setContent({ ...content, texteVTT: e.target.value })} rows={3} />
            {content.circuitsVTT.map((circuit, i) => (
              <div key={i} className="box mb-3" style={{ background: "#f9fbfd", borderRadius: 12, border: '1.5px solid #e0e7ef' }}>
                <div className="is-flex is-justify-content-space-between mb-2">
                  <span className="tag is-warning is-light">Circuit #{i + 1}</span>
                  <button 
                    type="button" 
                    className="button is-small is-danger"
                    onClick={() => removeListItem('circuitsVTT', i, circuit.nom || 'ce circuit')}
                    disabled={savingSection !== null}
                    title="Supprimer"
                  >
                    <span role="img" aria-label="Supprimer">🗑️</span>
                  </button>
                </div>
                <label className="label">Nom</label>
                <input className="input mb-2" value={circuit.nom} onChange={e => handleListChange('circuitsVTT', i, 'nom', e.target.value)} />
                <label className="label">Distance</label>
                <input className="input mb-2" value={circuit.distance} onChange={e => handleListChange('circuitsVTT', i, 'distance', e.target.value)} />
                <label className="label">Durée</label>
                <input className="input mb-2" value={circuit.duree} onChange={e => handleListChange('circuitsVTT', i, 'duree', e.target.value)} />
                <label className="label">Difficulté</label>
                <input className="input mb-2" value={circuit.difficulte} onChange={e => handleListChange('circuitsVTT', i, 'difficulte', e.target.value)} />
                <label className="label">Départ</label>
                <input className="input mb-2" value={circuit.depart} onChange={e => handleListChange('circuitsVTT', i, 'depart', e.target.value)} />
                <label className="label">Description</label>
                <textarea className="textarea mb-2" value={circuit.description} onChange={e => handleListChange('circuitsVTT', i, 'description', e.target.value)} />
                <label className="label">Dénivelé</label>
                <input className="input mb-2" value={circuit.denivele} onChange={e => handleListChange('circuitsVTT', i, 'denivele', e.target.value)} />
                <label className="label">Image (URL)</label>
                <div className="field has-addons mb-2">
                  <div className="control is-expanded">
                    <input 
                      className="input" 
                      value={circuit.image} 
                      onChange={e => handleListChange('circuitsVTT', i, 'image', e.target.value)}
                      placeholder="URL de l'image" 
                    />
                  </div>
                  <div className="control">
                    <button
                      type="button"
                      className="button is-info"
                      onClick={() => handleImageUpload('circuitsVTT', i, 'image')}
                      disabled={uploadingImage}
                    >
                      <span className="icon">
                        <i className="fas fa-upload"></i>
                      </span>
                      <span>Upload</span>
                    </button>
                  </div>
                </div>
                {circuit.image && (
                  <figure className="image is-128x128 mb-2">
                    <img src={circuit.image} alt="Aperçu" style={{ objectFit: 'cover', borderRadius: 8 }} />
                  </figure>
                )}
              </div>
            ))}
            <div className="has-text-centered">
              <button 
                type="button" 
                className="button is-link is-light" 
                onClick={() => addListItem('circuitsVTT', { nom: "", distance: "", duree: "", difficulte: "", depart: "", description: "", denivele: "", image: "" })}
                style={{ borderRadius: 8 }}
              >
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
                <span>Ajouter un circuit VTT</span>
              </button>
            </div>
            {/* Sous-section location VTT */}
            <div className="notification is-link is-light mt-4" style={{ borderRadius: 12 }}>
              <strong>🚲 Location de VTT</strong>
              <label className="label">Texte d'intro location VTT</label>
              <textarea className="textarea mb-2" value={content.locationVTT} onChange={e => setContent({ ...content, locationVTT: e.target.value })} rows={3} />
              <label className="label">Infos location VTT (une ligne par info)</label>
              <textarea className="textarea mb-2" value={(content.locationVTTInfos || []).join('\n')}
                onChange={e => setContent({ ...content, locationVTTInfos: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })} rows={4} />
            </div>
            <div className="has-text-centered mt-3">
              <button 
                type="button" 
                className={`button is-link${savingSection === 'circuitsVTT' ? ' is-loading' : ''}`}
                onClick={() => saveSection('circuitsVTT')}
                disabled={savingSection !== null}
                style={{ borderRadius: 8 }}
              >
                <span style={{ marginRight: 8 }}>💾</span>
                Enregistrer cette section
              </button>
            </div>
          </div>

          {/* Installations sportives */}
          <div className="box mb-6">
            <h2 className="title is-4 has-text-danger mb-4">🏟️ Installations sportives</h2>
            <label className="label">Titre section installations sportives</label>
            <input className="input mb-2" value={content.titreInstallations} onChange={e => setContent({ ...content, titreInstallations: e.target.value })} />
            <label className="label">Texte d'intro installations sportives</label>
            <textarea className="textarea mb-2" value={content.texteInstallations} onChange={e => setContent({ ...content, texteInstallations: e.target.value })} rows={3} />
            {content.installationsSportives.map((inst, i) => (
              <div key={i} className="box mb-3" style={{ background: "#f9fbfd", borderRadius: 12, border: '1.5px solid #e0e7ef' }}>
                <div className="is-flex is-justify-content-space-between mb-2">
                  <span className="tag is-danger is-light">Installation #{i + 1}</span>
                  <button 
                    type="button" 
                    className="button is-small is-danger"
                    onClick={() => removeListItem('installationsSportives', i, inst.nom || 'cette installation')}
                    disabled={savingSection !== null}
                    title="Supprimer"
                  >
                    <span role="img" aria-label="Supprimer">🗑️</span>
                  </button>
                </div>
                <label className="label">Nom</label>
                <input className="input mb-2" value={inst.nom} onChange={e => handleListChange('installationsSportives', i, 'nom', e.target.value)} />
                <label className="label">Description</label>
                <textarea className="textarea mb-2" value={inst.description} onChange={e => handleListChange('installationsSportives', i, 'description', e.target.value)} />
                <label className="label">Équipements (séparés par une virgule)</label>
                <input className="input mb-2" value={inst.equipements.join(", ")} onChange={e => handleListChange('installationsSportives', i, 'equipements', e.target.value.split(",").map(s => s.trim()))} />
                <label className="label">Horaires</label>
                <input className="input mb-2" value={inst.horaires} onChange={e => handleListChange('installationsSportives', i, 'horaires', e.target.value)} />
                <label className="label">Adresse</label>
                <input className="input mb-2" value={inst.adresse} onChange={e => handleListChange('installationsSportives', i, 'adresse', e.target.value)} />
                <label className="label">Image (URL)</label>
                <div className="field has-addons mb-2">
                  <div className="control is-expanded">
                    <input 
                      className="input" 
                      value={inst.image} 
                      onChange={e => handleListChange('installationsSportives', i, 'image', e.target.value)}
                      placeholder="URL de l'image" 
                    />
                  </div>
                  <div className="control">
                    <button
                      type="button"
                      className="button is-info"
                      onClick={() => handleImageUpload('installationsSportives', i, 'image')}
                      disabled={uploadingImage}
                    >
                      <span className="icon">
                        <i className="fas fa-upload"></i>
                      </span>
                      <span>Upload</span>
                    </button>
                  </div>
                </div>
                {inst.image && (
                  <figure className="image is-128x128 mb-2">
                    <img src={inst.image} alt="Aperçu" style={{ objectFit: 'cover', borderRadius: 8 }} />
                  </figure>
                )}
              </div>
            ))}
            <div className="has-text-centered">
              <button 
                type="button" 
                className="button is-link is-light" 
                onClick={() => addListItem('installationsSportives', { nom: "", description: "", equipements: [""], horaires: "", adresse: "", image: "" })}
                style={{ borderRadius: 8 }}
              >
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
                <span>Ajouter une installation sportive</span>
              </button>
            </div>
            {/* Sous-section équipements à louer */}
            <div className="notification is-primary is-light mt-4" style={{ borderRadius: 12 }}>
              <strong>🎾 Équipements sportifs à louer</strong>
              <label className="label">Titre équipements sportifs à louer</label>
              <input className="input mb-2" value={content.equipementsSportifs} onChange={e => setContent({ ...content, equipementsSportifs: e.target.value })} />
              <label className="label">Liste des équipements à louer</label>
              <div className="columns is-multiline">
                {content.equipementsSportifsInfos.map((eq, i) => (
                  <div key={i} className="column is-12-mobile is-6-tablet is-6-desktop">
                    <div className="box" style={{ background: "#fafdff", borderRadius: 12 }}>
                      <label className="label">Emoji</label>
                      <input className="input mb-2" value={eq.emoji} onChange={e => {
                        const arr = [...content.equipementsSportifsInfos];
                        arr[i].emoji = e.target.value;
                        setContent({ ...content, equipementsSportifsInfos: arr });
                      }} placeholder="🏀" />
                      <label className="label">Titre</label>
                      <input className="input mb-2" value={eq.titre} onChange={e => {
                        const arr = [...content.equipementsSportifsInfos];
                        arr[i].titre = e.target.value;
                        setContent({ ...content, equipementsSportifsInfos: arr });
                      }} placeholder="Ballons et matériel" />
                      <label className="label">Description</label>
                      <textarea className="textarea mb-2" value={eq.description} onChange={e => {
                        const arr = [...content.equipementsSportifsInfos];
                        arr[i].description = e.target.value;
                        setContent({ ...content, equipementsSportifsInfos: arr });
                      }} placeholder="Ballons (foot, basket, volley), raquettes de badminton et autres équipements disponibles à la mairie." />
                      <label className="label">Note (optionnel)</label>
                      <input className="input mb-2" value={eq.note || ''} onChange={e => {
                        const arr = [...content.equipementsSportifsInfos];
                        arr[i].note = e.target.value;
                        setContent({ ...content, equipementsSportifsInfos: arr });
                      }} placeholder="Caution demandée. Réservation conseillée en période estivale." />
                      <label className="label">Lien site web (optionnel)</label>
                      <input className="input mb-2" value={eq.lien || ''} onChange={e => {
                        const arr = [...content.equipementsSportifsInfos];
                        arr[i].lien = e.target.value;
                        setContent({ ...content, equipementsSportifsInfos: arr });
                      }} placeholder="https://... ou /contact" />
                      <button type="button" className="button is-danger is-light mt-2"
                        onClick={() => {
                          toast.info(
                            <div>
                              <p className="mb-2">Supprimer <strong>{eq.titre || 'cet équipement'}</strong> ?</p>
                              <div className="buttons mt-3">
                                <button
                                  className="button is-danger is-small"
                                  onClick={() => {
                                    toast.dismiss();
                                    setContent({
                                      ...content,
                                      equipementsSportifsInfos: content.equipementsSportifsInfos.filter((_, idx) => idx !== i)
                                    });
                                    toast.success('Équipement supprimé', { autoClose: 2000 });
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
                        }}>
                        <span role="img" aria-label="Supprimer">🗑️</span> Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="button is-link is-light is-small"
                onClick={() => setContent({
                  ...content,
                  equipementsSportifsInfos: [
                    ...content.equipementsSportifsInfos,
                    { emoji: "", titre: "", description: "", note: "", lien: "" }
                  ]
                })}>
                Ajouter une ligne
              </button>
            </div>
            <div className="has-text-centered mt-3">
              <button 
                type="button" 
                className={`button is-link${savingSection === 'installationsSportives' ? ' is-loading' : ''}`}
                onClick={() => saveSection('installationsSportives')}
                disabled={savingSection !== null}
                style={{ borderRadius: 8 }}
              >
                <span style={{ marginRight: 8 }}>💾</span>
                Enregistrer cette section
              </button>
            </div>
          </div>

          {/* Office du tourisme */}
          <div className="box mb-6">
            <h2 className="title is-4 has-text-info mb-4">🏢 Office du tourisme</h2>
            <label className="label">Adresse</label>
            <input className="input mb-2" value={content.officeTourisme.adresse} onChange={e => setContent({ ...content, officeTourisme: { ...content.officeTourisme, adresse: e.target.value } })} />
            <label className="label">Téléphone</label>
            <input className="input mb-2" value={content.officeTourisme.tel} onChange={e => setContent({ ...content, officeTourisme: { ...content.officeTourisme, tel: e.target.value } })} />
            <label className="label">Email</label>
            <input className="input mb-2" value={content.officeTourisme.email} onChange={e => setContent({ ...content, officeTourisme: { ...content.officeTourisme, email: e.target.value } })} />
            <label className="label">Horaires</label>
            <input className="input mb-2" value={content.officeTourisme.horaires} onChange={e => setContent({ ...content, officeTourisme: { ...content.officeTourisme, horaires: e.target.value } })} />
            <label className="label">Site web</label>
            <input className="input mb-2" value={content.officeTourisme.site} onChange={e => setContent({ ...content, officeTourisme: { ...content.officeTourisme, site: e.target.value } })} />
            <label className="label">Image (URL)</label>
            <div className="field has-addons mb-2">
              <div className="control is-expanded">
                <input 
                  className="input" 
                  value={content.officeTourisme.image || ''} 
                  onChange={e => setContent({ ...content, officeTourisme: { ...content.officeTourisme, image: e.target.value } })}
                  placeholder="URL de l'image" 
                />
              </div>
              <div className="control">
                <button
                  type="button"
                  className="button is-info"
                  onClick={handleOfficeTourismeImageUpload}
                  disabled={uploadingImage}
                >
                  <span className="icon">
                    <i className="fas fa-upload"></i>
                  </span>
                  <span>Upload</span>
                </button>
              </div>
            </div>
            {content.officeTourisme.image && (
              <figure className="image is-128x128 mb-2">
                <img src={content.officeTourisme.image} alt="Aperçu Office du Tourisme" style={{ objectFit: 'cover', borderRadius: 8 }} />
              </figure>
            )}
            <div className="has-text-centered mt-3">
              <button 
                type="button" 
                className={`button is-link${savingSection === 'officeTourisme' ? ' is-loading' : ''}`}
                onClick={() => saveSection('officeTourisme')}
                disabled={savingSection !== null}
                style={{ borderRadius: 8 }}
              >
                <span style={{ marginRight: 8 }}>💾</span>
                Enregistrer cette section
              </button>
            </div>
          </div>

          <button className={`button is-link is-medium mt-4${loading ? ' is-loading' : ''}`} type="submit" disabled={loading}>
            <span style={{ marginRight: 8 }}>💾</span>
            Enregistrer tout
          </button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={2500} newestOnTop />
    </div>
  );
}