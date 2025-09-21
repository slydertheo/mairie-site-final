import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ActualiteAdmin() {
  const [actualites, setActualites] = useState([]);
  const [form, setForm] = useState({ imgSrc: '', date: '', title: '' });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetch('/api/actualites')
      .then(res => res.json())
      .then(setActualites);
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.includes('image/')) {
      toast.error('Veuillez sélectionner une image.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La taille de l\'image ne doit pas dépasser 5MB.');
      return;
    }

    // Afficher un toast de chargement pour les grandes images
    const loadingId = toast.loading("Traitement de l'image...");

    // Compression et redimensionnement de l'image
    compressImage(file, {
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 0.7
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
    setLoading(true);
    
    // Vérification plus stricte de la taille des données
    if (form.imgSrc && form.imgSrc.length > 800000) { // ~800KB limite pour l'encodage base64
      toast.error("L'image est trop volumineuse même après compression. Veuillez utiliser une image plus petite.");
      setLoading(false);
      return;
    }
    
    // Afficher toast de chargement
    const loadingToastId = toast.loading(editMode ? "Modification en cours..." : "Ajout en cours...");

    try {
      // Ajout d'un timeout pour éviter le chargement infini
      const timeoutId = setTimeout(() => {
        if (loading) {
          setLoading(false);
          toast.update(loadingToastId, {
            render: "La requête a pris trop de temps. Veuillez réessayer avec une image plus petite.",
            type: "error",
            isLoading: false,
            autoClose: 5000
          });
        }
      }, 30000); // 30 secondes
      
      if (editMode) {
        const response = await fetch('/api/actualites', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, id: editId })
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        // Remplacer toast de chargement par toast de succès
        toast.update(loadingToastId, { 
          render: "Actualité modifiée avec succès", 
          type: "success",
          isLoading: false,
          autoClose: 3000
        });
      } else {
        await fetch('/api/actualites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        
        // Remplacer toast de chargement par toast de succès
        toast.update(loadingToastId, { 
          render: "Actualité ajoutée avec succès", 
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
    setForm({
      title: actu.title || '',
      date: actu.date || '',
      imgSrc: actu.imgSrc || ''
    });
    setPreviewImage(actu.imgSrc || null);
    
    // Supprimer cette partie ou la commenter pour éviter le défilement automatique
    // setTimeout(() => {
    //   window.scrollTo({ top: 0, behavior: 'smooth' });
    // }, 100);
  };

  const resetForm = () => {
    setForm({ imgSrc: '', date: '', title: '' });
    setPreviewImage(null);
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
      <div className="box" style={{ borderRadius: 12 }}>
        <h2 className="title is-5">
          {editMode ? 'Modifier une actualité' : 'Ajouter une actualité'}
        </h2>
        
        <form onSubmit={handleSubmit} className="mb-5">
          <div className="field">
            <label className="label">Titre</label>
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
          
          <div className="field">
            <label className="label">Date</label>
            <div className="control">
              <input 
                className="input" 
                type="date" 
                name="date" 
                value={formatDateForInput(form.date)} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <div className="field">
            <label className="label">Image</label>
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
          
          <div className="field is-grouped mt-4">
            <div className="control">
              <button 
                className={`button is-link${loading ? ' is-loading' : ''}`} 
                type="submit" 
                disabled={loading}
              >
                {editMode ? 'Enregistrer les modifications' : 'Ajouter'}
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
        
        <h3 className="title is-5 mt-6 mb-3">Liste des actualités</h3>
        <table className="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Titre</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {actualites.map(actu => (
              <tr key={actu.id}>
                <td>{actu.date}</td>
                <td>{actu.title}</td>
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
                  <div className="buttons are-small">
                    <button 
                      className="button is-info" 
                      onClick={() => {
                        console.log("Clic sur modifier pour:", actu); // Débogage du clic
                        handleEdit(actu);
                      }} 
                      disabled={loading}
                      type="button" // Ajouter type="button" pour éviter de soumettre un formulaire
                    >
                      <span className="icon">
                        <i className="fas fa-edit"></i>
                      </span>
                      <span>Modifier</span>
                    </button>
                    <button 
                      className="button is-danger" 
                      onClick={() => handleDelete(actu.id)} 
                      disabled={loading}
                    >
                      <span className="icon">
                        <i className="fas fa-trash"></i>
                      </span>
                      <span>Supprimer</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {actualites.length === 0 && (
              <tr>
                <td colSpan="4" className="has-text-centered">
                  Aucune actualité n'a été ajoutée
                </td>
              </tr>
            )}
          </tbody>
        </table>
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