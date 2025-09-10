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
    introVillage: "", // <-- AJOUT ICI
    titreGuide: "",
    titrePedestre: "",
    textePedestre: "", // <-- AJOUT
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
          introVillage: "", // <-- AJOUT ICI AUSSI
          titreGuide: "",
          titrePedestre: "",
          textePedestre: "", // <-- AJOUT
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
    <>
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
        }}
      >
        <div className="container" style={{
          fontFamily: "'Inter', 'Roboto', Arial, sans-serif",
          maxWidth: 1100
        }}>
          <h1 className="title is-3 has-text-link mb-5" style={{ textAlign: 'center' }}>
            Découvrir Friesen
          </h1>
          
          {/* Onglets de navigation */}
          <div className="tabs is-centered is-boxed is-medium mb-5">
            <ul>
              <li className={activeTab === 'guide' ? 'is-active' : ''}>
                <a onClick={() => setActiveTab('guide')}>
                  <span className="icon is-small"><i className="fas fa-map-marked-alt"></i></span>
                  <span>Guide de visite</span>
                </a>
              </li>
              <li className={activeTab === 'pedestre' ? 'is-active' : ''}>
                <a onClick={() => setActiveTab('pedestre')}>
                  <span className="icon is-small"><i className="fas fa-hiking"></i></span>
                  <span>Circuits pédestres</span>
                </a>
              </li>
              <li className={activeTab === 'vtt' ? 'is-active' : ''}>
                <a onClick={() => setActiveTab('vtt')}>
                  <span className="icon is-small"><i className="fas fa-bicycle"></i></span>
                  <span>Circuits VTT</span>
                </a>
              </li>
              <li className={activeTab === 'installations' ? 'is-active' : ''}>
                <a onClick={() => setActiveTab('installations')}>
                  <span className="icon is-small"><i className="fas fa-futbol"></i></span>
                  <span>Installations sportives</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contenu des onglets */}
          {renderContent()}
          
          {/* Contact et informations pratiques */}
          <div className="columns mt-6">
            <div className="column is-6">
              <div className="box" style={{ 
                borderRadius: 16, 
                boxShadow: '0 2px 12px #1277c620',
                background: '#f8fafc',
                height: '100%'
              }}>
                <h3 className="title is-5 has-text-primary mb-3">Office du Tourisme</h3>
                <div className="columns">
                  <div className="column is-8">
                    <p className="mb-3">Pour toute information supplémentaire et documentation sur les activités touristiques de Friesen et sa région.</p>
                    <p className="has-text-grey mb-2">
                      <span style={{ fontSize: 16, marginRight: 8 }}>📍</span> {content.officeTourisme.adresse}
                    </p>
                    <p className="has-text-grey mb-2">
                      <span style={{ fontSize: 16, marginRight: 8 }}>📞</span> {content.officeTourisme.tel}
                    </p>
                    <p className="has-text-grey mb-2">
                      <span style={{ fontSize: 16, marginRight: 8 }}>📧</span> {content.officeTourisme.email}
                    </p>
                    <p className="has-text-grey mb-3">
                      <span style={{ fontSize: 16, marginRight: 8 }}>🕒</span> {content.officeTourisme.horaires}
                    </p>
                    <a href={content.officeTourisme.site} className="button is-link is-light">Visiter le site web</a>
                  </div>
                  <div className="column">
                    <figure className="image is-square">
                      <img 
                        src="https://images.unsplash.com/photo-1582880414731-b8cecb28af33?auto=format&fit=crop&w=300&q=80" 
                        alt="Office du tourisme" 
                        style={{ objectFit: 'cover', borderRadius: 12 }}
                      />
                    </figure>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="column is-6">
              <div className="box" style={{ 
                borderRadius: 16, 
                boxShadow: '0 2px 12px #1277c620',
                background: '#f8fafc',
                height: '100%'
              }}>
                <h3 className="title is-5 has-text-primary mb-3">Informations pratiques</h3>
                <div className="columns is-multiline">
                  {content.infosPratiques.map((info, index) => (
                    <div key={index} className="column is-6">
                      <div className="notification is-white p-4" style={{ borderRadius: 12 }}>
                        <p className="has-text-weight-bold">
                          <span style={{ fontSize: 20, marginRight: 8 }}>{info.emoji}</span> {info.titre}
                        </p>
                        <p className="is-size-7">{info.texte}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/infos-pratiques" className="button is-link is-light is-fullwidth mt-3">
                  Plus d'informations pratiques
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}