import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import Link from 'next/link';

export default function Visites() {
  const [activeTab, setActiveTab] = useState('guide');

  // Circuits pédestres
  const circuitsPedestres = [
    {
      id: 1,
      nom: "Circuit de la Forêt des Chênes",
      distance: "5,2 km",
      duree: "1h30",
      difficulte: "Facile",
      depart: "Place de la Mairie",
      description: "Balade familiale à travers les chênaies centenaires avec vue panoramique sur la vallée.",
      points: ["Chêne Napoléon", "Étang du Moulin", "Point de vue de la Croix Blanche"],
      image: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      nom: "Sentier des Trois Collines",
      distance: "8,7 km",
      duree: "2h45",
      difficulte: "Moyen",
      depart: "Parking de l'église",
      description: "Circuit vallonné offrant de superbes panoramas sur les Vosges et la plaine d'Alsace.",
      points: ["Colline Saint-Martin", "Chapelle Saint-Wendelin", "Ancien moulin"],
      image: "https://images.unsplash.com/photo-1513569771920-c9e1d31714af?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      nom: "Sentier de l'Eau",
      distance: "3,5 km",
      duree: "1h",
      difficulte: "Très facile",
      depart: "Lavoir communal",
      description: "Promenade le long de la Largue, idéale pour observer la faune et la flore des zones humides.",
      points: ["Ancien lavoir", "Étang de pêche", "Observatoire ornithologique"],
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80"
    }
  ];

  // Circuits VTT
  const circuitsVTT = [
    {
      id: 4,
      nom: "Circuit des Crêtes",
      distance: "18 km",
      duree: "2h",
      difficulte: "Difficile",
      depart: "Parking forestier",
      description: "Circuit technique avec passages en single track et belles descentes en forêt.",
      denivele: "450 m",
      image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 5,
      nom: "Boucle de la Largue",
      distance: "12 km",
      duree: "1h15",
      difficulte: "Moyen",
      depart: "Place de la Mairie",
      description: "Circuit mixte combinant chemins forestiers et petites routes de campagne.",
      denivele: "220 m",
      image: "https://images.unsplash.com/photo-1558447185-56433fd1cbd7?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 6,
      nom: "Tour du Sundgau",
      distance: "32 km",
      duree: "3h30",
      difficulte: "Moyen-Difficile",
      depart: "Parking de la salle polyvalente",
      description: "Grande boucle traversant plusieurs villages du Sundgau avec passages techniques.",
      denivele: "580 m",
      image: "https://images.unsplash.com/photo-1526262517440-90db89147d3a?auto=format&fit=crop&w=600&q=80"
    }
  ];

  // Points d'intérêt pour le guide de visite
  const pointsInteret = [
    {
      id: 7,
      nom: "Église Saint-Martin",
      categorie: "Patrimoine religieux",
      description: "Église du XVIIIe siècle avec son clocher à bulbe typiquement alsacien et ses magnifiques vitraux.",
      adresse: "Place de l'Église",
      horaires: "Tous les jours de 9h à 18h",
      image: "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 8,
      nom: "Maison Alsacienne",
      categorie: "Patrimoine architectural",
      description: "Maison à colombages du XVIIe siècle parfaitement conservée et restaurée selon les techniques traditionnelles.",
      adresse: "15 rue Principale",
      horaires: "Visites guidées le samedi à 14h30 (sur réservation)",
      image: "https://images.unsplash.com/photo-1583006432882-a15a80b532fc?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 9,
      nom: "Fontaine des Quatre Saisons",
      categorie: "Monument historique",
      description: "Fontaine en grès des Vosges datant de 1785, ornée de sculptures représentant les quatre saisons.",
      adresse: "Place de la Fontaine",
      horaires: "Accès libre",
      image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 10,
      nom: "Point de vue du Rebberg",
      categorie: "Site naturel",
      description: "Panorama exceptionnel sur la plaine d'Alsace et les Vosges, particulièrement spectaculaire au coucher du soleil.",
      adresse: "Chemin du Rebberg",
      horaires: "Accès libre",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 11,
      nom: "Lavoir communal",
      categorie: "Petit patrimoine",
      description: "Ancien lavoir du XIXe siècle témoignant de la vie quotidienne d'autrefois.",
      adresse: "Rue du Lavoir",
      horaires: "Accès libre",
      image: "https://images.unsplash.com/photo-1562046433-05b953abd6a8?auto=format&fit=crop&w=600&q=80"
    }
  ];

  // Installations sportives
  const installationsSportives = [
    {
      id: 12,
      nom: "Bike Park",
      description: "Espace dédié au VTT avec modules adaptés à tous les niveaux, du débutant à l'expert.",
      equipements: ["Pumptrack", "Ligne de sauts", "Modules techniques", "Zone d'apprentissage"],
      horaires: "Accès libre de 8h à 20h",
      adresse: "Rue des Sports",
      image: "https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 13,
      nom: "Terrain multisports",
      description: "Espace polyvalent permettant la pratique du basket, football, handball et autres sports collectifs.",
      equipements: ["Terrain synthétique", "Paniers de basket", "Buts multisports", "Éclairage"],
      horaires: "Accès libre de 8h à 22h",
      adresse: "Complexe sportif, rue des Écoles",
      image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 14,
      nom: "Parcours santé",
      description: "Circuit sportif en plein air avec plusieurs stations d'exercices physiques.",
      equipements: ["15 agrès", "Parcours de 1,2 km", "Panneaux explicatifs"],
      horaires: "Accès libre",
      adresse: "Forêt communale, entrée rue des Tilleuls",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'guide':
        return (
          <div>
            <div className="content mb-5">
              <div className="notification is-info is-light">
                <p className="is-size-5 mb-3">
                  <strong>Découvrez le charme de notre village !</strong>
                </p>
                <p>
                  Friesen vous invite à découvrir son riche patrimoine architectural, ses traditions vivantes et ses magnifiques paysages.
                  Téléchargez notre guide complet ou suivez les points d'intérêt présentés ci-dessous pour une visite autonome.
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
              {pointsInteret.map((point) => (
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
                  <p className="mb-3">Découvrez Friesen avec un guide local passionné qui vous dévoilera tous les secrets et anecdotes du village.</p>
                  <ul className="mb-4">
                    <li>Tous les samedis à 14h (d'avril à octobre)</li>
                    <li>Sur réservation pour les groupes (minimum 5 personnes)</li>
                    <li>Durée : environ 2h</li>
                    <li>Tarif : 5€/personne (gratuit pour les moins de 12 ans)</li>
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
                  <strong>Randonnées pédestres autour de Friesen</strong>
                </p>
                <p>
                  Explorez notre magnifique région au rythme de vos pas ! Nos sentiers balisés vous feront découvrir 
                  des paysages variés, entre forêts, prairies et points de vue remarquables.
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
              {circuitsPedestres.map((circuit) => (
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
                  <strong>Circuits VTT</strong>
                </p>
                <p>
                  Amateurs de VTT, Friesen et ses environs vous offrent des parcours variés pour tous les niveaux.
                  Des balades familiales aux circuits techniques pour les plus sportifs, il y en a pour tous les goûts !
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
              {circuitsVTT.map((circuit) => (
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
                    Vous n'avez pas votre propre vélo ? Pas de problème ! Louez un VTT à l'office du tourisme 
                    ou chez notre partenaire "Cycles du Sundgau".
                  </p>
                  <ul>
                    <li>VTT adultes et enfants</li>
                    <li>VTT à assistance électrique</li>
                    <li>Casques et accessoires</li>
                    <li>Tarifs : à partir de 15€ la demi-journée</li>
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

            {installationsSportives.map((installation) => (
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
              <h3 className="title is-5 has-text-primary mb-3">Équipements sportifs à louer</h3>
              
              <div className="columns">
                <div className="column">
                  <div className="notification is-white" style={{ borderRadius: 12 }}>
                    <p className="has-text-weight-bold mb-2">
                      <span style={{ fontSize: 24, marginRight: 8 }}>🏀</span> Ballons et matériel
                    </p>
                    <p>Ballons (foot, basket, volley), raquettes de badminton et autres équipements disponibles à la mairie.</p>
                    <p className="is-size-7 mt-2">Caution demandée. Réservation conseillée en période estivale.</p>
                  </div>
                </div>
                <div className="column">
                  <div className="notification is-white" style={{ borderRadius: 12 }}>
                    <p className="has-text-weight-bold mb-2">
                      <span style={{ fontSize: 24, marginRight: 8 }}>🚲</span> Vélos
                    </p>
                    <p>Location de vélos classiques et électriques à l'office du tourisme pour découvrir la région.</p>
                    <p className="is-size-7 mt-2">Tarifs : à partir de 10€ la demi-journée.</p>
                  </div>
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
        <div className="container" style={{ maxWidth: 1100 }}>
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
                      <span style={{ fontSize: 16, marginRight: 8 }}>📍</span> 3 place de la Mairie, 68580 Friesen
                    </p>
                    <p className="has-text-grey mb-2">
                      <span style={{ fontSize: 16, marginRight: 8 }}>📞</span> 03.89.XX.XX.XX
                    </p>
                    <p className="has-text-grey mb-2">
                      <span style={{ fontSize: 16, marginRight: 8 }}>📧</span> tourisme@friesen.fr
                    </p>
                    <p className="has-text-grey mb-3">
                      <span style={{ fontSize: 16, marginRight: 8 }}>🕒</span> Mar-Sam: 9h-12h et 14h-17h
                    </p>
                    <a href="#" className="button is-link is-light">Visiter le site web</a>
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
                  <div className="column is-6">
                    <div className="notification is-white p-4" style={{ borderRadius: 12 }}>
                      <p className="has-text-weight-bold">
                        <span style={{ fontSize: 20, marginRight: 8 }}>🅿️</span> Stationnement
                      </p>
                      <p className="is-size-7">Parkings gratuits au centre du village et près du complexe sportif</p>
                    </div>
                  </div>
                  <div className="column is-6">
                    <div className="notification is-white p-4" style={{ borderRadius: 12 }}>
                      <p className="has-text-weight-bold">
                        <span style={{ fontSize: 20, marginRight: 8 }}>🚌</span> Transport
                      </p>
                      <p className="is-size-7">Ligne de bus 312 depuis Altkirch (arrêt "Friesen Centre")</p>
                    </div>
                  </div>
                  <div className="column is-6">
                    <div className="notification is-white p-4" style={{ borderRadius: 12 }}>
                      <p className="has-text-weight-bold">
                        <span style={{ fontSize: 20, marginRight: 8 }}>🍽️</span> Restauration
                      </p>
                      <p className="is-size-7">2 restaurants et une aire de pique-nique aménagée</p>
                    </div>
                  </div>
                  <div className="column is-6">
                    <div className="notification is-white p-4" style={{ borderRadius: 12 }}>
                      <p className="has-text-weight-bold">
                        <span style={{ fontSize: 20, marginRight: 8 }}>💊</span> Santé
                      </p>
                      <p className="is-size-7">Pharmacie en centre-ville et médecin sur rendez-vous</p>
                    </div>
                  </div>
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