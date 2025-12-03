import React, { useEffect, useState, useRef } from 'react';
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
  const [ref, isVisible] = useOnScreen({ threshold: threshold, triggerOnce: once });

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

function QuickBox({ icon, label, href, isFile, index = 0 }) {
  const isPdf = isFile || (href && href.toLowerCase().endsWith('.pdf'));
  
  return (
    <AnimateOnScroll animation="fade-up" delay={index * 80} duration={600}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="box is-flex is-align-items-center quick-box"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
          gap: 14,
          fontWeight: 600,
          fontSize: 17,
          color: '#1277c6',
          border: '2px solid #e0e7ef',
          borderRadius: 16,
          marginBottom: 18,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(18, 119, 198, 0.08)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(18, 119, 198, 0.2)';
          e.currentTarget.style.borderColor = '#1277c6';
          e.currentTarget.style.background = 'linear-gradient(135deg, #fafdff 0%, #e8f4ff 100%)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(18, 119, 198, 0.08)';
          e.currentTarget.style.borderColor = '#e0e7ef';
          e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)';
        }}
      >
        {/* Effet de brillance au survol */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          transition: 'left 0.6s ease',
          pointerEvents: 'none'
        }} className="shine-effect"></div>

        <span style={{
          fontSize: 36,
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1277c6 0%, #1b9bd7 100%)',
          borderRadius: 14,
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(18, 119, 198, 0.25)',
          transition: 'transform 0.4s ease'
        }}>
          {isPdf ? '📄' : icon}
        </span>
        <div style={{ flex: 1 }}>
          {label}
          {isPdf && (
            <span className="tag is-small is-info is-light ml-2" style={{
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              PDF
            </span>
          )}
        </div>
        <span style={{
          fontSize: 24,
          opacity: 0.5,
          transition: 'all 0.3s ease'
        }} className="arrow-icon">
          →
        </span>
      </a>
    </AnimateOnScroll>
  );
}

