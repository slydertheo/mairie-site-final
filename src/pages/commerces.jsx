import React, { useEffect, useState, useRef } from 'react';
import 'bulma/css/bulma.min.css';
import Link from 'next/link';

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
  // Utiliser un threshold plus faible sur mobile
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

export default function Commerces() {
  const [commerces, setCommerces] = useState([]);
  const [content, setContent] = useState({});
  const [marches, setMarches] = useState([]);

  useEffect(() => {
    fetch('/api/commerces').then(res => res.json()).then(setCommerces);
    fetch('/api/pageContent?page=commerces')
      .then(res => res.json())
      .then(data => {
        const obj = {};
        data.forEach(d => { obj[d.section] = d.contenu || d.titre; });
        setContent(obj);
      });
    fetch('/api/marches').then(res => res.json()).then(setMarches);
  }, []);

  // Fonction pour formater une catégorie
  const formatCategory = (category) => {
    switch(category) {
      case 'alimentaire': return '🍎 Commerces alimentaires';
      case 'restauration': return '🍽️ Restaurants et cafés';
      case 'services': return '🛠️ Services';
      case 'artisanat': return '🔨 Artisanat local';
      default: return category;
    }
  };

  return (
    <>
      {/* En-tête hero avec animation */}
      <section
        className="hero is-primary is-medium hero-animated"
        style={{
          backgroundImage: 'linear-gradient(180deg,rgba(10,37,64,0.6),rgba(10,37,64,0.3)),url("village.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '0 0 40px 40px',
          boxShadow: '0 10px 40px #0a254040',
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
          <div className="container has-text-centered">
            <AnimateOnScroll animation="fade-up" duration={1000}>
              <h1 className="title is-1 has-text-weight-bold" style={{ 
                color: '#fff', 
                textShadow: '0 4px 24px #0a2540a0', 
                letterSpacing: 1.5, 
                fontSize: '3rem',
                marginBottom: 20
              }}>
                {content.hero_titre || <>Bienvenue sur le site officiel de<br />la Mairie de <span style={{ color: '#ffd700', textShadow: '0 2px 8px #1277c6' }}>Friesen</span></>}
              </h1>
            </AnimateOnScroll>
            <AnimateOnScroll animation="zoom-in" delay={400}>
              <p className="subtitle is-4" style={{ color: '#e0e7ef', marginTop: 20 }}>
                Découvrez nos commerces et artisans locaux
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={600}>
              <div style={{
                width: 80,
                height: 4,
                background: 'linear-gradient(90deg, transparent, #ffd700, transparent)',
                margin: '20px auto',
                borderRadius: 2
              }}></div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section
        className="section"
        style={{
          background: 'linear-gradient(135deg, #f7fafd 0%, #ffffff 100%)',
          minHeight: '100vh',
          marginTop: 0,
          paddingTop: 40,
          position: 'relative'
        }}
      >
        {/* Motif de fond décoratif */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(18, 119, 198, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.03) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>

        <div className="container" style={{ maxWidth: 1200, position: 'relative', zIndex: 1 }}>
          <AnimateOnScroll animation="fade-up" duration={800}>
            <h1 className="title is-2 has-text-link mb-5" style={{ 
              textAlign: 'center', 
              letterSpacing: 1, 
              marginBottom: 30,
              background: 'linear-gradient(135deg, #1277c6 0%, #1b9bd7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 800
            }}>
              {content.titre || "Commerces et artisans à Friesen"}
            </h1>
          </AnimateOnScroll>
          
          <AnimateOnScroll animation="zoom-in" delay={200}>
            <div className="content mb-6">
              <div className="notification is-info is-light animated-box" style={{ 
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)', 
                border: '2px solid #e0e7ef', 
                borderRadius: 16, 
                boxShadow: '0 4px 16px #1277c620',
                transition: 'all 0.3s ease'
              }}>
                <p className="is-size-5 mb-3" style={{ 
                  fontWeight: 700,
                  color: '#1277c6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}>
                  <span style={{ fontSize: 28 }}>🏪</span>
                  {content.intro_titre || "Soutenez nos commerces locaux !"}
                </p>
                <p style={{ color: '#4b5563', lineHeight: 1.8 }}>
                  {content.intro || "La commune de Friesen est fière de ses commerçants et artisans qui participent activement à la vie économique et sociale de notre village. Nous vous invitons à découvrir leurs produits et services de qualité, et à privilégier ces acteurs locaux pour vos achats du quotidien."}
                </p>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Liste des commerces par catégorie */}
          {['alimentaire', 'restauration', 'services', 'artisanat'].map((category, catIndex) => (
            <div key={category} className="mb-6">
              <AnimateOnScroll animation="fade-right" delay={catIndex * 100}>
                <h2 className="title is-3 has-text-primary mb-5" style={{ 
                  borderLeft: '5px solid #1277c6', 
                  paddingLeft: 15, 
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}>
                  {formatCategory(category)}
                </h2>
              </AnimateOnScroll>
              
              <div className="columns is-multiline">
                {commerces.filter(c => c.categorie === category).map((commerce, index) => (
                  <div key={commerce.id} className="column is-half">
                    <AnimateOnScroll animation="fade-up" delay={index * 100}>
                      <div
                        className="card commerce-card"
                        style={{
                          borderRadius: 16,
                          border: '2px solid #e0e7ef',
                          overflow: 'hidden',
                          boxShadow: '0 6px 24px #1277c620',
                          height: '100%',
                          background: '#ffffff',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          position: 'relative'
                        }}
                      >
                        {/* Effet de brillance */}
                        <div className="shine-effect" style={{
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                          transition: 'left 0.6s ease',
                          pointerEvents: 'none',
                          zIndex: 1
                        }}></div>

                        <div className="card-image" style={{ 
                          background: '#ffffff', 
                          borderBottom: '2px solid #e0e7ef', 
                          borderTopLeftRadius: 16, 
                          borderTopRightRadius: 16,
                          overflow: 'hidden'
                        }}>
                          <figure
                            className="image"
                            style={{
                              aspectRatio: '4/3',
                              overflow: 'hidden',
                              background: '#ffffff',
                              borderTopLeftRadius: 16,
                              borderTopRightRadius: 16,
                              marginBottom: 0
                            }}
                          >
                            <img
                              src={commerce.image}
                              alt={commerce.nom}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                background: '#ffffff',
                                borderTopLeftRadius: 16,
                                borderTopRightRadius: 16,
                                transition: 'transform 0.4s ease'
                              }}
                              className="commerce-img"
                            />
                          </figure>
                        </div>
                        <div className="card-content" style={{ background: '#ffffff', padding: 20 }}>
                          <span
                            className="tag is-link"
                            style={{
                              position: 'absolute',
                              top: 15,
                              right: 15,
                              zIndex: 2,
                              fontSize: 11,
                              letterSpacing: 0.5,
                              fontWeight: 600,
                              padding: '6px 12px',
                              borderRadius: 8,
                              boxShadow: '0 2px 8px rgba(18, 119, 198, 0.3)',
                              background: 'linear-gradient(135deg, #1277c6 0%, #1b9bd7 100%)'
                            }}
                          >
                            {formatCategory(commerce.categorie).split(' ')[0]}
                          </span>
                          <p className="title is-4 has-text-link mb-2" style={{ 
                            marginTop: 10,
                            fontWeight: 700
                          }}>
                            {commerce.nom}
                          </p>
                          <p className="subtitle is-6 mb-4" style={{ color: '#6b7280', lineHeight: 1.6 }}>
                            {commerce.description}
                          </p>
                          
                          <div className="content">
                            {commerce.adresse && (
                              <p className="has-text-grey mb-2" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 18 }}>📍</span> 
                                <span>{commerce.adresse}</span>
                              </p>
                            )}
                            {commerce.telephone && (
                              <p className="has-text-grey mb-2" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 18 }}>📞</span> 
                                <span>{commerce.telephone}</span>
                              </p>
                            )}
                            {commerce.horaires && (
                              <p className="has-text-grey mb-3" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 18 }}>🕒</span> 
                                <span>{commerce.horaires}</span>
                              </p>
                            )}
                            <p>
                              {commerce.site ? (
                                <a
                                  href={commerce.site}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="button is-link commerce-btn"
                                  style={{
                                    borderRadius: 10,
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #1277c6, #1b9bd7)',
                                    color: '#fff',
                                    border: 'none',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 12px #1277c640'
                                  }}
                                >
                                  <span style={{ marginRight: 8 }}>🌐</span> Visiter le site web
                                </a>
                              ) : (
                                <button
                                  className="button is-light"
                                  disabled
                                  style={{
                                    borderRadius: 10,
                                    fontWeight: 600,
                                    background: '#f5f5f5',
                                    color: '#9ca3af',
                                    border: '2px solid #e5e7eb',
                                    cursor: 'not-allowed'
                                  }}
                                >
                                  <span style={{ marginRight: 8 }}>🌐</span> Aucun site web
                                </button>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </AnimateOnScroll>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Section pour les marchés */}
          {marches.map((m, index) => (
            <AnimateOnScroll key={m.id} animation="zoom-in" delay={index * 150}>
              <div
                className="box market-box"
                style={{
                  borderRadius: 16,
                  border: '2px solid #e0e7ef',
                  boxShadow: '0 6px 24px #1277c620',
                  background: 'linear-gradient(135deg, #ffffff 0%, #fffbf0 100%)',
                  marginTop: 50,
                  maxWidth: 1200,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Effet de brillance */}
                <div className="shine-effect-market" style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  transition: 'left 0.6s ease',
                  pointerEvents: 'none',
                  zIndex: 1
                }}></div>

                <div className="columns" style={{ position: 'relative', zIndex: 2 }}>
                  <div className="column is-8">
                    <h3 className="title is-3 has-text-primary mb-4" style={{ 
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}>
                      <span style={{ fontSize: 36 }}>🛒</span>
                      {m.titre}
                    </h3>
                    <p className="subtitle is-5 mb-4" style={{ color: '#6b7280', lineHeight: 1.8 }}>
                      {m.texte}
                    </p>
                    <div className="content">
                      {m.adresse && (
                        <p className="has-text-grey mb-3" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 20 }}>📍</span> 
                          <span style={{ fontWeight: 500 }}>{m.adresse}</span>
                        </p>
                      )}
                      {m.jour && (
                        <p className="has-text-grey mb-3" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 20 }}>🗓️</span> 
                          <span style={{ fontWeight: 500 }}>{m.jour}</span>
                        </p>
                      )}
                      {m.horaires && (
                        <p className="has-text-grey mb-4" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 20 }}>🕒</span> 
                          <span style={{ fontWeight: 500 }}>{m.horaires}</span>
                        </p>
                      )}
                      {m.produits && (
                        <div className="notification is-primary is-light" style={{ 
                          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
                          border: '2px solid #bae6fd', 
                          borderRadius: 12,
                          boxShadow: '0 2px 8px rgba(18, 119, 198, 0.1)'
                        }}>
                          <p style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                            <span style={{ fontSize: 20, marginTop: 2 }}>🌾</span>
                            <span>
                              <strong style={{ color: '#1277c6' }}>Produits proposés :</strong>
                              <br />
                              {m.produits}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="column is-4">
                    <figure className="image market-image-container" style={{ 
                      aspectRatio: '4/3', 
                      overflow: 'hidden', 
                      background: '#ffffff', 
                      borderRadius: 12, 
                      border: '2px solid #e0e7ef',
                      boxShadow: '0 4px 12px rgba(18, 119, 198, 0.1)'
                    }}>
                      <img
                        src={m.image || "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=400&q=80"}
                        alt={m.titre}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: 12,
                          background: '#ffffff',
                          transition: 'transform 0.4s ease'
                        }}
                        className="market-img"
                      />
                    </figure>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
    
        </div>
      </section>

      {/* CSS pour les animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
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
          box-shadow: 0 12px 32px rgba(18, 119, 198, 0.25) !important;
        }

        .commerce-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 48px rgba(18, 119, 198, 0.3) !important;
          border-color: #1277c6 !important;
        }

        .commerce-card:hover .shine-effect {
          left: 100% !important;
        }

        .commerce-card:hover .commerce-img {
          transform: scale(1.08);
        }

        .commerce-card:hover .commerce-btn {
          background: linear-gradient(135deg, #1b9bd7, #1277c6) !important;
          box-shadow: 0 6px 20px rgba(18, 119, 198, 0.5) !important;
          transform: translateY(-2px);
        }

        .market-box:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 48px rgba(18, 119, 198, 0.3) !important;
          border-color: #ffd700 !important;
        }

        .market-box:hover .shine-effect-market {
          left: 100% !important;
        }

        .market-box:hover .market-img {
          transform: scale(1.1) rotate(2deg);
        }

        @media screen and (max-width: 768px) {
          .hero.is-medium .hero-body {
            padding: 2rem 1rem !important;
          }

          .title.is-1 {
            font-size: 1.75rem !important;
          }

          .title.is-2 {
            font-size: 1.5rem !important;
          }

          .title.is-3 {
            font-size: 1.25rem !important;
          }

          .subtitle.is-4 {
            font-size: 1rem !important;
          }

          .container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }

          .section {
            padding: 2rem 1rem !important;
          }

          .column {
            padding: 0.5rem !important;
          }

          .card-content {
            padding: 1rem !important;
          }

          .commerce-card:hover,
          .market-box:hover {
            transform: none !important;
          }

          .commerce-card:hover .commerce-img,
          .market-box:hover .market-img {
            transform: scale(1.05) !important;
          }

          .columns.is-multiline {
            margin: 0 !important;
          }

          .market-box .columns {
            flex-direction: column-reverse !important;
          }

          .market-box .column {
            width: 100% !important;
          }

          .notification {
            padding: 1rem !important;
          }

          .button {
            font-size: 0.875rem !important;
            padding: 0.5rem 1rem !important;
          }
        }

        @media screen and (max-width: 480px) {
          .title.is-1 {
            font-size: 1.5rem !important;
          }

          .hero.is-medium .hero-body {
            padding: 1.5rem 0.75rem !important;
          }

          .section {
            padding: 1.5rem 0.75rem !important;
          }

          .box {
            padding: 1rem !important;
            margin-top: 2rem !important;
          }

          .card-content {
            padding: 0.75rem !important;
          }

          p[style*="gap: 10"] {
            font-size: 0.875rem !important;
          }
        }
      `}</style>
    </>
  );
}