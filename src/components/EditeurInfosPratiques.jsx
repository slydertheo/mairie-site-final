import React, { useState, useEffect } from 'react';

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
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/pageContent?page=infos_pratiques')
      .then(res => res.json())
      .then(data => setContent({ ...content, ...(data[0] || {}) }));
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

  const removeListItem = (section, idx) => {
    setContent({ ...content, [section]: content[section].filter((_, i) => i !== idx) });
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

  const removeNestedListItem = (parent, section, idx) => {
    setContent({
      ...content,
      [parent]: {
        ...content[parent],
        [section]: content[parent][section].filter((_, i) => i !== idx)
      }
    });
  };

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/pageContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: 'infos_pratiques',
        ...content
      })
    });
    setLoading(false);
    setMsg('Modifications enregistrées !');
    setTimeout(() => setMsg(''), 2000);
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
            <li className={activeTab === 'liens' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('liens')}>Événement</a>
            </li>
            <li className={activeTab === 'chasse' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('chasse')}>Chasse</a>
            </li>
          </ul>
        </div>

        <form onSubmit={handleSave}>
          {activeTab === 'bulletins' && (
            <>
              <div className="box mb-6">
                <h2 className="title is-4 has-text-link mb-4">📰 Bulletins communaux</h2>
                {content.bulletins.map((b, i) => (
                  <div key={i} className="box mb-2">
                    <label className="label">Titre</label>
                    <input className="input mb-2" value={b.titre} onChange={e => handleListChange('bulletins', i, 'titre', e.target.value)} placeholder="Titre" />
                    <label className="label">Date</label>
                    <input className="input mb-2" value={b.date} onChange={e => handleListChange('bulletins', i, 'date', e.target.value)} placeholder="Date" />
                    <label className="label">Nom du fichier</label>
                    <input className="input mb-2" value={b.fichier} onChange={e => handleListChange('bulletins', i, 'fichier', e.target.value)} placeholder="Nom du fichier" />
                    <button type="button" className="button is-danger is-small mt-2" onClick={() => removeListItem('bulletins', i)}>Supprimer</button>
                  </div>
                ))}
                <button type="button" className="button is-link is-light is-small" onClick={() => addListItem('bulletins', { titre: "", date: "", fichier: "" })}>Ajouter un bulletin</button>
              </div>

              <div className="box mb-6">
                <h2 className="title is-4 has-text-link mb-4">🎉 Manifestations</h2>
                {content.manifestations.map((m, i) => (
                  <div key={i} className="box mb-2">
                    <label className="label">Titre</label>
                    <input className="input mb-2" value={m.titre} onChange={e => handleListChange('manifestations', i, 'titre', e.target.value)} placeholder="Titre" />
                    <label className="label">Date</label>
                    <input className="input mb-2" value={m.date} onChange={e => handleListChange('manifestations', i, 'date', e.target.value)} placeholder="Date" />
                    <label className="label">Description</label>
                    <textarea className="textarea mb-2" value={m.description} onChange={e => handleListChange('manifestations', i, 'description', e.target.value)} placeholder="Description" />
                    <label className="label">Lieu</label>
                    <input className="input mb-2" value={m.lieu} onChange={e => handleListChange('manifestations', i, 'lieu', e.target.value)} placeholder="Lieu" />
                    <label className="checkbox">
                      <input type="checkbox" checked={m.inscription} onChange={e => handleListChange('manifestations', i, 'inscription', e.target.checked)} />
                      Inscription requise
                    </label>
                    <button type="button" className="button is-danger is-small mt-2" onClick={() => removeListItem('manifestations', i)}>Supprimer</button>
                  </div>
                ))}
                <button type="button" className="button is-link is-light is-small" onClick={() => addListItem('manifestations', { titre: "", date: "", description: "", lieu: "", inscription: false })}>Ajouter une manifestation</button>
              </div>
            </>
          )}

          {activeTab === 'contacts' && (
            <>
              <div className="box mb-6">
                <h2 className="title is-4 has-text-danger mb-4">📞 Numéros d'urgence</h2>
                {content.contacts.urgence.map((c, i) => (
                  <div key={i} className="box mb-2">
                    <label className="label">Service</label>
                    <input className="input mb-2" value={c.service} onChange={e => handleNestedListChange('contacts', 'urgence', i, 'service', e.target.value)} placeholder="Service" />
                    <label className="label">Numéro</label>
                    <input className="input mb-2" value={c.numero} onChange={e => handleNestedListChange('contacts', 'urgence', i, 'numero', e.target.value)} placeholder="Numéro" />
                    <label className="label">Détails</label>
                    <input className="input mb-2" value={c.details} onChange={e => handleNestedListChange('contacts', 'urgence', i, 'details', e.target.value)} placeholder="Détails" />
                    <button type="button" className="button is-danger is-small mt-2" onClick={() => removeNestedListItem('contacts', 'urgence', i)}>Supprimer</button>
                  </div>
                ))}
                <button type="button" className="button is-link is-light is-small" onClick={() => addNestedListItem('contacts', 'urgence', { service: "", numero: "", details: "" })}>Ajouter un contact</button>
              </div>

              <div className="box mb-6">
                <h2 className="title is-4 has-text-danger mb-4">🔒 Services de sécurité</h2>
                {(content.contacts.securite || []).map((c, i) => (
                  <div key={i} className="box mb-2">
                    <label className="label">Service</label>
                    <input className="input mb-2" value={c.service} onChange={e => handleNestedListChange('contacts', 'securite', i, 'service', e.target.value)} placeholder="Service" />
                    <label className="label">Numéro</label>
                    <input className="input mb-2" value={c.numero} onChange={e => handleNestedListChange('contacts', 'securite', i, 'numero', e.target.value)} placeholder="Numéro" />
                    <label className="label">Détails</label>
                    <input className="input mb-2" value={c.details} onChange={e => handleNestedListChange('contacts', 'securite', i, 'details', e.target.value)} placeholder="Détails" />
                    <label className="label">Horaires</label>
                    <input className="input mb-2" value={c.horaires} onChange={e => handleNestedListChange('contacts', 'securite', i, 'horaires', e.target.value)} placeholder="Horaires" />
                    <button type="button" className="button is-danger is-small mt-2" onClick={() => removeNestedListItem('contacts', 'securite', i)}>Supprimer</button>
                  </div>
                ))}
                <button type="button" className="button is-link is-light is-small" onClick={() => addNestedListItem('contacts', 'securite', { service: "", numero: "", details: "", horaires: "" })}>Ajouter un contact de sécurité</button>
              </div>

              <div className="box mb-6">
                <h2 className="title is-4 has-text-info mb-4">🏢 Services publics</h2>
                {(content.contacts.services || []).map((c, i) => (
                  <div key={i} className="box mb-2">
                    <label className="label">Service</label>
                    <input className="input mb-2" value={c.service} onChange={e => handleNestedListChange('contacts', 'services', i, 'service', e.target.value)} placeholder="Service" />
                    <label className="label">Numéro</label>
                    <input className="input mb-2" value={c.numero} onChange={e => handleNestedListChange('contacts', 'services', i, 'numero', e.target.value)} placeholder="Numéro" />
                    <label className="label">Détails</label>
                    <input className="input mb-2" value={c.details} onChange={e => handleNestedListChange('contacts', 'services', i, 'details', e.target.value)} placeholder="Détails" />
                    <label className="label">Horaires</label>
                    <input className="input mb-2" value={c.horaires} onChange={e => handleNestedListChange('contacts', 'services', i, 'horaires', e.target.value)} placeholder="Horaires" />
                    <button type="button" className="button is-danger is-small mt-2" onClick={() => removeNestedListItem('contacts', 'services', i)}>Supprimer</button>
                  </div>
                ))}
                <button type="button" className="button is-link is-light is-small" onClick={() => addNestedListItem('contacts', 'services', { service: "", numero: "", details: "", horaires: "" })}>Ajouter un service public</button>
              </div>

              <div className="box mb-6">
                <h2 className="title is-4 has-text-link mb-4">🔗 Liens utiles - Contacts et Urgences</h2>
                {(content.liensUtilesContacts || []).map((lien, i) => (
                  <div key={i} className="box mb-2">
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
                    <div className="select mb-2">
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
                    
                    <div className="field is-grouped mt-3">
                      <div className="control">
                        <button type="button" className="button is-danger is-small" onClick={() => {
                          const arr = (content.liensUtilesContacts || []).filter((_, idx) => idx !== i);
                          setContent({ ...content, liensUtilesContacts: arr });
                        }}>Supprimer</button>
                      </div>
                      
                      <div className="control">
                        <button type="button" className="button is-info is-small" onClick={() => {
                          const arr = [...(content.liensUtilesContacts || [])];
                          // Déplacer vers le haut si ce n'est pas le premier élément
                          if (i > 0) {
                            const temp = arr[i];
                            arr[i] = arr[i - 1];
                            arr[i - 1] = temp;
                            setContent({ ...content, liensUtilesContacts: arr });
                          }
                        }} disabled={i === 0}>↑ Monter</button>
                      </div>
                      
                      <div className="control">
                        <button type="button" className="button is-info is-small" onClick={() => {
                          const arr = [...(content.liensUtilesContacts || [])];
                          // Déplacer vers le bas si ce n'est pas le dernier élément
                          if (i < arr.length - 1) {
                            const temp = arr[i];
                            arr[i] = arr[i + 1];
                            arr[i + 1] = temp;
                            setContent({ ...content, liensUtilesContacts: arr });
                          }
                        }} disabled={i === (content.liensUtilesContacts || []).length - 1}>↓ Descendre</button>
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="button is-link is-light" onClick={() => {
                  const liensUtilesContacts = [...(content.liensUtilesContacts || []), { 
                    titre: "", 
                    description: "", 
                    url: "", 
                    type: "urgence" 
                  }];
                  setContent({ ...content, liensUtilesContacts });
                }}>Ajouter un lien utile</button>
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
                  className="textarea mb-2" 
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
              </div>

              {/* Collecte des déchets (section existante) */}
              <div className="box mb-6">
                <h2 className="title is-4 has-text-success mb-4">♻️ Collecte des déchets</h2>
                <label className="label">Ordures ménagères</label>
                <input className="input mb-2" value={content.collecteDechets?.ordures || ""} onChange={e => setContent({ ...content, collecteDechets: { ...content.collecteDechets, ordures: e.target.value } })} />
                <label className="label">Recyclables</label>
                <input className="input mb-2" value={content.collecteDechets?.recyclables || ""} onChange={e => setContent({ ...content, collecteDechets: { ...content.collecteDechets, recyclables: e.target.value } })} />
                <label className="label">Biodéchets</label>
                <input className="input mb-2" value={content.collecteDechets?.biodechets || ""} onChange={e => setContent({ ...content, collecteDechets: { ...content.collecteDechets, biodechets: e.target.value } })} />
                <label className="label">Verre</label>
                <input className="input mb-2" value={content.collecteDechets?.verre || ""} onChange={e => setContent({ ...content, collecteDechets: { ...content.collecteDechets, verre: e.target.value } })} />
                <label className="label">Encombrants</label>
                <input className="input mb-2" value={content.collecteDechets?.encombrants || ""} onChange={e => setContent({ ...content, collecteDechets: { ...content.collecteDechets, encombrants: e.target.value } })} />
              </div>

              <div className="box mb-6">
                <h2 className="title is-4 has-text-success mb-4">♻️ Déchetteries</h2>
                {(content.collecteDechets?.dechetteries || []).map((d, i) => (
                  <div key={i} className="box mb-2">
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
                    <label className="label">Types de déchets acceptés</label>
                    <textarea className="textarea mb-2" value={d.dechets} onChange={e => {
                      const arr = [...content.collecteDechets.dechetteries];
                      arr[i].dechets = e.target.value;
                      setContent({ ...content, collecteDechets: { ...content.collecteDechets, dechetteries: arr } });
                    }} placeholder="Types de déchets acceptés" />
                    <button type="button" className="button is-danger is-small mt-2" onClick={() => {
                      const arr = content.collecteDechets.dechetteries.filter((_, idx) => idx !== i);
                      setContent({ ...content, collecteDechets: { ...content.collecteDechets, dechetteries: arr } });
                    }}>Supprimer</button>
                  </div>
                ))}
                <button type="button" className="button is-link is-light is-small" onClick={() => {
                  const dechetteries = [...(content.collecteDechets.dechetteries || []), { nom: "", adresse: "", horaires: "", dechets: "" }];
                  setContent({ ...content, collecteDechets: { ...content.collecteDechets, dechetteries } });
                }}>Ajouter une déchetterie</button>
              </div>

              <div className="box mb-6">
                <h2 className="title is-4 has-text-success mb-4">📄 Documents utiles</h2>
                {(content.collecteDechets?.documents || []).map((doc, i) => (
                  <div key={i} className="box mb-2">
                    <label className="label">Titre</label>
                    <input className="input mb-2" value={doc.titre} onChange={e => {
                      const arr = [...content.collecteDechets.documents];
                      arr[i].titre = e.target.value;
                      setContent({ ...content, collecteDechets: { ...content.collecteDechets, documents: arr } });
                    }} placeholder="Titre" />
                    <label className="label">Description</label>
                    <input className="input mb-2" value={doc.description} onChange={e => {
                      const arr = [...content.collecteDechets.documents];
                      arr[i].description = e.target.value;
                      setContent({ ...content, collecteDechets: { ...content.collecteDechets, documents: arr } });
                    }} placeholder="Description" />
                    <label className="label">Nom du fichier</label>
                    <input className="input mb-2" value={doc.fichier} onChange={e => {
                      const arr = [...content.collecteDechets.documents];
                      arr[i].fichier = e.target.value;
                      setContent({ ...content, collecteDechets: { ...content.collecteDechets, documents: arr } });
                    }} placeholder="Nom du fichier" />
                    <button type="button" className="button is-danger is-small mt-2" onClick={() => {
                      const arr = content.collecteDechets.documents.filter((_, idx) => idx !== i);
                      setContent({ ...content, collecteDechets: { ...content.collecteDechets, documents: arr } });
                    }}>Supprimer</button>
                  </div>
                ))}
                <button type="button" className="button is-link is-light is-small" onClick={() => {
                  const documents = [...(content.collecteDechets.documents || []), { titre: "", description: "", fichier: "" }];
                  setContent({ ...content, collecteDechets: { ...content.collecteDechets, documents } });
                }}>Ajouter un document</button>
              </div>

              <div className="box mb-6">
                <h2 className="title is-4 has-text-success mb-4">❓ Questions fréquentes</h2>
                {(content.collecteDechets?.faq || []).map((q, i) => (
                  <div key={i} className="box mb-2">
                    <label className="label">Question</label>
                    <input className="input mb-2" value={q.question} onChange={e => {
                      const arr = [...content.collecteDechets.faq];
                      arr[i].question = e.target.value;
                      setContent({ ...content, collecteDechets: { ...content.collecteDechets, faq: arr } });
                    }} placeholder="Question" />
                    <label className="label">Réponse</label>
                    <textarea className="textarea mb-2" value={q.reponse} onChange={e => {
                      const arr = [...content.collecteDechets.faq];
                      arr[i].reponse = e.target.value;
                      setContent({ ...content, collecteDechets: { ...content.collecteDechets, faq: arr } });
                    }} placeholder="Réponse" />
                    <button type="button" className="button is-danger is-small mt-2" onClick={() => {
                      const arr = content.collecteDechets.faq.filter((_, idx) => idx !== i);
                      setContent({ ...content, collecteDechets: { ...content.collecteDechets, faq: arr } });
                    }}>Supprimer</button>
                  </div>
                ))}
                <button type="button" className="button is-link is-light is-small" onClick={() => {
                  const faq = [...(content.collecteDechets.faq || []), { question: "", reponse: "" }];
                  setContent({ ...content, collecteDechets: { ...content.collecteDechets, faq } });
                }}>Ajouter une question</button>
              </div>
            </>
          )}

          {activeTab === 'salles' && (
            <>
              <div className="box mb-6">
                <h2 className="title is-4 has-text-warning mb-4">🏢 Salles communales</h2>
                {content.salles.map((salle, i) => (
                  <div key={i} className="box mb-2">
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
                    <button type="button" className="button is-danger is-small mt-2" onClick={() => removeListItem('salles', i)}>Supprimer</button>
                  </div>
                ))}
                <button type="button" className="button is-link is-light is-small" onClick={() => addListItem('salles', {
                  nom: "", capacite: "", equipements: "", tarifs: "", image: ""
                })}>Ajouter une salle</button>
              </div>

              <div className="box mb-6">
                <h2 className="title is-4 has-text-link mb-4">📅 Réservations existantes</h2>
                {content.reservations.map((resa, i) => (
                  <div key={i} className="box mb-2">
                    <label className="label">Date</label>
                    <input className="input mb-2" type="date" value={resa.date} onChange={e => handleListChange('reservations', i, 'date', e.target.value)} />
                    <label className="label">Salle</label>
                    <input className="input mb-2" value={resa.salle} onChange={e => handleListChange('reservations', i, 'salle', e.target.value)} />
                    <label className="label">Événement</label>
                    <input className="input mb-2" value={resa.evenement} onChange={e => handleListChange('reservations', i, 'evenement', e.target.value)} />
                    <button type="button" className="button is-danger is-small mt-2" onClick={() => removeListItem('reservations', i)}>Supprimer</button>
                  </div>
                ))}
                <button type="button" className="button is-link is-light is-small" onClick={() => addListItem('reservations', {
                  date: "", salle: "", evenement: ""
                })}>Ajouter une réservation</button>
              </div>
            </>
          )}

          {activeTab === 'chasse' && (
            <>
              <div className="box mb-6">
                <h2 className="title is-4 has-text-warning mb-4">🎯 Chasse</h2>

                <h3 className="subtitle">Battues</h3>
                {(content.chasse?.battues || []).map((b, i) => (
                  <div key={i} className="box mb-2">
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
                  <div key={i} className="box mb-2">
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
                    <button type="button" className="button is-danger is-small mt-2" onClick={() => {
                      setContent({
                        ...content,
                        eauPotable: {
                          ...content.eauPotable,
                          contacts: content.eauPotable.contacts.filter((_, idx) => idx !== i)
                        }
                      });
                    }}>Supprimer</button>
                  </div>
                ))}
                <button type="button" className="button is-link is-light is-small" onClick={() => {
                  setContent({
                    ...content,
                    eauPotable: {
                      ...content.eauPotable,
                      contacts: [...(content.eauPotable.contacts || []), { service: "", numero: "", email: "" }]
                    }
                  });
                }}>Ajouter un contact</button>
              </div>
            </>
          )}

          {activeTab === 'liens' && (
            <>
              <div className="box mb-6">
                <h2 className="title is-4 has-text-link mb-4">🔗 Liens utiles</h2>
                {(content.liensUtiles || []).map((lien, i) => (
                  <div key={i} className="box mb-2">
                    <label className="label">Titre</label>
                    <input className="input mb-2" value={lien.titre} onChange={e => handleListChange('liensUtiles', i, 'titre', e.target.value)} />
                    <label className="label">Description</label>
                    <input className="input mb-2" value={lien.description} onChange={e => handleListChange('liensUtiles', i, 'description', e.target.value)} />
                    <label className="label">URL</label>
                    <input className="input mb-2" value={lien.url} onChange={e => handleListChange('liensUtiles', i, 'url', e.target.value)} />
                    <label className="label">Catégorie</label>
                    <input className="input mb-2" value={lien.categorie || ''} onChange={e => handleListChange('liensUtiles', i, 'categorie', e.target.value)} />
                    <button type="button" className="button is-danger is-small mt-2" onClick={() => removeListItem('liensUtiles', i)}>Supprimer</button>
                  </div>
                ))}
                <button type="button" className="button is-link is-light is-small" onClick={() => addListItem('liensUtiles', {
                  titre: "", description: "", url: "", categorie: ""
                })}>Ajouter un lien</button>
              </div>
            </>
          )}

          <div className="field is-grouped is-grouped-centered mt-6">
            <div className="control">
              <button className={`button is-link is-medium${loading ? ' is-loading' : ''}`} type="submit" disabled={loading}>Enregistrer les modifications</button>
            </div>
          </div>

          {msg && <div className="notification is-info is-light py-2 px-3 mt-3 has-text-centered">{msg}</div>}
        </form>
      </div>
    </div>
  );
}