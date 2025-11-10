import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
import Link from 'next/link';

// Hook personnalisé pour les animations au défilement
function useOnScreen(options) {
  const ref = React.useRef();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (options.triggerOnce) {
          observer.disconnect();
        }
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return [ref, isVisible];
}

// Composant d'animation
function AnimateOnScroll({ children, animation = "fade-up", delay = 0, duration = 800, threshold = 0.1 }) {
  const [ref, isVisible] = useOnScreen({ threshold, triggerOnce: true });

  const animations = {
    "fade-up": {
      hidden: { opacity: 0, transform: 'translateY(50px)' },
      visible: { opacity: 1, transform: 'translateY(0)' }
    },
    "fade-left": {
      hidden: { opacity: 0, transform: 'translateX(50px)' },
      visible: { opacity: 1, transform: 'translateX(0)' }
    },
    "fade-right": {
      hidden: { opacity: 0, transform: 'translateX(-50px)' },
      visible: { opacity: 1, transform: 'translateX(0)' }
    },
    "zoom-in": {
      hidden: { opacity: 0, transform: 'scale(0.8)' },
      visible: { opacity: 1, transform: 'scale(1)' }
    }
  };

  const selectedAnimation = animations[animation] || animations["fade-up"];
  
  return (
    <div
      ref={ref}
      style={{
        ...selectedAnimation[isVisible ? 'visible' : 'hidden'],
        transition: `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Associations() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [content, setContent] = useState({});

  useEffect(() => {
    fetch('/api/pageContent?page=associations')
      .then(res => res.json())
      .then(data => setContent(data[0] || {}));
  }, []);

  // Associations dynamiques
  const associationsList = content.associations || {};

  // Événements dynamiques
  const events = content.events || [];

  const formatCategory = (category) => {
    switch(category) {
      case 'sport': return 'Sports et loisirs';
      case 'culture': return 'Culture et patrimoine';
      case 'social': return 'Social et solidarité';
      case 'jeunesse': return 'Jeunesse et éducation';
      case 'environnement': return 'Environnement';
      default: return category;
    }
  };

  const associationsArray = Array.isArray(associationsList) ? associationsList : Object.values(associationsList).flat();

  const filterAssociations = () => {
    return associationsArray.filter(association =>
      (activeTab === 'all' || association.categorie === activeTab) &&
      (
        association.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        association.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const filteredAssociations = filterAssociations();
  const categories = Array.from(new Set(associationsArray.map(a => a.categorie).filter(Boolean)));

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
            <h1 className="title is-2 has-text-weight-bold" style={{ 
              color: '#fff', 
              textShadow: '0 4px 24px #0a2540a0', 
              letterSpacing: 1,
              fontFamily: 'Merriweather, serif'
            }}>
              {content.hero_titre || "Les associations de Friesen"}
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
          <AnimateOnScroll animation="fade-up">
            <h1 className="title is-3 has-text-link mb-5" style={{ 
              textAlign: 'center',
              fontFamily: 'Merriweather, serif'
            }}>
              {content.page_titre || "Découvrez les associations locales"}
            </h1>
          </AnimateOnScroll>
          
          <AnimateOnScroll animation="fade-up" delay={100}>
            <div className="content mb-5">
              <div className="notification is-info is-light" style={{ borderRadius: 16 }}>
                <p className="is-size-5 mb-3">
                  <strong>{content.notification_titre || "Un tissu associatif dynamique !"}</strong>
                </p>
                <p>
                  {content.notification_texte || "Les associations constituent le cœur battant de notre village. Qu'elles soient sportives, culturelles, solidaires ou environnementales, elles créent du lien entre les habitants et animent notre commune tout au long de l'année. Découvrez leurs activités et n'hésitez pas à les rejoindre !"}
                </p>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Recherche et filtres */}
          <AnimateOnScroll animation="zoom-in" delay={200}>
            <div className="box" style={{ 
              borderRadius: 16, 
              boxShadow: '0 4px 16px #1277c620',
              background: 'linear-gradient(120deg, #f8fafc 80%, #eaf6ff 100%)',
              marginBottom: 40,
              padding: 24
            }}>
              <div className="columns is-vcentered">
                <div className="column is-8">
                  <div className="field">
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="text"
                        placeholder="Rechercher une association..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ borderRadius: 12 }}
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-search"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className="select is-fullwidth">
                    <select
                      value={activeTab}
                      onChange={(e) => setActiveTab(e.target.value)}
                      style={{ borderRadius: 12 }}
                    >
                      <option value="all">Toutes les catégories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {formatCategory(category)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Liste des associations filtrées */}
          {filteredAssociations.length > 0 ? (
            <div className="columns is-multiline">
              {filteredAssociations.map((association, index) => (
                <div key={association.id} className="column is-half">
                  <AnimateOnScroll animation="fade-up" delay={index * 50}>
                    <div className="card" style={{ 
                      borderRadius: 16, 
                      overflow: 'hidden',
                      boxShadow: '0 4px 16px #1277c620',
                      height: '100%',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 8px 32px #1277c640';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px #1277c620';
                    }}
                    >
                      <div className="card-image">
                        <figure className="image is-3by2">
                          <img 
                            src={association.image || 'https://via.placeholder.com/800x533?text=Association'} 
                            alt={association.nom} 
                            style={{ objectFit: 'cover' }}
                            onError={e => {
                              e.currentTarget.src = 'https://via.placeholder.com/800x533?text=Association';
                            }}
                          />
                        </figure>
                      </div>
                      <div className="card-content">
                        <p className="title is-5 has-text-link mb-2" style={{ fontFamily: 'Merriweather, serif' }}>
                          {association.nom}
                        </p>
                        <p className="tag is-info is-light mb-3">{formatCategory(association.categorie)}</p>
                        <p className="subtitle is-6 mb-3" style={{ lineHeight: 1.6 }}>
                          {association.description}
                        </p>
                        
                        <div className="content">
                          {association.contact && (
                            <p className="has-text-grey mb-2" style={{ fontSize: 15 }}>
                              <span style={{ fontSize: 16, marginRight: 8 }}>👤</span> {association.contact}
                            </p>
                          )}
                          {association.email && (
                            <p className="has-text-grey mb-2" style={{ fontSize: 15 }}>
                              <span style={{ fontSize: 16, marginRight: 8 }}>📧</span> {association.email}
                            </p>
                          )}
                          {association.activites && (
                            <p className="has-text-grey mb-2" style={{ fontSize: 15 }}>
                              <span style={{ fontSize: 16, marginRight: 8 }}>🕒</span> {association.activites}
                            </p>
                          )}
                          {association.lieu && (
                            <p className="has-text-grey mb-2" style={{ fontSize: 15 }}>
                              <span style={{ fontSize: 16, marginRight: 8 }}>📍</span> {association.lieu}
                            </p>
                          )}
                          {association.site && (
                            <p className="mt-3">
                              <a 
                                href={association.site} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="button is-link is-light"
                                style={{ borderRadius: 10, fontWeight: 600 }}
                              >
                                <span style={{ marginRight: 6 }}>🌐</span> Visiter le site web
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </AnimateOnScroll>
                </div>
              ))}
            </div>
          ) : (
            <AnimateOnScroll animation="fade-up">
              <div className="notification is-warning" style={{ borderRadius: 16 }}>
                <p className="has-text-centered">
                  <span style={{ fontSize: 48 }}>🔍</span>
                </p>
                <p className="has-text-centered">
                  Aucune association ne correspond à votre recherche.
                </p>
              </div>
            </AnimateOnScroll>
          )}

          {/* Agenda des événements associatifs */}
          <AnimateOnScroll animation="fade-up" delay={100}>
            <div className="box mt-6" style={{ 
              borderRadius: 16, 
              boxShadow: '0 4px 16px #1277c620',
              background: 'linear-gradient(120deg, #fffef5 80%, #fef3c7 100%)',
              marginTop: 50,
              padding: 32
            }}>
              <h2 className="title is-4 has-text-warning mb-4" style={{ 
                fontFamily: 'Merriweather, serif',
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <span style={{ fontSize: 32 }}>📅</span>
                {content.agenda_titre || "Agenda des événements associatifs"}
              </h2>
              
              {events.length > 0 ? (
                <>
                  {/* Version desktop - tableau */}
                  <div className="is-hidden-mobile">
                    <table className="table is-fullwidth is-striped" style={{ borderRadius: 12, overflow: 'hidden' }}>
                      <thead>
                        <tr style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
                          <th style={{ width: '20%', padding: 16 }}>📅 Date</th>
                          <th style={{ width: '30%', padding: 16 }}>🎯 Événement</th>
                          <th style={{ width: '25%', padding: 16 }}>👥 Association</th>
                          <th style={{ width: '25%', padding: 16 }}>📍 Lieu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((event, index) => (
                          <tr key={index} style={{ 
                            transition: 'background 0.3s ease',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fffbeb'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <td style={{ padding: 16 }}>{event.date}</td>
                            <td style={{ padding: 16 }}><strong>{event.titre}</strong></td>
                            <td style={{ padding: 16 }}>{event.association}</td>
                            <td style={{ padding: 16 }}>{event.lieu}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Version mobile - cartes */}
                  <div className="is-hidden-tablet">
                    {events.map((event, index) => (
                      <div key={index} className="box mb-3" style={{ 
                        background: 'white',
                        borderRadius: 12,
                        padding: '1rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        borderLeft: '4px solid #fbbf24'
                      }}>
                        <div className="mb-2">
                          <strong className="has-text-warning" style={{ fontSize: 16 }}>
                            {event.titre}
                          </strong>
                        </div>
                        <div className="is-size-7 has-text-grey mb-1">
                          📅 {event.date}
                        </div>
                        <div className="is-size-7 has-text-grey mb-1">
                          👥 {event.association}
                        </div>
                        <div className="is-size-7 has-text-grey">
                          📍 {event.lieu}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="notification is-light has-text-centered" style={{ background: 'white', borderRadius: 12 }}>
                  <p style={{ fontSize: 48, opacity: 0.3 }}>📭</p>
                  <p>Aucun événement à venir pour le moment</p>
                </div>
              )}
            </div>
          </AnimateOnScroll>

          {/* Informations sur les subventions et permanence conseil */}
          <div className="columns mt-6 is-variable is-4">
            {/* Section Subventions */}
            <div className="column is-full">
              <AnimateOnScroll animation="fade-up" delay={200}>
                <div className="box" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: 16,
                  padding: 32,
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
                }}>
                  <div className="columns is-vcentered">
                    <div className="column">
                      <h3 className="title is-4 has-text-white mb-3" style={{
                        fontFamily: 'Merriweather, serif',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12
                      }}>
                        <span style={{ fontSize: 32 }}>💶</span>
                        {content.subventions?.titre || 'Subventions aux associations'}
                      </h3>
                      <p className="mb-4" style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.95)' }}>
                        {content.subventions?.texte || 'La commune soutient les associations locales...'}
                      </p>
                      {content.subventions?.date_limite && (
                        <div className="notification is-light mb-3" style={{
                          background: 'rgba(255,255,255,0.15)',
                          border: '2px solid rgba(255,255,255,0.3)',
                          color: 'white',
                          borderRadius: 12
                        }}>
                          <strong>📅 Date limite de dépôt :</strong> {content.subventions.date_limite}
                        </div>
                      )}
                      <div className="buttons" style={{ gap: 12, flexWrap: 'wrap' }}>
                        {content.subventions?.formulaire_url && (
                          <a 
                            href={content.subventions.formulaire_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button is-light is-medium"
                            style={{
                              fontWeight: 600,
                              borderRadius: 12,
                              padding: '12px 24px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.transform = 'translateY(-3px)';
                              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <span style={{ marginRight: 8 }}>📄</span>
                            <span>Télécharger le formulaire</span>
                          </a>
                        )}
                        {content.subventions?.site_web && (
                          <a 
                            href={content.subventions.site_web}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button is-white is-outlined is-medium"
                            style={{
                              fontWeight: 600,
                              borderRadius: 12,
                              padding: '12px 24px',
                              border: '2px solid white',
                              color: 'white',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = 'white';
                              e.currentTarget.style.color = '#667eea';
                              e.currentTarget.style.transform = 'translateY(-3px)';
                              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = 'white';
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <span style={{ marginRight: 8 }}>🔗</span>
                            <span>Plus d'informations</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="column is-narrow is-hidden-mobile">
                      <span style={{ fontSize: 120, opacity: 0.2 }}>💰</span>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Section Permanence conseil */}
            <div className="column is-half">
              <AnimateOnScroll animation="fade-right" delay={300}>
                <div className="box" style={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  borderRadius: 16,
                  padding: 32,
                  boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)',
                  height: '100%'
                }}>
                  <h3 className="title is-4 has-text-white mb-3" style={{
                    fontFamily: 'Merriweather, serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}>
                    <span style={{ fontSize: 32 }}>📝</span>
                    {content.creation?.titre || 'Permanence conseil associatif'}
                  </h3>
                  <p className="mb-4" style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.95)' }}>
                    {content.creation?.texte || 'Besoin d\'aide pour créer votre association ? Nous sommes là pour vous accompagner.'}
                  </p>
                  {content.creation?.permanence && (
                    <div className="notification is-light mb-3" style={{
                      background: 'rgba(255,255,255,0.15)',
                      border: '2px solid rgba(255,255,255,0.3)',
                      color: 'white',
                      borderRadius: 12
                    }}>
                      <strong>🕐 Permanence :</strong><br />
                      {content.creation.permanence}
                    </div>
                  )}
                  {content.creation?.contact_url && (
                    <a 
                      href={content.creation.contact_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button is-white is-medium"
                      style={{
                        fontWeight: 600,
                        borderRadius: 12,
                        padding: '12px 24px',
                        transition: 'all 0.3s ease',
                        width: '100%',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <span style={{ marginRight: 8 }}>🔗</span>
                      <span>En savoir plus</span>
                    </a>
                  )}
                </div>
              </AnimateOnScroll>
            </div>

            {/* Section Réservation de salles */}
            <div className="column is-half">
              <AnimateOnScroll animation="fade-left" delay={300}>
                <div className="box" style={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  borderRadius: 16,
                  padding: 32,
                  boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)',
                  height: '100%'
                }}>
                  <h3 className="title is-4 has-text-white mb-3" style={{
                    fontFamily: 'Merriweather, serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}>
                    <span style={{ fontSize: 32 }}>🏛️</span>
                    {content.salles?.titre || 'Salles communales'}
                  </h3>
                  <p className="mb-3" style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.95)' }}>
                    {content.salles?.texte || 'La commune met à disposition des associations plusieurs salles.'}
                  </p>
                  <ul style={{ marginBottom: 20, fontSize: 14, lineHeight: 1.8 }}>
                    {(content.salles?.liste || [
                      "Salle polyvalente (capacité 200 personnes)",
                      "Salle de réunion de la mairie (capacité 30 personnes)",
                      "Local des associations (capacité 50 personnes)"
                    ]).map((salle, idx) => (
                      <li key={idx} style={{ marginBottom: 6 }}>✓ {salle}</li>
                    ))}
                  </ul>
                  {content.salles?.contact_url && (
                    <a 
                      href={content.salles.contact_url}
                      className="button is-white is-medium"
                      style={{
                        fontWeight: 600,
                        borderRadius: 12,
                        padding: '12px 24px',
                        transition: 'all 0.3s ease',
                        width: '100%',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <span style={{ marginRight: 8 }}>📅</span>
                      <span>Réserver une salle</span>
                    </a>
                  )}
                </div>
              </AnimateOnScroll>
            </div>
          </div>

          {/* Forum des associations */}
          <AnimateOnScroll animation="zoom-in" delay={400}>
            <div className="notification is-link is-light mt-6" style={{ 
              borderRadius: 16,
              padding: 32,
              boxShadow: '0 4px 16px #1277c620'
            }}>
              <div className="columns is-vcentered">
                <div className="column is-2 has-text-centered is-hidden-mobile">
                  {content.forum?.image ? (
                    <img
                      src={content.forum.image}
                      alt={content.forum?.titre || "Forum des associations"}
                      style={{ maxWidth: "100%", borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                      onError={e => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'block';
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: 64 }}>📅</span>
                  )}
                </div>
                <div className="column">
                  <h3 className="title is-5 mb-2" style={{ fontFamily: 'Merriweather, serif' }}>
                    {content.forum?.titre || "Forum des associations 2025"}
                  </h3>
                  <p className="mb-2" style={{ fontSize: 16, fontWeight: 600 }}>
                    {content.forum?.date || "Le samedi 6 septembre 2025 de 10h à 17h"}
                  </p>
                  <p style={{ lineHeight: 1.6 }}>
                    {content.forum?.texte || "Une occasion unique de découvrir toutes les associations de Friesen !"}
                  </p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Contact */}
          <AnimateOnScroll animation="fade-up" delay={500}>
            <div className="has-text-centered mt-6" style={{ paddingBottom: 40 }}>
              <p className="mb-4" style={{ fontSize: 17, lineHeight: 1.6 }}>
                {content.contact?.texte || "Vous souhaitez en savoir plus sur la vie associative de notre commune ?"}
              </p>
              <a 
                href={content.contact?.contact_url || "/contact"} 
                className="button is-link is-medium"
                style={{
                  borderRadius: 12,
                  fontWeight: 600,
                  padding: '12px 32px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px #1277c640';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{ marginRight: 8 }}>📧</span>
                <span>Contactez la mairie</span>
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}