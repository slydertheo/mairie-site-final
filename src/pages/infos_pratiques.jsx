import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
import Link from 'next/link';
import useHeroImage from '../hooks/useHeroImage';

export default function InfosPratiques() {
  const heroImage = useHeroImage();
  const [activeTab, setActiveTab] = useState('contacts');
  const [archiveAnneeActive, setArchiveAnneeActive] = useState(null);
  const [reservationForm, setReservationForm] = useState({
    nom: '',
    email: '',
    telephone: '',
    date: '',
    heureDebut: '',
    heureFin: '',
    salle: 'polyvalente',
    participants: '',
    nature: ''
  });
    // Calendrier de collecte des déchets
  const collecteDechets = {
    ordures: "Le lundi matin",
    recyclables: "Le mercredi matin des semaines paires",
    biodechets: "Le jeudi matin",
    verre: "Points d'apport volontaire (Place de la Mairie, Rue des Écoles)",
    encombrants: "1er mardi des mois de mars, juin, septembre et décembre"
  };

  const [releveForm, setReleveForm] = useState({
    nom: '',
    adresse: '',
    email: '',
    telephone: '',
    numCompteur: '',
    index: '',
    date: ''
  });
  const [formSubmitted, setFormSubmitted] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // Example state for admin check
  const [isLoading, setIsLoading] = useState(false); // Example state for loading
  const [pageData, setPageData] = useState({}); // Example state for dynamic data

  useEffect(() => {
    const fetchPageData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/pageContent?page=infos_pratiques');
        const data = await response.json();

        if (data && data[0]) {
          setPageData({
            ...data[0],
            collecteDechets: {
              ...data[0].collecteDechets,
              faqTitle: data[0].collecteDechets?.faqTitle || "Questions sur la collecte ?",
              faqDescription: data[0].collecteDechets?.faqDescription || "Contactez le service déchets de la CCSAL :",
              contactPhone: data[0].collecteDechets?.contactPhone || "03.89.XX.XX.XX",
              contactEmail: data[0].collecteDechets?.contactEmail || "dechets@sudalsace-largue.fr",
            },
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, []);

  // Initialiser l'année active pour les archives
  useEffect(() => {
    if (pageData.archivesBulletinsAnnees && pageData.archivesBulletinsAnnees.length > 0 && !archiveAnneeActive) {
      setArchiveAnneeActive(pageData.archivesBulletinsAnnees[0]);
    }
  }, [pageData.archivesBulletinsAnnees, archiveAnneeActive]);

  // Bulletins communaux (chargés dynamiquement depuis pageData)
  const bulletins = pageData.bulletins || [];
  // Trier les années du plus récent au moins récent
  const archivesAnnees = (pageData.archivesBulletinsAnnees || []).sort((a, b) => parseInt(b) - parseInt(a));
  const archivesBulletins = pageData.archivesBulletins || {};

  // Gestion du formulaire de réservation
  const handleReservationChange = (e) => {
    const { name, value } = e.target;
    setReservationForm({ ...reservationForm, [name]: value });
  };

  // Gestion du formulaire de relevé d'eau
  const handleReleveChange = (e) => {
    const { name, value } = e.target;
    setReleveForm({ ...releveForm, [name]: value });
  };

  // Soumission de formulaire
  const handleSubmit = (e, formType) => {
    e.preventDefault();
    console.log(`Formulaire ${formType} envoyé:`, formType === 'reservation' ? reservationForm : releveForm);
    setFormSubmitted(formType);
    
    // Réinitialisation des formulaires
    if (formType === 'reservation') {
      setReservationForm({
        nom: '',
        email: '',
        telephone: '',
        date: '',
        heureDebut: '',
        heureFin: '',
        salle: 'polyvalente',
        participants: '',
        nature: ''
      });
    } else {
      setReleveForm({
        nom: '',
        adresse: '',
        email: '',
        telephone: '',
        numCompteur: '',
        index: '',
        date: ''
      });
    }
    
    // Effacer le message après 5 secondes
    setTimeout(() => {
      setFormSubmitted('');
    }, 5000);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'contacts':
        return (
          <div>
            {/* Bouton d'édition pour les administrateurs */}
            {isAdmin && (
              <div className="is-flex is-justify-content-flex-end mb-4">
                <Link href="/admin/editeur-infos-pratiques?tab=contacts" className="button is-link is-light">
                  <span className="icon"><i className="fas fa-edit"></i></span>
                  <span>Éditer cette section</span>
                </Link>
              </div>
            )
            }
            
            {isLoading ? (
              <div className="has-text-centered p-5">
                <span className="icon is-large">
                  <i className="fas fa-spinner fa-pulse fa-3x has-text-primary"></i>
                </span>
                <p className="mt-4 is-size-5 has-text-weight-semibold">Chargement des données...</p>
              </div>
            ) : (
              <>
                {/* Numéros d'urgence */}
                <section className="box mb-6" style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
                  <h2 className="title is-4 has-text-danger mb-4">
                    <span className="icon"><i className="fas fa-phone-alt"></i></span> Numéros d'urgence
                  </h2>
                  <div className="table-container">
                    <table className="table is-fullwidth is-hoverable">
                      <thead>
                        <tr className="has-background-danger-light">
                          <th>Service</th>
                          <th>Numéro</th>
                          <th>Informations</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(pageData.contacts?.urgence || []).length > 0 ? (
                          pageData.contacts.urgence.map((contact, index) => (
                            <tr key={index}>
                              <td><strong>{contact.service}</strong></td>
                              <td className="has-text-danger has-text-weight-bold">{contact.numero}</td>
                              <td>{contact.details}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="has-text-centered">
                              Aucun numéro d'urgence disponible
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Services de sécurité */}
                <section className="box mb-6" style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
                  <h2 className="title is-4 has-text-link mb-4">
                    <span className="icon"><i className="fas fa-shield-alt"></i></span> Services de sécurité
                  </h2>
                  {(pageData.contacts?.securite || []).length > 0 ? (
                    <div className="columns is-multiline">
                      {pageData.contacts.securite.map((contact, index) => (
                        <div key={index} className="column is-half">
                          <div className="box has-background-light" style={{ borderRadius: 12, height: '100%' }}>
                            <p className="title is-5 mb-2">{contact.service}</p>
                            <p className="has-text-weight-bold mb-2">
                              <span className="icon"><i className="fas fa-phone"></i></span> {contact.numero}
                            </p>
                            <p className="mb-2">{contact.details}</p>
                            <p className="is-size-7 has-text-grey">{contact.horaires}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="notification is-light">
                      Aucun service de sécurité disponible
                    </div>
                  )}
                </section>

                {/* Services publics */}
                <section className="box mb-6" style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
                  <h2 className="title is-4 has-text-primary mb-4">
                    <span className="icon"><i className="fas fa-building"></i></span> Services publics
                  </h2>
                  {(pageData.contacts?.services || []).length > 0 ? (
                    <div className="columns is-multiline">
                      {pageData.contacts.services.map((contact, index) => (
                        <div key={index} className="column is-half">
                          <div className="box has-background-light" style={{ borderRadius: 12, height: '100%' }}>
                            <p className="title is-5 mb-2">{contact.service}</p>
                            <p className="has-text-weight-bold mb-2">
                              <span className="icon"><i className="fas fa-phone"></i></span> {contact.numero}
                            </p>
                            <p className="mb-2">{contact.details}</p>
                            <p className="is-size-7 has-text-grey">{contact.horaires}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="notification is-light">
                      Aucun service public disponible
                    </div>
                  )}
                </section>

                {/* Liens utiles */}
                {(pageData.liensUtilesContacts || []).length > 0 && (
                  <section className="box mt-5" style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
                    <h2 className="title is-4 has-text-primary mb-4">
                      <span className="icon"><i className="fas fa-link"></i></span> Liens utiles
                    </h2>
                    <div className="columns is-multiline">
                      {pageData.liensUtilesContacts.map((lien, index) => (
                        <div key={index} className="column is-one-third">
                          <a
                            href={lien.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button is-light is-fullwidth"
                            style={{
                              justifyContent: 'flex-start',
                              height: 'auto',
                              padding: '16px',
                              borderRadius: 12,
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                              textAlign: 'left',
                              whiteSpace: 'normal',
                              display: 'block'
                            }}
                          >
                            <span className="icon" style={{ verticalAlign: 'top' }}>
                              <i className="fas fa-external-link-alt"></i>
                            </span>
                            <span style={{ 
                              display: 'inline-block', 
                              verticalAlign: 'top',
                              maxWidth: 'calc(100% - 30px)',
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word'
                            }}>
                              <strong style={{ display: 'block', marginBottom: '4px' }}>{lien.titre}</strong>
                              <small className="has-text-grey" style={{ display: 'block', lineHeight: '1.4' }}>
                                {lien.description}
                              </small>
                            </span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        );

      case 'dechets':
        return (
          <div>
            <div className="content mb-5">
              <div className="notification is-info is-light">
                <p className="is-size-5 mb-3">
                  <strong>{pageData.collecteDechets?.titre || "Collecte des déchets à Friesen"}</strong>
                </p>
                <p>
                  {pageData.collecteDechets?.introduction || "La collecte et le traitement des déchets sont gérés par la Communauté de Communes Sud Alsace Largue (CCSAL). Consultez ci-dessous les jours de collecte et les consignes de tri."}
                </p>
              </div>
            </div>
            
            <h2 className="title is-4 has-text-primary mb-4">Calendrier de collecte</h2>
            
            <div className="box" style={{ borderRadius: 12 }}>
              <table className="table is-fullwidth">
                <tbody>
                  <tr>
                    <td width="180"><strong>Ordures ménagères</strong></td>
                    <td>{pageData.collecteDechets?.ordures || "Non disponible"}</td>
                    <td><span className="tag is-dark">Bac gris</span></td>
                  </tr>
                  <tr>
                    <td><strong>Recyclables</strong></td>
                    <td>{pageData.collecteDechets?.recyclables || "Non disponible"}</td>
                    <td><span className="tag is-warning">Bac jaune</span></td>
                  </tr>
                  <tr>
                    <td><strong>Biodéchets</strong></td>
                    <td>{pageData.collecteDechets?.biodechets || "Non disponible"}</td>
                    <td><span className="tag is-success">Bac vert</span></td>
                  </tr>
                  <tr>
                    <td><strong>Verre</strong></td>
                    <td>{pageData.collecteDechets?.verre || "Non disponible"}</td>
                    <td><span className="tag is-link">Conteneurs</span></td>
                  </tr>
                  <tr>
                    <td><strong>Encombrants</strong></td>
                    <td>{pageData.collecteDechets?.encombrants || "Non disponible"}</td>
                    <td><span className="tag is-primary">Sur inscription</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Guide du tri */}
            <div className="columns mt-5">
              <div className="column is-half">
                <h2 className="title is-4 has-text-primary mb-4">Guide du tri</h2>
                
                <div className="box" style={{ borderRadius: 12 }}>
                  <h3 className="title is-5 has-text-warning mb-3">Bac jaune : recyclables</h3>
                  <div className="columns is-multiline is-mobile">
                    <div className="column is-6">
                      <div className="notification has-background-warning-light p-3">
                        <p className="has-text-centered mb-2">✅ À mettre</p>
                        <ul className="is-size-7">
                          <li>Papiers, journaux, magazines</li>
                          <li>Emballages en carton</li>
                          <li>Bouteilles et flacons en plastique</li>
                          <li>Emballages en métal</li>
                          <li>Briques alimentaires</li>
                        </ul>
                      </div>
                    </div>
                    <div className="column is-6">
                      <div className="notification has-background-danger-light p-3">
                        <p className="has-text-centered mb-2">❌ À ne pas mettre</p>
                        <ul className="is-size-7">
                          <li>Objets en plastique (jouets, etc.)</li>
                          <li>Vaisselle cassée</li>
                          <li>Verre</li>
                          <li>Emballages sales</li>
                          <li>Mouchoirs en papier</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="box mt-4" style={{ borderRadius: 12 }}>
                  <h3 className="title is-5 has-text-success mb-3">Bac vert : biodéchets</h3>
                  <div className="columns is-multiline is-mobile">
                    <div className="column is-6">
                      <div className="notification has-background-success-light p-3">
                        <p className="has-text-centered mb-2">✅ À mettre</p>
                        <ul className="is-size-7">
                          <li>Épluchures</li>
                          <li>Restes alimentaires</li>
                          <li>Marc de café, sachets de thé</li>
                          <li>Coquilles d'œufs écrasées</li>
                          <li>Fruits et légumes abîmés</li>
                        </ul>
                      </div>
                    </div>
                    <div className="column is-6">
                      <div className="notification has-background-danger-light p-3">
                        <p className="has-text-centered mb-2">❌ À ne pas mettre</p>
                        <ul className="is-size-7">
                          <li>Viande et poisson (grandes quantités)</li>
                          <li>Produits laitiers</li>
                          <li>Huiles et sauces</li>
                          <li>Plastiques biodégradables</li>
                          <li>Cendres de charbon</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="column">
                <h2 className="title is-4 has-text-primary mb-4">Infos pratiques</h2>

                {/* Déchetteries */}
                <div className="box" style={{ borderRadius: 12 }}>
                  <h3 className="title is-5 mb-3">Déchetteries</h3>
                  {(pageData.collecteDechets?.dechetteries || []).map((dechetterie, index) => (
                    <div className="media mb-4" key={index}>
                      <div className="media-left">
                        <span style={{ fontSize: 40 }}>♻️</span>
                      </div>
                      <div className="media-content">
                        <p className="has-text-weight-bold mb-1">{dechetterie.nom}</p>
                        <p className="is-size-7 mb-1">{dechetterie.adresse}</p>
                        <p className="is-size-7">{dechetterie.horaires}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Documents utiles */}
                <div className="box mt-4" style={{ borderRadius: 12 }}>
                  <h3 className="title is-5 mb-3">Documents utiles</h3>
                  <div className="buttons">
                    {(pageData.collecteDechets?.documents || []).map((document, index) => (
                      <a
                        key={index}
                        href={document.fichier}
                        className="button is-light is-fullwidth"
                        style={{ justifyContent: 'flex-start' }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="icon">
                          <i className="fas fa-download"></i>
                        </span>
                        <span>{document.titre}</span>
                      </a>
                    ))}
                  </div>

                  {/* Formulaire d'upload pour les administrateurs */}
                  {isAdmin && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        try {
                          const response = await fetch('/api/upload_doc', {
                            method: 'POST',
                            body: formData,
                          });
                          const data = await response.json();
                          if (data.fileUrl) {
                            // Ajouter le nouveau document à la liste
                            const newDocument = {
                              titre: formData.get('titre'),
                              fichier: data.fileUrl,
                            };
                            setPageData((prevData) => ({
                              ...prevData,
                              collecteDechets: {
                                ...prevData.collecteDechets,
                                documents: [...(prevData.collecteDechets?.documents || []), newDocument],
                              },
                            }));
                          }
                        } catch (error) {
                          console.error('Erreur lors de l\'upload du fichier :', error);
                        }
                      }}
                    >
                      <div className="field">
                        <label className="label">Titre du document</label>
                        <div className="control">
                          <input
                            className="input"
                            type="text"
                            name="titre"
                            placeholder="Titre du document"
                            required
                          />
                        </div>
                      </div>
                      <div className="field">
                        <label className="label">Fichier</label>
                        <div className="control">
                          <input
                            className="input"
                            type="file"
                            name="file"
                            accept=".pdf,.doc,.docx"
                            required
                          />
                        </div>
                      </div>
                      <div className="field">
                        <div className="control">
                          <button className="button is-link" type="submit">
                            Télécharger le document
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>

                {/* Questions fréquentes */}
                <div className="notification is-link is-light mt-4" style={{ borderRadius: 12 }}>
                  {isLoading ? (
                    <p>Chargement des données...</p>
                  ) : (
                    <>
                      <div>
                        {(pageData.collecteDechets?.faq || []).map((item, index) => (
                          <div key={index} className="box mb-3" style={{ borderRadius: 12 }}>
                            <p className="has-text-weight-bold mb-2">Question {index + 1} :</p>
                            <p className="mb-2">{item.question || "Question non renseignée"}</p>
                            <p className="has-text-grey">{item.reponse || "Réponse non renseignée"}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'bulletin':
        return (
          <div>
            <div className="content mb-5">
              <div className="notification is-info is-light">
                <p className="is-size-5 mb-3">
                  <strong>Bulletin communal</strong>
                </p>
                <p>
                  Retrouvez ici les bulletins municipaux publiés par la commune de Friesen.
                  Ces publications trimestrielles vous informent des actualités et des projets de la commune.
                </p>
              </div>
            </div>
            
            {isLoading ? (
              <div className="has-text-centered p-6">
                <span className="icon is-large">
                  <i className="fas fa-spinner fa-pulse fa-3x has-text-primary"></i>
                </span>
                <p className="mt-4 is-size-5 has-text-weight-semibold">Chargement des bulletins...</p>
              </div>
            ) : bulletins.length > 0 ? (
              <div className="columns is-multiline">
                {bulletins.map((bulletin, index) => (
                  <div key={bulletin.id || index} className="column is-half">
                    <div className="box" style={{ 
                      borderRadius: 16, 
                      overflow: 'hidden',
                      boxShadow: '0 2px 12px #1277c620',
                      background: '#f8fafc',
                    }}>
                      <div className="columns is-vcentered">
                        <div className="column is-4 has-text-centered">
                          <div style={{ 
                            background: '#f0f7fd',
                            padding: '20px',
                            borderRadius: '12px',
                            maxWidth: '150px',
                            margin: '0 auto'
                          }}>
                            <span style={{ fontSize: 48 }}>📰</span>
                            <p className="is-size-7 mt-2">{bulletin.date}</p>
                          </div>
                        </div>
                        <div className="column">
                          <h3 className="title is-5 has-text-link mb-3">{bulletin.titre}</h3>
                          <div className="buttons">
                            <a 
                              href={`/uploads/${bulletin.fichier}`}
                              target="_blank"
                              rel="noopener noreferrer" 
                              className="button is-link is-light"
                            >
                              <span className="icon"><i className="fas fa-eye"></i></span>
                              <span>Consulter</span>
                            </a>
                            <a 
                              href={`/uploads/${bulletin.fichier}`} 
                              download={bulletin.titre}
                              className="button is-link"
                            >
                              <span className="icon"><i className="fas fa-download"></i></span>
                              <span>Télécharger</span>
                            </a>
                          </div>
                          <p className="help has-text-grey mt-2">
                            <span className="icon is-small"><i className="fas fa-info-circle"></i></span>
                            Si le téléchargement ne fonctionne pas, contactez la mairie.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="notification is-warning has-text-centered">
                <p className="is-size-5 mb-3">
                  <span className="icon is-large">
                    <i className="fas fa-exclamation-triangle fa-2x"></i>
                  </span>
                </p>
                <p className="is-size-5 has-text-weight-semibold mb-2">Aucun bulletin disponible</p>
                <p>Les bulletins municipaux seront publiés prochainement.</p>
              </div>
            )}

            {archivesAnnees.length > 0 && (
              <div className="box mt-6" style={{ 
                borderRadius: 16, 
                boxShadow: '0 2px 12px #1277c620',
                background: '#f8fafc',
              }}>
                <h2 className="title is-5 has-text-primary mb-3">Archives des bulletins</h2>
                
                <div className="tabs">
                  <ul>
                    {archivesAnnees.map((annee) => (
                      <li key={annee} className={archiveAnneeActive === annee ? 'is-active' : ''}>
                        <a onClick={() => setArchiveAnneeActive(annee)}>{annee}</a>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {archiveAnneeActive && archivesBulletins[archiveAnneeActive] && archivesBulletins[archiveAnneeActive].length > 0 ? (
                  <div className="table-container">
                    <table className="table is-fullwidth">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Titre</th>
                          <th width="180">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {archivesBulletins[archiveAnneeActive].map((bulletin, index) => (
                          <tr key={index}>
                            <td>{bulletin.date}</td>
                            <td>{bulletin.titre}</td>
                            <td>
                              <div className="buttons are-small">
                                <a 
                                  href={`/uploads/${bulletin.fichier}`} 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="button is-link is-light"
                                >
                                  Consulter
                                </a>
                                <a 
                                  href={`/uploads/${bulletin.fichier}`} 
                                  download={bulletin.titre}
                                  className="button is-link"
                                >
                                  Télécharger
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="notification is-light has-text-centered">
                    <p>Aucun bulletin disponible pour l'année {archiveAnneeActive}.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
        
      case 'eau':
        return (
          <div>
            <div className="content mb-5">
              <div className="notification is-info is-light">
                <p className="is-size-5 mb-3">
                  <strong>Service des Eaux</strong>
                </p>
                <p>
                  Le service des eaux est géré par la commune en coordination avec la CCSAL.
                  Transmettez votre relevé de compteur en ligne et consultez toutes les informations relatives à l'eau potable.
                </p>
              </div>
            </div>
            
            <div className="columns">
              <div className="column is-5">
                <h2 className="title is-5 has-text-primary mb-4">Transmettre votre relevé de compteur</h2>
                
                {formSubmitted === 'releve' && (
                  <div className="notification is-success">
                    <button className="delete" onClick={() => setFormSubmitted('')}></button>
                    Votre relevé a bien été transmis. Merci de votre collaboration.
                  </div>
                )}
                
                <div className="box" style={{ borderRadius: 12 }}>
                  <form onSubmit={(e) => handleSubmit(e, 'releve')}>
                    <div className="field">
                      <label className="label">Nom et prénom</label>
                      <div className="control">
                        <input 
                          className="input" 
                          type="text" 
                          name="nom" 
                          value={releveForm.nom} 
                          onChange={handleReleveChange} 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="field">
                      <label className="label">Adresse</label>
                      <div className="control">
                        <textarea 
                          className="textarea" 
                          name="adresse" 
                          value={releveForm.adresse} 
                          onChange={handleReleveChange} 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="columns">
                      <div className="column">
                        <div className="field">
                          <label className="label">Email</label>
                          <div className="control">
                            <input 
                              className="input" 
                              type="email" 
                              name="email" 
                              value={releveForm.email} 
                              onChange={handleReleveChange} 
                              required 
                            />
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="field">
                          <label className="label">Téléphone</label>
                          <div className="control">
                            <input 
                              className="input" 
                              type="tel" 
                              name="telephone" 
                              value={releveForm.telephone} 
                              onChange={handleReleveChange} 
                              required 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="field">
                      <label className="label">Numéro de compteur</label>
                      <div className="control">
                        <input 
                          className="input" 
                          type="text" 
                          name="numCompteur" 
                          value={releveForm.numCompteur} 
                          onChange={handleReleveChange} 
                          required 
                        />
                      </div>
                      <p className="help">
                        Numéro inscrit sur votre compteur (généralement 8 chiffres)
                      </p>
                    </div>
                    
                    <div className="columns">
                      <div className="column">
                        <div className="field">
                          <label className="label">Index relevé</label>
                          <div className="control">
                            <input 
                              className="input" 
                              type="number" 
                              name="index" 
                              value={releveForm.index} 
                              onChange={handleReleveChange} 
                              required 
                            />
                          </div>
                          <p className="help">
                            Chiffres noirs uniquement (m³)
                          </p>
                        </div>
                      </div>
                      <div className="column">
                        <div className="field">
                          <label className="label">Date du relevé</label>
                          <div className="control">
                            <input 
                              className="input" 
                              type="date" 
                              name="date" 
                              value={releveForm.date} 
                              onChange={handleReleveChange} 
                              required 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="field mt-4">
                      <div className="control">
                        <button 
                          className="button is-link" 
                          type="submit" 
                          style={{
                            borderRadius: 10,
                            fontWeight: 700,
                          }}
                        >
                          Transmettre mon relevé
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              
              <div className="column">
                <h2 className="title is-5 has-text-primary mb-4">Informations pratiques</h2>
                
                <div className="box" style={{ borderRadius: 12 }}>
                  <h3 className="title is-5 mb-3">Comment lire votre compteur</h3>
                  <figure className="image mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1598329349088-75bee294d2eb?auto=format&fit=crop&w=600&q=80" 
                      alt="Compteur d'eau" 
                      style={{ borderRadius: 8, maxHeight: 200, objectFit: 'cover' }}
                    />
                  </figure>
                  <ul>
                    <li className="mb-2">Notez les chiffres noirs (avant la virgule) : ce sont les mètres cubes (m³)</li>
                    <li className="mb-2">Les chiffres rouges sont les décimales (ne pas les indiquer)</li>
                    <li>Vérifiez l'absence de fuite : tous les robinets fermés, le petit triangle rouge ne doit pas tourner</li>
                  </ul>
                </div>
                
                <div className="box mt-4" style={{ borderRadius: 12 }}>
                  <h3 className="title is-5 mb-3">Périodes de relevé</h3>
                  <ul>
                    <li className="mb-2"><strong>Relevé principal :</strong> Juin</li>
                    <li><strong>Relevé complémentaire :</strong> Décembre</li>
                  </ul>
                  <p className="notification is-warning is-light mt-3 mb-0">
                    En cas d'absence lors du passage du releveur, déposez votre relevé en ligne dans les 7 jours.
                  </p>
                </div>
                
                <div className="box mt-4" style={{ borderRadius: 12 }}>
                  <h3 className="title is-5 mb-3">Contacts et urgences</h3>
                  <p className="mb-2">
                    <strong>Service des eaux (horaires de bureau) :</strong> 03.89.XX.XX.XX
                  </p>
                  <p className="mb-2">
                    <strong>Urgence fuite sur le réseau public :</strong> 03.89.XX.XX.XX
                  </p>
                  <p className="has-text-danger has-text-weight-bold">
                    En cas de fuite importante, fermez le robinet avant compteur.
                  </p>
                </div>
                
                <div className="notification is-link is-light mt-4" style={{ borderRadius: 12 }}>
                  <p className="has-text-weight-bold mb-2">Qualité de l'eau</p>
                  <p className="mb-3">
                    L'eau distribuée à Friesen est conforme aux normes de qualité. 
                    Les dernières analyses sont disponibles en mairie et sur le site de l'ARS.
                  </p>
                  <a href="#" className="button is-small is-link">
                    Consulter les analyses
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      case 'chasse':
        return (
          <div>
            <div className="content mb-5">
              <div className="notification is-info is-light">
                <p className="is-size-5 mb-3">
                  <strong>Chasse et battues sur le territoire communal</strong>
                </p>
                <p>
                  La chasse est une activité réglementée participant à la régulation de la faune sauvage et à la prévention des dégâts aux cultures et forêts.
                  Retrouvez ici les dates des battues et informations sur la pratique de la chasse dans notre commune.
                </p>
              </div>
            </div>
            
            {/* Calendrier des battues */}
            <div className="box" style={{ borderRadius: 12 }}>
              <h2 className="title is-4 has-text-primary mb-4">Calendrier des battues - Saison 2024-2025</h2>
              
              <div className="notification is-warning mb-4">
                <span className="icon mr-2"><i className="fas fa-exclamation-triangle"></i></span>
                <strong>Sécurité :</strong> Pendant les périodes de battues, les promenades en forêt sont fortement déconseillées dans les zones concernées.
                Respectez la signalisation et les consignes des chasseurs.
              </div>
              
              <div className="table-container">
                <table className="table is-fullwidth">
                  <thead>
                    <tr className="has-background-danger-light">
                      <th>Date</th>
                      <th>Secteur</th>
                      <th>Type de chasse</th>
                      <th>Horaires</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>24 octobre 2025</td>
                      <td>Forêt Nord</td>
                      <td>Battue grand gibier</td>
                      <td>8h - 17h</td>
                    </tr>
                    <tr>
                      <td>15 novembre 2025</td>
                      <td>Forêt Est</td>
                      <td>Battue grand gibier</td>
                      <td>8h - 17h</td>
                    </tr>
                    <tr>
                      <td>29 novembre 2025</td>
                      <td>Forêt Sud</td>
                      <td>Battue grand gibier</td>
                      <td>8h - 17h</td>
                    </tr>
                    <tr>
                      <td>20 décembre 2025</td>
                      <td>Forêt Nord et Est</td>
                      <td>Battue grand gibier</td>
                      <td>8h - 17h</td>
                    </tr>
                    <tr>
                      <td>10 janvier 2026</td>
                      <td>Forêt Sud</td>
                      <td>Battue grand gibier</td>
                      <td>8h - 17h</td>
                    </tr>
                    <tr>
                      <td>24 janvier 2026</td>
                      <td>Ensemble du territoire</td>
                      <td>Battue grands gibiers</td>
                      <td>8h - 17h</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Carte des lots de chasse */}
            <div className="columns mt-5">
              <div className="column">
                <div className="box" style={{ borderRadius: 12 }}>
                  <h2 className="title is-4 has-text-primary mb-4">Lots de chasse</h2>
                  
                  <figure className="image is-16by9 mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1506260408121-e353d10b87c7?auto=format&fit=crop&w=1000&q=80" 
                      alt="Carte des lots de chasse" 
                      style={{ borderRadius: 8, objectFit: 'cover' }}
                    />
                  </figure>
                  
                  <div className="content">
                    <p>Le territoire de chasse de la commune est divisé en 3 lots :</p>
                    <ul>
                      <li><strong>Lot 1 - Nord :</strong> 450 hectares, principalement forestiers</li>
                      <li><strong>Lot 2 - Est :</strong> 320 hectares, mixte (forêt et plaine)</li>
                      <li><strong>Lot 3 - Sud :</strong> 380 hectares, principalement plaine</li>
                    </ul>
                    <p>
                      Pour consulter la carte détaillée des lots de chasse, veuillez vous adresser à la mairie 
                      ou télécharger le document ci-dessous.
                    </p>
                    
                    <a href="#" className="button is-link is-light mt-2">
                      <span className="icon"><i className="fas fa-download"></i></span>
                      <span>Télécharger la carte des lots (PDF)</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="column">
                <div className="box" style={{ borderRadius: 12 }}>
                  <h2 className="title is-4 has-text-primary mb-4">Règlementation et contacts</h2>
                  
                  <div className="content">
                    <p><strong>Période d'ouverture générale de la chasse :</strong></p>
                    <p>Du 15 septembre 2025 au 28 février 2026</p>
                    
                    <p className="mt-4"><strong>Adjudicataires des lots de chasse :</strong></p>
                    <ul>
                      <li><strong>Lot 1 :</strong> Association des chasseurs du Nord - M. François Meyer</li>
                      <li><strong>Lot 2 :</strong> Société de chasse Saint-Hubert - M. Jean-Paul Schmitt</li>
                      <li><strong>Lot 3 :</strong> Groupement des chasseurs du Sundgau - M. Thomas Klein</li>
                    </ul>
                    
                    <p className="mt-4"><strong>Règles à respecter pour les promeneurs :</strong></p>
                    <ul>
                      <li>Rester sur les sentiers balisés</li>
                      <li>Porter des vêtements visibles (de préférence orange ou rouge vif)</li>
                      <li>Tenir les chiens en laisse</li>
                      <li>Respecter la signalisation temporaire lors des battues</li>
                    </ul>
                  </div>
                  
                  <div className="buttons mt-4">
                    <a href="https://www.chasseurdefrance.com/" target="_blank" rel="noopener noreferrer" className="button is-link is-light">
                      <span className="icon"><i className="fas fa-external-link-alt"></i></span>
                      <span>Fédération des Chasseurs</span>
                    </a>
                    <a href="https://www.fdc68.fr/" target="_blank" rel="noopener noreferrer" className="button is-link is-light">
                      <span className="icon"><i className="fas fa-external-link-alt"></i></span>
                      <span>Fédération du Haut-Rhin</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Signaler un problème lié à la chasse */}
            <div className="notification is-info is-light mt-5" style={{ borderRadius: 12 }}>
              <div className="columns is-vcentered">
                <div className="column is-9">
                  <p className="has-text-weight-bold mb-2">Signaler un problème lié à la chasse</p>
                  <p>
                    Pour toute question ou problème concernant la pratique de la chasse sur la commune 
                    (non-respect des règles, comportement dangereux, etc.), veuillez contacter la mairie 
                    ou la gendarmerie.
                  </p>
                </div>
                <div className="column">
                  <a href="/contact" className="button is-info">
                    <span className="icon"><i className="fas fa-envelope"></i></span>
                    <span>Nous contacter</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <>
      {/* En-tête hero */}
      <section
        class="hero is-primary is-medium"
        style={{
          backgroundImage: `linear-gradient(180deg,rgba(10,37,64,0.55),rgba(10,37,64,0.25)),url("${heroImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '0 0 32px 32px',
          boxShadow: '0 8px 32px #0a254030',
          marginBottom: 0,
        }}
      >
        <div class="hero-body">
        </div>
      </section>

      {/* Contenu principal */}
      <section
        class="section"
        style={{
          background: '#fafdff',
          minHeight: '100vh',
          marginTop: 0,
        }}
      >
        <div class="container" style={{ maxWidth: 1100 }}>
          <h1 class="title is-3 has-text-link mb-5" style={{ textAlign: 'center' }}>
            Informations pratiques
          </h1>
          
          {/* Onglets de navigation */}
          <div class="tabs is-boxed is-medium mb-5">
            <ul>
              <li class={activeTab === 'contacts' ? 'is-active' : ''}>
                <a onClick={() => setActiveTab('contacts')}>
                  <span class="icon"><i class="fas fa-phone-alt"></i></span>
                  <span>Contacts &amp; urgences</span>
                </a>
              </li>
              <li class={activeTab === 'dechets' ? 'is-active' : ''}>
                <a onClick={() => setActiveTab('dechets')}>
                  <span class="icon"><i class="fas fa-recycle"></i></span>
                  <span>Déchets</span>
                </a>
              </li>
              <li class={activeTab === 'bulletin' ? 'is-active' : ''}>
                <a onClick={() => setActiveTab('bulletin')}>
                  <span class="icon"><i class="fas fa-newspaper"></i></span>
                  <span>Bulletin communal</span>
                </a>
              </li>
              <li class={activeTab === 'eau' ? 'is-active' : ''}>
                <a onClick={() => setActiveTab('eau')}>
                  <span class="icon"><i class="fas fa-tint"></i></span>
                  <span>Service des eaux</span>
                </a>
              </li>
              <li class={activeTab === 'chasse' ? 'is-active' : ''}>
                <a onClick={() => setActiveTab('chasse')}>
                  <span class="icon"><i class="fas fa-bullseye"></i></span>
                  <span>Chasse</span>
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contenu des onglets */}
          {renderContent()}
        </div>
      </section>
    </>
  );
}