export default function Demarches() {
  const heroImage = useHeroImage();
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/pageContent?page=demarches')
      .then(res => res.json())
      .then(data => {
        setContent(data[0] || {});
      })
      .catch(err => {
        console.error("Erreur lors du chargement des démarches:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Créer des arrays à partir des données pour faciliter le rendu
  const demarchesRapides = [];
  const demarchesUrbanisme = [];
  const demarchesAutres = [];

  // Extraire les démarches rapides
  for (let i = 1; i <= 20; i++) {
    const labelKey = `demarche_rapide_${i}_label`;
    const urlKey = `demarche_rapide_${i}_url`;
    const iconKey = `demarche_rapide_${i}_icon`;
    if (content[labelKey]) {
      demarchesRapides.push({
        id: i,
        label: content[labelKey],
        url: content[urlKey] || '#',
        isFile: content[urlKey]?.toLowerCase().endsWith('.pdf') || false,
        icon: content[iconKey] || "📄"
      });
    }
  }

  // Extraire les démarches urbanisme
  for (let i = 1; i <= 20; i++) {
    const labelKey = `urbanisme_${i}_label`;
    const urlKey = `urbanisme_${i}_url`;
    const iconKey = `urbanisme_${i}_icon`;
    if (content[labelKey]) {
      demarchesUrbanisme.push({
        id: i,
        label: content[labelKey],
        url: content[urlKey] || '#',
        isFile: content[urlKey]?.toLowerCase().endsWith('.pdf') || false,
        icon: content[iconKey] || "🏡"
      });
    }
  }

  // Extraire les autres démarches
  for (let i = 1; i <= 20; i++) {
    const labelKey = `autre_${i}_label`;
    const urlKey = `autre_${i}_url`;
    const iconKey = `autre_${i}_icon`;
    if (content[labelKey]) {
      demarchesAutres.push({
        id: i,
        label: content[labelKey],
        url: content[urlKey] || '#',
        isFile: content[urlKey]?.toLowerCase().endsWith('.pdf') || false,
        icon: content[iconKey] || "🔗"
      });
    }
  }

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
        {/* Effet de particules animées */}
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

      {/* Contenu démarches */}
      <section className="section" style={{ 
        background: 'linear-gradient(180deg, #fafdff 0%, #f0f7ff 100%)', 
        minHeight: '100vh', 
        marginTop: 0,
        position: 'relative'
      }}>
        {/* Motif de fond décoratif */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(18, 119, 198, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(18, 119, 198, 0.03) 0%, transparent 50%)',
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
              {content.titre || "Démarches administratives"}
            </h1>
          </AnimateOnScroll>

          {loading ? (
            <AnimateOnScroll animation="zoom-in">
              <div className="has-text-centered py-6">
                <span className="icon is-large" style={{ color: '#1277c6' }}>
                  <i className="fas fa-spinner fa-pulse fa-3x"></i>
                </span>
                <p className="mt-4 has-text-weight-semibold" style={{ color: '#4a5568', fontSize: 18 }}>
                  Chargement des démarches...
                </p>
              </div>
            </AnimateOnScroll>
          ) : (
            <div className="columns is-variable is-6">
              {/* Colonne 1 : Démarches rapides */}
              <div className="column is-half">
                <AnimateOnScroll animation="fade-right" delay={100}>
                  <div style={{
                    background: 'linear-gradient(135deg, #1277c6 0%, #1b9bd7 100%)',
                    padding: '16px 24px',
                    borderRadius: '16px 16px 0 0',
                    marginBottom: 20,
                    boxShadow: '0 4px 16px rgba(18, 119, 198, 0.2)'
                  }}>
                    <h2 className="title is-5 mb-0" style={{ 
                      color: 'white',
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                      ⚡ Démarches rapides
                    </h2>
                  </div>
                </AnimateOnScroll>

                {demarchesRapides.length === 0 ? (
                  <AnimateOnScroll animation="fade-up">
                    <div className="notification is-light is-info" style={{ borderRadius: 14 }}>
                      Aucune démarche rapide n'a été configurée.
                    </div>
                  </AnimateOnScroll>
                ) : (
                  demarchesRapides.map((demarche, index) => (
                    <QuickBox 
                      key={demarche.id}
                      icon={demarche.icon}
                      label={demarche.label}
                      href={demarche.url}
                      isFile={demarche.isFile}
                      index={index}
                    />
                  ))
                )}
              </div>

              {/* Colonne 2 : Urbanisme et autres liens */}
              <div className="column is-half">
                <AnimateOnScroll animation="fade-left" delay={100}>
                  <div style={{
                    background: 'linear-gradient(135deg, #48c774 0%, #3ec46d 100%)',
                    padding: '16px 24px',
                    borderRadius: '16px 16px 0 0',
                    marginBottom: 20,
                    boxShadow: '0 4px 16px rgba(72, 199, 116, 0.2)'
                  }}>
                    <h2 className="title is-5 mb-0" style={{ 
                      color: 'white',
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                      🏡 Urbanisme
                    </h2>
                  </div>
                </AnimateOnScroll>

                {demarchesUrbanisme.length === 0 ? (
                  <AnimateOnScroll animation="fade-up">
                    <div className="notification is-light is-success" style={{ borderRadius: 14 }}>
                      Aucune démarche d'urbanisme n'a été configurée.
                    </div>
                  </AnimateOnScroll>
                ) : (
                  demarchesUrbanisme.map((demarche, index) => (
                    <QuickBox 
                      key={demarche.id}
                      icon={demarche.icon}
                      label={demarche.label}
                      href={demarche.url}
                      isFile={demarche.isFile}
                      index={index}
                    />
                  ))
                )}

                {/* Autres démarches */}
                <AnimateOnScroll animation="fade-up" delay={300}>
                  <div className="box mt-5" style={{ 
                    background: 'linear-gradient(135deg, #f8fbff 0%, #f0f7ff 100%)', 
                    border: '2px solid #e0e7ef', 
                    borderRadius: 16,
                    boxShadow: '0 4px 16px rgba(18, 119, 198, 0.08)',
                    transition: 'all 0.3s ease'
                  }}>
                    <h3 className="subtitle is-6 has-text-link mb-3" style={{ 
                      fontWeight: 700,
                      letterSpacing: 0.3
                    }}>
                      🔗 Autres démarches utiles
                    </h3>
                    {demarchesAutres.length === 0 ? (
                      <div className="notification is-light is-info is-size-7 py-2" style={{ borderRadius: 10 }}>
                        Aucune autre démarche n'a été configurée.
                      </div>
                    ) : (
                      <ul style={{ paddingLeft: 20, fontSize: 15 }}>
                        {demarchesAutres.map((demarche, index) => (
                          <AnimateOnScroll key={demarche.id} animation="fade-left" delay={index * 60}>
                            <li style={{ marginBottom: 12, transition: 'transform 0.2s ease' }} className="other-link">
                              <span style={{ fontSize: 22, marginRight: 8 }}>{demarche.icon}</span>
                              <a 
                                href={demarche.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="has-text-link"
                                style={{
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  transition: 'all 0.2s ease',
                                  position: 'relative'
                                }}
                              >
                                {demarche.label}
                                {demarche.isFile && (
                                  <span className="tag is-small is-info is-light ml-1">PDF</span>
                                )}
                              </a>
                            </li>
                          </AnimateOnScroll>
                        ))}
                      </ul>
                    )}
                  </div>
                </AnimateOnScroll>

                {/* PDF Règlement */}
                {content.pdf_reglement_label && content.pdf_reglement_url && (
                  <AnimateOnScroll animation="zoom-in" delay={400}>
                    <div className="has-text-centered mt-5">
                      <a 
                        href={content.pdf_reglement_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="button is-link is-medium"
                        style={{
                          borderRadius: 14,
                          fontWeight: 700,
                          padding: '1.25rem 2rem',
                          boxShadow: '0 6px 20px rgba(18, 119, 198, 0.25)',
                          transition: 'all 0.3s ease',
                          border: 'none'
                        }}
                      >
                        <span className="icon">
                          <i className="fas fa-file-pdf"></i>
                        </span>
                        <span>{content.pdf_reglement_label}</span>
                      </a>
                    </div>
                  </AnimateOnScroll>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CSS pour les animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.95); }
        }

        .quick-box:hover .shine-effect {
          left: 100% !important;
        }

        .quick-box:hover span:first-of-type {
          transform: scale(1.15) rotate(5deg);
        }

        .quick-box:hover .arrow-icon {
          opacity: 1 !important;
          transform: translateX(8px);
        }

        .other-link:hover {
          transform: translateX(8px);
        }

        .other-link a:hover {
          color: #0d5a9e !important;
          text-decoration: underline !important;
        }

        .button.is-link:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(18, 119, 198, 0.4) !important;
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

        @media screen and (max-width: 768px) {
          .quick-box {
            font-size: 15px !important;
          }
          
          .quick-box span:first-of-type {
            width: 48px !important;
            height: 48px !important;
            font-size: 28px !important;
          }
        }
      `}</style>
    </>
  );
}