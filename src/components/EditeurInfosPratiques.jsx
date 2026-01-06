import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditeurInfosPratiques() {
  const [activeTab, setActiveTab] = useState('bulletins');
  const [content, setContent] = useState({
    bulletins: [],
    manifestations: [],
    contacts: {
      urgence: [],
      securite: [],
      services: []
    },
    collecteDechets: {
      ordures: "",
      recyclables: "",
      biodechets: "",
      verre: "",
      encombrants: "",
      dechetteries: [],
      faq: [],
      documents: []
    },
    salles: [],
    reservations: [],
    chasse: {
      battues: [],
      lots: [],
      reglementation: "",
      contacts: []
    },
    liensUtiles: [],
    eauPotable: {
      releve: "",
      tarifs: "",
      qualite: "",
      contacts: []
    },
    liensUtilesContacts: []
  });
  const [loading, setLoading] = useState(false);
  const [savingSection, setSavingSection] = useState(null);

  useEffect(() => {
    fetch('/api/pageContent?page=infos_pratiques')
      .then(res => res.json())
      .then(data => setContent({ ...content, ...(data[0] || {}) }))
      .catch(() => toast.error('Erreur lors du chargement'));
    // eslint-disable-next-line
  }, []);

  const handleListChange = (section, idx, field, value) => {
    const arr = [...content[section]];
    arr[idx][field] = value;
    setContent({ ...content, [section]: arr });
  };

  const addListItem = (section, template) => {
    setContent({ ...content, [section]: [...(content[section] || []), template] });
  };

  const removeListItem = (section, idx, itemName = 'cet élément') => {
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

  const handleNestedListChange = (parent, section, idx, field, value) => {
    const arr = [...content[parent][section]];
    arr[idx][field] = value;
    setContent({
      ...content,
      [parent]: {
        ...content[parent],
        [section]: arr
      }
    });
  };

  const addNestedListItem = (parent, section, template) => {
    setContent({
      ...content,
      [parent]: {
        ...content[parent],
        [section]: [...(content[parent][section] || []), template]
      }
    });
  };

  const removeNestedListItem = (parent, section, idx, itemName = 'cet élément') => {
    toast.info(
      <div>
        <p className="mb-2">Supprimer <strong>{itemName}</strong> ?</p>
        <div className="buttons mt-3">
          <button
            className="button is-danger is-small"
            onClick={() => {
              toast.dismiss();
              setContent({
                ...content,
                [parent]: {
                  ...content[parent],
                  [section]: content[parent][section].filter((_, i) => i !== idx)
                }
              });
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

  const saveSection = async (sectionName) => {
    setSavingSection(sectionName);
    const toastId = toast.loading('Enregistrement...');

    try {
      await fetch('/api/pageContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'infos_pratiques',
          ...content
        })
      });

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
          page: 'infos_pratiques',
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
          📝 Éditeur - Informations pratiques
        </h1>

        <div className="tabs is-boxed mb-5">
          <ul>
            <li className={activeTab === 'contacts' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('contacts')}>Contacts & Urgences</a>
            </li>
            <li className={activeTab === 'dechets' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('dechets')}>Déchets</a>
            </li>
            <li className={activeTab === 'bulletins' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('bulletins')}>Bulletins communal</a>
            </li>
            <li className={activeTab === 'salles' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('salles')}>Salles & Réservations</a>
            </li>
            <li className={activeTab === 'eau' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('eau')}>Service des eaux</a>
            </li>
            <li className={activeTab === 'chasse' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('chasse')}>Chasse</a>
            </li>
          </ul>
        </div>

        <form onSubmit={handleSave}>
          {activeTab === 'bulletins' && (
            <>
              {/* Introduction */}
              <div className="box mb-6">
                <h2 className="title is-4 has-text-link mb-4">📝 Introduction - Bulletins communaux</h2>
                
                <label className="label">Titre principal</label>
                <input 
                  className="input mb-3" 
                  value={content.bulletinsInfo?.titre || "Bulletin communal"} 
                  onChange={e => setContent({ 
                    ...content, 
                    bulletinsInfo: { 
                      ...content.bulletinsInfo, 
                      titre: e.target.value 
                    } 
                  })} 
                  placeholder="Titre de la section"
                />
                
                <label className="label">Texte d'introduction</label>
                <textarea 
                  className="textarea mb-3" 
                  value={content.bulletinsInfo?.introduction || ""} 
                  onChange={e => setContent({ 
                    ...content, 
                    bulletinsInfo: { 
                      ...content.bulletinsInfo, 
                      introduction: e.target.value 
                    } 
                  })} 
                  placeholder="Texte d'introduction"
                  rows={3}
                />

                <div className="has-text-centered mt-3">
                  <button 
                    type="button" 
                    className={`button is-link${savingSection === 'bulletinsInfo' ? ' is-loading' : ''}`}
                    onClick={() => saveSection('bulletinsInfo')}
                    disabled={savingSection !== null}
                    style={{ borderRadius: 8 }}
                  >
                    <span style={{ marginRight: 8 }}>💾</span>
                    Enregistrer cette section
                  </button>
                </div>
              </div>

              {/* Bulletins récents */}
              <div className="box mb-6">
                <h2 className="title is-4 has-text-link mb-4">📰 Bulletins récents</h2>
                
                {(content.bulletins || []).map((bulletin, i) => (
                  <div key={i} className="box mb-3" style={{ background: "#f9fbfd", borderRadius: 12, border: '1.5px solid #e0e7ef' }}>
                    <div className="is-flex is-justify-content-space-between mb-2">
                      <span className="tag is-info is-light">Bulletin #{i + 1}</span>
                      <button 
                        type="button" 
                        className="button is-small is-danger"
                        onClick={() => removeListItem('bulletins', i, bulletin.titre || 'ce bulletin')}
                        disabled={savingSection !== null}
                        title="Supprimer"
                      >
                        <span role="img" aria-label="Supprimer">🗑️</span>
                      </button>
                    </div>
                    
                    <div className="columns">
                      <div className="column is-3">
                        <label className="label">Date</label>
                        <input 
                          className="input" 
                          value={bulletin.date || ""} 
                          onChange={e => handleListChange('bulletins', i, 'date', e.target.value)} 
                          placeholder="Ex: Juin 2025"
                        />
                      </div>
                      <div className="column">
                        <label className="label">Titre</label>
                        <input 
                          className="input" 
                          value={bulletin.titre || ""} 
                          onChange={e => handleListChange('bulletins', i, 'titre', e.target.value)} 
                          placeholder="Ex: Bulletin municipal - Été 2025"
                        />
                      </div>
                    </div>
                    
                    <div className="columns">
                      <div className="column">
                        <label className="label">Nom du fichier</label>
                        <div className="field has-addons">
                          <div className="control is-expanded">
                            <input 
                              className="input" 
                              value={bulletin.fichier || ""} 
                              onChange={e => handleListChange('bulletins', i, 'fichier', e.target.value)} 
                              placeholder="Ex: bulletin-ete-2025.pdf"
                            />
                          </div>
                          <div className="control">
                            <button
                              type="button"
                              className="button is-info"
                              onClick={() => {
                                const fileInput = document.createElement("input");
                                fileInput.type = "file";
                                fileInput.accept = ".pdf";
                                fileInput.onchange = async e => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const toastId = toast.loading('Upload du bulletin PDF...');
                                    const formData = new FormData();
                                    formData.append("file", file);

                                    try {
                                      const response = await fetch("/api/upload_doc", {
                                        method: "POST",
                                        body: formData,
                                      });
                                      const data = await response.json();
                                      if (response.ok) {
                                        // Extraire juste le nom du fichier depuis l'URL
                                        const fileName = data.fileUrl.split('/').pop();
                                        handleListChange('bulletins', i, 'fichier', fileName);
                                        toast.update(toastId, {
                                          render: '✅ Bulletin PDF uploadé !',
                                          type: 'success',
                                          isLoading: false,
                                          autoClose: 2000
                                        });
                                      } else {
                                        toast.update(toastId, {
                                          render: '❌ Erreur lors de l\'upload',
                                          type: 'error',
                                          isLoading: false,
                                          autoClose: 3000
                                        });
                                      }
                                    } catch (error) {
                                      console.error("Erreur lors de l'upload :", error);
                                      toast.update(toastId, {
                                        render: '❌ Erreur lors de l\'upload',
                                        type: 'error',
                                        isLoading: false,
                                        autoClose: 3000
                                      });
                                    }
                                  }
                                };
                                fileInput.click();
                              }}
                              title="Uploader un fichier PDF"
                            >
                              <span className="icon">
                                <i className="fas fa-upload"></i>
                              </span>
                              <span>Upload PDF</span>
                            </button>
                          </div>
                        </div>
                        {bulletin.fichier && (
                          <p className="help has-text-success">
                            <span className="icon is-small">
                              <i className="fas fa-check-circle"></i>
                            </span>
                            Fichier: {bulletin.fichier}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="has-text-centered">
                  <button 
                    type="button" 
                    className="button is-link is-light" 
                    onClick={() => addListItem('bulletins', { id: Date.now(), titre: "", date: "", fichier: "" })}
                    style={{ borderRadius: 8 }}
                  >
                    <span className="icon">
                      <i className="fas fa-plus"></i>
                    </span>
                    <span>Ajouter un bulletin récent</span>
                  </button>
                </div>

                <div className="has-text-centered mt-3">
                  <button 
                    type="button" 
                    className={`button is-link${savingSection === 'bulletins' ? ' is-loading' : ''}`}
                    onClick={() => saveSection('bulletins')}
                    disabled={savingSection !== null}
                    style={{ borderRadius: 8 }}
                  >
                    <span style={{ marginRight: 8 }}>💾</span>
                    Enregistrer cette section
                  </button>
                </div>
              </div>

              {/* Gestion des archives par année */}
              <div className="box mb-6">
                <h2 className="title is-4 has-text-link mb-4">🗄️ Archives des bulletins</h2>

                {/* Gestion des années d'archives */}
                <div className="field mb-5">
                  <label className="label">Années disponibles</label>
                  <div className="tags input-tag">
                    {(content.archivesBulletinsAnnees || []).map((annee, i) => (
                      <span key={i} className="tag is-link is-medium">
                        {annee}
                        <button 
                          type="button" 
                          className="delete is-small" 
                          onClick={() => {
                            const newAnnees = [...content.archivesBulletinsAnnees];
                            newAnnees.splice(i, 1);
                            setContent({...content, archivesBulletinsAnnees: newAnnees});
                          }}
                        ></button>
                      </span>
                    ))}
                    
                    <input 
                      className="input is-small tag-input" 
                      style={{ border: 'none', outline: 'none', width: '80px' }}
                      placeholder="Ajouter..."
                      onKeyDown={e => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          const nouvelleAnnee = e.target.value.trim();
                          if (!/^\d{4}$/.test(nouvelleAnnee)) {
                            alert("Veuillez entrer une année au format YYYY (ex: 2024)");
                            return;
                          }
                          
                          const annees = [...(content.archivesBulletinsAnnees || [])];
                          if (!annees.includes(nouvelleAnnee)) {
                            annees.push(nouvelleAnnee);
                            annees.sort((a, b) => parseInt(b) - parseInt(a)); // Trier par ordre décroissant
                            setContent({...content, archivesBulletinsAnnees: annees});
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                  <p className="help">Appuyez sur Entrée pour ajouter une année</p>
                </div>

                {/* Gestion des bulletins par année */}
                {(content.archivesBulletinsAnnees || []).length > 0 && (
                  <div className="field">
                    <label className="label">Bulletins par année</label>
                    
                    <div className="tabs">
                      <ul>
                        {(content.archivesBulletinsAnnees || []).map((annee, i) => (
                          <li key={i} className={content.archiveAnneeActive === annee ? 'is-active' : ''}>
                            <a onClick={() => setContent({...content, archiveAnneeActive: annee})}>
                              {annee}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {content.archiveAnneeActive && (
                      <>
                        <table className="table is-fullwidth">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Titre</th>
                              <th>Fichier</th>
                              <th width="150">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {((content.archivesBulletins || {})[content.archiveAnneeActive] || []).map((bulletin, i) => (
                              <tr key={i}>
                                <td>
                                  <input 
                                    className="input is-small" 
                                    value={bulletin.date || ""} 
                                    onChange={e => {
                                      const newArchives = {...content.archivesBulletins};
                                      newArchives[content.archiveAnneeActive][i].date = e.target.value;
                                      setContent({...content, archivesBulletins: newArchives});
                                    }} 
                                    placeholder="Ex: Mars 2024"
                                  />
                                </td>
                                <td>
                                  <input 
                                    className="input is-small" 
                                    value={bulletin.titre || ""} 
                                    onChange={e => {
                                      const newArchives = {...content.archivesBulletins};
                                      newArchives[content.archiveAnneeActive][i].titre = e.target.value;
                                      setContent({...content, archivesBulletins: newArchives});
                                    }} 
                                    placeholder="Titre du bulletin"
                                  />
                                </td>
                                <td>
                                  <div className="field has-addons mb-0">
                                    <div className="control is-expanded">
                                      <input 
                                        className="input is-small" 
                                        value={bulletin.fichier || ""} 
                                        onChange={e => {
                                          const newArchives = {...content.archivesBulletins};
                                          newArchives[content.archiveAnneeActive][i].fichier = e.target.value;
                                          setContent({...content, archivesBulletins: newArchives});
                                        }} 
                                        placeholder="Nom du fichier"
                                      />
                                    </div>
                                    <div className="control">
                                      <button
                                        type="button"
                                        className="button is-info is-small"
                                        onClick={() => {
                                          const fileInput = document.createElement("input");
                                          fileInput.type = "file";
                                          fileInput.accept = ".pdf";
                                          fileInput.onchange = async e => {
                                            const file = e.target.files[0];
                                            if (file) {
                                              const toastId = toast.loading('Upload du bulletin PDF...');
                                              const formData = new FormData();
                                              formData.append("file", file);

                                              try {
                                                const response = await fetch("/api/upload_doc", {
                                                  method: "POST",
                                                  body: formData,
                                                });
                                                const data = await response.json();
                                                if (response.ok) {
                                                  const fileName = data.fileUrl.split('/').pop();
                                                  const newArchives = {...content.archivesBulletins};
                                                  newArchives[content.archiveAnneeActive][i].fichier = fileName;
                                                  setContent({...content, archivesBulletins: newArchives});
                                                  toast.update(toastId, {
                                                    render: '✅ Bulletin PDF uploadé !',
                                                    type: 'success',
                                                    isLoading: false,
                                                    autoClose: 2000
                                                  });
                                                } else {
                                                  toast.update(toastId, {
                                                    render: '❌ Erreur lors de l\'upload',
                                                    type: 'error',
                                                    isLoading: false,
                                                    autoClose: 3000
                                                  });
                                                }
                                              } catch (error) {
                                                console.error("Erreur lors de l'upload :", error);
                                                toast.update(toastId, {
                                                  render: '❌ Erreur lors de l\'upload',
                                                  type: 'error',
                                                  isLoading: false,
                                                  autoClose: 3000
                                                });
                                              }
                                            }
                                          };
                                          fileInput.click();
                                        }}
                                        title="Uploader un fichier PDF"
                                      >
                                        <span className="icon">
                                          <i className="fas fa-upload"></i>
                                        </span>
                                      </button>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="buttons are-small">
                                    <button 
                                      type="button" 
                                      className="button is-danger is-small" 
                                      onClick={() => {
                                        const newArchives = {...content.archivesBulletins};
                                        newArchives[content.archiveAnneeActive].splice(i, 1);
                                        setContent({...content, archivesBulletins: newArchives});
                                      }}
                                      title="Supprimer"
                                    >
                                      <span className="icon is-small"><i className="fas fa-trash"></i></span>
                                      <span>🗑️</span>
                                    </button>
                                    <button 
                                      type="button" 
                                      className="button is-info is-small" 
                                      onClick={() => {
                                        const newArchives = {...content.archivesBulletins};
                                        const bulletins = newArchives[content.archiveAnneeActive];
                                        
                                        if (i > 0) {
                                          [bulletins[i], bulletins[i-1]] = [bulletins[i-1], bulletins[i]];
                                          setContent({...content, archivesBulletins: newArchives});
                                        }
                                      }}
                                      disabled={i === 0}
                                      title="Monter"
                                    >
                                      <span className="icon is-small"><i className="fas fa-arrow-up"></i></span>
                                      <span>⬆️</span>
                                    </button>
                                    <button 
                                      type="button" 
                                      className="button is-info is-small" 
                                      onClick={() => {
                                        const newArchives = {...content.archivesBulletins};
                                        const bulletins = newArchives[content.archiveAnneeActive];
                                        
                                        if (i < bulletins.length - 1) {
                                          [bulletins[i], bulletins[i+1]] = [bulletins[i+1], bulletins[i]];
                                          setContent({...content, archivesBulletins: newArchives});
                                        }
                                      }}
                                      disabled={i === ((content.archivesBulletins || {})[content.archiveAnneeActive] || []).length - 1}
                                      title="Descendre"
                                    >
                                      <span className="icon is-small"><i className="fas fa-arrow-down"></i></span>
                                      <span>⬇️</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        
                        <button 
                          type="button" 
                          className="button is-link is-light" 
                          onClick={() => {
                            const newArchives = {...content.archivesBulletins || {}};
                            
                            if (!newArchives[content.archiveAnneeActive]) {
                              newArchives[content.archiveAnneeActive] = [];
                            }
                            
                            newArchives[content.archiveAnneeActive].push({
                              date: "",
                              titre: "",
                              fichier: ""
                            });
                            
                            setContent({...content, archivesBulletins: newArchives});
                          }}
                        >
                          <span className="icon"><i className="fas fa-plus"></i></span>
                          <span>Ajouter un bulletin pour {content.archiveAnneeActive}</span>
                        </button>
                      </>
                    )}
                  </div>
                )}

                <div className="has-text-centered mt-4">
                  <button 
                    type="button" 
                    className={`button is-link${savingSection === 'archivesBulletins' ? ' is-loading' : ''}`}
                    onClick={() => saveSection('archivesBulletins')}
                    disabled={savingSection !== null}
                    style={{ borderRadius: 8 }}
                  >
                    <span style={{ marginRight: 8 }}>💾</span>
                    Enregistrer les archives
                  </button>
                </div>
              </div>

              {/* Paramètres d'affichage */}
              <div className="box mb-6">
                <h2 className="title is-4 has-text-link mb-4">⚙️ Paramètres d'affichage</h2>
                
                <div className="field">
                  <label className="label">Année d'archive affichée par défaut</label>
                  <div className="select">
                    <select 
                      value={content.archiveAnneeDefaut || ""} 
                      onChange={e => setContent({...content, archiveAnneeDefaut: e.target.value})}
                    >
                      <option value="">Sélectionnez une année</option>
                      {(content.archivesBulletinsAnnees || []).map((annee, i) => (
                        <option key={i} value={annee}>{annee}</option>
                      ))}
                    </select>
                  </div>
                  <p className="help">Cette année sera sélectionnée par défaut dans la section archives</p>
                </div>
                
                <div className="field">
                  <label className="label">Nombre de bulletins récents à afficher</label>
                  <div className="control">
                    <input 
                      type="number" 
                      className="input" 
                      value={content.nombreBulletinsRecents || 4} 
                      onChange={e => setContent({...content, nombreBulletinsRecents: parseInt(e.target.value) || 4})}
                      min="1" 
                      max="8"
                    />
                  </div>
                  <p className="help">Nombre de bulletins à afficher en haut de la page (recommandé: 4)</p>
                </div>

                <div className="has-text-centered mt-4">
                  <button 
                    type="button" 
                    className={`button is-link${savingSection === 'parametresAffichage' ? ' is-loading' : ''}`}
                    onClick={() => saveSection('parametresAffichage')}
                    disabled={savingSection !== null}
                    style={{ borderRadius: 8 }}
                  >
                    <span style={{ marginRight: 8 }}>💾</span>
                    Enregistrer les paramètres
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'contacts' && (
            <>
              <div className="box mb-6">
                <h2 className="title is-4 has-text-danger mb-4">📞 Numéros d'urgence</h2>
                {content.contacts.urgence.map((c, i) => (
                  <div key={i} className="box mb-2" style={{ background: "#f9fbfd", borderRadius: 12 }}>
                    <div className="is-flex is-justify-content-space-between mb-2">
                      <span className="tag is-danger is-light">Contact #{i + 1}</span>
                      <button 
                        type="button" 
                        className="button is-small is-danger"
                        onClick={() => removeNestedListItem('contacts', 'urgence', i, c.service || 'ce contact')}
                        disabled={savingSection !== null}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                    <label className="label">Service</label>
                    <input className="input mb-2" value={c.service} onChange={e => handleNestedListChange('contacts', 'urgence', i, 'service', e.target.value)} placeholder="Service" />
                    <label className="label">Numéro</label>
                    <input className="input mb-2" value={c.numero} onChange={e => handleNestedListChange('contacts', 'urgence', i, 'numero', e.target.value)} placeholder="Numéro" />
                    <label className="label">Détails</label>
                    <input className="input mb-2" value={c.details} onChange={e => handleNestedListChange('contacts', 'urgence', i, 'details', e.target.value)} placeholder="Détails" />
                  </div>
                ))}
                <div className="has-text-centered">
                  <button type="button" className="button is-link is-light" onClick={() => addNestedListItem('contacts', 'urgence', { service: "", numero: "", details: "" })} style={{ borderRadius: 8 }}>
                    <span className="icon"><i className="fas fa-plus"></i></span>
                    <span>Ajouter un contact</span>
                  </button>
                </div>
                <div className="has-text-centered mt-3">
                  <button 
                    type="button" 
                    className={`button is-link${savingSection === 'contactsUrgence' ? ' is-loading' : ''}`}
                    onClick={() => saveSection('contactsUrgence')}
                    disabled={savingSection !== null}
                    style={{ borderRadius: 8 }}
                  >
                    <span style={{ marginRight: 8 }}>💾</span>
                    Enregistrer cette section
                  </button>
                </div>
              </div>

              <div className="box mb-6">
                <h2 className="title is-4 has-text-danger mb-4">🔒 Services de sécurité</h2>
                {(content.contacts.securite || []).map((c, i) => (
                  <div key={i} className="box mb-2" style={{ background: "#f9fbfd", borderRadius: 12 }}>
                    <div className="is-flex is-justify-content-space-between mb-2">
                      <span className="tag is-danger is-light">Service #{i + 1}</span>
                      <button 
                        type="button" 
                        className="button is-small is-danger"
                        onClick={() => removeNestedListItem('contacts', 'securite', i, c.service || 'ce service')}
                        disabled={savingSection !== null}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                    <label className="label">Service</label>
                    <input className="input mb-2" value={c.service} onChange={e => handleNestedListChange('contacts', 'securite', i, 'service', e.target.value)} placeholder="Service" />
                    <label className="label">Numéro</label>
                    <input className="input mb-2" value={c.numero} onChange={e => handleNestedListChange('contacts', 'securite', i, 'numero', e.target.value)} placeholder="Numéro" />
                    <label className="label">Détails</label>
                    <input className="input mb-2" value={c.details} onChange={e => handleNestedListChange('contacts', 'securite', i, 'details', e.target.value)} placeholder="Détails" />
                    <label className="label">Horaires</label>
                    <input className="input mb-2" value={c.horaires} onChange={e => handleNestedListChange('contacts', 'securite', i, 'horaires', e.target.value)} placeholder="Horaires" />
                  </div>
                ))}
                <div className="has-text-centered">
                  <button type="button" className="button is-link is-light" onClick={() => addNestedListItem('contacts', 'securite', { service: "", numero: "", details: "", horaires: "" })} style={{ borderRadius: 8 }}>
                    <span className="icon"><i className="fas fa-plus"></i></span>
                    <span>Ajouter un contact de sécurité</span>
                  </button>
                </div>
                <div className="has-text-centered mt-3">
                  <button 
                    type="button" 
                    className={`button is-link${savingSection === 'contactsSecurite' ? ' is-loading' : ''}`}
                    onClick={() => saveSection('contactsSecurite')}
                    disabled={savingSection !== null}
                    style={{ borderRadius: 8 }}
                  >
                    <span style={{ marginRight: 8 }}>💾</span>
                    Enregistrer cette section
                  </button>
                </div>
              </div>

              <div className="box mb-6">
                <h2 className="title is-4 has-text-info mb-4">🏢 Services publics</h2>
                {(content.contacts.services || []).map((c, i) => (
                  <div key={i} className="box mb-2" style={{ background: "#f9fbfd", borderRadius: 12 }}>
                    <div className="is-flex is-justify-content-space-between mb-2">
                      <span className="tag is-info is-light">Service #{i + 1}</span>
                      <button 
                        type="button" 
                        className="button is-small is-danger"
                        onClick={() => removeNestedListItem('contacts', 'services', i, c.service || 'ce service')}
                        disabled={savingSection !== null}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                    <label className="label">Service</label>
                    <input className="input mb-2" value={c.service} onChange={e => handleNestedListChange('contacts', 'services', i, 'service', e.target.value)} placeholder="Service" />
                    <label className="label">Numéro</label>
                    <input className="input mb-2" value={c.numero} onChange={e => handleNestedListChange('contacts', 'services', i, 'numero', e.target.value)} placeholder="Numéro" />
                    <label className="label">Détails</label>
                    <input className="input mb-2" value={c.details} onChange={e => handleNestedListChange('contacts', 'services', i, 'details', e.target.value)} placeholder="Détails" />
                    <label className="label">Horaires</label>
                    <input className="input mb-2" value={c.horaires} onChange={e => handleNestedListChange('contacts', 'services', i, 'horaires', e.target.value)} placeholder="Horaires" />
                  </div>
                ))}
                <div className="has-text-centered">
                  <button type="button" className="button is-link is-light" onClick={() => addNestedListItem('contacts', 'services', { service: "", numero: "", details: "", horaires: "" })} style={{ borderRadius: 8 }}>
                    <span className="icon"><i className="fas fa-plus"></i></span>
                    <span>Ajouter un service public</span>
                  </button>
                </div>
                <div className="has-text-centered mt-3">
                  <button 
                    type="button" 
                    className={`button is-link${savingSection === 'contactsServices' ? ' is-loading' : ''}`}
                    onClick={() => saveSection('contactsServices')}
                    disabled={savingSection !== null}
                    style={{ borderRadius: 8 }}
                  >
                    <span style={{ marginRight: 8 }}>💾</span>
                    Enregistrer cette section
                  </button>
                </div>
              </div>

              <div className="box mb-6">
                <h2 className="title is-4 has-text-link mb-4">🔗 Liens utiles - Contacts et Urgences</h2>
                {(content.liensUtilesContacts || []).map((lien, i) => (
                  <div key={i} className="box mb-2" style={{ background: "#f9fbfd", borderRadius: 12 }}>
                    <div className="is-flex is-justify-content-space-between mb-2">
                      <span className="tag is-link is-light">Lien #{i + 1}</span>
                      <button 
                        type="button" 
                        className="button is-small is-danger"
                        onClick={() => {
                          const arr = (content.liensUtilesContacts || []).filter((_, idx) => idx !== i);
                          setContent({ ...content, liensUtilesContacts: arr });
                          toast.success('Lien supprimé', { autoClose: 2000 });
                        }}
                        disabled={savingSection !== null}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                    <label className="label">Titre</label>
                    <input className="input mb-2" value={lien.titre} onChange={e => {
                      const arr = [...(content.liensUtilesContacts || [])];
                      arr[i].titre = e.target.value;
                      setContent({ ...content, liensUtilesContacts: arr });
                    }} placeholder="Titre du lien" />
                    
                    <label className="label">Description</label>
                    <input className="input mb-2" value={lien.description} onChange={e => {
                      const arr = [...(content.liensUtilesContacts || [])];
                      arr[i].description = e.target.value;
                      setContent({ ...content, liensUtilesContacts: arr });
                    }} placeholder="Description du lien" />
                    
                    <label className="label">URL</label>
                    <input className="input mb-2" value={lien.url} onChange={e => {
                      const arr = [...(content.liensUtilesContacts || [])];
                      arr[i].url = e.target.value;
                      setContent({ ...content, liensUtilesContacts: arr });
                    }} placeholder="URL du lien" />
                    
                    <label className="label">Type de service</label>
                    <div className="select mb-2 is-fullwidth">
                      <select value={lien.type || 'urgence'} onChange={e => {
                        const arr = [...(content.liensUtilesContacts || [])];
                        arr[i].type = e.target.value;
                        setContent({ ...content, liensUtilesContacts: arr });
                      }}>
                        <option value="urgence">Urgence</option>
                        <option value="securite">Sécurité</option>
                        <option value="sante">Santé</option>
                        <option value="administratif">Démarche administrative</option>
                        <option value="autre">Autre service</option>
                      </select>
                    </div>
                    
                    <div className="buttons mt-3">
                      <button 
                        type="button" 
                        className="button is-small is-white"
                        title="Monter"
                        onClick={() => {
                          const arr = [...(content.liensUtilesContacts || [])];
                          if (i > 0) {
                            [arr[i], arr[i-1]] = [arr[i-1], arr[i]];
                            setContent({ ...content, liensUtilesContacts: arr });
                          }
                        }} 
                        disabled={i === 0}
                      >
                        ▲
                      </button>
                      <button 
                        type="button" 
                        className="button is-small is-white"
                        title="Descendre"
                        onClick={() => {
                          const arr = [...(content.liensUtilesContacts || [])];
                          if (i < arr.length - 1) {
                            [arr[i], arr[i+1]] = [arr[i+1], arr[i]];
                            setContent({ ...content, liensUtilesContacts: arr });
                          }
                        }} 
                        disabled={i === (content.liensUtilesContacts || []).length - 1}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                ))}
                <div className="has-text-centered">
                  <button type="button" className="button is-link is-light" onClick={() => {
                    const liensUtilesContacts = [...(content.liensUtilesContacts || []), { 
                      titre: "", 
                      description: "", 
                      url: "", 
                      type: "urgence" 
                    }];
                    setContent({ ...content, liensUtilesContacts });
                  }}>
                    <span className="icon"><i className="fas fa-plus"></i></span>
                    <span>Ajouter un lien utile</span>
                  </button>
                </div>

                {/* AJOUT DU BOUTON ENREGISTRER */}
                <div className="has-text-centered mt-3">
                  <button 
                    type="button" 
                    className={`button is-link${savingSection === 'liensUtilesContacts' ? ' is-loading' : ''}`}
                    onClick={() => saveSection('liensUtilesContacts')}
                    disabled={savingSection !== null}
                    style={{ borderRadius: 8 }}
                  >
                    <span style={{ marginRight: 8 }}>💾</span>
                    Enregistrer cette section
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'dechets' && (
            <>
              {/* Titre et introduction de la collecte des déchets */}
              <div className="box mb-6">
                <h2 className="title is-4 has-text-success mb-4">📝 Introduction - Collecte des déchets</h2>
                <label className="label">Titre de la section</label>
                <input 
                  className="input mb-3" 
                  value={content.collecteDechets?.titre || "Collecte des déchets à Friesen"} 
                  onChange={e => setContent({ 
                    ...content, 
                    collecteDechets: { 
                      ...content.collecteDechets, 
                      titre: e.target.value 
                    } 
                  })} 
                  placeholder="Titre de la section"
                />
                
                <label className="label">Texte d'introduction</label>
                <textarea 
                  className="textarea mb-3" 
                  value={content.collecteDechets?.introduction || "La collecte et le traitement des déchets sont gérés par la Communauté de Communes Sud Alsace Largue (CCSAL). Consultez ci-dessous les jours de collecte et les consignes de tri."} 
                  onChange={e => setContent({ 
                    ...content, 
                    collecteDechets: { 
                      ...content.collecteDechets, 
                      introduction: e.target.value 
                    } 
                  })} 
                  placeholder="Texte d'introduction"
                  rows={3}
                />

                <div className="has-text-centered mt-3">
                  <button 
                    type="button" 
                    className={`button is-link${savingSection === 'collecteDechetsIntro' ? ' is-loading' : ''}`}
                    onClick={() => saveSection('collecteDechetsIntro')}
                    disabled={savingSection !== null}
                    style={{ borderRadius: 8 }}
                  >
                    <span style={{ marginRight: 8 }}>💾</span>
                    Enregistrer cette section
                  </button>
                </div>
              </div>

              {/* Collecte des déchets */}
              <div className="box mb-6">
                <h2 className="title is-4 has-text-success mb-4">♻️ Collecte des déchets</h2>
                
                <div className="field">
                  <label className="label">Ordures ménagères</label>
                  <div className="control">
                    <input 
                      className="input mb-2" 
                      type="text" 
                      value={content.collecteDechets?.ordures || ""} 
                      onChange={e => setContent({ 
                        ...content, 
                        collecteDechets: { 
                          ...content.collecteDechets, 
                          ordures: e.target.value 
                        } 
                      })} 
                      placeholder="Exemple : Le lundi matin" 
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Recyclables</label>
                  <div className="control">
                    <input 
                      className="input mb-2" 
                      type="text" 
                      value={content.collecteDechets?.recyclables || ""} 
                      onChange={e => setContent({ 
                        ...content, 
                        collecteDechets: { 
                          ...content.collecteDechets, 
                          recyclables: e.target.value 
                        } 
                      })} 
                      placeholder="Exemple : Le mercredi matin des semaines paires" 
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Biodéchets</label>
                  <div className="control">
                    <input 
                      className="input mb-2" 
                      type="text" 
                      value={content.collecteDechets?.biodechets || ""} 
                      onChange={e => setContent({ 
                        ...content, 
                        collecteDechets: { 
                          ...content.collecteDechets, 
                          biodechets: e.target.value 
                        } 
                      })} 
                      placeholder="Exemple : Le jeudi matin" 
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Verre</label>
                  <div className="control">
                    <input 
                      className="input mb-2" 
                      type="text" 
                      value={content.collecteDechets?.verre || ""} 
                      onChange={e => setContent({ 
                        ...content, 
                        collecteDechets: { 
                          ...content.collecteDechets, 
                          verre: e.target.value 
                        } 
                      })} 
                      placeholder="Exemple : Points d'apport volontaire (Place de la Mairie, Rue des Écoles)" 
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Encombrants</label>
                  <div className="control">
                    <input 
                      className="input mb-2" 
                      type="text" 
                      value={content.collecteDechets?.encombrants || ""} 
                      onChange={e => setContent({ 
                        ...content, 
                        collecteDechets: { 
                          ...content.collecteDechets, 
                          encombrants: e.target.value 
                        } 
                      })} 
                      placeholder="Exemple : 1er mardi des mois de mars, juin, septembre et décembre" 
                    />
                  </div>
                </div>

                <div className="has-text-centered mt-3">
                  <button 
                    type="button" 
                    className={`button is-link${savingSection === 'collecteDechetsHoraires' ? ' is-loading' : ''}`}
                    onClick={() => saveSection('collecteDechetsHoraires')}
                    disabled={savingSection !== null}
                    style={{ borderRadius: 8 }}
                  >
                    <span style={{ marginRight: 8 }}>💾</span>
                    Enregistrer cette section
                  </button>
                </div>
              </div>

              {/* Déchetteries */}
              <div className="box mb-6">
                <h2 className="title is-4 has-text-success mb-4">♻️ Déchetteries</h2>
                {(content.collecteDechets?.dechetteries || []).map((d, i) => (
                  <div key={i} className="box mb-2" style={{ background: "#f9fbfd", borderRadius: 12 }}>
                    <div className="is-flex is-justify-content-space-between mb-2">
                      <span className="tag is-success is-light">Déchetterie #{i + 1}</span>
                      <button 
                        type="button" 
                        className="button is-small is-danger"
                        onClick={() => {
                          toast.info(
                            <div>
                              <p className="mb-2">Supprimer <strong>{d.nom || 'cette déchetterie'}</strong> ?</p>
                              <div className="buttons mt-3">
                                <button
                                  className="button is-danger is-small"
                                  onClick={() => {
                                    toast.dismiss();
                                    const arr = content.collecteDechets.dechetteries.filter((_, idx) => idx !== i);
                                    setContent({ ...content, collecteDechets: { ...content.collecteDechets, dechetteries: arr } });
                                    toast.success('Déchetterie supprimée', { autoClose: 2000 });
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
                        }}
                        disabled={savingSection !== null}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                    <label className="label">Nom</label>
                    <input className="input mb-2" value={d.nom} onChange={e => {
                      const arr = [...content.collecteDechets.dechetteries];
                      arr[i].nom = e.target.value;
                      setContent({ ...content, collecteDechets: { ...content.collecteDechets, dechetteries: arr } });
                    }} placeholder="Nom" />
                    <label className="label">Adresse</label>
                    <input className="input mb-2" value={d.adresse} onChange={e => {
                      const arr = [...content.collecteDechets.dechetteries];
                      arr[i].adresse = e.target.value;
                      setContent({ ...content, collecteDechets: { ...content.collecteDechets, dechetteries: arr } });
                    }} placeholder="Adresse" />
                    <label className="label">Horaires</label>
                    <textarea className="textarea mb-2" value={d.horaires} onChange={e => {
                      const arr = [...content.collecteDechets.dechetteries];
                      arr[i].horaires = e.target.value;
                      setContent({ ...content, collecteDechets: { ...content.collecteDechets, dechetteries: arr } });
                    }} placeholder="Horaires" />
                  </div>
                ))}
                <div className="has-text-centered">
                  <button type="button" className="button is-link is-light" onClick={() => {
                    const dechetteries = [...(content.collecteDechets.dechetteries || []), { nom: "", adresse: "", horaires: "" }];
                    setContent({ ...content, collecteDechets: { ...content.collecteDechets, dechetteries } });
                  }} style={{ borderRadius: 8 }}>
                    <span className="icon"><i className="fas fa-plus"></i></span>
                    <span>Ajouter une déchetterie</span>
                  </button>
                </div>

                <div className="has-text-centered mt-3">
                  <button 
                    type="button" 
                    className={`button is-link${savingSection === 'dechetteries' ? ' is-loading' : ''}`}
                    onClick={() => saveSection('dechetteries')}
                    disabled={savingSection !== null}
                    style={{ borderRadius: 8 }}
                  >
                    <span style={{ marginRight: 8 }}>💾</span>
                    Enregistrer cette section
                  </button>
                </div>
              </div>

              {/* Documents utiles */}
              <div className="box mb-6">
                <h2 className="title is-4 has-text-success mb-4">📄 Documents utiles</h2>
                {(content.collecteDechets?.documents || []).map((doc, i) => (
                  <div key={i} className="box mb-2" style={{ background: "#f9fbfd", borderRadius: 12 }}>
                    <div className="is-flex is-justify-content-space-between mb-2">
                      <span className="tag is-success is-light">Document #{i + 1}</span>
                      <button
                        type="button"
                        className="button is-small is-danger"
                        onClick={() => {
                          toast.info(
                            <div>
                              <p className="mb-2">Supprimer <strong>{doc.titre || 'ce document'}</strong> ?</p>
                              <div className="buttons mt-3">
                                <button
                                  className="button is-danger is-small"
                                  onClick={() => {
                                    toast.dismiss();
                                    const arr = content.collecteDechets.documents.filter((_, idx) => idx !== i);
                                    setContent({ ...content, collecteDechets: { ...content.collecteDechets, documents: arr } });
                                    toast.success('Document supprimé', { autoClose: 2000 });
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
                        }}
                        disabled={savingSection !== null}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                    <label className="label">Titre</label>
                    <input
                      className="input mb-2"
                      value={doc.titre}
                      onChange={e => {
                        const arr = [...content.collecteDechets.documents];
                        arr[i].titre = e.target.value;
                        setContent({ ...content, collecteDechets: { ...content.collecteDechets, documents: arr } });
                      }}
                      placeholder="Titre"
                    />

                    <label className="label">Fichier</label>
                    <div className="field has-addons">
                      <div className="control is-expanded">
                        <input
                          className="input mb-2"
                          type="text"
                          value={doc.fichier || ""}
                          onChange={e => {
                            const arr = [...content.collecteDechets.documents];
                            arr[i].fichier = e.target.value;
                            setContent({ ...content, collecteDechets: { ...content.collecteDechets, documents: arr } });
                          }}
                          placeholder="Aucun fichier sélectionné"
                        />
                      </div>
                      <div className="control">
                        <button
                          type="button"
                          className="button is-info"
                          onClick={() => {
                            const fileInput = document.createElement("input");
                            fileInput.type = "file";
                            fileInput.accept = ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg";
                            fileInput.onchange = async e => {
                              const file = e.target.files[0];
                              if (file) {
                                const toastId = toast.loading('Upload du fichier...');
                                const formData = new FormData();
                                formData.append("file", file);

                                try {
                                  const response = await fetch("/api/upload_doc", {
                                    method: "POST",
                                    body: formData,
                                  });
                                  const data = await response.json();
                                  if (response.ok) {
                                    const arr = [...content.collecteDechets.documents];
                                    arr[i].fichier = data.fileUrl;
                                    setContent({ ...content, collecteDechets: { ...content.collecteDechets, documents: arr } });
                                    toast.update(toastId, {
                                      render: '✅ Fichier uploadé !',
                                      type: 'success',
                                      isLoading: false,
                                      autoClose: 2000
                                    });
                                  } else {
                                    toast.update(toastId, {
                                      render: '❌ Erreur lors de l\'upload',
                                      type: 'error',
                                      isLoading: false,
                                      autoClose: 3000
                                    });
                                  }
                                } catch (error) {
                                  console.error("Erreur lors de l'upload :", error);
                                  toast.update(toastId, {
                                    render: '❌ Erreur lors de l\'upload',
                                    type: 'error',
                                    isLoading: false,
                                    autoClose: 3000
                                  });
                                }
                              }
                            };
                            fileInput.click();
                          }}
                          title="Uploader un fichier"
                        >
                          📄
                        </button>
                      </div>
                      {doc.fichier && (
                        <div className="control">
                          <button
                            type="button"
                            className="button is-danger"
                            onClick={() => {
                              const arr = [...content.collecteDechets.documents];
                              arr[i].fichier = "";
                              setContent({ ...content, collecteDechets: { ...content.collecteDechets, documents: arr } });
                              toast.success('Fichier retiré', { autoClose: 2000 });
                            }}
                            title="Retirer le fichier"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="has-text-centered">
                  <button
                    type="button"
                    className="button is-link is-light"
                    onClick={() => {
                      const documents = [...(content.collecteDechets.documents || []), { titre: "", fichier: "" }];
                      setContent({ ...content, collecteDechets: { ...content.collecteDechets, documents } });
                    }}
                    style={{ borderRadius: 8 }}
                  >
                    <span className="icon"><i className="fas fa-plus"></i></span>
                    <span>Ajouter un document</span>
                  </button>
                </div>

                <div className="has-text-centered mt-3">
                  <button 
                    type="button" 
                    className={`button is-link${savingSection === 'documentsCollecte' ? ' is-loading' : ''}`}
                    onClick={() => saveSection('documentsCollecte')}
                    disabled={savingSection !== null}
                    style={{ borderRadius: 8 }}
                  >
                    <span style={{ marginRight: 8 }}>💾</span>
                    Enregistrer cette section
                  </button>
                </div>
              </div>

              {/* Questions fréquentes */}
              <div className="box mb-6">
                <h2 className="title is-4 has-text-success mb-4">❓ Questions fréquentes</h2>
                {(content.collecteDechets?.faq || []).map((q, i) => (
                  <div key={i} className="box mb-3" style={{ background: "#f9fbfd", borderRadius: 12 }}>
                    <div className="is-flex is-justify-content-space-between mb-2">
                      <span className="tag is-success is-light">Question #{i + 1}</span>
                      <button
                        type="button"
                        className="button is-small is-danger"
                        onClick={() => {
                          toast.info(
                            <div>
                              <p className="mb-2">Supprimer <strong>{q.question || 'cette question'}</strong> ?</p>
                              <div className="buttons mt-3">
                                <button
                                  className="button is-danger is-small"
                                  onClick={() => {
                                    toast.dismiss();
                                    const arr = content.collecteDechets.faq.filter((_, idx) => idx !== i);
                                    setContent({ ...content, collecteDechets: { ...content.collecteDechets, faq: arr } });
                                    toast.success('Question supprimée', { autoClose: 2000 });
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
                        }}
                        disabled={savingSection !== null}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="field">
                      <label className="label">Question</label>
                      <input
                        className="input mb-2"
                        value={q.question}
                        onChange={e => {
                          const arr = [...content.collecteDechets.faq];
                          arr[i].question = e.target.value;
                          setContent({ ...content, collecteDechets: { ...content.collecteDechets, faq: arr } });
                        }}
                        placeholder="Entrez la question"
                      />
                    </div>
                    <div className="field">
                      <label className="label">Réponse</label>
                      <textarea
                        className="textarea mb-2"
                        value={q.reponse}
                        onChange={e => {
                          const arr = [...content.collecteDechets.faq];
                          arr[i].reponse = e.target.value;
                          setContent({ ...content, collecteDechets: { ...content.collecteDechets, faq: arr } });
                        }}
                        placeholder="Entrez la réponse"
                      />
                    </div>
                  </div>
                ))}
                <div className="has-text-centered">
                  <button
                    type="button"
                    className="button is-link is-light"
                    onClick={() => {
                      const faq = [...(content.collecteDechets.faq || []), { question: "", reponse: "" }];
                      setContent({ ...content, collecteDechets: { ...content.collecteDechets, faq } });
                    }}
                    style={{ borderRadius: 8 }}
                  >
                    <span className="icon"><i className="fas fa-plus"></i></span>
                    <span>Ajouter une question</span>
                  </button>
                </div>

                <div className="has-text-centered mt-3">
                  <button 
                    type="button" 
                    className={`button is-link${savingSection === 'faqCollecte' ? ' is-loading' : ''}`}
                    onClick={() => saveSection('faqCollecte')}
                    disabled={savingSection !== null}
                    style={{ borderRadius: 8 }}
                  >
                    <span style={{ marginRight: 8 }}>💾</span>
                    Enregistrer cette section
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'salles' && (
            <>
              <div className="box mb-6">
                <h2 className="title is-4 has-text-warning mb-4">🏢 Salles communales</h2>
                {content.salles.map((salle, i) => (
                  <div key={i} className="box mb-2" style={{ background: "#f9fbfd", borderRadius: 12 }}>
                    <div className="is-flex is-justify-content-space-between mb-2">
                      <span className="tag is-warning is-light">Salle #{i + 1}</span>
                      <button 
                        type="button" 
                        className="button is-small is-danger"
                        onClick={() => removeListItem('salles', i, salle.nom || 'cette salle')}
                        disabled={savingSection !== null}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                    <label className="label">Nom de la salle</label>
                    <input className="input mb-2" value={salle.nom} onChange={e => handleListChange('salles', i, 'nom', e.target.value)} />
                    <label className="label">Capacité</label>
                    <input className="input mb-2" value={salle.capacite} onChange={e => handleListChange('salles', i, 'capacite', e.target.value)} />
                    <label className="label">Équipements</label>
                    <input className="input mb-2" value={salle.equipements} onChange={e => handleListChange('salles', i, 'equipements', e.target.value)} />
                    <label className="label">Tarifs</label>
                    <input className="input mb-2" value={salle.tarifs} onChange={e => handleListChange('salles', i, 'tarifs', e.target.value)} />
                    <label className="label">URL de l'image</label>
                    <input className="input mb-2" value={salle.image} onChange={e => handleListChange('salles', i, 'image', e.target.value)} />
                  </div>
                ))}
                <div className="has-text-centered">
                  <button type="button" className="button is-link is-light is-small" onClick={() => addListItem('salles', {
                    nom: "", capacite: "", equipements: "", tarifs: "", image: ""
                  })}>Ajouter une salle</button>
                </div>
              </div>

              <div className="box mb-6">
                <h2 className="title is-4 has-text-link mb-4">📅 Réservations existantes</h2>
                {content.reservations.map((resa, i) => (
                  <div key={i} className="box mb-2" style={{ background: "#f9fbfd", borderRadius: 12 }}>
                    <div className="is-flex is-justify-content-space-between mb-2">
                      <span className="tag is-link is-light">Réservation #{i + 1}</span>
                      <button 
                        type="button" 
                        className="button is-small is-danger"
                        onClick={() => removeListItem('reservations', i, resa.evenement || 'cette réservation')}
                        disabled={savingSection !== null}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                    <label className="label">Date</label>
                    <input className="input mb-2" type="date" value={resa.date} onChange={e => handleListChange('reservations', i, 'date', e.target.value)} />
                    <label className="label">Salle</label>
                    <input className="input mb-2" value={resa.salle} onChange={e => handleListChange('reservations', i, 'salle', e.target.value)} />
                    <label className="label">Événement</label>
                    <input className="input mb-2" value={resa.evenement} onChange={e => handleListChange('reservations', i, 'evenement', e.target.value)} />
                  </div>
                ))}
                <div className="has-text-centered">
                  <button type="button" className="button is-link is-light is-small" onClick={() => addListItem('reservations', {
                    date: "", salle: "", evenement: ""
                  })}>Ajouter une réservation</button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'chasse' && (
            <>
              <div className="box mb-6">
                <h2 className="title is-4 has-text-warning mb-4">🎯 Chasse</h2>

                <h3 className="subtitle">Battues</h3>
                {(content.chasse?.battues || []).map((b, i) => (
                  <div key={i} className="box mb-2" style={{ background: "#f9fbfd", borderRadius: 12 }}>
                    <label className="label">Date</label>
                    <input className="input mb-2" value={b.date} onChange={e => {
                      const arr = [...content.chasse.battues];
                      arr[i].date = e.target.value;
                      setContent({ ...content, chasse: { ...content.chasse, battues: arr } });
                    }} />
                    <label className="label">Secteur</label>
                    <input className="input mb-2" value={b.secteur} onChange={e => {
                      const arr = [...content.chasse.battues];
                      arr[i].secteur = e.target.value;
                      setContent({ ...content, chasse: { ...content.chasse, battues: arr } });
                    }} />
                    <label className="label">Type de chasse</label>
                    <input className="input mb-2" value={b.type} onChange={e => {
                      const arr = [...content.chasse.battues];
                      arr[i].type = e.target.value;
                      setContent({ ...content, chasse: { ...content.chasse, battues: arr } });
                    }} />
                    <label className="label">Horaires</label>
                    <input className="input mb-2" value={b.horaires} onChange={e => {
                      const arr = [...content.chasse.battues];
                      arr[i].horaires = e.target.value;
                      setContent({ ...content, chasse: { ...content.chasse, battues: arr } });
                    }} />
                    <button type="button" className="button is-danger is-small mt-2" onClick={() => {
                      setContent({
                        ...content,
                        chasse: {
                          ...content.chasse,
                          battues: content.chasse.battues.filter((_, idx) => idx !== i)
                        }
                      });
                    }}>Supprimer</button>
                  </div>
                ))}
                <div className="has-text-centered">
                  <button type="button" className="button is-link is-light is-small mb-4" onClick={() => {
                    setContent({
                      ...content,
                      chasse: {
                        ...content.chasse,
                        battues: [...(content.chasse.battues || []), { date: "", secteur: "", type: "", horaires: "" }]
                      }
                    });
                  }}>Ajouter une battue</button>

                  <h3 className="subtitle mt-4">Règlementation</h3>
                  <textarea
                    className="textarea mb-4"
                    value={content.chasse?.reglementation || ""}
                    onChange={e => setContent({ ...content, chasse: { ...content.chasse, reglementation: e.target.value } })}
                    rows={4}
                  ></textarea>

                  <h3 className="subtitle">Lots de chasse</h3>
                  {(content.chasse?.lots || []).map((lot, i) => (
                    <div key={i} className="box mb-2" style={{ background: "#f9fbfd", borderRadius: 12 }}>
                      <label className="label">Numéro/Nom</label>
                      <input className="input mb-2" value={lot.nom} onChange={e => {
                        const arr = [...content.chasse.lots];
                        arr[i].nom = e.target.value;
                        setContent({ ...content, chasse: { ...content.chasse, lots: arr } });
                      }} />
                      <label className="label">Description</label>
                      <input className="input mb-2" value={lot.description} onChange={e => {
                        const arr = [...content.chasse.lots];
                        arr[i].description = e.target.value;
                        setContent({ ...content, chasse: { ...content.chasse, lots: arr } });
                      }} />
                      <label className="label">Adjudicataire</label>
                      <input className="input mb-2" value={lot.adjudicataire} onChange={e => {
                        const arr = [...content.chasse.lots];
                        arr[i].adjudicataire = e.target.value;
                        setContent({ ...content, chasse: { ...content.chasse, lots: arr } });
                      }} />
                      <button type="button" className="button is-danger is-small mt-2" onClick={() => {
                        setContent({
                          ...content,
                          chasse: {
                            ...content.chasse,
                            lots: content.chasse.lots.filter((_, idx) => idx !== i)
                          }
                        });
                      }}>Supprimer</button>
                    </div>
                  ))}
                  <div className="has-text-centered">
                    <button type="button" className="button is-link is-light is-small" onClick={() => {
                      setContent({
                        ...content,
                        chasse: {
                          ...content.chasse,
                          lots: [...(content.chasse.lots || []), { nom: "", description: "", adjudicataire: "" }]
                        }
                      });
                    }}>Ajouter un lot</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'eau' && (
            <>
              <div className="box mb-6">
                <h2 className="title is-4 has-text-info mb-4">💧 Eau potable</h2>

                <h3 className="subtitle">Informations générales</h3>
                <label className="label">Relevé des compteurs</label>
                <textarea
                  className="textarea mb-2"
                  value={content.eauPotable?.releve || ""}
                  onChange={e => setContent({ ...content, eauPotable: { ...content.eauPotable, releve: e.target.value } })}
                  placeholder="Informations sur le relevé des compteurs"
                  rows={3}
                ></textarea>

                <label className="label">Tarifs</label>
                <textarea
                  className="textarea mb-2"
                  value={content.eauPotable?.tarifs || ""}
                  onChange={e => setContent({ ...content, eauPotable: { ...content.eauPotable, tarifs: e.target.value } })}
                  placeholder="Tarifs de l'eau"
                  rows={3}
                ></textarea>

                <label className="label">Qualité de l'eau</label>
                <textarea
                  className="textarea mb-2"
                  value={content.eauPotable?.qualite || ""}
                  onChange={e => setContent({ ...content, eauPotable: { ...content.eauPotable, qualite: e.target.value } })}
                  placeholder="Informations sur la qualité de l'eau"
                  rows={3}
                ></textarea>

                <h3 className="subtitle mt-4">Contacts du service des eaux</h3>
                {(content.eauPotable?.contacts || []).map((c, i) => (
                  <div key={i} className="box mb-2">
                    <label className="label">Service</label>
                    <input className="input mb-2" value={c.service} onChange={e => {
                      const arr = [...content.eauPotable.contacts];
                      arr[i].service = e.target.value;
                      setContent({ ...content, eauPotable: { ...content.eauPotable, contacts: arr } });
                    }} placeholder="Service" />
                    <label className="label">Numéro</label>
                    <input className="input mb-2" value={c.numero} onChange={e => {
                      const arr = [...content.eauPotable.contacts];
                      arr[i].numero = e.target.value;
                      setContent({ ...content, eauPotable: { ...content.eauPotable, contacts: arr } });
                    }} placeholder="Numéro" />
                    <label className="label">Email</label>
                    <input className="input mb-2" value={c.email} onChange={e => {
                      const arr = [...content.eauPotable.contacts];
                      arr[i].email = e.target.value;
                      setContent({ ...content, eauPotable: { ...content.eauPotable, contacts: arr } });
                    }} placeholder="Email" />
                  </div>
                ))}
                <div className="has-text-centered">
                  <button type="button" className="button is-link is-light" onClick={() => {
                    setContent({
                      ...content,
                      eauPotable: {
                        ...content.eauPotable,
                        contacts: [...(content.eauPotable.contacts || []), { service: "", numero: "", email: "" }]
                      }
                    });
                  }}>Ajouter un contact</button>
                </div>
              </div>
            </>
          )}

          {/* SUPPRIMEZ CETTE SECTION COMPLÈTE */}
          {/* <div className="field is-grouped is-grouped-centered mt-6">
            <div className="control">
              <button className={`button is-link is-medium${loading ? ' is-loading' : ''}`} type="submit" disabled={loading}>
                <span style={{ marginRight: 8 }}>💾</span>
                Enregistrer tout
              </button>
            </div>
          </div> */}
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={2500} newestOnTop />
    </div>
  );
}