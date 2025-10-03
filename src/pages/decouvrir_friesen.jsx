import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
import Link from 'next/link';

export default function Visites() {
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
              {content.pointsInteret.map((point) => (
                <div key={point.id} className="column is-half">
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
              {content.circuitsPedestres.map((circuit) => (
                <div key={circuit.id} className="column is-half">
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
              {content.circuitsVTT.map((circuit) => (
                <div key={circuit.id} className="column is-half">
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

            {content.installationsSportives.map((installation) => (
              <div key={installation.id} className="box mb-5" style={{ 
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
          backgroundImage: 'linear-gradient(180deg,rgba(10,37,64,0.55),rgba(10,37,64,0.25)),url("village.jpeg")',
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
              {/* En-tête */}
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
                <div className="columns is-vcentered is-mobile" style={{ margin: 0 }}>
                  <div className="column is-12-mobile is-4-tablet has-text-centered" style={{ padding: '1rem' }}>
                    <figure className="image" style={{ maxWidth: 280, margin: '0 auto' }}>
                      <img 
                        src="https://images.unsplash.com/photo-1582880414731-b8cecb28af33?auto=format&fit=crop&w=300&q=80" 
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
                    <div className="columns is-multiline is-mobile" style={{ margin: '0 -0.5rem' }}>
                      {/* Colonne gauche */}
                      <div className="column is-12-mobile is-6-tablet" style={{ padding: '0.5rem' }}>
                        {content.officeTourisme.adresse && (
                          <div style={{ 
                            background: '#f8fafc',
                            padding: '1.5rem',
                            borderRadius: 12,
                            border: '2px solid #e0e7ef',
                            marginBottom: 12,
                            transition: 'all 0.3s ease'
                          }}
                          className="info-card"
                          >
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'flex-start',
                              gap: 12
                            }}>
                              <span style={{ fontSize: 28, flexShrink: 0 }}>📍</span>
                              <div>
                                <p className="has-text-weight-bold mb-2" style={{ color: '#1277c6', fontSize: 15 }}>
                                  Adresse
                                </p>
                                <p style={{ fontSize: 14, color: '#4a5568', lineHeight: 1.5, wordBreak: 'break-word' }}>
                                  {content.officeTourisme.adresse}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {content.officeTourisme.tel && (
                          <div style={{ 
                            background: '#f8fafc',
                            padding: '1.5rem',
                            borderRadius: 12,
                            border: '2px solid #e0e7ef',
                            marginBottom: 12,
                            transition: 'all 0.3s ease'
                          }}
                          className="info-card"
                          >
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'flex-start',
                              gap: 12
                            }}>
                              <span style={{ fontSize: 28, flexShrink: 0 }}>📞</span>
                              <div>
                                <p className="has-text-weight-bold mb-2" style={{ color: '#1277c6', fontSize: 15 }}>
                                  Téléphone
                                </p>
                                <p style={{ fontSize: 14, color: '#4a5568', lineHeight: 1.5 }}>
                                  {content.officeTourisme.tel}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Colonne droite */}
                      <div className="column is-12-mobile is-6-tablet" style={{ padding: '0.5rem' }}>
                        {content.officeTourisme.email && (
                          <div style={{ 
                            background: '#f8fafc',
                            padding: '1.5rem',
                            borderRadius: 12,
                            border: '2px solid #e0e7ef',
                            marginBottom: 12,
                            transition: 'all 0.3s ease'
                          }}
                          className="info-card"
                          >
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'flex-start',
                              gap: 12
                            }}>
                              <span style={{ fontSize: 28, flexShrink: 0 }}>📧</span>
                              <div>
                                <p className="has-text-weight-bold mb-2" style={{ color: '#1277c6', fontSize: 15 }}>
                                  Email
                                </p>
                                <p style={{ fontSize: 14, color: '#4a5568', lineHeight: 1.5, wordBreak: 'break-word' }}>
                                  {content.officeTourisme.email}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {content.officeTourisme.horaires && (
                          <div style={{ 
                            background: '#f8fafc',
                            padding: '1.5rem',
                            borderRadius: 12,
                            border: '2px solid #e0e7ef',
                            marginBottom: 12,
                            transition: 'all 0.3s ease'
                          }}
                          className="info-card"
                          >
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'flex-start',
                              gap: 12
                            }}>
                              <span style={{ fontSize: 28, flexShrink: 0 }}>🕒</span>
                              <div>
                                <p className="has-text-weight-bold mb-2" style={{ color: '#1277c6', fontSize: 15 }}>
                                  Horaires
                                </p>
                                <p style={{ fontSize: 14, color: '#4a5568', lineHeight: 1.5 }}>
                                  {content.officeTourisme.horaires}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Boutons - Affichage conditionnel */}
                    {(content.officeTourisme.site || content.officeTourisme.email) && (
                      <div className="buttons mt-5 is-flex-wrap-wrap" style={{ gap: 10 }}>
                        {content.officeTourisme.site && (
                          <a 
                            href={content.officeTourisme.site} 
                            className="button is-link is-medium"
                            style={{
                              borderRadius: 12,
                              fontWeight: 600,
                              padding: '0.75rem 1.75rem',
                              flex: '1 1 auto',
                              minWidth: '200px'
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
                              minWidth: '200px'
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
                <div className="columns is-multiline is-mobile" style={{ margin: '0 -0.75rem' }}>
                  {content.infosPratiques.map((info, index) => (
                    <div 
                      key={index} 
                      className={`column ${
                        content.infosPratiques.length === 1 ? 'is-12' :
                        content.infosPratiques.length === 2 ? 'is-6-mobile is-6-tablet' :
                        content.infosPratiques.length === 3 ? 'is-6-mobile is-4-tablet' :
                        'is-6-mobile is-4-tablet is-4-desktop'
                      }`}
                      style={{ padding: '0.75rem' }}
                    >
                      <div style={{ 
                        background: 'linear-gradient(135deg, #f8fff8 0%, #efffef 100%)',
                        padding: '1.75rem 1.25rem',
                        borderRadius: 16,
                        textAlign: 'center',
                        height: '100%',
                        border: '2px solid #e8f5e8',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '180px'
                      }}
                      className="pratique-card"
                      >
                        <div style={{ fontSize: 48, marginBottom: 16 }}>{info.emoji}</div>
                        <p className="has-text-weight-bold mb-3" style={{ color: '#48c774', fontSize: 17 }}>
                          {info.titre}
                        </p>
                        <p style={{ fontSize: 14, color: '#4a5568', lineHeight: 1.6 }}>
                          {info.texte}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="has-text-centered mt-6">
                  <Link 
                    href="/infos-pratiques" 
                    className="button is-success is-large"
                    style={{
                      borderRadius: 12,
                      fontWeight: 700,
                      padding: '1rem 2.5rem',
                      boxShadow: '0 6px 16px #48c77440',
                      fontSize: 18
                    }}
                  >
                    <span className="icon is-medium">
                      <i className="fas fa-info-circle"></i>
                    </span>
                    <span>Toutes les informations pratiques</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CSS responsive */}
      <style jsx global>{`
        .info-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(18, 119, 198, 0.15);
          border-color: #1277c6;
        }
        
        .pratique-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 28px rgba(72, 199, 116, 0.25);
          border-color: #48c774;
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
            width: 100%;
          }
          
          .buttons {
            flex-direction: column;
            gap: 10px;
          }
          
          .buttons .button {
            width: 100%;
            margin: 0 !important;
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
          
          .pratique-card {
            min-height: 160px !important;
          }
          
          .info-card {
            margin-bottom: 0.75rem !important;
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
        }
      `}</style>
    </div>
  );
}