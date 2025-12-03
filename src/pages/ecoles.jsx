import React, { useState, useEffect, useRef } from 'react';
import 'bulma/css/bulma.min.css';
import Link from 'next/link';
import useHeroImage from '../hooks/useHeroImage';

// Hook personnalisé pour les animations au défilement
function useOnScreen(options) {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (options?.triggerOnce) {
          observer.disconnect();
        }
      } else if (!options?.triggerOnce) {
        setIsVisible(false);
      }
    }, {
      threshold: options?.threshold || 0.1,
      rootMargin: options?.rootMargin || '0px'
    });

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
function AnimateOnScroll({ children, animation = "fade-up", delay = 0, duration = 800, threshold = 0.1, once = true }) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const adjustedThreshold = isMobile ? 0.01 : threshold;
  const [ref, isVisible] = useOnScreen({ threshold: adjustedThreshold, triggerOnce: once });

  const animations = {
    "fade-up": {
      hidden: { opacity: 0, transform: 'translateY(50px) scale(0.95)' },
      visible: { opacity: 1, transform: 'translateY(0) scale(1)' }
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
    },
    "slide-up": {
      hidden: { opacity: 0, transform: 'translateY(100px)' },
      visible: { opacity: 1, transform: 'translateY(0)' }
    }
  };

  const selectedAnimation = animations[animation] || animations["fade-up"];
  
  return (
    <div
      ref={ref}
      style={{
        ...selectedAnimation[isVisible ? 'visible' : 'hidden'],
        transition: `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

export default function Ecoles() {
  const heroImage = useHeroImage();
  const [formData, setFormData] = useState({
    nomEnfant: '',
    prenomEnfant: '',
    dateNaissance: '',
    nomParent: '',
    prenomParent: '',
    telephone: '',
    email: '',
    adresse: '',
    classe: '',
    cantine: false,
    garderieMatin: false,
    garderieSoir: false
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [content, setContent] = useState({});
  const [vacances, setVacances] = useState([]);
  const [ecoles, setEcoles] = useState([]);
  const [services, setServices] = useState([]);
  const [servicesSections, setServicesSections] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    fetch('/api/pageContent?page=ecoles')
      .then(res => res.json())
      .then(data => {
        const obj = data?.[0] || {};
        setContent(obj);
        setEcoles(Array.isArray(obj.ecoles_json) ? obj.ecoles_json : []);
        setVacances(Array.isArray(obj.vacances_json) ? obj.vacances_json : []);
        
        // Charger les sections de services
        const sections = Array.isArray(obj.services_sections_json) 
          ? obj.services_sections_json 
          : [{ id: 'default', titre: 'Services Périscolaires', emoji: '🎨', description: '' }];
        setServicesSections(sections);
        
        // Charger les services
        const servicesData = Array.isArray(obj.services_json) ? obj.services_json : [];
        setServices(servicesData);
        
        // Tout déplier par défaut
        const expanded = {};
        sections.forEach(s => expanded[s.id] = true);
        setExpandedSections(expanded);
        
        // Charger les documents
        let docs = Array.isArray(obj.documents_json) ? obj.documents_json : [];
        if (docs.length === 0) {
          const legacy = [];
          for (let i = 1; i <= 4; i++) {
            if (obj[`doc_${i}_label`] && obj[`doc_${i}_url`]) {
              legacy.push({
                id: `doc-${i}`,
                label: obj[`doc_${i}_label`],
                url: obj[`doc_${i}_url`],
                emoji: '📄'
              });
            }
          }
          docs = legacy;
        }
        setDocuments(docs);
      });
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulaire envoyé:', formData);
    setFormSubmitted(true);
    setFormData({
      nomEnfant: '',
      prenomEnfant: '',
      dateNaissance: '',
      nomParent: '',
      prenomParent: '',
      telephone: '',
      email: '',
      adresse: '',
      classe: '',
      cantine: false,
      garderieMatin: false,
      garderieSoir: false
    });
    
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };

  const openServiceModal = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const getServicesForSection = (sectionId) => {
    return services.filter(s => s.sectionId === sectionId);
  };

  return (
    <>
      {/* En-tête hero avec animation */}
      <section
        className="hero is-primary is-medium hero-animated"
        style={{
          backgroundImage: `linear-gradient(180deg,rgba(10,37,64,0.55),rgba(10,37,64,0.25)),url("${heroImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '0 0 32px 32px',
          boxShadow: '0 8px 32px #0a254030',
          marginBottom: 0,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'float 20s linear infinite',
          opacity: 0.3
        }}></div>

        <div className="hero-body" style={{ position: 'relative', zIndex: 1 }}>
        </div>
      </section>

      {/* Contenu principal */}
      <section
        className="section"
        style={{
          background: 'linear-gradient(180deg, #fafdff 0%, #f0f7ff 100%)',
          minHeight: '100vh',
          marginTop: 0,
          position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(18, 119, 198, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(72, 199, 116, 0.03) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>

        <div className="container" style={{ maxWidth: 1100, position: 'relative', zIndex: 1 }}>
          <AnimateOnScroll animation="fade-up" duration={800}>
            <h1 className="title is-3 has-text-link mb-6" style={{ 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #1277c6 0%, #1b9bd7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 800,
              letterSpacing: 0.5
            }}>
              {content.titre || "Écoles et Services Périscolaires"}
            </h1>
          </AnimateOnScroll>

          <div className="columns is-variable is-6">
            {/* Colonne 1 : Écoles, Calendrier, Documents */}
            <div className="column is-half">
              {/* Nos écoles */}
              <AnimateOnScroll animation="fade-right" delay={100}>
                <div className="box animated-box" style={{ 
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)', 
                  borderRadius: 16,
                  border: '2px solid #e0e7ef',
                  boxShadow: '0 4px 16px rgba(18, 119, 198, 0.08)',
                  transition: 'all 0.3s ease'
                }}>
                  <h2 className="title is-4 has-text-primary mb-4" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}>
                    <span style={{ fontSize: 32 }}>🏫</span>
                    Nos écoles
                  </h2>

                  {ecoles.length === 0 && (
                    <p className="has-text-grey">Aucune école renseignée pour le moment.</p>
                  )}

                  {ecoles.map((e, index) => (
                    <AnimateOnScroll key={e.id} animation="fade-up" delay={index * 100}>
                      <div className="media mb-5 school-card" style={{
                        padding: 16,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #f8fbff 0%, #f0f7ff 100%)',
                        border: '2px solid #e8f4ff',
                        transition: 'all 0.3s ease'
                      }}>
                        <figure className="media-left">
                          <p className="image is-96x96" style={{ position: 'relative' }}>
                            <img
                              src={e.image || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=200&q=80'}
                              alt={e.nom}
                              style={{ 
                                objectFit: 'cover', 
                                borderRadius: 12,
                                boxShadow: '0 4px 12px rgba(18, 119, 198, 0.15)'
                              }}
                              onError={(ev) => { ev.currentTarget.src = 'https://via.placeholder.com/96?text=Logo'; }}
                            />
                          </p>
                        </figure>
                        <div className="media-content">
                          <h3 className="subtitle is-5 has-text-link mb-2" style={{ fontWeight: 700 }}>{e.nom || 'Nom de l\'école'}</h3>
                          {e.partenaire && (
                            <p style={{ fontStyle: 'italic', fontSize: 15, color: '#48c774' }} className="mb-2">{e.partenaire}</p>
                          )}
                          {e.adresse && (
                            <p className="has-text-grey mb-2">
                              <span style={{ fontSize: 18, marginRight: 8 }}>📍</span> {e.adresse}
                            </p>
                          )}
                          {e.tel && (
                            <p className="has-text-grey mb-2">
                              <span style={{ fontSize: 18, marginRight: 8 }}>📞</span> {e.tel}
                            </p>
                          )}
                          {e.email && (
                            <p className="has-text-grey">
                              <span style={{ fontSize: 18, marginRight: 8 }}>✉️</span> {e.email}
                            </p>
                          )}
                          {e.site && (
                            <p className="mt-2">
                              <a className="button is-small is-link is-light" href={e.site} target="_blank" rel="noopener noreferrer" style={{
                                borderRadius: 8,
                                fontWeight: 600
                              }}>
                                🌐 Site web
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    </AnimateOnScroll>
                  ))}

                  <AnimateOnScroll animation="zoom-in" delay={300}>
                    <div className="notification is-info is-light mt-5" style={{
                      borderRadius: 12,
                      border: '2px solid #3e8ed0',
                      boxShadow: '0 2px 8px rgba(62, 142, 208, 0.1)'
                    }}>
                      <p className="has-text-weight-bold mb-2">📢 Information transport scolaire</p>
                      <p className="mb-3">{content.info_transport || "Un service de ramassage scolaire est disponible."}</p>
                      {content.transport_fluo68_pdf && (
                        <a 
                          href={content.transport_fluo68_pdf} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="button is-info is-light"
                          style={{ borderRadius: 10, fontWeight: 600 }}
                        >
                          📄 Inscription Fluo 68 (PDF)
                        </a>
                      )}
                    </div>
                  </AnimateOnScroll>
                </div>
              </AnimateOnScroll>

              {/* Calendrier scolaire */}
              <AnimateOnScroll animation="fade-right" delay={200}>
                <div className="box animated-box mt-5" style={{ 
                  background: 'linear-gradient(135deg, #ffffff 0%, #fff8f0 100%)', 
                  borderRadius: 16,
                  border: '2px solid #ffecd2',
                  boxShadow: '0 4px 16px rgba(255, 152, 0, 0.08)',
                  transition: 'all 0.3s ease'
                }}>
                  <h2 className="title is-5 has-text-primary mb-3" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}>
                    <span style={{ fontSize: 28 }}>📅</span>
                    Calendrier scolaire 2024-2025
                  </h2>
                  
                  <div className="buttons mb-3">
                    {content.calendrier_pdf_url && (
                      <a href={content.calendrier_pdf_url} target="_blank" rel="noopener noreferrer" className="button is-link is-light" style={{
                        borderRadius: 10,
                        fontWeight: 600
                      }}>
                        📄 Télécharger le calendrier (PDF)
                      </a>
                    )}
                    {content.calendrier_url && (
                      <a href={content.calendrier_url} target="_blank" rel="noopener noreferrer" className="button is-link is-light" style={{
                        borderRadius: 10,
                        fontWeight: 600
                      }}>
                        🌐 Calendrier officiel
                      </a>
                    )}
                  </div>

                  {vacances && vacances.length > 0 ? (
                    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                      <table className="table is-fullwidth is-striped" style={{ 
                        borderRadius: 10, 
                        overflow: 'hidden',
                        minWidth: 400
                      }}>
                        <thead>
                          <tr style={{ background: 'linear-gradient(135deg, #1277c6 0%, #1b9bd7 100%)', color: 'white' }}>
                            <th style={{ color: 'white', whiteSpace: 'nowrap', textAlign: 'left', paddingLeft: 12 }}>Vacances</th>
                            <th style={{ color: 'white', whiteSpace: 'nowrap', textAlign: 'left' }}>Début</th>
                            <th style={{ color: 'white', whiteSpace: 'nowrap', textAlign: 'left' }}>Fin</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vacances.map((v, idx) => (
                            <tr key={v.id || idx} style={{ transition: 'background 0.2s ease' }} className="table-row-hover">
                              <td style={{ fontWeight: 600, whiteSpace: 'nowrap', textAlign: 'left', paddingLeft: 12 }}>{v.titre}</td>
                              <td style={{ whiteSpace: 'nowrap', textAlign: 'left' }}>{v.debut}</td>
                              <td style={{ whiteSpace: 'nowrap', textAlign: 'left' }}>{v.fin}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : content.calendrier ? (
                    <div 
                      className="content"
                      dangerouslySetInnerHTML={{ __html: content.calendrier }} 
                      style={{
                        background: 'white',
                        padding: '1rem',
                        borderRadius: 8,
                        border: '1px solid #ffecd2'
                      }}
                    />
                  ) : (
                    <p className="has-text-grey">Aucun calendrier renseigné pour le moment.</p>
                  )}
                </div>
              </AnimateOnScroll>

              {/* Documents utiles */}
              <AnimateOnScroll animation="fade-right" delay={300}>
                <div className="box animated-box mt-5" style={{ 
                  background: 'linear-gradient(135deg, #ffffff 0%, #fff8f0 100%)', 
                  borderRadius: 16,
                  border: '2px solid #ffecd2',
                  boxShadow: '0 4px 16px rgba(255, 152, 0, 0.08)',
                  transition: 'all 0.3s ease'
                }}>
                  <h2 className="title is-5 has-text-primary mb-3" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}>
                    <span style={{ fontSize: 28 }}>📚</span>
                    Documents utiles
                  </h2>
                  
                  {documents.length === 0 && (
                    <p className="has-text-grey">Aucun document disponible pour le moment.</p>
                  )}

                  <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                    {documents.map((doc, index) => (
                      <AnimateOnScroll key={doc.id || index} animation="fade-up" delay={index * 50}>
                        <li style={{ marginBottom: 12 }}>
                          <a 
                            href={doc.url} 
                            className="has-text-link document-link" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              padding: '10px 14px',
                              background: 'white',
                              borderRadius: 10,
                              border: '2px solid #ffecd2',
                              transition: 'all 0.3s ease',
                              textDecoration: 'none',
                              fontWeight: 600
                            }}
                          >
                            <span style={{ fontSize: 20 }}>{doc.emoji || '📄'}</span>
                            {doc.label}
                            <span style={{ marginLeft: 'auto', opacity: 0.5 }}>→</span>
                          </a>
                        </li>
                      </AnimateOnScroll>
                    ))}
                  </ul>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Colonne 2 : Services périscolaires par section */}
            <div className="column is-half">
              <AnimateOnScroll animation="fade-left" delay={100}>
                <div className="box animated-box" style={{ 
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0fff8 100%)', 
                  borderRadius: 16,
                  border: '2px solid #d2ffe8',
                  boxShadow: '0 4px 16px rgba(72, 199, 116, 0.08)',
                  transition: 'all 0.3s ease'
                }}>
                  <h2 className="title is-4 has-text-primary mb-4" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}>
                    <span style={{ fontSize: 32 }}>🎨</span>
                    Services et Activités
                  </h2>
                  
                  {servicesSections.length === 0 && (
                    <p className="has-text-grey">Aucun service renseigné pour le moment.</p>
                  )}

                  {servicesSections.map((section, sectionIndex) => {
                    const sectionServices = getServicesForSection(section.id);
                    
                    return (
                      <AnimateOnScroll key={section.id} animation="fade-up" delay={sectionIndex * 100}>
                        <div className="box mb-4" style={{
                          background: 'white',
                          borderRadius: 12,
                          border: '2px solid #e8fff4',
                          overflow: 'hidden'
                        }}>
                          {/* En-tête de section cliquable */}
                          <div 
                            onClick={() => toggleSection(section.id)}
                            style={{
                              cursor: 'pointer',
                              padding: '1rem',
                              background: 'linear-gradient(135deg, #f0fff8 0%, #e8fff4 100%)',
                              borderBottom: expandedSections[section.id] ? '2px solid #d2ffe8' : 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'all 0.3s ease'
                            }}
                            className="section-header"
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <span style={{ fontSize: 28 }}>{section.emoji || '📂'}</span>
                              <div>
                                <h3 className="subtitle is-5 mb-1" style={{ fontWeight: 700, color: '#1277c6' }}>
                                  {section.titre}
                                </h3>
                                {section.description && (
                                  <p className="is-size-7 has-text-grey mb-0">
                                    {section.description}
                                  </p>
                                )}
                                <p className="is-size-7 has-text-info mt-1">
                                  {sectionServices.length} service(s)
                                </p>
                              </div>
                            </div>
                            <span style={{ 
                              fontSize: 20, 
                              transform: expandedSections[section.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s ease'
                            }}>
                              ▼
                            </span>
                          </div>

                          {/* Services de la section */}
                          {expandedSections[section.id] && (
                            <div style={{ padding: '1rem' }}>
                              {sectionServices.length === 0 ? (
                                <p className="has-text-grey is-size-7">Aucun service dans cette section</p>
                              ) : (
                                sectionServices.map((service, serviceIndex) => (
                                  <AnimateOnScroll key={service.id} animation="fade-up" delay={serviceIndex * 50}>
                                    <div 
                                      className="media mb-3 service-card" 
                                      style={{
                                        padding: 14,
                                        borderRadius: 10,
                                        background: '#f8fbff',
                                        border: '1px solid #e8f4ff',
                                        transition: 'all 0.3s ease',
                                        cursor: service.btnUrl ? 'pointer' : 'default'
                                      }}
                                      onClick={() => service.btnUrl && openServiceModal(service)}
                                    >
                                      {service.image && (
                                        <figure className="media-left">
                                          <p className="image is-48x48">
                                            <img 
                                              src={service.image}
                                              alt={service.titre}
                                              style={{ 
                                                objectFit: 'cover', 
                                                borderRadius: 8,
                                                boxShadow: '0 2px 8px rgba(72, 199, 116, 0.15)'
                                              }}
                                              onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/48?text=S'; }}
                                            />
                                          </p>
                                        </figure>
                                      )}
                                      <div className="media-content">
                                        <h4 className="subtitle is-6 has-text-link mb-1" style={{ 
                                          fontWeight: 600,
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 6
                                        }}>
                                          {service.emoji && <span style={{ fontSize: 18 }}>{service.emoji}</span>}
                                          {service.titre}
                                        </h4>
                                        {service.horaires && (
                                          <p className="has-text-grey mb-1" style={{ fontSize: 13 }}>
                                            {service.horaires}
                                          </p>
                                        )}
                                        {service.description && (
                                          <p className="has-text-grey" style={{ fontSize: 13, whiteSpace: 'pre-line' }}>
                                            {service.description.length > 100 
                                              ? service.description.substring(0, 100) + '...' 
                                              : service.description}
                                          </p>
                                        )}
                                        {service.btnLabel && service.btnUrl && (
                                          <button 
                                            className="button is-small is-success is-light mt-2" 
                                            style={{
                                              borderRadius: 6,
                                              fontWeight: 600,
                                              fontSize: 12
                                            }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              openServiceModal(service);
                                            }}
                                          >
                                            {service.btnLabel} →
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </AnimateOnScroll>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      </AnimateOnScroll>
                    );
                  })}
                </div>
              </AnimateOnScroll>

              {/* Formulaire d'inscription */}
              <AnimateOnScroll animation="fade-left" delay={200}>
                <div className="box animated-box mt-5" style={{ 
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)', 
                  borderRadius: 16,
                  border: '2px solid #e0e7ef',
                  boxShadow: '0 4px 16px rgba(18, 119, 198, 0.08)',
                  transition: 'all 0.3s ease'
                }}>
                  <h2 className="title is-4 has-text-primary mb-4" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}>
                    <span style={{ fontSize: 32 }}>📝</span>
                    Inscription aux services scolaires
                  </h2>
                  
                  {formSubmitted && (
                    <AnimateOnScroll animation="zoom-in">
                      <div className="notification is-success" style={{
                        borderRadius: 12,
                        animation: 'slideDown 0.3s ease'
                      }}>
                        <button className="delete" onClick={() => setFormSubmitted(false)}></button>
                        ✅ Votre demande d'inscription a bien été enregistrée. Vous recevrez une confirmation par email.
                      </div>
                    </AnimateOnScroll>
                  )}

                  <form onSubmit={handleSubmit}>
                    <AnimateOnScroll animation="fade-up" delay={50}>
                      <div className="field">
                        <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 20 }}>👶</span>
                          Informations sur l'enfant
                        </label>
                        <div className="columns">
                          <div className="column">
                            <div className="field">
                              <label className="label is-small">Nom</label>
                              <div className="control">
                                <input
                                  className="input"
                                  type="text"
                                  name="nomEnfant"
                                  value={formData.nomEnfant}
                                  onChange={handleChange}
                                  required
                                  style={{ borderRadius: 10 }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="column">
                            <div className="field">
                              <label className="label is-small">Prénom</label>
                              <div className="control">
                                <input
                                  className="input"
                                  type="text"
                                  name="prenomEnfant"
                                  value={formData.prenomEnfant}
                                  onChange={handleChange}
                                  required
                                  style={{ borderRadius: 10 }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="field">
                          <label className="label is-small">Date de naissance</label>
                          <div className="control">
                            <input
                              className="input"
                              type="date"
                              name="dateNaissance"
                              value={formData.dateNaissance}
                              onChange={handleChange}
                              required
                              style={{ borderRadius: 10 }}
                            />
                          </div>
                        </div>

                        <div className="field">
                          <label className="label is-small">Classe</label>
                          <div className="control">
                            <div className="select is-fullwidth">
                              <select name="classe" value={formData.classe} onChange={handleChange} required style={{ borderRadius: 10 }}>
                                <option value="">Sélectionnez une classe</option>
                                <option value="PS">Petite Section</option>
                                <option value="MS">Moyenne Section</option>
                                <option value="GS">Grande Section</option>
                                <option value="CP">CP</option>
                                <option value="CE1">CE1</option>
                                <option value="CE2">CE2</option>
                                <option value="CM1">CM1</option>
                                <option value="CM2">CM2</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AnimateOnScroll>

                    <AnimateOnScroll animation="fade-up" delay={100}>
                      <div className="field mt-5">
                        <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 20 }}>👨‍👩‍👧</span>
                          Informations du responsable légal
                        </label>
                        <div className="columns">
                          <div className="column">
                            <div className="field">
                              <label className="label is-small">Nom</label>
                              <div className="control">
                                <input
                                  className="input"
                                  type="text"
                                  name="nomParent"
                                  value={formData.nomParent}
                                  onChange={handleChange}
                                  required
                                  style={{ borderRadius: 10 }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="column">
                            <div className="field">
                              <label className="label is-small">Prénom</label>
                              <div className="control">
                                <input
                                  className="input"
                                  type="text"
                                  name="prenomParent"
                                  value={formData.prenomParent}
                                  onChange={handleChange}
                                  required
                                  style={{ borderRadius: 10 }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="columns">
                          <div className="column">
                            <div className="field">
                              <label className="label is-small">Téléphone</label>
                              <div className="control">
                                <input
                                  className="input"
                                  type="tel"
                                  name="telephone"
                                  value={formData.telephone}
                                  onChange={handleChange}
                                  required
                                  style={{ borderRadius: 10 }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="column">
                            <div className="field">
                              <label className="label is-small">Email</label>
                              <div className="control">
                                <input
                                  className="input"
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  required
                                  style={{ borderRadius: 10 }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="field">
                          <label className="label is-small">Adresse</label>
                          <div className="control">
                            <textarea
                              className="textarea"
                              name="adresse"
                              value={formData.adresse}
                              onChange={handleChange}
                              required
                              style={{ borderRadius: 10 }}
                            />
                          </div>
                        </div>
                      </div>
                    </AnimateOnScroll>

                    <AnimateOnScroll animation="fade-up" delay={150}>
                      <div className="field mt-5">
                        <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 20 }}>✅</span>
                          Services souhaités
                        </label>
                        
                        {[
                          { name: 'cantine', label: 'Inscription à la cantine', emoji: '🍽️' },
                          { name: 'garderieMatin', label: 'Garderie du matin (7h30 - 8h30)', emoji: '🌅' },
                          { name: 'garderieSoir', label: 'Garderie du soir (16h30 - 18h30)', emoji: '🌆' }
                        ].map((service, idx) => (
                          <div key={service.name} className="field checkbox-field" style={{
                            padding: '12px 16px',
                            background: 'white',
                            borderRadius: 10,
                            border: '2px solid #e0e7ef',
                            marginBottom: 10,
                            transition: 'all 0.2s ease'
                          }}>
                            <div className="control">
                              <label className="checkbox" style={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: 10,
                                cursor: 'pointer',
                                fontWeight: 500
                              }}>
                                <input
                                  type="checkbox"
                                  name={service.name}
                                  checked={formData[service.name]}
                                  onChange={handleChange}
                                  style={{ width: 20, height: 20 }}
                                />
                                <span style={{ fontSize: 20 }}>{service.emoji}</span>
                                <span>{service.label}</span>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AnimateOnScroll>

                    <AnimateOnScroll animation="zoom-in" delay={200}>
                      <div className="field mt-5">
                        <div className="control">
                          <button 
                            className="button is-link is-medium is-fullwidth submit-button"
                            type="submit"
                            style={{
                              borderRadius: 12,
                              fontWeight: 700,
                              fontSize: 18,
                              padding: '1.25rem 0',
                              boxShadow: '0 4px 16px rgba(18, 119, 198, 0.3)',
                              transition: 'all 0.3s ease',
                              border: 'none'
                            }}
                          >
                            <span style={{ marginRight: 8 }}>✉️</span>
                            Envoyer la demande d'inscription
                          </button>
                        </div>
                      </div>
                    </AnimateOnScroll>
                  </form>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* Modal pour afficher le PDF ou lien externe */}
      {showModal && selectedService && (
        <div 
          className={`modal ${showModal ? 'is-active' : ''}`}
          onClick={closeModal}
          style={{
            zIndex: 9999
          }}
        >
          <div className="modal-background"></div>
          <div 
            className="modal-card" 
            style={{ 
              maxWidth: '90vw', 
              width: '900px',
              maxHeight: '90vh'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal-card-head" style={{ 
              background: 'linear-gradient(135deg, #48c774 0%, #3ab66a 100%)',
              color: 'white'
            }}>
              <p className="modal-card-title has-text-white" style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                {selectedService.emoji && <span style={{ fontSize: 24 }}>{selectedService.emoji}</span>}
                {selectedService.titre}
              </p>
              <button 
                className="delete" 
                aria-label="close" 
                onClick={closeModal}
                style={{
                  background: 'white',
                  opacity: 0.9
                }}
              ></button>
            </header>
            <section className="modal-card-body" style={{ 
              padding: 0,
              overflow: 'hidden'
            }}>
              {selectedService.btnUrl.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={selectedService.btnUrl}
                  style={{
                    width: '100%',
                    height: '70vh',
                    border: 'none'
                  }}
                  title={selectedService.titre}
                />
              ) : (
                <div style={{ 
                  padding: '2rem',
                  textAlign: 'center'
                }}>
                  <p className="mb-4">Ce lien va s'ouvrir dans un nouvel onglet :</p>
                  <a 
                    href={selectedService.btnUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="button is-success is-large"
                    style={{
                      borderRadius: 10,
                      fontWeight: 600
                    }}
                  >
                    🔗 {selectedService.btnLabel || 'Ouvrir le lien'}
                  </a>
                  <p className="mt-4 has-text-grey is-size-7">
                    {selectedService.btnUrl}
                  </p>
                </div>
              )}
            </section>
            <footer className="modal-card-foot" style={{
              justifyContent: 'space-between',
              background: '#f9fbfd'
            }}>
              {selectedService.description && (
                <div style={{ flex: 1, marginRight: '1rem' }}>
                  <p className="is-size-7 has-text-grey">
                    {selectedService.description}
                  </p>
                </div>
              )}
              <div className="buttons">
                {selectedService.btnUrl.toLowerCase().endsWith('.pdf') && (
                  <a 
                    href={selectedService.btnUrl} 
                    download 
                    className="button is-success is-light"
                    style={{ borderRadius: 8 }}
                  >
                    📥 Télécharger
                  </a>
                )}
                <button 
                  className="button is-light" 
                  onClick={closeModal}
                  style={{ borderRadius: 8 }}
                >
                  Fermer
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}

      {/* CSS pour les animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-animated {
          animation: heroFadeIn 1.5s ease-out;
        }

        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: scale(1.05);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animated-box:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(18, 119, 198, 0.18) !important;
        }

        .school-card:hover {
          transform: translateX(8px);
          border-color: #1277c6 !important;
          box-shadow: 0 6px 20px rgba(18, 119, 198, 0.15) !important;
        }

        .service-card:hover {
          transform: translateX(4px);
          border-color: #48c774 !important;
          box-shadow: 0 4px 16px rgba(72, 199, 116, 0.12) !important;
        }

        .section-header:hover {
          background: linear-gradient(135deg, #e8fff4 0%, #d2ffe8 100%) !important;
        }

        .table-row-hover:hover {
          background: #f0f7ff !important;
        }

        .checkbox-field:hover {
          border-color: #1277c6 !important;
          background: #f8fbff !important;
        }

        .submit-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(18, 119, 198, 0.4) !important;
        }

        .document-link:hover {
          transform: translateX(8px);
          border-color: #ff9800 !important;
          background: #fff8f0 !important;
        }

        .document-link:hover span:last-child {
          opacity: 1 !important;
        }

        .modal.is-active {
          display: flex;
        }

        .modal-background {
          background-color: rgba(10, 10, 10, 0.7);
        }

        .modal-card {
          animation: modalSlideDown 0.3s ease;
        }

        @keyframes modalSlideDown {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media screen and (max-width: 768px) {
          .hero.is-medium .hero-body {
            padding: 3rem 1.5rem !important;
          }

          .title.is-2 {
            font-size: 1.75rem !important;
            line-height: 1.3 !important;
          }

          .title.is-3 {
            font-size: 1.5rem !important;
            line-height: 1.3 !important;
          }

          .title.is-4 {
            font-size: 1.25rem !important;
          }

          .title.is-5 {
            font-size: 1.125rem !important;
          }

          .subtitle.is-5 {
            font-size: 1rem !important;
          }

          .subtitle.is-6 {
            font-size: 0.9rem !important;
          }

          .container {
            padding-left: 0.75rem !important;
            padding-right: 0.75rem !important;
          }

          .section {
            padding: 2rem 0.75rem !important;
          }

          .columns {
            margin: 0 !important;
          }
          
          .column {
            padding: 0.5rem !important;
          }

          .box {
            padding: 1rem !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }

          .animated-box:hover {
            transform: none !important;
          }

          .school-card,
          .service-card {
            padding: 12px !important;
          }

          .school-card:hover,
          .service-card:hover {
            transform: none !important;
          }

          .section-header {
            padding: 0.75rem !important;
          }

          .section-header:hover {
            transform: none !important;
          }

          .media-left {
            margin-right: 0.75rem !important;
          }

          .image.is-96x96 {
            height: 64px !important;
            width: 64px !important;
          }

          .image.is-64x64 {
            height: 48px !important;
            width: 48px !important;
          }

          .image.is-48x48 {
            height: 40px !important;
            width: 40px !important;
          }

          .buttons {
            flex-wrap: wrap;
          }

          .button {
            font-size: 0.875rem !important;
            padding: 0.5rem 0.75rem !important;
            white-space: normal !important;
            height: auto !important;
          }

          .buttons .button {
            width: 100%;
            margin-bottom: 0.5rem;
          }

          .table {
            font-size: 0.875rem !important;
          }

          .table th,
          .table td {
            padding: 0.5rem 0.75rem !important;
            font-size: 0.875rem !important;
          }

          .field .columns {
            margin: 0 !important;
          }

          .field .column {
            padding: 0.25rem !important;
          }

          .input,
          .textarea,
          .select select {
            font-size: 0.875rem !important;
          }

          .label {
            font-size: 0.875rem !important;
            margin-bottom: 0.25rem !important;
          }

          .label.is-small {
            font-size: 0.75rem !important;
          }

          .checkbox-field {
            padding: 8px 12px !important;
          }

          .submit-button {
            font-size: 1rem !important;
            padding: 1rem !important;
          }

          .submit-button:hover {
            transform: none !important;
          }

          .notification {
            padding: 1rem !important;
            font-size: 0.875rem !important;
          }

          .document-link {
            padding: 8px 12px !important;
            font-size: 0.875rem !important;
          }

          .document-link:hover {
            transform: none !important;
          }

          .modal-card {
            width: 95vw !important;
            max-height: 85vh !important;
          }

          .modal-card-body iframe {
            height: 60vh !important;
          }
        }

        @media screen and (max-width: 480px) {
          .hero.is-medium .hero-body {
            padding: 2rem 1rem !important;
          }

          .title.is-2 {
            font-size: 1.5rem !important;
          }

          .title.is-3 {
            font-size: 1.25rem !important;
          }

          .container {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
          }

          .section {
            padding: 1.5rem 0.5rem !important;
          }

          .box {
            padding: 0.75rem !important;
            border-radius: 12px !important;
          }

          .media {
            display: block !important;
          }

          .media-left {
            margin-bottom: 0.75rem !important;
            margin-right: 0 !important;
          }

          .media-left .image {
            margin: 0 auto !important;
          }
        }
      `}</style>
    </>
  );
}