import React, { useState, useEffect } from 'react';

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
        for (let i = 1; i <= 20; i++) { // Augmenté de 4 à 20
          const labelKey = `urbanisme_${i}_label`;
          const urlKey = `urbanisme_${i}_url`;
          if (obj[labelKey]) {
            urbanismeData.push({
              id: i,
              label: obj[labelKey] || '',
              url: obj[urlKey] || '',
              isFile: obj[urlKey]?.endsWith('.pdf') || false
            });
          }
        }
        
        // Initialiser autres démarches
        const autresData = [];
        for (let i = 1; i <= 20; i++) { // Augmenté de 3 à 20
          const labelKey = `autre_${i}_label`;
          const urlKey = `autre_${i}_url`;
          if (obj[labelKey]) {
            autresData.push({
              id: i,
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
    setDemarches(prev => ({
      ...prev,
      [group]: prev[group].filter(d => d.id !== id)
    }));
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
  const prepareDataForSave = () => {
    const saveData = {
      page: 'demarches',
      ...headerForm
    };
    
    // Réinitialiser tous les champs existants pour éviter les doublons
    for (let i = 1; i <= 20; i++) {  // Augmenté à 20 pour supporter plus d'entrées
      saveData[`demarche_rapide_${i}_label`] = '';
      saveData[`demarche_rapide_${i}_url`] = '';
      saveData[`urbanisme_${i}_label`] = '';
      saveData[`urbanisme_${i}_url`] = '';
      saveData[`autre_${i}_label`] = '';
      saveData[`autre_${i}_url`] = '';
    }
    
    // Démarches rapides - utiliser l'index + 1 pour une numérotation séquentielle
    demarches.rapides.forEach((d, index) => {
      const i = index + 1;
      saveData[`demarche_rapide_${i}_label`] = d.label;
      saveData[`demarche_rapide_${i}_url`] = d.url;
    });
    
    // Démarches urbanisme
    demarches.urbanisme.forEach((d, index) => {
      const i = index + 1;
      saveData[`urbanisme_${i}_label`] = d.label;
      saveData[`urbanisme_${i}_url`] = d.url;
    });
    
    // Autres démarches
    demarches.autres.forEach((d, index) => {
      const i = index + 1;
      saveData[`autre_${i}_label`] = d.label;
      saveData[`autre_${i}_url`] = d.url;
    });
    
    // PDF règlement
    saveData.pdf_reglement_label = pdfReglement.label;
    saveData.pdf_reglement_url = pdfReglement.url;
    
    return saveData; // Assurez-vous que cette ligne est présente
  };

  // Sauvegarder les données
  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    
    const saveData = prepareDataForSave();
    
    try {
      await fetch('/api/pageContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      });
      setMsg('Modifications enregistrées !');
      setTimeout(() => setMsg(''), 2000);
    } catch (error) {
      setMsg('Erreur lors de la sauvegarde');
      console.error("Erreur de sauvegarde:", error);
      setTimeout(() => setMsg(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Gérer l'upload de fichiers PDF
  const handleFileUpload = async (group, id) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf';
    
    fileInput.onchange = async (e) => {
      if (!e.target.files || !e.target.files[0]) return;
      
      const file = e.target.files[0];
      
      setLoading(true);
      try {
        // Créer une FormData
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
        
        setMsg('Fichier téléchargé avec succès!');
        setTimeout(() => setMsg(''), 2000);
      } catch (error) {
        setMsg('Erreur lors du téléchargement: ' + error.message);
        console.error('Erreur upload:', error);
        setTimeout(() => setMsg(''), 3000);
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

  // Ajoute cette fonction avant le return
  const handleSaveSection = async (groupKey) => {
    setLoading(true);
    setMsg('');
    // Prépare les données comme dans handleSave, mais ne sauvegarde que la section concernée
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
    // Remplit uniquement la section concernée
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
    // Ajoute le PDF règlement pour ne pas l'effacer
    saveData.pdf_reglement_label = pdfReglement.label;
    saveData.pdf_reglement_url = pdfReglement.url;

    try {
      await fetch('/api/pageContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      });
      setMsg(`Section "${GROUPS.find(g => g.key === groupKey).title}" enregistrée !`);
      setTimeout(() => setMsg(''), 2000);
    } catch (error) {
      setMsg('Erreur lors de la sauvegarde');
      setTimeout(() => setMsg(''), 3000);
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
                          className="delete" 
                          onClick={() => removeDemarche(group.key, demarche.id)}
                          disabled={loading}
                        />
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
                          <div className="is-flex">
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
                              onClick={() => handleFileUpload(group.key, demarche.id)}
                              disabled={loading}
                            >
                              <span className="icon">
                                <i className="fas fa-upload"></i>
                              </span>
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
                <div className="is-flex">
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
                    onClick={() => handleFileUpload('reglement', null)}
                    disabled={loading}
                  >
                    <span className="icon">
                      <i className="fas fa-upload"></i>
                    </span>
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
    </div>
  );
}