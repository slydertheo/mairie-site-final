import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HEADER_FIELDS = [
  { key: 'titre', label: 'Titre principal', type: 'text' },
  { key: 'intro', label: 'Introduction', type: 'textarea' },
];

const GROUPS = [
  { key: 'rapides', icon: '⚡', title: 'Démarches rapides' },
  { key: 'urbanisme', icon: '🏡', title: 'Urbanisme' },
  { key: 'autres', icon: '🔗', title: 'Autres démarches utiles' },
];

export default function DemarchesEditor() {
  const [headerForm, setHeaderForm] = useState({});
  const [demarches, setDemarches] = useState({
    rapides: [],
    urbanisme: [],
    autres: []
  });
  const [pdfReglement, setPdfReglement] = useState({
    label: '',
    url: '',
    isFile: false
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [pendingSave, setPendingSave] = useState(false); // État pour suivre les sauvegardes en attente

  // Charger les données existantes
  useEffect(() => {
    setLoading(true);
    fetch('/api/pageContent?page=demarches')
      .then(res => res.json())
      .then(data => {
        const obj = data[0] || {};

        // Initialiser l'en-tête
        const headerData = {};
        HEADER_FIELDS.forEach(f => {
          headerData[f.key] = obj[f.key] || '';
        });
        setHeaderForm(headerData);

        // Initialiser les démarches rapides
        const rapidesData = [];
        for (let i = 1; i <= 20; i++) {
          const labelKey = `demarche_rapide_${i}_label`;
          const urlKey = `demarche_rapide_${i}_url`;
          if (obj[labelKey]) {
            rapidesData.push({
              id: crypto.randomUUID(),
              label: obj[labelKey] || '',
              url: obj[urlKey] || '',
              isFile: obj[urlKey]?.endsWith('.pdf') || false
            });
          }
        }

        // Initialiser les démarches urbanisme
        const urbanismeData = [];
        for (let i = 1; i <= 20; i++) {
          const labelKey = `urbanisme_${i}_label`;
          const urlKey = `urbanisme_${i}_url`;
          if (obj[labelKey]) {
            urbanismeData.push({
              id: crypto.randomUUID(),
              label: obj[labelKey] || '',
              url: obj[urlKey] || '',
              isFile: obj[urlKey]?.endsWith('.pdf') || false
            });
          }
        }

        // Initialiser autres démarches
        const autresData = [];
        for (let i = 1; i <= 20; i++) {
          const labelKey = `autre_${i}_label`;
          const urlKey = `autre_${i}_url`;
          if (obj[labelKey]) {
            autresData.push({
              id: crypto.randomUUID(),
              label: obj[labelKey] || '',
              url: obj[urlKey] || '',
              isFile: obj[urlKey]?.endsWith('.pdf') || false
            });
          }
        }

        // Initialiser le PDF règlement
        setPdfReglement({
          label: obj.pdf_reglement_label || '',
          url: obj.pdf_reglement_url || '',
          isFile: obj.pdf_reglement_url?.endsWith('.pdf') || false
        });

        setDemarches({
          rapides: rapidesData,
          urbanisme: urbanismeData,
          autres: autresData
        });
      })
      .catch(err => {
        console.error("Erreur lors du chargement des données:", err);
        setHeaderForm({});
        setDemarches({
          rapides: [],
          urbanisme: [],
          autres: []
        });
      })
      .finally(() => setLoading(false));
  }, []);

  // Gérer les changements dans l'en-tête
  const handleHeaderChange = e => {
    setHeaderForm({ ...headerForm, [e.target.name]: e.target.value });
  };
  
  // Ajouter une démarche
  const addDemarche = (group) => {
    setDemarches(prev => {
      return {
        ...prev,
        [group]: [...prev[group], { id: crypto.randomUUID(), label: '', url: '', isFile: false }]
      };
    });
  };
  
  // Supprimer une démarche
  const removeDemarche = (group, id) => {
    const demarche = demarches[group].find(d => d.id === id);
    toast.info(
      <div>
        <p>Voulez-vous vraiment supprimer&nbsp;: <b>{demarche?.label || 'cette démarche'}</b> ?</p>
        <div className="buttons mt-3">
          <button
            className="button is-danger is-small"
            onClick={async () => {
              toast.dismiss();
              // 1. Supprime du state
              const newDemarches = {
                ...demarches,
                [group]: demarches[group].filter(d => d.id !== id)
              };
              setDemarches(newDemarches);
              // 2. Appelle handleSave avec les nouvelles données
              setLoading(true);
              const saveData = prepareDataForSave(newDemarches);
              const toastId = toast.loading('Sauvegarde en cours...');
              try {
                await fetch('/api/pageContent', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(saveData)
                });
                toast.update(toastId, { render: 'Démarche supprimée !', type: 'success', isLoading: false, autoClose: 2000 });
              } catch (error) {
                toast.update(toastId, { render: 'Erreur lors de la suppression', type: 'error', isLoading: false, autoClose: 3000 });
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
  
  // Mettre à jour une démarche
  const updateDemarche = (group, id, field, value) => {
    setDemarches(prev => ({
      ...prev,
      [group]: prev[group].map(d => 
        d.id === id ? { ...d, [field]: value } : d
      )
    }));
  };
  
  // Mettre à jour le PDF règlement
  const handlePdfReglementChange = (field, value) => {
    setPdfReglement(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Transformer les données pour la sauvegarde
  const prepareDataForSave = (demarchesArg = demarches) => {
    const saveData = {
      page: 'demarches',
      ...headerForm
    };
    for (let i = 1; i <= 20; i++) {
      saveData[`demarche_rapide_${i}_label`] = '';
      saveData[`demarche_rapide_${i}_url`] = '';
      saveData[`urbanisme_${i}_label`] = '';
      saveData[`urbanisme_${i}_url`] = '';
      saveData[`autre_${i}_label`] = '';
      saveData[`autre_${i}_url`] = '';
    }
    demarchesArg.rapides.forEach((d, index) => {
      const i = index + 1;
      saveData[`demarche_rapide_${i}_label`] = d.label;
      saveData[`demarche_rapide_${i}_url`] = d.url;
    });
    demarchesArg.urbanisme.forEach((d, index) => {
      const i = index + 1;
      saveData[`urbanisme_${i}_label`] = d.label;
      saveData[`urbanisme_${i}_url`] = d.url;
    });
    demarchesArg.autres.forEach((d, index) => {
      const i = index + 1;
      saveData[`autre_${i}_label`] = d.label;
      saveData[`autre_${i}_url`] = d.url;
    });
    saveData.pdf_reglement_label = pdfReglement.label;
    saveData.pdf_reglement_url = pdfReglement.url;
    return saveData;
  };

  // Sauvegarder les données avec toast
  const handleSave = async e => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);

    const saveData = prepareDataForSave();

    const toastId = toast.loading('Sauvegarde en cours...');
    try {
      await fetch('/api/pageContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      });
      toast.update(toastId, { render: 'Modifications enregistrées !', type: 'success', isLoading: false, autoClose: 2000 });
      setMsg('');
    } catch (error) {
      toast.update(toastId, { render: 'Erreur lors de la sauvegarde', type: 'error', isLoading: false, autoClose: 3000 });
      setMsg('');
      console.error("Erreur de sauvegarde:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gérer l'upload de fichiers PDF avec toast
  const handleFileUpload = async (group, id) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf';

    fileInput.onchange = async (e) => {
      if (!e.target.files || !e.target.files[0]) return;

      const file = e.target.files[0];

      setLoading(true);
      const toastId = toast.loading('Téléchargement en cours...');
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload_doc', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Échec du téléchargement: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (group === 'reglement') {
          handlePdfReglementChange('url', data.fileUrl);
          handlePdfReglementChange('isFile', true);
        } else {
          updateDemarche(group, id, 'url', data.fileUrl);
          updateDemarche(group, id, 'isFile', true);
        }

        toast.update(toastId, { render: 'Fichier téléchargé avec succès!', type: 'success', isLoading: false, autoClose: 2000 });
        setMsg('');
      } catch (error) {
        toast.update(toastId, { render: 'Erreur lors du téléchargement: ' + error.message, type: 'error', isLoading: false, autoClose: 3000 });
        setMsg('');
        console.error('Erreur upload:', error);
      } finally {
        setLoading(false);
      }
    };

    fileInput.click();
  };

  // Ajoute cette fonction utilitaire avant le return
  const moveDemarche = (group, id, direction) => {
    setDemarches(prev => {
      const list = [...prev[group]];
      const idx = list.findIndex(d => d.id === id);
      if (idx === -1) return prev;

      let swapWith = direction === 'up' ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= list.length) return prev;

      // Échange les deux démarches
      [list[idx], list[swapWith]] = [list[swapWith], list[idx]];
      console.log('moveDemarche', group, id, direction, list.map(d => d.label));
      return { ...prev, [group]: list };
    });
  };

  // Nouvelle fonction pour sauvegarder une section spécifique
  const handleSaveSection = async (groupKey) => {
    setLoading(true);
    const toastId = toast.loading('Sauvegarde en cours...');

    try {
      // 1. Récupère toutes les données existantes
      const res = await fetch('/api/pageContent?page=demarches');
      const data = await res.json();
      const obj = data[0] || {};

      // 2. Prépare le nouvel objet à envoyer (copie de l'existant)
      const saveData = { ...obj, page: 'demarches' };

      // 3. Vide la section concernée
      for (let i = 1; i <= 20; i++) {
        if (groupKey === 'rapides') {
          saveData[`demarche_rapide_${i}_label`] = '';
          saveData[`demarche_rapide_${i}_url`] = '';
        }
        if (groupKey === 'urbanisme') {
          saveData[`urbanisme_${i}_label`] = '';
          saveData[`urbanisme_${i}_url`] = '';
        }
        if (groupKey === 'autres') {
          saveData[`autre_${i}_label`] = '';
          saveData[`autre_${i}_url`] = '';
        }
      }

      // 4. Remplit la section concernée avec les valeurs actuelles
      demarches[groupKey].forEach((d, index) => {
        const i = index + 1;
        if (groupKey === 'rapides') {
          saveData[`demarche_rapide_${i}_label`] = d.label;
          saveData[`demarche_rapide_${i}_url`] = d.url;
        }
        if (groupKey === 'urbanisme') {
          saveData[`urbanisme_${i}_label`] = d.label;
          saveData[`urbanisme_${i}_url`] = d.url;
        }
        if (groupKey === 'autres') {
          saveData[`autre_${i}_label`] = d.label;
          saveData[`autre_${i}_url`] = d.url;
        }
      });

      // 5. Toujours garder le PDF règlement à jour
      saveData.pdf_reglement_label = pdfReglement.label;
      saveData.pdf_reglement_url = pdfReglement.url;

      // 6. Envoie tout à l’API
      await fetch('/api/pageContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      });

      toast.update(toastId, { render: 'Section enregistrée !', type: 'success', isLoading: false, autoClose: 2000 });
    } catch (error) {
      toast.update(toastId, { render: 'Erreur lors de la sauvegarde', type: 'error', isLoading: false, autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box" style={{ borderRadius: 14, background: '#fafdff', border: '1.5px solid #e0e7ef', boxShadow: '0 2px 12px #e0e7ef33' }}>
      <h2 className="title is-4 mb-4 has-text-link" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 28 }}>🗂️</span> Contenu de la page Démarches
      </h2>
      <form onSubmit={handleSave}>
        {/* Sections de démarches */}
        {GROUPS.map(group => (
          <div key={group.key} className="box mb-4" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
            <h3 className="subtitle is-5 mb-3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22 }}>{group.icon}</span> {group.title}
            </h3>
            {demarches[group.key].length === 0 ? (
              <div>
                <div className="notification is-light is-info is-size-7 py-2 px-3 mb-3" style={{ borderRadius: 8 }}>
                  Aucune démarche ajoutée.
                </div>
              </div>
            ) : (
              <div style={{ paddingRight: '5px' }}>
                {demarches[group.key].map((demarche, index, arr) => (
                  <div 
                    key={demarche.id} 
                    className="box mb-3 pt-3 pb-3" 
                    style={{ background: '#f9fbfd', borderRadius: 8, border: '1px solid #e0e7ef' }}
                  >
                    <div className="is-flex is-justify-content-space-between mb-2">
                      <span className="tag is-info is-light">Démarche #{index + 1}</span>
                      <div>
                        <button
                          type="button"
                          className="button is-small is-white"
                          title="Monter"
                          onClick={() => moveDemarche(group.key, demarche.id, 'up')}
                          disabled={loading || index === 0}
                          style={{ marginRight: 4 }}
                        >
                          <span className="icon is-small">▲</span>
                        </button>
                        <button
                          type="button"
                          className="button is-small is-white"
                          title="Descendre"
                          onClick={() => moveDemarche(group.key, demarche.id, 'down')}
                          disabled={loading || index === arr.length - 1}
                          style={{ marginRight: 8 }}
                        >
                          <span className="icon is-small">▼</span>
                        </button>
                        <button 
                          type="button" 
                          className="button is-small is-danger"
                          title="Supprimer"
                          onClick={() => removeDemarche(group.key, demarche.id)}
                          disabled={loading}
                        >
                          <span role="img" aria-label="Supprimer">🗑️</span>
                        </button>
                      </div>
                    </div>
                    <div className="field mb-3">
                      <label className="label is-small">Texte à afficher</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          value={demarche.label}
                          onChange={(e) => updateDemarche(group.key, demarche.id, 'label', e.target.value)}
                          readOnly={loading}
                          style={{ background: loading ? "#f5f5f5" : "white" }}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label is-small">Type de ressource</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select
                            value={demarche.isFile ? "file" : "link"}
                            onChange={(e) => updateDemarche(group.key, demarche.id, 'isFile', e.target.value === "file")}
                            disabled={loading}
                          >
                            <option value="link">Lien URL</option>
                            <option value="file">Fichier PDF</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="field">
                      {demarche.isFile ? (
                        <div>
                          <label className="label is-small">Fichier PDF</label>
                          <div className="is-flex" style={{ alignItems: 'center', gap: 8 }}>
                            <input
                              className="input"
                              type="text"
                              value={demarche.url}
                              onChange={(e) => updateDemarche(group.key, demarche.id, 'url', e.target.value)}
                              readOnly={true}
                              placeholder="Choisir un fichier..."
                              style={{ background: "#f5f5f5" }}
                            />
                            <button
                              type="button"
                              className="button is-info ml-2"
                              style={{ display: 'flex', alignItems: 'center', gap: 0, borderRadius: 8, paddingLeft: 12, paddingRight: 12 }}
                              onClick={() => handleFileUpload(group.key, demarche.id)}
                              disabled={loading}
                            >
                              <span role="img" aria-label="PDF" style={{ fontSize: 18 }}>📄</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="label is-small">URL du lien</label>
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              value={demarche.url}
                              onChange={(e) => updateDemarche(group.key, demarche.id, 'url', e.target.value)}
                              readOnly={loading}
                              style={{ background: loading ? "#f5f5f5" : "white" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="has-text-centered mt-2">
              <button
                type="button"
                className={`button is-link${loading ? ' is-loading' : ''}`}
                onClick={() => handleSaveSection(group.key)}
                disabled={loading}
                style={{ borderRadius: 8, marginTop: 8 }}
              >
                Enregistrer cette section
              </button>
            </div>
            <div className="has-text-centered mt-3">
              <button 
                type="button" 
                className="button is-info is-light" 
                onClick={() => addDemarche(group.key)}
                disabled={loading}
                style={{ borderRadius: 8 }}
              >
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
                <span>Ajouter une démarche</span>
              </button>
            </div>
          </div>
        ))}
        {/* PDF Règlement */}
        <div className="box mb-4" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
          <h3 className="subtitle is-5 mb-3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>📑</span> PDF Règlement
          </h3>
          <div className="field mb-3">
            <label className="label is-small">Nom du PDF règlement</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={pdfReglement.label}
                onChange={(e) => handlePdfReglementChange('label', e.target.value)}
                readOnly={loading}
                style={{ background: loading ? "#f5f5f5" : "white" }}
              />
            </div>
          </div>
          <div className="field">
            <label className="label is-small">Type de ressource</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  value={pdfReglement.isFile ? "file" : "link"}
                  onChange={(e) => handlePdfReglementChange('isFile', e.target.value === "file")}
                  disabled={loading}
                >
                  <option value="link">Lien URL</option>
                  <option value="file">Fichier PDF</option>
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            {pdfReglement.isFile ? (
              <div>
                <label className="label is-small">Fichier PDF</label>
                <div className="is-flex" style={{ alignItems: 'center', gap: 8 }}>
                  <input
                    className="input"
                    type="text"
                    value={pdfReglement.url}
                    onChange={(e) => handlePdfReglementChange('url', e.target.value)}
                    readOnly={true}
                    placeholder="Choisir un fichier..."
                    style={{ background: "#f5f5f5" }}
                  />
                  <button
                    type="button"
                    className="button is-info ml-2"
                    style={{ display: 'flex', alignItems: 'center', gap: 0, borderRadius: 8, paddingLeft: 12, paddingRight: 12 }}
                    onClick={() => handleFileUpload('reglement', null)}
                    disabled={loading}
                  >
                    <span role="img" aria-label="PDF" style={{ fontSize: 18 }}>📄</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="label is-small">URL du lien</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    value={pdfReglement.url}
                    onChange={(e) => handlePdfReglementChange('url', e.target.value)}
                    readOnly={loading}
                    style={{ background: loading ? "#f5f5f5" : "white" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Boutons de sauvegarde */}
        <div className="field is-grouped mt-4">
          <div className="control">
            <button className={`button is-link${loading ? ' is-loading' : ''}`} type="submit" disabled={loading} style={{ borderRadius: 8 }}>
              Enregistrer
            </button>
          </div>
          {msg && (
            <div className={`notification is-light ${msg.includes('Erreur') ? 'is-danger' : 'is-success'} py-2 px-3 ml-3`} style={{ borderRadius: 8 }}>
              {msg}
            </div>
          )}
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} newestOnTop />
    </div>
  );
}