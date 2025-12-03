import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PAGES = [
  { slug: 'accueil', title: '🏠 Accueil', defaultImage: '/village.jpeg' },
  { slug: 'demarches', title: '📄 Démarches', defaultImage: '/village.jpeg' },
  { slug: 'ecoles', title: '🎓 Écoles', defaultImage: '/village.jpeg' },
  { slug: 'commerces', title: '🛒 Commerces', defaultImage: '/village.jpeg' },
  { slug: 'intercommunalite', title: '🏛️ Intercommunalité', defaultImage: '/village.jpeg' },
  { slug: 'associations', title: '🤝 Associations', defaultImage: '/village.jpeg' },
  { slug: 'decouvrir_friesen', title: '🌄 Découvrir Friesen', defaultImage: '/village.jpeg' },
  { slug: 'infos_pratiques', title: 'ℹ️ Infos Pratiques', defaultImage: '/village.jpeg' },
];

export default function EditeurNavbar() {
  const [navbarImages, setNavbarImages] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadingPage, setUploadingPage] = useState(null);

  useEffect(() => {
    fetch('/api/navbar-images')
      .then(res => {
        if (!res.ok) {
          throw new Error('Erreur de chargement');
        }
        return res.json();
      })
      .then(data => {
        if (data.images) {
          setNavbarImages(data.images);
        }
      })
      .catch((err) => {
        console.error('Erreur chargement navbar-images:', err);
        toast.error('Erreur lors du chargement');
      });
  }, []);

  const handleImageChange = (pageSlug, imageUrl) => {
    setNavbarImages({
      ...navbarImages,
      [pageSlug]: imageUrl
    });
  };

  const handleImageUpload = async (pageSlug, file) => {
    if (!file) return;

    if (!file.type.includes('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image trop volumineuse (max 5MB)');
      return;
    }

    setUploadingPage(pageSlug);
    const toastId = toast.loading('Upload de l\'image...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload_doc', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Erreur upload');

      handleImageChange(pageSlug, data.fileUrl);

      toast.update(toastId, {
        render: '✅ Image uploadée !',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });
    } catch (err) {
      toast.update(toastId, {
        render: '❌ ' + (err.message || 'Erreur lors de l\'upload'),
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setUploadingPage(null);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const toastId = toast.loading('Enregistrement...');

    try {
      const res = await fetch('/api/navbar-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: navbarImages })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Erreur serveur' }));
        throw new Error(errorData.error || 'Erreur serveur');
      }

      toast.update(toastId, {
        render: '✅ Images de navbar enregistrées !',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      toast.update(toastId, {
        render: '❌ ' + (err.message || 'Erreur lors de l\'enregistrement'),
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const resetToDefault = (pageSlug) => {
    const page = PAGES.find(p => p.slug === pageSlug);
    handleImageChange(pageSlug, page?.defaultImage || '/LogoFriesen.png');
    toast.success('Image réinitialisée par défaut', { autoClose: 2000 });
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
          🖼️ Images de fond (Hero) par Page
        </h1>

        <div className="notification is-info is-light mb-5">
          <p className="has-text-weight-semibold mb-2">💡 Personnalisez l'image de fond du hero pour chaque page</p>
          <p className="is-size-7">
            L'image apparaîtra en arrière-plan de la section hero (sous la navbar) de chaque page du site.
            Par défaut, toutes les pages utilisent "village.jpeg".
          </p>
        </div>

        <div className="columns is-multiline">
          {PAGES.map(page => (
            <div key={page.slug} className="column is-6">
              <div className="box" style={{ 
                background: '#f9fbfd', 
                borderRadius: 12, 
                border: '1.5px solid #e0e7ef',
                minHeight: 280
              }}>
                <div className="is-flex is-justify-content-space-between is-align-items-center mb-3">
                  <h3 className="subtitle is-5 mb-0" style={{ color: '#1277c6', fontWeight: 700 }}>
                    {page.title}
                  </h3>
                  <span className="tag is-link is-light">{page.slug}</span>
                </div>

                <div className="field">
                  <label className="label is-small">Image actuelle</label>
                  <div style={{ 
                    width: '100%', 
                    height: 200, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    marginBottom: 12,
                    borderRadius: 8,
                    border: '2px solid #e0e7ef',
                    background: 'white',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={navbarImages[page.slug] || page.defaultImage}
                      alt={page.title}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        display: 'block'
                      }}
                      onError={(e) => {
                        e.currentTarget.src = page.defaultImage;
                      }}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label is-small">Upload nouvelle image</label>
                  <div className="file has-name is-fullwidth mb-2">
                    <label className="file-label">
                      <input
                        className="file-input"
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(page.slug, e.target.files[0])}
                        disabled={uploadingPage === page.slug}
                      />
                      <span className="file-cta">
                        <span className="file-icon">
                          {uploadingPage === page.slug ? '⏳' : '📤'}
                        </span>
                        <span className="file-label">
                          {uploadingPage === page.slug ? 'Upload...' : 'Choisir une image'}
                        </span>
                      </span>
                      <span className="file-name">
                        {navbarImages[page.slug] ? 'Image personnalisée' : 'Image par défaut'}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="field">
                  <label className="label is-small">Ou entrez une URL</label>
                  <div className="control">
                    <input
                      className="input is-small"
                      type="text"
                      placeholder="https://..."
                      value={navbarImages[page.slug] || ''}
                      onChange={e => handleImageChange(page.slug, e.target.value)}
                    />
                  </div>
                </div>

                <div className="buttons mt-3">
                  <button
                    type="button"
                    className="button is-small is-warning is-light"
                    onClick={() => resetToDefault(page.slug)}
                  >
                    <span className="icon">
                      <i className="fas fa-undo"></i>
                    </span>
                    <span>Réinitialiser</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="has-text-centered mt-5">
          <button
            className={`button is-link is-medium${loading ? ' is-loading' : ''}`}
            onClick={handleSave}
            disabled={loading}
            style={{ borderRadius: 8 }}
          >
            <span style={{ marginRight: 8 }}>💾</span>
            Enregistrer toutes les images
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2500} newestOnTop />
    </div>
  );
}