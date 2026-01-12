import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ActualiteCarousel({ actualites }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [selectedActualite, setSelectedActualite] = useState(null);
  const [isImageEnlarged, setIsImageEnlarged] = useState(false); // Nouvel état pour l'agrandissement d'image
  
  // Responsive settings
  const getVisibleItemsCount = () => {
    const baseCount = windowWidth < 768 ? 1 : windowWidth < 1024 ? 2 : 3;
    return Math.min(baseCount, actualites.length);
  };
  
  const visibleItems = getVisibleItemsCount();
  const totalItems = actualites.length;
  const maxIndex = Math.max(0, totalItems - visibleItems);
  const needsNavigation = totalItems > visibleItems;
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      
      if (currentIndex > totalItems - getVisibleItemsCount()) {
        setCurrentIndex(Math.max(0, totalItems - getVisibleItemsCount()));
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex, totalItems]);
  
  useEffect(() => {
    if (!isPaused && needsNavigation && !isAnimating) {
      const timer = setTimeout(() => {
        nextSlide();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isPaused, needsNavigation, isAnimating]);

  const nextSlide = () => {
    if (isAnimating || !needsNavigation) return;
    setIsAnimating(true);
    
    setCurrentIndex((current) => {
      const next = current + 1;
      return next > maxIndex ? 0 : next;
    });
    
    setTimeout(() => setIsAnimating(false), 800);
  };
  
  const prevSlide = () => {
    if (isAnimating || !needsNavigation) return;
    setIsAnimating(true);
    
    setCurrentIndex((current) => {
      const prev = current - 1;
      return prev < 0 ? maxIndex : prev;
    });
    
    setTimeout(() => setIsAnimating(false), 800);
  };

  const goToSlide = (index) => {
    if (isAnimating || !needsNavigation) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const openModal = (actu) => {
    setSelectedActualite(actu);
    document.documentElement.classList.add('is-clipped');
  };

  const closeModal = () => {
    setSelectedActualite(null);
    setIsImageEnlarged(false); // Réinitialiser l'état d'agrandissement
    document.documentElement.classList.remove('is-clipped');
  };

  const toggleImageSize = () => {
    setIsImageEnlarged(!isImageEnlarged);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && selectedActualite) {
        closeModal();
      }
    };

    if (selectedActualite) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.documentElement.classList.remove('is-clipped');
    };
  }, [selectedActualite]);

  const renderCards = () => {
    const itemWidth = totalItems < visibleItems 
      ? 100 / totalItems 
      : 100 / visibleItems;
    
    const perspective = windowWidth < 768 ? 600 : 1200;
    
    return actualites.map((actu, index) => {
      const position = index - currentIndex;
      const isVisible = totalItems <= visibleItems 
        ? index < totalItems
        : position >= 0 && position < visibleItems;
      
      const isNext = position >= visibleItems && position < visibleItems + 1;
      const isPrev = position === -1;
      
      let rotateY = 0;
      let translateZ = 0;
      let opacity = 0;
      let scale = 0.7;
      
      if (isVisible) {
        opacity = 1;
        scale = 1;
        rotateY = 0;
        translateZ = 0;
      } else if (isPrev) {
        opacity = 0.6;
        rotateY = 25;
        translateZ = -120;
      } else if (isNext) {
        opacity = 0.6;
        rotateY = -25;
        translateZ = -120;
      }
      
      const leftPosition = totalItems <= visibleItems
        ? index * itemWidth
        : position * itemWidth;
      
      return (
        <div 
          key={index}
          className="carousel-card-wrapper"
          style={{ 
            position: 'absolute',
            left: `${leftPosition}%`,
            width: `${itemWidth}%`,
            height: '100%',
            padding: windowWidth < 768 ? '0.5rem' : '1rem',
            opacity: isVisible || isPrev || isNext ? opacity : 0,
            transform: `
              scale(${scale}) 
              translateZ(${translateZ}px) 
              rotateY(${rotateY}deg)
            `,
            transformOrigin: position < 0 ? 'right center' : 'left center',
            transition: 'all 0.8s cubic-bezier(0.33, 1, 0.68, 1)',
            zIndex: isVisible ? 2 : 1
          }}
        >
          <div className="card" style={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: isVisible ? '0 8px 32px rgba(18, 119, 198, 0.25)' : '0 4px 12px rgba(18, 119, 198, 0.1)',
              borderRadius: '16px',
              overflow: 'hidden',
              transition: 'transform 0.5s ease, box-shadow 0.5s ease',
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: isVisible ? '1px solid rgba(18, 119, 198, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
            }}>
            <div 
              className="card-image"
              style={{
                height: '55%',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
              }}
            >
              {actu.pdfUrl ? (
                // Afficher le PDF en object
                <div style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <object
                    data={`${actu.pdfUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                    type="application/pdf"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      pointerEvents: 'none'
                    }}
                    title={actu.title}
                  >
                    {/* Fallback si le PDF ne peut pas être affiché */}
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                      gap: '10px'
                    }}>
                      <i className="fas fa-file-pdf" style={{ fontSize: '48px', color: '#1277c6' }}></i>
                      <div style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}>Document PDF</div>
                    </div>
                  </object>
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    background: 'rgba(18, 119, 198, 0.95)',
                    color: 'white',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}>
                    <i className="fas fa-file-pdf"></i>
                    PDF
                  </div>
                </div>
              ) : (
                <img 
                  src={
                    actu.imgSrc 
                      ? (actu.imgSrc.startsWith('data:') || actu.imgSrc.startsWith('http') || actu.imgSrc.startsWith('/') 
                          ? actu.imgSrc 
                          : `/uploads/${actu.imgSrc}`)
                      : 'https://via.placeholder.com/400x300?text=Actualité'
                  }
                  alt={actu.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    console.log('Erreur chargement image actualité:', actu.imgSrc);
                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
                  }}
                />
              )}
            </div>
            <div className="card-content" style={{ 
              padding: windowWidth < 768 ? '1rem' : '1.5rem', 
              height: '45%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'linear-gradient(120deg, #ffffff 80%, #f8fafc 100%)',
              borderTop: '2px solid #eaf6ff'
            }}>
              <div>
                <p className="has-text-link has-text-weight-bold is-size-7 mb-2" style={{ 
                  color: '#1277c6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem'
                }}>
                  <span style={{ fontSize: '0.9rem' }}>📅</span>
                  {actu.date}
                </p>
                <h3 className={`title ${windowWidth < 768 ? 'is-6' : 'is-5'} mb-2`} style={{ 
                  height: windowWidth < 768 ? '2.4em' : '3em', 
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical',
                  color: '#0a2540',
                  fontFamily: 'Merriweather, serif',
                  fontWeight: 700,
                  lineHeight: 1.3
                }}>{actu.title}</h3>
                {actu.description && (
                  <p style={{
                    margin: '0.5rem 0 0 0',
                    fontSize: '0.875rem',
                    color: '#6c757d',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.4',
                    whiteSpace: 'pre-line'
                  }}>
                    {actu.description}
                  </p>
                )}
              </div>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  if (actu.pdfUrl) {
                    // Ouvrir le PDF dans un nouvel onglet
                    window.open(actu.pdfUrl, '_blank');
                  } else {
                    // Ouvrir la modal pour les actualités sans PDF
                    openModal(actu);
                  }
                }}
                className="" // Retiré les classes Bulma
                style={{ 
                  alignSelf: 'flex-start',
                  display: 'flex !important',
                  alignItems: 'center !important',
                  justifyContent: 'center !important',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #1277c6 0%, #0f5a94 100%)',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(18, 119, 198, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(18, 119, 198, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(18, 119, 198, 0.3)';
                }}
              >
                <i className={actu.pdfUrl ? "fas fa-file-pdf" : "fas fa-eye"} style={{ 
                  color: 'white !important'
                }}></i>
                <span style={{
                  color: 'white !important'
                }}>{actu.pdfUrl ? 'Ouvrir le PDF' : 'Lire la suite'}</span>
              </button>
            </div>
          </div>
        </div>
      );
    });
  };

  if (totalItems === 0) {
    return (
      <div className="notification is-info">
        Aucune actualité n'est disponible pour le moment.
      </div>
    );
  }

  // Composant Modal séparé pour le portal
  const Modal = () => {
    if (!selectedActualite) return null;

    return createPortal(
      <div 
        className="modal is-active modal-fade-in"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999999,
          backgroundColor: 'rgba(18, 119, 198, 0.15)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <div className="modal-background" onClick={closeModal}></div>
        <div 
          className="modal-card modal-slide-up" 
          style={{ 
            maxWidth: isImageEnlarged ? '98vw' : '90vw',
            width: isImageEnlarged ? '98vw' : '1000px',
            maxHeight: isImageEnlarged ? '98vh' : '90vh',
            height: isImageEnlarged ? '98vh' : 'auto',
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            margin: 'auto',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 25px 80px rgba(18, 119, 198, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Header - masqué en plein écran */}
          {!isImageEnlarged && (
            <header className="modal-card-head modal-header-slide" style={{
              background: 'linear-gradient(135deg, #1277c6 0%, #0f5a94 100%)',
              color: 'white',
              borderRadius: '20px 20px 0 0',
              padding: '25px 30px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Effet de brillance animé */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                animation: 'shine 3s infinite'
              }}></div>
              
              <p className="modal-card-title has-text-white" style={{
                fontSize: '1.6rem',
                fontWeight: 'bold',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                position: 'relative',
                zIndex: 1
              }}>
                {selectedActualite.title}
              </p>
              <button 
                className="delete is-large modal-close-hover" 
                aria-label="close"
                onClick={closeModal}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  zIndex: 1
                }}
              ></button>
            </header>
          )}
          
          <section className="modal-card-body" style={{ 
            padding: 0, 
            overflow: 'auto',
            height: isImageEnlarged ? '100%' : 'auto',
            background: isImageEnlarged ? '#f8f9fa' : 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
          }}>
            {/* Zone image */}
            <div 
              className={`image-container ${isImageEnlarged ? 'image-fullscreen' : 'image-normal'}`}
              style={{ 
                height: isImageEnlarged ? '100vh' : '55vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isImageEnlarged ? '#f8f9fa' : '#ffffff',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                overflow: 'hidden'
              }}
              onClick={toggleImageSize}
            >
              {/* Effet de zoom au survol */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at center, transparent 60%, rgba(18, 119, 198, 0.1) 100%)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none'
              }} className="hover-gradient"></div>

              <img 
                src={
                  selectedActualite.imgSrc 
                    ? (selectedActualite.imgSrc.startsWith('data:') || selectedActualite.imgSrc.startsWith('http') || selectedActualite.imgSrc.startsWith('/') 
                        ? selectedActualite.imgSrc 
                        : `/uploads/${selectedActualite.imgSrc}`)
                    : 'https://via.placeholder.com/800x600?text=Actualité'
                }
                alt={selectedActualite.title}
                className="modal-image"
                style={{
                  width: isImageEnlarged ? '95vw' : '90%',
                  height: isImageEnlarged ? '95vh' : '90%',
                  objectFit: 'contain',
                  transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  borderRadius: isImageEnlarged ? '0' : '12px',
                  boxShadow: isImageEnlarged ? 'none' : '0 10px 40px rgba(18, 119, 198, 0.2)'
                }}
                onError={(e) => {
                  console.log('Erreur chargement image modal actualité:', selectedActualite.imgSrc);
                  e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Image+non+disponible';
                }}
              />
              
              {/* Bouton fermer en plein écran - Position corrigée */}
              {isImageEnlarged && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeModal();
                  }}
                  className="fullscreen-close-btn"
                  style={{
                    position: 'absolute',
                    top: '30px',
                    right: '30px',
                    background: 'linear-gradient(135deg, rgba(18, 119, 198, 0.9) 0%, rgba(18, 119, 198, 0.8) 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    backdropFilter: 'blur(20px)',
                    zIndex: 1000002,
                    boxShadow: '0 8px 25px rgba(18, 119, 198, 0.4)'
                  }}
                >
                  ×
                </button>
              )}
              
              {/* Overlay avec indication - Position et texte corrigés */}
              {!isImageEnlarged && (
                <div 
                  className="expand-indicator"
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    background: 'linear-gradient(135deg, rgba(18, 119, 198, 0.95) 0%, rgba(18, 119, 198, 0.9) 100%)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '25px',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: 0.9,
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    backdropFilter: 'blur(15px)',
                    boxShadow: '0 4px 20px rgba(18, 119, 198, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    zIndex: 1000001
                  }}
                >
                  <i className="fas fa-expand-alt" style={{ fontSize: '16px' }}></i>
                  <span>Agrandir</span>
                </div>
              )}

              {/* Instructions en plein écran - Position corrigée */}
              {isImageEnlarged && (
                <div
                  style={{
                    position: 'absolute',
                    top: '30px',
                    left: '30px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '15px 20px',
                    borderRadius: '25px',
                    fontSize: '14px',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    zIndex: 1000001
                  }}
                >
                  <i className="fas fa-mouse-pointer" style={{ color: '#1277c6' }}></i>
                  <span>Cliquez pour réduire</span>
                </div>
              )}

              {/* Titre en overlay plein écran - Position en bas */}
              {isImageEnlarged && (
                <div
                  className="fullscreen-title"
                  style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, rgba(18, 119, 198, 0.95) 0%, rgba(18, 119, 198, 0.9) 100%)',
                    color: 'white',
                    padding: '20px 35px',
                    borderRadius: '25px',
                    maxWidth: '80vw',
                    textAlign: 'center',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 30px rgba(18, 119, 198, 0.4)',
                    zIndex: 1000001
                  }}
                >
                  <p style={{ 
                    margin: 0, 
                    fontSize: '18px', 
                    fontWeight: 'bold',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                  }}>
                    {selectedActualite.title}
                  </p>
                  <p style={{ 
                    margin: '8px 0 0 0', 
                    fontSize: '14px', 
                    opacity: 0.9,
                    fontWeight: '500'
                  }}>
                    📅 {selectedActualite.date}
                  </p>
                </div>
              )}
            </div>
            
            {/* Contenu textuel - masqué en plein écran */}
            {!isImageEnlarged && (
              <div className="content modal-content-slide" style={{ 
                padding: '35px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
              }}>
                <div className="date-badge" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginBottom: '25px',
                  padding: '15px 25px',
                  background: 'linear-gradient(135deg, rgba(18, 119, 198, 0.1) 0%, rgba(18, 119, 198, 0.08) 100%)',
                  borderRadius: '50px',
                  border: '2px solid rgba(18, 119, 198, 0.2)',
                  transition: 'all 0.3s ease'
                }}>
                  <span className="icon" style={{ marginRight: '12px' }}>
                    <i className="fas fa-calendar-alt" style={{ 
                      fontSize: '18px',
                      color: '#1277c6' // Couleur fixe
                    }}></i>
                  </span>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#1277c6' // Couleur fixe au lieu de la classe Bulma
                  }}>
                    {selectedActualite.date}
                  </p>
                </div>
                
                <div className="block description-content">
                  {selectedActualite.description ? (
                    <div>
                      <div 
                        className="is-size-5 has-text-justified" 
                        style={{
                          lineHeight: '1.8',
                          color: '#2c3e50',
                          fontWeight: '400'
                        }}
                        dangerouslySetInnerHTML={{ __html: selectedActualite.description }}
                      />
                    </div>
                  ) : (
                    <div className="notification" style={{
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                      border: '2px solid rgba(18, 119, 198, 0.1)',
                      borderRadius: '15px',
                      padding: '25px'
                    }}>
                      <p className="is-size-5 has-text-justified" style={{
                        lineHeight: '1.8',
                        color: '#2c3e50',
                        marginBottom: '15px'
                      }}>
                        📄 Aucune description disponible pour cette actualité.
                      </p>
                      <p style={{ 
                        color: '#6c757d',
                        lineHeight: '1.6'
                      }}>
                        Ajoutez une description depuis l'administration pour enrichir le contenu de cette actualité.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
          
          {/* Footer - masqué en plein écran */}
          {!isImageEnlarged && (
            <footer className="modal-card-foot modal-footer-slide" style={{
              background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
              borderTop: '2px solid rgba(18, 119, 198, 0.1)',
              justifyContent: 'space-between',
              padding: '25px 35px',
              borderRadius: '0 0 20px 20px'
            }}>
              <button 
                className="expand-btn" // Retiré les classes Bulma
                onClick={toggleImageSize}
                style={{
                  background: 'linear-gradient(135deg, #1277c6 0%, #0f5a94 100%)',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '0 30px',
                  height: '45px',
                  fontWeight: '500',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: '0 4px 15px rgba(18, 119, 198, 0.3)',
                  color: 'white !important',
                  display: 'flex !important',
                  alignItems: 'center !important',
                  justifyContent: 'center !important',
                  gap: '10px',
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-expand-arrows-alt" style={{ 
                  color: 'white',
                  marginRight: '8px'
                }}></i>
                <span style={{ 
                  color: 'white'
                }}>Voir en grand</span>
              </button>
              
              {selectedActualite.pdfUrl && (
                <a
                  href={selectedActualite.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  style={{
                    background: 'linear-gradient(135deg, #1277c6 0%, #0f5a94 100%)',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '0 30px',
                    height: '45px',
                    fontWeight: '500',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: '0 4px 15px rgba(18, 119, 198, 0.3)',
                    color: 'white !important',
                    display: 'flex !important',
                    alignItems: 'center !important',
                    justifyContent: 'center !important',
                    gap: '10px',
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}
                >
                  <i className="fas fa-file-pdf" style={{ 
                    color: 'white',
                    marginRight: '8px'
                  }}></i>
                  <span style={{ 
                    color: 'white'
                  }}>Télécharger le PDF</span>
                </a>
              )}
              
              <button 
                className="close-btn" // Retiré les classes Bulma
                onClick={closeModal}
                style={{
                  borderRadius: '50px',
                  padding: '0 30px',
                  height: '45px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  border: '2px solid rgba(18, 119, 198, 0.2)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  color: '#363636'
                }}
              >
                <i className="fas fa-times" style={{ 
                  marginRight: '8px'
                }}></i>
                <span>Fermer</span>
              </button>
            </footer>
          )}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <div 
        className="carousel-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(18, 119, 198, 0.1)',
          height: windowWidth < 768 ? '450px' : '500px',
          marginBottom: 0,
          perspective: windowWidth < 768 ? '600px' : '1200px',
          transformStyle: 'preserve-3d',
          background: 'transparent'
        }}
      >
        <div className="carousel-track" style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
          transformStyle: 'preserve-3d',
        }}>
          {renderCards()}
        </div>
        
        {needsNavigation && (
          <>
            <button 
              onClick={prevSlide} 
              className="button is-rounded carousel-nav prev"
              style={{
                position: 'absolute',
                top: '50%',
                left: windowWidth < 768 ? '5px' : '15px',
                transform: 'translateY(-50%)',
                background: 'linear-gradient(135deg, #1277c6 0%, #0f5a94 100%)',
                border: 'none',
                width: windowWidth < 768 ? '40px' : '50px',
                height: windowWidth < 768 ? '40px' : '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                padding: 0,
                boxShadow: '0 4px 15px rgba(18, 119, 198, 0.4)',
                transition: 'all 0.3s ease',
                color: 'white',
                borderRadius: '50%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.15)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(18, 119, 198, 0.5)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #0f5a94 0%, #1277c6 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(18, 119, 198, 0.4)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #1277c6 0%, #0f5a94 100%)';
              }}
              aria-label="Précédent"
            >
              <i className="fas fa-chevron-left" style={{ color: 'white', fontSize: '18px' }}></i>
            </button>
            <button 
              onClick={nextSlide} 
              className="button is-rounded carousel-nav next"
              style={{
                position: 'absolute',
                top: '50%',
                right: windowWidth < 768 ? '5px' : '15px',
                transform: 'translateY(-50%)',
                background: 'linear-gradient(135deg, #1277c6 0%, #0f5a94 100%)',
                border: 'none',
                width: windowWidth < 768 ? '40px' : '50px',
                height: windowWidth < 768 ? '40px' : '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                padding: 0,
                boxShadow: '0 4px 15px rgba(18, 119, 198, 0.4)',
                transition: 'all 0.3s ease',
                color: 'white',
                borderRadius: '50%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.15)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(18, 119, 198, 0.5)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #0f5a94 0%, #1277c6 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(18, 119, 198, 0.4)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #1277c6 0%, #0f5a94 100%)';
              }}
              aria-label="Suivant"
            >
              <i className="fas fa-chevron-right" style={{ color: 'white', fontSize: '18px' }}></i>
            </button>
          </>
        )}
        
        {windowWidth >= 768 && needsNavigation && (
          <div className="carousel-indicators" style={{
            position: 'absolute',
            bottom: '15px',
            left: '0',
            right: '0',
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            zIndex: 10,
          }}>
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                style={{
                  width: index === currentIndex ? '30px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: index === currentIndex ? '#1277c6' : 'rgba(255, 255, 255, 0.7)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  boxShadow: index === currentIndex ? 
                    '0 2px 5px rgba(18, 119, 198, 0.5)' : 
                    '0 1px 3px rgba(0,0,0,0.2)',
                  transform: index === currentIndex ? 'scale(1.05)' : 'scale(1)'
                }}
                aria-label={`Aller à l'actualité ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Modal montée dans le body via Portal */}
      <Modal />
      
      {/* CSS global pour s'assurer que la modal est au-dessus de tout */}
      <style jsx global>{`
        /* Animations d'entrée */
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(20px);
          }
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Classes d'animation */
        .modal-fade-in {
          animation: modalFadeIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .modal-slide-up {
          animation: modalSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .modal-header-slide {
          animation: slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .modal-content-slide {
          animation: slideInUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .modal-footer-slide {
          animation: slideInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .date-badge {
          animation: slideInLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .description-content {
          animation: slideInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Effets au survol */
        .image-container:hover .hover-gradient {
          opacity: 1 !important;
        }

        .image-container:hover .modal-image {
          transform: scale(1.02);
        }

        .expand-indicator:hover {
          transform: scale(1.1) translateY(-2px);
          box-shadow: 0 8px 30px rgba(18, 119, 198, 0.4);
        }

        .fullscreen-close-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 35px rgba(18, 119, 198, 0.5);
        }

        .fullscreen-title {
          animation: slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .expand-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(18, 119, 198, 0.4);
        }

        .close-btn:hover {
          transform: translateY(-2px);
          background: rgba(18, 119, 198, 0.1);
        }

        .date-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(18, 119, 198, 0.2);
        }

        /* Transitions d'image */
        .image-fullscreen {
          animation: pulse 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Force la modal à être au-dessus de tout */
        body > .modal.is-active {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          z-index: 999999 !important;
        }

        /* Empêcher le scroll */
        .is-clipped {
          overflow: hidden !important;
        }
      `}</style>
    </>
  );
}