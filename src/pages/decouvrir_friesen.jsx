import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
import Link from 'next/link';
import useHeroImage from '../hooks/useHeroImage';

export default function Visites() {
  const heroImage = useHeroImage();
  const [activeTab, setActiveTab] = useState('guide');
  const [content, setContent] = useState({
    guideIntro: "",
    guideBouton: "",
    guidePlan: "",
    pointsInteret: [],
    circuitsPedestres: [],
    circuitsVTT: [],
    installationsSportives: [],
    officeTourisme: {
      adresse: "",
      tel: "",
      email: "",
      horaires: "",
      site: ""
    },
    infosPratiques: [],
    accrocheVillage: "",
    introVillage: "",
    titreGuide: "",
    titrePedestre: "",
    textePedestre: "",
    titreVTT: "",
    texteVTT: "",
    locationVTT: "",
    locationVTTInfos: [],
    equipementsSportifs: "",
    equipementsSportifsInfos: []
  });

  useEffect(() => {
    fetch('/api/pageContent?page=decouvrir_friesen')
      .then(res => res.json())
      .then(data => {
        const initial = {
          guideIntro: "",
          guideBouton: "",
          guidePlan: "",
          pointsInteret: [],
          circuitsPedestres: [],
          circuitsVTT: [],
          installationsSportives: [],
          officeTourisme: {
            adresse: "",
            tel: "",
            email: "",
            horaires: "",
            site: ""
          },
          infosPratiques: [],
          accrocheVillage: "",
          introVillage: "",
          titreGuide: "",
          titrePedestre: "",
          textePedestre: "",
          titreVTT: "",
          texteVTT: "",
          locationVTT: "",
          locationVTTInfos: [],
          equipementsSportifs: "",
          equipementsSportifsInfos: []
        };
        setContent({ ...initial, ...(data[0] || {}) });
      });
  }, []);

  const tabs = [
    { id: 'guide', icon: '🗺️', label: 'Guide de visite', shortLabel: 'Guide' },
    { id: 'pedestre', icon: '🚶', label: 'Circuits pédestres', shortLabel: 'Pédestre' },
    { id: 'vtt', icon: '🚴', label: 'Circuits VTT', shortLabel: 'VTT' },
    { id: 'installations', icon: '⚽', label: 'Installations sportives', shortLabel: 'Sport' }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'guide':
        return (
          <div>
            <div className="content mb-5">
              <div className="notification is-info is-light">
                <p className="is-size-5 mb-3">
                  <strong>{content.accrocheVillage}</strong>
                </p>
                <p>
                  {content.introVillage}
                </p>
                <div className="buttons mt-4">
                  <a href="#" className="button is-link">
                    <span className="icon">
                      <i className="fas fa-download"></i>
                    </span>
                    <span>Télécharger le guide (PDF)</span>
                  </a>
                  <a href="#" className="button is-link is-light">
                    <span className="icon">
                      <i className="fas fa-map-marked-alt"></i>
                    </span>
                    <span>Plan interactif</span>
                  </a>
                </div>
              </div>
            </div>

            <h2 className="title is-4 has-text-primary mb-4">Points d'intérêt</h2>
            
            <div className="columns is-multiline">
              {content.pointsInteret.map((point, index) => (
                <div key={index} className="column is-half">
                  <div className="card" style={{ 
                    borderRadius: 16, 
                    overflow: 'hidden',
                    boxShadow: '0 2px 12px #1277c620',
                    height: '100%'
                  }}>
                    <div className="card-image">
                      <figure className="image is-3by2">
                        <img 
                          src={point.image} 
                          alt={point.nom} 
                          style={{ objectFit: 'cover' }}
                        />
                      </figure>
                    </div>
                    <div className="card-content">
                      <p className="title is-5 has-text-link mb-2">{point.nom}</p>
                      <p className="subtitle is-6 mb-3 has-text-grey">{point.categorie}</p>
                      
                      <div className="content">
                        <p className="mb-2">{point.description}</p>
                        <p className="has-text-grey mb-2">
                          <span style={{ fontSize: 16, marginRight: 8 }}>📍</span> {point.adresse}
                        </p>
                        <p className="has-text-grey">
                          <span style={{ fontSize: 16, marginRight: 8 }}>🕒</span> {point.horaires}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="box has-background-link-light mt-6" style={{ borderRadius: 16 }}>
              <div className="columns is-vcentered">
                <div className="column is-3 has-text-centered">
                  <img 
                    src="https://images.unsplash.com/photo-1580893246395-52aead8960dc?auto=format&fit=crop&w=300&q=80" 
                    alt="Office du tourisme" 
                    style={{ borderRadius: 12, maxWidth: 200 }}
                  />
                </div>
                <div className="column">
                  <h3 className="title is-5 mb-3">Visites guidées</h3>
                  <p className="mb-3">{content.titreGuide}</p>
                  <ul className="mb-4">
                    {content.infosVisiteGuidee && content.infosVisiteGuidee.map((info, idx) => (
                      <li key={idx}>
                        <span style={{ whiteSpace: 'pre-line' }}>{info}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#" className="button is-link">Réserver une visite guidée</a>
                </div>
              </div>
            </div>
          </div>
        );

      case 'pedestre':
        return (
          <div>
            <div className="content mb-5">
              <div className="notification is-info is-light">
                <p className="is-size-5 mb-3">
                  <strong>{content.titrePedestre}</strong>
                </p>
                <p>
                  {content.textePedestre}
                </p>
                <div className="buttons mt-4">
                  <a href="#" className="button is-link">
                    <span className="icon">
                      <i className="fas fa-download"></i>
                    </span>
                    <span>Télécharger les parcours (GPX)</span>
                  </a>
                  <a href="#" className="button is-link is-light">
                    <span className="icon">
                      <i className="fas fa-map-marked-alt"></i>
                    </span>
                    <span>Carte des sentiers</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="columns is-multiline">
              {content.circuitsPedestres.map((circuit, index) => (
                <div key={index} className="column is-half">
                  <div className="card" style={{ 
                    borderRadius: 16, 
                    overflow: 'hidden',
                    boxShadow: '0 2px 12px #1277c620',
                    height: '100%'
                  }}>
                    <div className="card-image">
                      <figure className="image is-3by2">
                        <img 
                          src={circuit.image} 
                          alt={circuit.nom} 
                          style={{ objectFit: 'cover' }}
                        />
                      </figure>
                    </div>
                    <div className="card-content">
                      <p className="title is-5 has-text-link mb-2">{circuit.nom}</p>
                      
                      <div className="tags mb-3">
                        <span className="tag is-info">{circuit.distance}</span>
                        <span className="tag is-success">{circuit.duree}</span>
                        <span className={`tag ${
                          circuit.difficulte === 'Facile' ? 'is-success' : 
                          circuit.difficulte === 'Moyen' ? 'is-warning' : 
                          'is-danger'
                        }`}>
                          {circuit.difficulte}
                        </span>
                      </div>
                      
                      <div className="content">
                        <p className="mb-3">{circuit.description}</p>
                        <p className="has-text-grey mb-3">
                          <span style={{ fontSize: 16, marginRight: 8 }}>🚶</span> Départ : {circuit.depart}
                        </p>
                        
                        <p className="has-text-weight-bold mb-2">Points d'intérêt :</p>
                        <ul>
                          {circuit.points.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="notification is-warning is-light mt-5" style={{ borderRadius: 16 }}>
              <div className="columns is-vcentered">
                <div className="column is-narrow">
                  <span style={{ fontSize: 40 }}>⚠️</span>
                </div>
                <div className="column">
                  <p className="has-text-weight-bold mb-2">Consignes de sécurité</p>
                  <ul>
                    <li>Équipez-vous de chaussures adaptées et de vêtements appropriés selon la météo</li>
                    <li>Emportez suffisamment d'eau, particulièrement en été</li>
                    <li>Respectez la signalisation et ne quittez pas les sentiers balisés</li>
                    <li>Respectez la faune et la flore, remportez vos déchets</li>
                    <li>En cas d'urgence, composez le 112</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'vtt':
        return (
          <div>
            <div className="content mb-5">
              <div className="notification is-info is-light">
                <p className="is-size-5 mb-3">
                  <strong>{content.titreVTT}</strong>
                </p>
                <p>
                  {content.texteVTT}
                </p>
                <div className="buttons mt-4">
                  <a href="#" className="button is-link">
                    <span className="icon">
                      <i className="fas fa-download"></i>
                    </span>
                    <span>Télécharger les traces GPX</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="columns is-multiline">
              {content.circuitsVTT.map((circuit, index) => (
                <div key={index} className="column is-half">
                  <div className="card" style={{ 
                    borderRadius: 16, 
                    overflow: 'hidden',
                    boxShadow: '0 2px 12px #1277c620',
                    height: '100%'
                  }}>
                    <div className="card-image">
                      <figure className="image is-3by2">
                        <img 
                          src={circuit.image} 
                          alt={circuit.nom} 
                          style={{ objectFit: 'cover' }}
                        />
                      </figure>
                    </div>
                    <div className="card-content">
                      <p className="title is-5 has-text-link mb-2">{circuit.nom}</p>
                      
                      <div className="tags mb-3">
                        <span className="tag is-info">{circuit.distance}</span>
                        <span className="tag is-success">{circuit.duree}</span>
                        <span className={`tag ${
                          circuit.difficulte === 'Facile' ? 'is-success' : 
                          circuit.difficulte === 'Moyen' ? 'is-warning' : 
                          'is-danger'
                        }`}>
                          {circuit.difficulte}
                        </span>
                        <span className="tag is-link">{circuit.denivele}</span>
                      </div>
                      
                      <div className="content">
                        <p className="mb-3">{circuit.description}</p>
                        <p className="has-text-grey">
                          <span style={{ fontSize: 16, marginRight: 8 }}>🚵</span> Départ : {circuit.depart}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="box has-background-link-light mt-5" style={{ borderRadius: 16, overflow: 'hidden' }}>
              <div className="columns">
                <div className="column is-8">
                  <h3 className="title is-5 mb-3">Location de VTT</h3>
                  <p className="mb-3">
                    {content.locationVTT}
                  </p>
                  <ul>
                    {content.locationVTTInfos && content.locationVTTInfos.map((info, idx) => (
                      <li key={idx}>{info}</li>
                    ))}
                  </ul>
                  <a href="#" className="button is-link mt-3">Réserver un VTT</a>
                </div>
                <div className="column">
                  <figure className="image is-4by3">
                    <img 
                      src="https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?auto=format&fit=crop&w=500&q=80" 
                      alt="Location VTT" 
                      style={{ objectFit: 'cover', borderRadius: 12 }}
                    />
                  </figure>
                </div>
              </div>
            </div>
          </div>
        );

      case 'installations':
        return (
          <div>
            <div className="content mb-5">
              <div className="notification is-info is-light">
                <p className="is-size-5 mb-3">
                  <strong>Installations sportives</strong>
                </p>
                <p>
                  La commune de Friesen met à votre disposition diverses installations sportives en accès libre. 
                  Profitez-en pour vous détendre et pratiquer votre activité favorite !
                </p>
              </div>
            </div>

            {content.installationsSportives.map((installation, index) => (
              <div key={index} className="box mb-5" style={{ 
                borderRadius: 16, 
                overflow: 'hidden',
                boxShadow: '0 2px 12px #1277c620',
                background: '#f8fafc'
              }}>
                <div className="columns">
                  <div className="column is-5">
                    <figure className="image is-4by3">
                      <img 
                        src={installation.image} 
                        alt={installation.nom} 
                        style={{ objectFit: 'cover', borderRadius: 12 }}
                      />
                    </figure>
                  </div>
                  <div className="column">
                    <h3 className="title is-4 has-text-primary mb-3">{installation.nom}</h3>
                    <p className="mb-4">{installation.description}</p>
                    
                    <div className="columns">
                      <div className="column">
                        <p className="has-text-weight-bold mb-2">Équipements :</p>
                        <ul>
                          {installation.equipements.map((eq, index) => (
                            <li key={index}>{eq}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="column">
                        <p className="has-text-grey mb-2">
                          <span style={{ fontSize: 16, marginRight: 8 }}>📍</span> {installation.adresse}
                        </p>
                        <p className="has-text-grey">
                          <span style={{ fontSize: 16, marginRight: 8 }}>🕒</span> {installation.horaires}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="box mt-6" style={{ 
              borderRadius: 16, 
              boxShadow: '0 2px 12px #1277c620',
              background: '#f0f7fd',
            }}>
              <h3 className="title is-5 has-text-primary mb-3">{content.equipementsSportifs}</h3>
              <div className="columns is-multiline">
                {content.equipementsSportifsInfos.map((eq, i) => (
                  <div key={i} className="column is-6">
                    <div className="notification is-white" style={{ borderRadius: 12 }}>
                      <p className="has-text-weight-bold mb-2">
                        <span style={{ fontSize: 24, marginRight: 8 }}>{eq.emoji}</span> {eq.titre}
                      </p>
                      <p>{eq.description}</p>
                      {eq.note && <p className="is-size-7 mt-2">{eq.note}</p>}
                      {eq.lien && (
                        <div className="mt-3">
                          <a 
                            href={eq.lien} 
                            className="button is-link is-small"
                            style={{ borderRadius: 8, fontWeight: 600 }}
                            target={eq.lien.startsWith('http') ? '_blank' : '_self'}
                            rel={eq.lien.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            <span className="icon is-small">
                              <i className="fas fa-external-link-alt"></i>
                            </span>
                            <span>En savoir plus</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* En-tête hero */}
      <section
        className="hero is-primary is-medium"
        style={{
          backgroundImage: `linear-gradient(180deg,rgba(10,37,64,0.55),rgba(10,37,64,0.25)),url("${heroImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '0 0 32px 32px',
          boxShadow: '0 8px 32px #0a254030',
          marginBottom: 0,
        }}
      >
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title is-2 has-text-weight-bold" style={{ color: '#fff', textShadow: '0 4px 24px #0a2540a0', letterSpacing: 1 }}>
              Bienvenue sur le site officiel de<br />
              la Mairie de <span style={{ color: '#ffd700', textShadow: '0 2px 8px #1277c6' }}>Friesen</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section
        className="section"
        style={{
          background: '#fafdff',
          minHeight: '100vh',
          marginTop: 0,
          padding: '3rem 1rem'
        }}
      >
        <div className="container" style={{
          fontFamily: "'Inter', 'Roboto', Arial, sans-serif",
          maxWidth: 1100
        }}>
          <h1 className="title is-3 has-text-link mb-5" style={{ textAlign: 'center' }}>
            Découvrir Friesen
          </h1>
          
          {/* Navigation Desktop - Onglets classiques */}
          <div className="tabs is-centered is-boxed is-medium mb-5 is-hidden-mobile">
            <ul>
              {tabs.map(tab => (
                <li key={tab.id} className={activeTab === tab.id ? 'is-active' : ''}>
                  <a onClick={() => setActiveTab(tab.id)}>
                    <span className="icon is-small"><i className="fas fa-map-marked-alt"></i></span>
                    <span>{tab.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Mobile - Cartes cliquables */}
          <div className="is-hidden-tablet mb-5">
            <div className="columns is-multiline is-mobile" style={{ margin: '0 -0.5rem' }}>
              {tabs.map(tab => (
                <div key={tab.id} className="column is-6-mobile" style={{ padding: '0.5rem' }}>
                  <div
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      background: activeTab === tab.id 
                        ? 'linear-gradient(135deg, #1277c6 0%, #1b9bd7 100%)' 
                        : 'white',
                      color: activeTab === tab.id ? 'white' : '#333',
                      padding: '1.25rem 0.75rem',
                      borderRadius: 16,
                      boxShadow: activeTab === tab.id 
                        ? '0 6px 20px #1277c640' 
                        : '0 2px 8px #1277c620',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'center',
                      border: activeTab === tab.id ? 'none' : '2px solid #e0e7ef',
                      transform: activeTab === tab.id ? 'scale(1.02)' : 'scale(1)'
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{tab.icon}</div>
                    <div style={{ 
                      fontSize: 14, 
                      fontWeight: activeTab === tab.id ? 700 : 600,
                      lineHeight: 1.3
                    }}>
                      {tab.shortLabel}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contenu des onglets */}
          {renderContent()}
          
          {/* Office du Tourisme - Affichage conditionnel */}
          {(content.officeTourisme.adresse || content.officeTourisme.tel || content.officeTourisme.email || content.officeTourisme.horaires) && (
            <div className="box mt-6" style={{ 
              borderRadius: 16, 
              boxShadow: '0 4px 20px #1277c620',
              background: 'white',
              border: '2px solid #1277c6',
              overflow: 'hidden',
              padding: 0
            }}>
              {/* En-tête */}j
              <div style={{
                background: 'linear-gradient(135deg, #1277c6 0%, #1b9bd7 100%)',
                padding: '2rem 1.5rem',
                color: 'white',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🏢</div>
                <h3 className="title is-3" style={{ color: 'white', marginBottom: 10 }}>
                  Office du Tourisme
                </h3>
                <p style={{ opacity: 0.95, fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
                  Pour toute information sur les activités touristiques de Friesen et sa région
                </p>
              </div>

              {/* Contenu */}
              <div style={{ padding: '2.5rem 1.5rem' }}>
                <div className="columns is-vcentered" style={{ margin: 0 }}>
                  <div className="column is-12-mobile is-4-tablet has-text-centered" style={{ padding: '1rem' }}>
                    <figure className="image" style={{ maxWidth: 280, margin: '0 auto' }}>
                      <img 
                        src={content.officeTourisme.image || "https://images.unsplash.com/photo-1582880414731-b8cecb28af33?auto=format&fit=crop&w=300&q=80"} 
                        alt="Office du tourisme" 
                        style={{ 
                          objectFit: 'cover', 
                          borderRadius: 16, 
                          boxShadow: '0 8px 24px #1277c630',
                          border: '4px solid #f8fafc'
                        }}
                      />
                    </figure>
                  </div>
                  
                  <div className="column is-12-mobile is-8-tablet" style={{ padding: '1rem' }}>
                    <div className="info-grid">
                      {content.officeTourisme.adresse && (
                        <div className="info-card-tourism">
                          <div className="info-icon">📍</div>
                          <div className="info-content">
                            <p className="info-label">Adresse</p>
                            <p className="info-text">{content.officeTourisme.adresse}</p>
                          </div>
                        </div>
                      )}
                      
                      {content.officeTourisme.tel && (
                        <div className="info-card-tourism">
                          <div className="info-icon">📞</div>
                          <div className="info-content">
                            <p className="info-label">Téléphone</p>
                            <p className="info-text">{content.officeTourisme.tel}</p>
                          </div>
                        </div>
                      )}
                      
                      {content.officeTourisme.email && (
                        <div className="info-card-tourism">
                          <div className="info-icon">📧</div>
                          <div className="info-content">
                            <p className="info-label">Email</p>
                            <p className="info-text">{content.officeTourisme.email}</p>
                          </div>
                        </div>
                      )}
                      
                      {content.officeTourisme.horaires && (
                        <div className="info-card-tourism">
                          <div className="info-icon">🕒</div>
                          <div className="info-content">
                            <p className="info-label">Horaires</p>
                            <p className="info-text">{content.officeTourisme.horaires}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Boutons - Affichage conditionnel */}
                    {(content.officeTourisme.site || content.officeTourisme.email) && (
                      <div className="tourism-buttons">
                        {content.officeTourisme.site && (
                          <a 
                            href={content.officeTourisme.site} 
                            className="button is-link is-medium"
                            style={{
                              borderRadius: 12,
                              fontWeight: 600,
                              padding: '0.75rem 1.75rem',
                              flex: '1 1 auto',
                              minWidth: 'max-content'
                            }}
                          >
                            <span className="icon">
                              <i className="fas fa-globe"></i>
                            </span>
                            <span>Site web</span>
                          </a>
                        )}
                        {content.officeTourisme.email && (
                          <a 
                            href={`mailto:${content.officeTourisme.email}`}
                            className="button is-link is-light is-medium"
                            style={{
                              borderRadius: 12,
                              fontWeight: 600,
                              padding: '0.75rem 1.75rem',
                              flex: '1 1 auto',
                              minWidth: 'max-content'
                            }}
                          >
                            <span className="icon">
                              <i className="fas fa-envelope"></i>
                            </span>
                            <span>Contact</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Informations pratiques - Affichage conditionnel */}
          {content.infosPratiques && content.infosPratiques.length > 0 && (
            <div className="box mt-6" style={{ 
              borderRadius: 16, 
              boxShadow: '0 4px 20px #48c77420',
              background: 'white',
              border: '2px solid #48c774',
              padding: 0,
              overflow: 'hidden'
            }}>
              {/* En-tête */}
              <div style={{
                background: 'linear-gradient(135deg, #48c774 0%, #3ec46d 100%)',
                padding: '2rem 1.5rem',
                color: 'white',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>ℹ️</div>
                <h3 className="title is-3" style={{ color: 'white', marginBottom: 10 }}>
                  Informations pratiques
                </h3>
                <p style={{ opacity: 0.95, fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
                  Tout ce qu'il faut savoir avant votre visite à Friesen
                </p>
              </div>

              {/* Contenu */}
              <div style={{ padding: '2.5rem 1.5rem' }}>
                <div className="pratique-grid">
                  {content.infosPratiques.map((info, index) => (
                    <div key={index} className="pratique-card-new">
                      <div className="pratique-icon">{info.emoji}</div>
                      <h4 className="pratique-title">{info.titre}</h4>
                      <p className="pratique-text">{info.texte}</p>
                      {info.lien && (
                        <div className="mt-3">
                          <a 
                            href={info.lien} 
                            className="button is-success is-small"
                            style={{ 
                              borderRadius: 8, 
                              fontWeight: 600,
                              boxShadow: '0 2px 8px #48c77420'
                            }}
                            target={info.lien.startsWith('http') ? '_blank' : '_self'}
                            rel={info.lien.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            <span className="icon is-small">
                              <i className="fas fa-arrow-right"></i>
                            </span>
                            <span>En savoir plus</span>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="has-text-centered mt-6">
                  {content.lienInfosPratiques ? (
                    <a 
                      href={content.lienInfosPratiques}
                      className="button is-success is-large"
                      style={{
                        borderRadius: 12,
                        fontWeight: 700,
                        padding: '1rem 2.5rem',
                        boxShadow: '0 6px 16px #48c77440',
                        fontSize: 18
                      }}
                      target={content.lienInfosPratiques.startsWith('http') ? '_blank' : '_self'}
                      rel={content.lienInfosPratiques.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      <span className="icon is-medium">
                        <i className="fas fa-info-circle"></i>
                      </span>
                      <span>Toutes les informations pratiques</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CSS responsive */}
      <style jsx global>{`
        /* Office du Tourisme - Grid Layout */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .info-card-tourism {
          background: #f8fafc;
          padding: 1.25rem;
          border-radius: 12px;
          border: 2px solid #e0e7ef;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          transition: all 0.3s ease;
          min-height: 100px;
        }
        
        .info-card-tourism:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(18, 119, 198, 0.15);
          border-color: #1277c6;
        }
        
        .info-icon {
          font-size: 28px;
          flex-shrink: 0;
          line-height: 1;
        }
        
        .info-content {
          flex: 1;
          min-width: 0;
        }
        
        .info-label {
          font-weight: 700;
          color: #1277c6;
          font-size: 15px;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }
        
        .info-text {
          font-size: 14px;
          color: #4a5568;
          line-height: 1.5;
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }
        
        .tourism-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 1.5rem;
        }
        
        /* Informations Pratiques - Grid Layout */
        .pratique-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .pratique-card-new {
          background: linear-gradient(135deg, #f8fff8 0%, #efffef 100%);
          padding: 2rem 1.5rem;
          border-radius: 16px;
          border: 2px solid #e8f5e8;
          text-align: center;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          min-height: 200px;
        }
        
        .pratique-card-new:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 28px rgba(72, 199, 116, 0.25);
          border-color: #48c774;
        }
        
        .pratique-icon {
          font-size: 48px;
          margin-bottom: 1rem;
          line-height: 1;
        }
        
        .pratique-title {
          font-weight: 700;
          color: #48c774;
          font-size: 17px;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        
        .pratique-text {
          font-size: 14px;
          color: #4a5568;
          line-height: 1.6;
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
          flex-grow: 1;
        }
        
        @media screen and (max-width: 768px) {
          .container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          
          .columns {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          
          .column {
            padding: 0.5rem !important;
          }
          
          .box {
            overflow-x: visible !important;
            margin-left: 0.5rem;
            margin-right: 0.5rem;
          }
          
          .button {
            white-space: normal !important;
            height: auto !important;
            padding: 0.75rem 1.25rem !important;
          }
          
          .is-centered-mobile {
            justify-content: center;
          }
          
          .tabs ul {
            flex-wrap: nowrap;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          
          .tabs li {
            flex-shrink: 0;
          }
          
          .title.is-3 {
            font-size: 1.75rem !important;
          }
          
          /* Office du Tourisme - Mobile */
          .info-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          
          .info-card-tourism {
            min-height: auto;
            padding: 1rem;
          }
          
          .info-icon {
            font-size: 24px;
          }
          
          .info-label {
            font-size: 14px;
          }
          
          .info-text {
            font-size: 13px;
          }
          
          .tourism-buttons {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .tourism-buttons .button {
            width: 100%;
            min-width: auto !important;
          }
          
          /* Informations Pratiques - Mobile */
          .pratique-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .pratique-card-new {
            min-height: 160px;
            padding: 1.5rem 1rem;
          }
          
          .pratique-icon {
            font-size: 40px;
          }
          
          .pratique-title {
            font-size: 16px;
          }
          
          .pratique-text {
            font-size: 13px;
          }
        }
        
        @media screen and (max-width: 480px) {
          .button.is-large {
            font-size: 16px !important;
            padding: 0.875rem 1.5rem !important;
          }
          
          .button.is-medium {
            font-size: 15px !important;
          }
          
          .info-grid,
          .pratique-grid {
            gap: 0.5rem;
          }
        }
        
        @media screen and (min-width: 769px) and (max-width: 1024px) {
          .info-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .pratique-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media screen and (min-width: 1025px) {
          .info-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .pratique-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}