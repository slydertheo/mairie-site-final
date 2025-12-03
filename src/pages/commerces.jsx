import React, { useEffect, useState, useRef } from 'react';
import 'bulma/css/bulma.min.css';
import Link from 'next/link';
import useHeroImage from '../hooks/useHeroImage';

// Hook personnalisé pour les animations au défilement - OPTIMISÉ
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
      threshold: options?.threshold || 0,
      rootMargin: options?.rootMargin || '0px 0px -100px 0px' // Déclenche 100px avant
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

// Composant d'animation - OPTIMISÉ
function AnimateOnScroll({ children, animation = "fade-up", delay = 0, duration = 600, threshold = 0, once = true }) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const adjustedThreshold = isMobile ? 0 : threshold;
  const [ref, isVisible] = useOnScreen({ 
    threshold: adjustedThreshold, 
    triggerOnce: once,
    rootMargin: '0px 0px -50px 0px' // Animations plus rapides
  });

  const animations = {
    "fade-up": {
      hidden: { opacity: 0, transform: 'translateY(20px)' }, // Réduit de 50px à 20px
      visible: { opacity: 1, transform: 'translateY(0)' }
    },
    "fade-left": {
      hidden: { opacity: 0, transform: 'translateX(20px)' },
      visible: { opacity: 1, transform: 'translateX(0)' }
    },
    "fade-right": {
      hidden: { opacity: 0, transform: 'translateX(-20px)' },
      visible: { opacity: 1, transform: 'translateX(0)' }
    },
    "zoom-in": {
      hidden: { opacity: 0, transform: 'scale(0.95)' }, // Réduit de 0.8 à 0.95
      visible: { opacity: 1, transform: 'scale(1)' }
    },
    "slide-up": {
      hidden: { opacity: 0, transform: 'translateY(30px)' },
      visible: { opacity: 1, transform: 'translateY(0)' }
    }
  };

  const selectedAnimation = animations[animation] || animations["fade-up"];
  
  return (
    <div
      ref={ref}
      style={{
        ...selectedAnimation[isVisible ? 'visible' : 'hidden'],
        transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`, // Courbe plus rapide
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

export default function Commerces() {
  const heroImage = useHeroImage();
  const [commerces, setCommerces] = useState([]);
  const [content, setContent] = useState({});
  const [marches, setMarches] = useState([]);
  const [selectedCommerce, setSelectedCommerce] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/commerces').then(res => res.json()),
      fetch('/api/pageContent?page=commerces').then(res => res.json()),
      fetch('/api/marches').then(res => res.json())
    ]).then(([commercesData, contentData, marchesData]) => {
      setCommerces(commercesData);
      const obj = {};
      contentData.forEach(d => { obj[d.section] = d.contenu || d.titre; });
      setContent(obj);
      setMarches(marchesData);
      setLoading(false);
    });
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

  // Fonction pour tronquer le texte
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const openModal = (commerce) => {
    setSelectedCommerce(commerce);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCommerce(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      {/* En-tête hero avec animation */}
      <section
        className="hero is-primary is-medium hero-animated"
        style={{
          backgroundImage: `linear-gradient(180deg,rgba(10,37,64,0.65),rgba(10,37,64,0.4)),url("${heroImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          borderRadius: '0 0 40px 40px',
          boxShadow: '0 10px 40px rgba(10,37,64,0.25)',
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
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'float 20s linear infinite',
          opacity: 0.4
        }}></div>

        <div className="hero-body" style={{ position: 'relative', zIndex: 1 }}>
          <div className="container has-text-centered">
            <h1 className="title is-1 has-text-weight-bold" style={{ 
              color: '#fff', 
              textShadow: '0 4px 24px rgba(10,37,64,0.6)', 
              letterSpacing: 1.2, 
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              marginBottom: 20,
              animation: 'fadeInUp 0.8s ease-out'
            }}>
              {content.hero_titre || <>🏪 Commerces & Artisans</>}
            </h1>
            <p className="subtitle is-4" style={{ 
              color: '#e0e7ef', 
              marginTop: 20,
              textShadow: '0 2px 8px rgba(10,37,64,0.4)',
              animation: 'fadeInUp 0.8s ease-out 0.2s both'
            }}>
              Découvrez nos commerces et artisans locaux
            </p>
            <div style={{
              width: 80,
              height: 4,
              background: 'linear-gradient(90deg, transparent, #ffd700, transparent)',
              margin: '20px auto',
              borderRadius: 2,
              animation: 'fadeInUp 0.8s ease-out 0.4s both'
            }}></div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section
        className="section"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f8fafc 100%)',
          minHeight: '100vh',
          marginTop: 0,
          paddingTop: 60,
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
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(18, 119, 198, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 90% 80%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }}></div>

        <div className="container" style={{ maxWidth: 1200, position: 'relative', zIndex: 1 }}>
          {/* Titre principal */}
          <AnimateOnScroll animation="fade-up" duration={500}>
            <h1 className="title is-2 mb-5" style={{ 
              textAlign: 'center', 
              letterSpacing: 0.5, 
              marginBottom: 40,
              background: 'linear-gradient(135deg, #1277c6 0%, #1b9bd7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 800,
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)'
            }}>
              {content.titre || "Commerces et artisans à Friesen"}
            </h1>
          </AnimateOnScroll>
          
          {/* Introduction */}
          <AnimateOnScroll animation="zoom-in" duration={500} delay={100}>
            <div className="content mb-6">
              <div className="notification animated-box" style={{ 
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)', 
                border: '2px solid #e0e7ef', 
                borderRadius: 20, 
                boxShadow: '0 8px 24px rgba(18, 119, 198, 0.12)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                  <div style={{ fontSize: 48, lineHeight: 1, flexShrink: 0 }}>🏪</div>
                  <div>
                    <p className="is-size-5 mb-3" style={{ 
                      fontWeight: 700,
                      color: '#1277c6',
                      margin: 0,
                      marginBottom: '0.75rem'
                    }}>
                      {content.intro_titre || "Soutenez nos commerces locaux !"}
                    </p>
                    <p style={{ color: '#4b5563', lineHeight: 1.8, margin: 0 }}>
                      {content.intro || "La commune de Friesen est fière de ses commerçants et artisans qui participent activement à la vie économique et sociale de notre village. Nous vous invitons à découvrir leurs produits et services de qualité, et à privilégier ces acteurs locaux pour vos achats du quotidien."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Liste des commerces par catégorie */}
          {['alimentaire', 'restauration', 'services', 'artisanat'].map((category, catIndex) => {
            const categoryCommerces = commerces.filter(c => c.categorie === category);
            if (categoryCommerces.length === 0) return null;

            return (
              <div key={category} className="mb-6" style={{ marginBottom: '4rem' }}>
                <AnimateOnScroll animation="fade-right" duration={500} delay={catIndex * 50}>
                  <h2 className="title is-3 has-text-primary mb-5" style={{ 
                    borderLeft: '5px solid #1277c6', 
                    paddingLeft: 20, 
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    fontSize: 'clamp(1.25rem, 3vw, 1.75rem)'
                  }}>
                    {formatCategory(category)}
                  </h2>
                </AnimateOnScroll>
                
                <div className="columns is-multiline" style={{ margin: '0 -0.75rem' }}>
                  {categoryCommerces.map((commerce, index) => (
                    <div key={commerce.id} className="column is-half-tablet is-one-third-desktop" style={{ padding: '0.75rem' }}>
                      <AnimateOnScroll animation="fade-up" duration={500} delay={index * 30}>
                        <div
                          className="card commerce-card"
                          style={{
                            borderRadius: 20,
                            border: '2px solid #e2e8f0',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(18, 119, 198, 0.08)',
                            height: '100%',
                            background: '#ffffff',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          {/* Effet de brillance */}
                          <div className="shine-effect" style={{
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                            transition: 'left 0.6s ease',
                            pointerEvents: 'none',
                            zIndex: 1
                          }}></div>

                          {/* Image */}
                          <div className="card-image" style={{ 
                            background: '#ffffff', // Changé de #f8fafc à #ffffff
                            borderBottom: '2px solid #e2e8f0',
                            overflow: 'hidden',
                            flexShrink: 0
                          }}>
                            <figure
                              className="image"
                              style={{
                                height: 220,
                                overflow: 'hidden',
                                background: '#ffffff', // Changé de #f8fafc à #ffffff
                                marginBottom: 0,
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <img
                                src={commerce.image || 'https://via.placeholder.com/400x300?text=Commerce'}
                                alt={commerce.nom}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain', // Changé de 'cover' à 'contain'
                                  padding: '1rem', // Ajout d'un padding
                                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                  background: '#ffffff'
                                }}
                                className="commerce-img"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Commerce';
                                }}
                              />
                              {/* Badge catégorie */}
                              <span
                                className="tag"
                                style={{
                                  position: 'absolute',
                                  top: 15,
                                  right: 15,
                                  zIndex: 2,
                                  fontSize: 11,
                                  letterSpacing: 0.5,
                                  fontWeight: 700,
                                  padding: '8px 14px',
                                  borderRadius: 20,
                                  boxShadow: '0 4px 12px rgba(18, 119, 198, 0.3)',
                                  background: 'linear-gradient(135deg, #1277c6 0%, #1b9bd7 100%)',
                                  color: '#ffffff',
                                  border: '2px solid rgba(255,255,255,0.3)'
                                }}
                              >
                                {formatCategory(commerce.categorie).split(' ')[0]}
                              </span>
                            </figure>
                          </div>
                          
                          {/* Contenu */}
                          <div className="card-content" style={{ 
                            background: '#ffffff', 
                            padding: '1.5rem',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            <h3 className="title is-5 has-text-link mb-3" style={{ 
                              fontWeight: 700,
                              minHeight: 56,
                              display: 'flex',
                              alignItems: 'center',
                              lineHeight: 1.3,
                              fontSize: '1.15rem'
                            }}>
                              {commerce.nom}
                            </h3>
                            
                            <p className="subtitle is-6 mb-4" style={{ 
                              color: '#64748b', 
                              lineHeight: 1.6,
                              minHeight: 48,
                              maxHeight: 48,
                              overflow: 'hidden',
                              fontSize: '0.95rem'
                            }}>
                              {truncateText(commerce.description, 85)}
                              {commerce.description && commerce.description.length > 85 && (
                                <button
                                  onClick={() => openModal(commerce)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#1277c6',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    padding: 0,
                                    marginLeft: 4,
                                    textDecoration: 'underline'
                                  }}
                                >
                                  Lire plus
                                </button>
                              )}
                            </p>
                            
                            <div className="content" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                              <div style={{ marginBottom: '1rem' }}>
                                {commerce.adresse && (
                                  <p className="has-text-grey mb-2" style={{ 
                                    display: 'flex', 
                                    alignItems: 'flex-start', 
                                    gap: 8,
                                    fontSize: '0.9rem'
                                  }}>
                                    <span style={{ fontSize: 16, marginTop: 2 }}>📍</span> 
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      {truncateText(commerce.adresse, 40)}
                                    </span>
                                  </p>
                                )}
                                {commerce.telephone && (
                                  <p className="has-text-grey mb-2" style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 8,
                                    fontSize: '0.9rem'
                                  }}>
                                    <span style={{ fontSize: 16 }}>📞</span> 
                                    <a href={`tel:${commerce.telephone}`} style={{ color: '#1277c6', fontWeight: 500 }}>
                                      {commerce.telephone}
                                    </a>
                                  </p>
                                )}
                                {commerce.horaires && (
                                  <p className="has-text-grey mb-2" style={{ 
                                    display: 'flex', 
                                    alignItems: 'flex-start', 
                                    gap: 8,
                                    fontSize: '0.9rem'
                                  }}>
                                    <span style={{ fontSize: 16, marginTop: 2 }}>🕒</span> 
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {truncateText(commerce.horaires, 30)}
                                    </span>
                                  </p>
                                )}
                              </div>
                              
                              <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                                {commerce.site ? (
                                  <a
                                    href={commerce.site}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="button is-fullwidth commerce-btn"
                                    style={{
                                      borderRadius: 12,
                                      fontWeight: 600,
                                      background: 'linear-gradient(135deg, #1277c6 0%, #1b9bd7 100%)',
                                      color: '#fff',
                                      border: 'none',
                                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                      boxShadow: '0 4px 12px rgba(18, 119, 198, 0.3)',
                                      padding: '0.75rem'
                                    }}
                                  >
                                    <span style={{ marginRight: 8 }}>🌐</span> Visiter le site
                                  </a>
                                ) : (
                                  <button
                                    onClick={() => openModal(commerce)}
                                    className="button is-fullwidth"
                                    style={{
                                      borderRadius: 12,
                                      fontWeight: 600,
                                      background: '#ffffff',
                                      color: '#1277c6',
                                      border: '2px solid #1277c6',
                                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                      padding: '0.75rem'
                                    }}
                                  >
                                    <span style={{ marginRight: 8 }}>ℹ️</span> Plus d'infos
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </AnimateOnScroll>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Section pour les marchés */}
          {marches.length > 0 && (
            <div style={{ marginTop: '5rem' }}>
              <AnimateOnScroll animation="fade-up" duration={500}>
                <h2 className="title is-2 has-text-centered mb-5" style={{
                  color: '#1e293b',
                  fontWeight: 800,
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  marginBottom: '3rem'
                }}>
                  <span style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginRight: 12 }}>🛒</span>
                  Marchés locaux
                </h2>
              </AnimateOnScroll>

              {marches.map((m, index) => (
                <AnimateOnScroll key={m.id} animation="zoom-in" duration={500} delay={index * 100}>
                  <div
                    className="box market-box"
                    style={{
                      borderRadius: 20,
                      border: '2px solid #e2e8f0',
                      boxShadow: '0 4px 20px rgba(18, 119, 198, 0.08)',
                      background: 'linear-gradient(135deg, #ffffff 0%, #fffef8 100%)',
                      marginTop: index > 0 ? 40 : 0,
                      marginBottom: 40,
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
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                      transition: 'left 0.6s ease',
                      pointerEvents: 'none',
                      zIndex: 1
                    }}></div>

                    <div className="columns is-variable is-6" style={{ position: 'relative', zIndex: 2, margin: 0 }}>
                      <div className="column is-7" style={{ padding: '2rem' }}>
                        <h3 className="title is-3 has-text-primary mb-4" style={{ 
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          fontSize: 'clamp(1.5rem, 3.5vw, 2rem)'
                        }}>
                          <span style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)' }}>🛒</span>
                          {m.titre}
                        </h3>
                        <p className="subtitle is-5 mb-4" style={{ color: '#64748b', lineHeight: 1.8 }}>
                          {m.texte}
                        </p>
                        <div className="content">
                          <div style={{
                            background: '#f8fafc',
                            borderRadius: 12,
                            padding: '1.25rem',
                            marginBottom: '1rem',
                            border: '1px solid #e2e8f0'
                          }}>
                            {m.adresse && (
                              <p className="mb-3" style={{ 
                                display: 'flex', 
                                alignItems: 'flex-start', 
                                gap: 10,
                                paddingBottom: '0.75rem',
                                borderBottom: '1px solid #e2e8f0'
                              }}>
                                <span style={{ fontSize: 20, marginTop: 2 }}>📍</span> 
                                <span style={{ fontWeight: 500, color: '#1e293b' }}>{m.adresse}</span>
                              </p>
                            )}
                            {m.jour && (
                              <p className="mb-3" style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 10,
                                paddingBottom: '0.75rem',
                                borderBottom: '1px solid #e2e8f0'
                              }}>
                                <span style={{ fontSize: 20 }}>🗓️</span> 
                                <span style={{ fontWeight: 500, color: '#1e293b' }}>{m.jour}</span>
                              </p>
                            )}
                            {m.horaires && (
                              <p className="mb-0" style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 10
                              }}>
                                <span style={{ fontSize: 20 }}>🕒</span> 
                                <span style={{ fontWeight: 500, color: '#1e293b' }}>{m.horaires}</span>
                              </p>
                            )}
                          </div>
                          
                          {m.produits && (
                            <div className="notification" style={{ 
                              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', 
                              border: '2px solid #a7f3d0', 
                              borderRadius: 12,
                              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)',
                              padding: '1.25rem'
                            }}>
                              <p style={{ 
                                display: 'flex', 
                                alignItems: 'flex-start', 
                                gap: 10,
                                margin: 0
                              }}>
                                <span style={{ fontSize: 24, marginTop: 2 }}>🌾</span>
                                <span>
                                  <strong style={{ color: '#047857', display: 'block', marginBottom: 8 }}>
                                    Produits proposés
                                  </strong>
                                  <span style={{ color: '#065f46', lineHeight: 1.6 }}>
                                    {m.produits}
                                  </span>
                                </span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="column is-5" style={{ padding: '2rem' }}>
                        <figure className="image market-image-container" style={{ 
                          aspectRatio: '4/3', 
                          overflow: 'hidden', 
                          background: '#ffffff', // Changé de #f8fafc à #ffffff
                          borderRadius: 16, 
                          border: '2px solid #e2e8f0',
                          boxShadow: '0 8px 24px rgba(18, 119, 198, 0.12)',
                          height: '100%',
                          minHeight: 300,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <img
                            src={m.image || "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80"}
                            alt={m.titre}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain', // Changé de 'cover' à 'contain'
                              padding: '1rem', // Ajout d'un padding
                              borderRadius: 16,
                              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                              background: '#ffffff'
                            }}
                            className="market-img"
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80";
                            }}
                          />
                        </figure>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal pour afficher les détails complets */}
      {showModal && selectedCommerce && (
        <div 
          className={`modal ${showModal ? 'is-active' : ''}`}
          onClick={closeModal}
          style={{ zIndex: 9999 }}
        >
          <div className="modal-background" style={{ backdropFilter: 'blur(4px)' }}></div>
          <div 
            className="modal-card" 
            style={{ 
              maxWidth: '90vw', 
              width: '700px',
              maxHeight: '90vh',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal-card-head" style={{ 
              background: 'linear-gradient(135deg, #1277c6 0%, #1b9bd7 100%)',
              color: 'white',
              borderBottom: 'none',
              padding: '1.5rem 2rem'
            }}>
              <p className="modal-card-title has-text-white" style={{
                fontWeight: 700,
                fontSize: '1.5rem'
              }}>
                {selectedCommerce.nom}
              </p>
              <button 
                className="delete is-large" 
                aria-label="close" 
                onClick={closeModal}
                style={{
                  background: 'rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)'
                }}
              ></button>
            </header>
            <section className="modal-card-body" style={{ padding: '2rem' }}>
              {selectedCommerce.image && (
                <figure className="image mb-4" style={{ 
                  borderRadius: 12,
                  overflow: 'hidden',
                  maxHeight: 300,
                  border: '2px solid #e2e8f0'
                }}>
                  <img 
                    src={selectedCommerce.image} 
                    alt={selectedCommerce.nom}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </figure>
              )}
              
              <div className="content">
                {selectedCommerce.description && (
                  <div className="mb-4" style={{
                    background: '#f8fafc',
                    padding: '1.25rem',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0'
                  }}>
                    <h4 className="has-text-weight-bold has-text-primary mb-2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 20 }}>📝</span> Description
                    </h4>
                    <p style={{ lineHeight: 1.7, color: '#4b5563', margin: 0 }}>{selectedCommerce.description}</p>
                  </div>
                )}
                
                <div style={{
                  background: '#f8fafc',
                  padding: '1.25rem',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0'
                }}>
                  {selectedCommerce.adresse && (
                    <p className="mb-3" style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ fontSize: 20, marginTop: 2 }}>📍</span>
                      <span><strong>Adresse :</strong> {selectedCommerce.adresse}</span>
                    </p>
                  )}
                  
                  {selectedCommerce.telephone && (
                    <p className="mb-3" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 20 }}>📞</span>
                      <span><strong>Téléphone :</strong> <a href={`tel:${selectedCommerce.telephone}`} style={{ color: '#1277c6', fontWeight: 500 }}>{selectedCommerce.telephone}</a></span>
                    </p>
                  )}
                  
                  {selectedCommerce.horaires && (
                    <p className="mb-0" style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ fontSize: 20, marginTop: 2 }}>🕒</span>
                      <span><strong>Horaires :</strong> {selectedCommerce.horaires}</span>
                    </p>
                  )}
                </div>
              </div>
            </section>
            <footer className="modal-card-foot" style={{
              justifyContent: 'space-between',
              background: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              padding: '1.5rem 2rem'
            }}>
              {selectedCommerce.site ? (
                <a 
                  href={selectedCommerce.site} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button is-link"
                  style={{ 
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #1277c6, #1b9bd7)',
                    fontWeight: 600,
                    padding: '0.75rem 1.5rem'
                  }}
                >
                  <span style={{ marginRight: 8 }}>🌐</span> Visiter le site web
                </a>
              ) : (
                <div></div>
              )}
              <button 
                className="button is-light" 
                onClick={closeModal}
                style={{ 
                  borderRadius: 10,
                  fontWeight: 600,
                  padding: '0.75rem 1.5rem'
                }}
              >
                Fermer
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* CSS pour les animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-animated {
          animation: heroFadeIn 1s ease-out;
        }

        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: scale(1.02);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animated-box {
          transform-origin: center;
        }

        .animated-box:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 16px 40px rgba(18, 119, 198, 0.2) !important;
          border-color: #1277c6 !important;
        }

        .commerce-card {
          min-height: 580px;
        }

        .commerce-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(18, 119, 198, 0.25) !important;
          border-color: #1277c6 !important;
        }

        .commerce-card:hover .shine-effect {
          left: 100% !important;
        }

        .commerce-card:hover .commerce-img {
          transform: scale(1.05); /* Réduit de 1.1 à 1.05 */
        }

        .commerce-btn:hover {
          background: linear-gradient(135deg, #1b9bd7, #1277c6) !important;
          box-shadow: 0 8px 24px rgba(18, 119, 198, 0.4) !important;
          transform: translateY(-2px);
        }

        .market-box:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(18, 119, 198, 0.25) !important;
          border-color: #1277c6 !important;
        }

        .market-box:hover .shine-effect-market {
          left: 100% !important;
        }

        .market-box:hover .market-img {
          transform: scale(1.05); /* Réduit de 1.08 à 1.05 */
        }

        .modal.is-active {
          display: flex;
        }

        .modal-background {
          background-color: rgba(10, 10, 10, 0.75);
        }

        .modal-card {
          animation: modalSlideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes modalSlideDown {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media screen and (max-width: 1024px) {
          .commerce-card {
            min-height: auto !important;
          }

          .market-box .columns {
            flex-direction: column-reverse !important;
          }
        }

        @media screen and (max-width: 768px) {
          .hero.is-medium .hero-body {
            padding: 2.5rem 1rem !important;
          }

          .title.is-1 {
            font-size: 2rem !important;
          }

          .title.is-2 {
            font-size: 1.75rem !important;
          }

          .title.is-3 {
            font-size: 1.5rem !important;
          }

          .subtitle.is-4, .subtitle.is-5 {
            font-size: 1rem !important;
          }

          .section {
            padding: 2rem 1rem !important;
          }

          .column {
            padding: 0.5rem !important;
          }

          .card-content {
            padding: 1.25rem !important;
          }

          .commerce-card:hover,
          .market-box:hover {
            transform: translateY(-4px) !important;
          }

          .commerce-card:hover .commerce-img,
          .market-box:hover .market-img {
            transform: scale(1.05) !important;
          }

          .market-box .column {
            padding: 1.5rem !important;
          }

          .notification {
            padding: 1rem !important;
          }

          .button {
            font-size: 0.9rem !important;
          }

          .modal-card {
            width: 95vw !important;
            max-height: 90vh !important;
          }

          .modal-card-body {
            padding: 1.5rem !important;
          }

          .modal-card-head,
          .modal-card-foot {
            padding: 1.25rem !important;
          }
        }

        @media screen and (max-width: 480px) {
          .hero.is-medium .hero-body {
            padding: 2rem 0.75rem !important;
          }

          .section {
            padding: 1.5rem 0.75rem !important;
          }

          .box {
            padding: 1.25rem !important;
          }

          .card-content {
            padding: 1rem !important;
          }

          .title.is-1 {
            font-size: 1.75rem !important;
          }

          .animated-box > div {
            flex-direction: column !important;
            text-align: center !important;
          }

          .animated-box > div > div:first-child {
            margin-bottom: 1rem !important;
          }
        }

        /* Optimisation des performances */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        img {
          image-rendering: -webkit-optimize-contrast;
        }
      `}</style>
    </>
  );
}