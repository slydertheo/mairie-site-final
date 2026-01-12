import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ActualiteAdmin() {
  const [actualites, setActualites] = useState([]);
  const [form, setForm] = useState({ 
    imgSrc: '', 
    date: '', 
    title: '', 
    description: '', 
    pdfUrl: '',
    afficherDans: ['carrousel'] // Par défaut: carrousel uniquement
  });
  const [selectedDates, setSelectedDates] = useState([]); // Pour gérer les dates multiples
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');

  useEffect(() => {
    fetch('/api/actualites')
      .then(res => res.json())
      .then(setActualites);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Gérer les checkboxes pour afficherDans
  const handleAfficherDansChange = (e) => {
    const { value, checked } = e.target;
    let newAfficherDans = [...form.afficherDans];
    
    if (checked) {
      if (!newAfficherDans.includes(value)) {
        newAfficherDans.push(value);
      }
    } else {
      newAfficherDans = newAfficherDans.filter(item => item !== value);
    }
    
    setForm({ ...form, afficherDans: newAfficherDans });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.includes('image/')) {
      toast.error('Veuillez sélectionner une image.');
      return;
    }
    
    if (file.size > 50 * 1024 * 1024) {
      toast.error('La taille de l\'image ne doit pas dépasser 50MB.');
      return;
    }

    // Afficher un toast de chargement pour les grandes images
    const loadingId = toast.loading("Traitement de l'image...");

    // Compression et redimensionnement de l'image
    compressImage(file, {
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 0.8
    }).then(compressedImage => {
      setPreviewImage(compressedImage);
      setForm({ ...form, imgSrc: compressedImage });
      
      toast.update(loadingId, {
        render: 'Image chargée et optimisée avec succès',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });
    }).catch(error => {
      console.error("Erreur lors de la compression de l'image:", error);
      toast.update(loadingId, {
        render: "Erreur lors du traitement de l'image",
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    });
  };

  // Fonction pour gérer l'upload de PDF
  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Veuillez sélectionner un fichier PDF.');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error('La taille du PDF ne doit pas dépasser 100MB.');
      return;
    }

    const loadingId = toast.loading("Téléversement du PDF...");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload_doc', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors du téléversement');
      }

      const data = await response.json();
      const pdfUrl = data.fileUrl;

      setForm({ ...form, pdfUrl });
      setPdfFileName(file.name);

      toast.update(loadingId, {
        render: 'PDF téléversé avec succès',
        type: 'success',
        isLoading: false,
        autoClose: 2500
      });
    } catch (error) {
      console.error("Erreur lors du téléversement du PDF:", error);
      toast.update(loadingId, {
        render: "Erreur lors du téléversement du PDF",
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  // Fonction pour compresser et redimensionner l'image
  const compressImage = (file, options = {}) => {
    return new Promise((resolve, reject) => {
      const maxWidth = options.maxWidth || 1200;
      const maxHeight = options.maxHeight || 1200;
      const quality = options.quality || 0.7;
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          // Calculer les nouvelles dimensions en gardant les proportions
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
          
          // Créer un canvas pour redimensionner l'image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          // Dessiner l'image sur le canvas
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convertir en base64 avec compression
          const compressedBase64 = canvas.toDataURL(file.type, quality);
          
          resolve(compressedBase64);
        };
        
        img.onerror = error => {
          reject(error);
        };
      };
      
      reader.onerror = error => {
        reject(error);
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation : si des dates multiples sont sélectionnées, on les utilise, sinon on utilise la date unique
    const datesToUse = selectedDates.length > 0 ? selectedDates : (form.date.trim() ? [form.date] : []);
    
    if (!form.title.trim() || datesToUse.length === 0) {
      toast.error('Titre et au moins une date sont obligatoires.');
      return;
    }
    
    setLoading(true);
    
    // Afficher toast de chargement
    const loadingToastId = toast.loading(editMode ? "Modification en cours..." : "Ajout en cours...");

    try {
      // Ajout d'un timeout pour éviter le chargement infini
      const timeoutId = setTimeout(() => {
        if (loading) {
          setLoading(false);
          toast.update(loadingToastId, {
            render: "La requête a pris trop de temps. Veuillez réessayer.",
            type: "error",
            isLoading: false,
            autoClose: 5000
          });
        }
      }, 60000); // 60 secondes au lieu de 30
      
      if (editMode) {
        // Mode édition : mise à jour d'une seule actualité
        const response = await fetch('/api/actualites', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ...form, 
            id: editId,
            afficherDans: form.afficherDans.join(',') // Convertir en string
          })
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        toast.update(loadingToastId, { 
          render: "Actualité modifiée avec succès", 
          type: "success",
          isLoading: false,
          autoClose: 3000
        });
      } else {
        // Mode ajout : créer une actualité pour chaque date sélectionnée
        const promises = datesToUse.map(date => 
          fetch('/api/actualites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              ...form, 
              date,
              afficherDans: form.afficherDans.join(',') // Convertir en string
            })
          })
        );
        
        const responses = await Promise.all(promises);
        
        clearTimeout(timeoutId);
        
        const failedResponses = responses.filter(r => !r.ok);
        if (failedResponses.length > 0) {
          // Récupérer les détails des erreurs
          const errorDetails = await Promise.all(
            failedResponses.map(async r => {
              const text = await r.text();
              return `Status ${r.status}: ${text}`;
            })
          );
          console.error("Détails des erreurs:", errorDetails);
          throw new Error(`Erreur HTTP lors de l'ajout de ${failedResponses.length} actualité(s): ${errorDetails.join(', ')}`);
        }
        
        const message = datesToUse.length > 1 
          ? `${datesToUse.length} actualités ajoutées avec succès` 
          : "Actualité ajoutée avec succès";
        
        toast.update(loadingToastId, { 
          render: message, 
          type: "success",
          isLoading: false,
          autoClose: 3000
        });
      }

      resetForm();
      const updated = await fetch('/api/actualites').then(res => res.json());
      setActualites(updated);
    } catch (error) {
      console.error("Erreur lors de l'opération:", error);
      
      // Toast d'erreur
      toast.update(loadingToastId, { 
        render: editMode ? "Erreur lors de la modification" : "Erreur lors de l'ajout", 
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    // Afficher toast de confirmation avec bouton
    toast.info(
      <div>
        <p>Voulez-vous vraiment supprimer cette actualité?</p>
        <div className="buttons mt-3">
          <button 
            className="button is-danger is-small" 
            onClick={async () => {
              toast.dismiss();
              
              // Afficher toast de chargement
              const loadingToastId = toast.loading("Suppression en cours...");
              setLoading(true);
              
              try {
                await fetch('/api/actualites', {
                  method: 'DELETE',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id })
                });
                
                const updated = await fetch('/api/actualites').then(res => res.json());
                setActualites(updated);
                
                // Remplacer toast de chargement par toast de succès
                toast.update(loadingToastId, { 
                  render: "Actualité supprimée avec succès", 
                  type: "success",
                  isLoading: false,
                  autoClose: 3000
                });
              } catch (error) {
                // Toast d'erreur
                toast.update(loadingToastId, { 
                  render: "Erreur lors de la suppression", 
                  type: "error",
                  isLoading: false,
                  autoClose: 3000
                });
                console.error("Erreur de suppression:", error);
              } finally {
                setLoading(false);
              }
            }}
          >
            Confirmer
          </button>
          <button 
            className="button is-light is-small" 
            onClick={() => toast.dismiss()}
          >
            Annuler
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false,
        pauseOnFocusLoss: false,
        pauseOnHover: false,
      }
    );
  };

  const handleEdit = (actu) => {
    console.log("Édition de l'actualité:", actu);
    
    if (!actu || !actu.id) {
      console.error("Impossible de modifier: données incomplètes", actu);
      return;
    }
  
    setEditMode(true);
    setEditId(actu.id);
    setSelectedDates([]); // Réinitialiser les dates multiples en mode édition
    
    // Convertir afficherDans de string à array
    const afficherDansArray = actu.afficherDans 
      ? actu.afficherDans.split(',').filter(Boolean)
      : ['carrousel'];
    
    setForm({
      title: actu.title || '',
      date: actu.date || '',
      imgSrc: actu.imgSrc || '',
      description: actu.description || '',
      pdfUrl: actu.pdfUrl || '',
      afficherDans: afficherDansArray
    });
    setPreviewImage(actu.imgSrc || null);
    setPdfFileName(actu.pdfUrl ? 'PDF attaché' : '');
  };

  const resetForm = () => {
    setForm({ 
      imgSrc: '', 
      date: '', 
      title: '', 
      description: '', 
      pdfUrl: '',
      afficherDans: ['carrousel']
    });
    setSelectedDates([]);
    setPreviewImage(null);
    setPdfFileName('');
    setEditMode(false);
    setEditId(null);
    
    // Notification quand l'utilisateur annule une modification
    if (editMode) {
      toast.info('Modification annulée');
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  };

  return (
    <>
      <div className="box" style={{ borderRadius: 14, background: '#fafdff' }}>
        <h2 className="title is-4 mb-4 has-text-link">📰 Gestion du carrousel</h2>
        
        {/* Notification d'information sur le partage */}
        <div className="notification is-info is-light mb-4">
          <div className="content">
            <p className="has-text-weight-bold mb-2">
              💡 Nouvelles fonctionnalités de partage
            </p>
            <p className="is-size-7 mb-2">
              Vous pouvez maintenant partager vos actualités entre plusieurs sections :
            </p>
            <ul className="is-size-7" style={{ marginLeft: '1.5em' }}>
              <li><strong>🎠 Carrousel</strong> : Affiche l'actualité sur la page d'accueil (slider principal)</li>
              <li><strong>📅 Calendrier</strong> : Ajoute automatiquement l'événement au calendrier</li>
              <li><strong>📋 Panneau d'affichage</strong> : Affiche l'actualité dans le panneau d'affichage</li>
            </ul>
            <p className="is-size-7 has-text-weight-semibold mt-2">
              ✨ Sélectionnez une ou plusieurs destinations lors de la création/modification d'une actualité !
            </p>
          </div>
        </div>
        
        <div className="box mb-4" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
          <h3 className="subtitle is-5 mb-3">
            {editMode ? 'Modifier une actualité' : 'Ajouter une actualité'}
          </h3>
          
          <form onSubmit={handleSubmit} className="mb-5">
            <div className="field">
              <label className="label is-small">Titre</label>
              <div className="control">
                <input 
                  className="input" 
                  name="title" 
                  value={form.title} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="field is-grouped mb-3">
              <div className="control is-expanded">
                <label className="label is-small">
                  {editMode ? 'Date' : 'Date (ou ajoutez plusieurs dates ci-dessous)'}
                </label>
                <input 
                  className="input" 
                  type="date" 
                  name="date" 
                  value={formatDateForInput(form.date)} 
                  onChange={handleChange} 
                  required={editMode || selectedDates.length === 0}
                />
              </div>
              {!editMode && (
                <div className="control">
                  <label className="label is-small">&nbsp;</label>
                  <button 
                    type="button"
                    className="button is-success"
                    onClick={() => {
                      if (form.date && !selectedDates.includes(form.date)) {
                        setSelectedDates([...selectedDates, form.date].sort());
                        toast.success(`Date ajoutée : ${new Date(form.date).toLocaleDateString('fr-FR')}`);
                      } else if (selectedDates.includes(form.date)) {
                        toast.warning('Cette date est déjà ajoutée');
                      }
                    }}
                    disabled={!form.date || loading}
                    title="Ajouter cette date"
                  >
                    ➕ Ajouter
                  </button>
                </div>
              )}
            </div>

            {/* Affichage des dates sélectionnées */}
            {!editMode && selectedDates.length > 0 && (
              <div className="field mb-3">
                <label className="label is-small">Dates sélectionnées ({selectedDates.length})</label>
                <div className="tags">
                  {selectedDates.map((date, idx) => (
                    <span key={idx} className="tag is-success is-medium">
                      {new Date(date).toLocaleDateString('fr-FR')}
                      <button
                        type="button"
                        className="delete is-small"
                        onClick={() => {
                          setSelectedDates(selectedDates.filter(d => d !== date));
                          toast.info('Date retirée');
                        }}
                        disabled={loading}
                      />
                    </span>
                  ))}
                </div>
                <p className="help is-success">
                  Une actualité sera créée pour chaque date sélectionnée
                </p>
              </div>
            )}

            <div className="field">
              <label className="label is-small">Description</label>
              <div className="control">
                <textarea 
                  className="textarea" 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange}
                  placeholder="Description détaillée de l'actualité..."
                  rows={4}
                />
              </div>
              <p className="help">Cette description sera affichée dans la modal de détail</p>
            </div>
            
            {/* NOUVELLE SECTION : Afficher dans */}
            <div className="field">
              <label className="label is-small">
                📍 Afficher cette actualité dans :
              </label>
              <div className="control">
                <label className="checkbox mb-2" style={{ display: 'block' }}>
                  <input
                    type="checkbox"
                    value="carrousel"
                    checked={form.afficherDans.includes('carrousel')}
                    onChange={handleAfficherDansChange}
                    disabled={loading}
                  />
                  <span className="ml-2">
                    <span className="icon is-small">🎠</span>
                    <strong>Carrousel</strong> (page d'accueil)
                  </span>
                </label>
                
                <label className="checkbox mb-2" style={{ display: 'block' }}>
                  <input
                    type="checkbox"
                    value="calendrier"
                    checked={form.afficherDans.includes('calendrier')}
                    onChange={handleAfficherDansChange}
                    disabled={loading}
                  />
                  <span className="ml-2">
                    <span className="icon is-small">📅</span>
                    <strong>Calendrier</strong> (page événements)
                  </span>
                </label>
                
                <label className="checkbox mb-2" style={{ display: 'block' }}>
                  <input
                    type="checkbox"
                    value="panneau"
                    checked={form.afficherDans.includes('panneau')}
                    onChange={handleAfficherDansChange}
                    disabled={loading}
                  />
                  <span className="ml-2">
                    <span className="icon is-small">📋</span>
                    <strong>Panneau d'affichage</strong> (page d'accueil)
                  </span>
                </label>
              </div>
              <p className="help is-info">
                💡 Sélectionnez une ou plusieurs destinations pour partager cette actualité
              </p>
            </div>
            
            <div className="field">
              <label className="label is-small">Image</label>
              <div className="file has-name is-fullwidth mb-2">
                <label className="file-label">
                  <input 
                    className="file-input" 
                    type="file" 
                    name="imageFile" 
                    accept="image/*"
                    onChange={handleImageUpload} 
                  />
                  <span className="file-cta">
                    <span className="file-icon">
                      <i className="fas fa-upload"></i>
                    </span>
                    <span className="file-label">
                      Choisir une image...
                    </span>
                  </span>
                  <span className="file-name">
                    {previewImage ? 'Image sélectionnée' : 'Aucun fichier sélectionné'}
                  </span>
                </label>
              </div>
              
              <div className="control">
                <input 
                  className="input" 
                  name="imgSrc" 
                  value={form.imgSrc} 
                  onChange={handleChange}
                  placeholder="Ou entrez l'URL d'une image" 
                />
              </div>
              
              {previewImage && (
                <div className="mt-2">
                  <p className="is-size-7 mb-1">Aperçu :</p>
                  <img 
                    src={previewImage} 
                    alt="Aperçu" 
                    style={{ 
                      maxHeight: "150px", 
                      maxWidth: "300px", 
                      objectFit: "contain",
                      border: "1px solid #ddd",
                      borderRadius: "4px"
                    }} 
                  />
                </div>
              )}
            </div>
            
            <div className="field">
              <label className="label is-small">
                PDF (optionnel)
                <span className="icon is-small ml-1">
                  <i className="fas fa-file-pdf"></i>
                </span>
              </label>
              <div className="file has-name is-fullwidth mb-2">
                <label className="file-label">
                  <input 
                    className="file-input" 
                    type="file" 
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    disabled={loading}
                  />
                  <span className="file-cta">
                    <span className="file-icon">
                      <i className="fas fa-upload"></i>
                    </span>
                    <span className="file-label">
                      Téléverser un PDF...
                    </span>
                  </span>
                  <span className="file-name">
                    {pdfFileName || 'Aucun fichier PDF'}
                  </span>
                </label>
              </div>
              
              {form.pdfUrl && (
                <div className="notification is-success is-light mt-2">
                  <div className="is-flex is-align-items-center is-justify-content-space-between">
                    <span>
                      <span className="icon mr-1">
                        <i className="fas fa-check-circle"></i>
                      </span>
                      PDF attaché : <a href={form.pdfUrl} target="_blank" rel="noopener noreferrer" className="has-text-weight-bold">Voir le PDF</a>
                    </span>
                    <button
                      type="button"
                      className="delete"
                      onClick={() => {
                        setForm({ ...form, pdfUrl: '' });
                        setPdfFileName('');
                        toast.info('PDF retiré');
                      }}
                      disabled={loading}
                    />
                  </div>
                </div>
              )}
              
              <p className="help">Les visiteurs pourront télécharger ce PDF depuis la modal de détail</p>
            </div>
            
            <div className="field is-grouped mt-4">
              <div className="control">
                <button 
                  className={`button is-link${loading ? ' is-loading' : ''}`} 
                  type="submit" 
                  disabled={loading}
                >
                  Enregistrer
                </button>
              </div>
              
              {editMode && (
                <div className="control">
                  <button 
                    type="button"
                    className="button is-light" 
                    onClick={resetForm}
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
        
        <div className="box mb-4" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
          <h3 className="subtitle is-5 mb-3">Liste des actualités</h3>
          <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th>Date</th>
                <th>Titre</th>
                <th>Description</th>
                <th>Partagée dans</th>
                <th>Image</th>
                <th>PDF</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {actualites.map(actu => (
                <tr key={actu.id}>
                  <td>{actu.date}</td>
                  <td>{actu.title}</td>
                  <td style={{ maxWidth: '200px' }}>
                    {actu.description ? (
                      <div className="is-size-7" style={{ 
                        maxHeight: '60px', 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {actu.description.length > 100 
                          ? `${actu.description.substring(0, 100)}...` 
                          : actu.description
                        }
                      </div>
                    ) : (
                      <span className="has-text-grey-light is-italic">Aucune description</span>
                    )}
                  </td>
                  <td>
                    <div className="tags are-small">
                      {actu.afficherDans && actu.afficherDans.includes('carrousel') && (
                        <span className="tag is-link" title="Carrousel">🎠</span>
                      )}
                      {actu.afficherDans && actu.afficherDans.includes('calendrier') && (
                        <span className="tag is-success" title="Calendrier">📅</span>
                      )}
                      {actu.afficherDans && actu.afficherDans.includes('panneau') && (
                        <span className="tag is-warning" title="Panneau d'affichage">📋</span>
                      )}
                      {(!actu.afficherDans || actu.afficherDans === '') && (
                        <span className="tag is-light">🎠 Carrousel</span>
                      )}
                    </div>
                  </td>
                  <td>
                    {actu.imgSrc && (
                      <img 
                        src={actu.imgSrc} 
                        alt={actu.title} 
                        style={{ 
                          width: 80, 
                          height: 50, 
                          objectFit: 'cover',
                          borderRadius: '4px' 
                        }} 
                      />
                    )}
                  </td>
                  <td>
                    {actu.pdfUrl ? (
                      <a 
                        href={actu.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="button is-small is-danger is-light"
                        title="Voir le PDF"
                      >
                        <span className="icon">
                          <i className="fas fa-file-pdf"></i>
                        </span>
                      </a>
                    ) : (
                      <span className="has-text-grey-light is-italic">-</span>
                    )}
                  </td>
                  <td>
                    <div className="buttons are-small">
                      <button 
                        className="button is-info" 
                        onClick={() => {
                          console.log("Clic sur modifier pour:", actu);
                          handleEdit(actu);
                        }} 
                        disabled={loading}
                        type="button"
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button 
                        className="button is-danger" 
                        onClick={() => handleDelete(actu.id)} 
                        disabled={loading}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {actualites.length === 0 && (
                <tr>
                  <td colSpan="7" className="has-text-centered">
                    Aucune actualité n'a été ajoutée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}