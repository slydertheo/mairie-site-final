import React, { useState, useEffect } from 'react';

export default function ActualiteCarousel({ actualites }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
  // Responsive settings
  const getVisibleItemsCount = () => {
    if (windowWidth < 768) return 1; // Mobile
    if (windowWidth < 1024) return 2; // Tablet
    return 3; // Desktop
  };
  
  const visibleItems = getVisibleItemsCount();
  const totalItems = actualites.length;
  const maxIndex = Math.max(0, totalItems - visibleItems);
  
  // Window resize listener
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
  
  // Rotation automatique
  useEffect(() => {
    if (!isPaused && totalItems > visibleItems && !isAnimating) {
      const timer = setTimeout(() => {
        nextSlide();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isPaused, totalItems, visibleItems, isAnimating]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setCurrentIndex((current) => {
      const next = current + 1;
      return next > maxIndex ? 0 : next;
    });
    
    setTimeout(() => setIsAnimating(false), 800);
  };
  
  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setCurrentIndex((current) => {
      const prev = current - 1;
      return prev < 0 ? maxIndex : prev;
    });
    
    setTimeout(() => setIsAnimating(false), 800);
  };

  const goToSlide = (index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 800);
  };

  // Calculer toutes les cartes avec leur position pour l'animation 3D
  const renderCards = () => {
    const itemWidth = 100 / visibleItems;
    const perspective = windowWidth < 768 ? 600 : 1200;
    
    return actualites.map((actu, index) => {
      const position = index - currentIndex;
      const isVisible = position >= 0 && position < visibleItems;
      const isNext = position >= visibleItems && position < visibleItems + 1;
      const isPrev = position === -1;
      
      // Calculer la rotation et la position Z pour l'effet 3D
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
      
      return (
        <div 
          key={index}
          className="carousel-card-wrapper"
          style={{ 
            position: 'absolute',
            left: `${position * itemWidth}%`,
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
          <div 
            className="card" 
            style={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: isVisible ? '0 15px 35px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              overflow: 'hidden',
              transition: 'transform 0.5s ease, box-shadow 0.5s ease',
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
            }}
          >
            <div 
              className="card-image"
              style={{
                height: '55%',
                backgroundImage: `url(${actu.imgSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Overlay gradient effect */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(0deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 40%)',
                zIndex: 1
              }} />
            </div>
            <div className="card-content" style={{ 
              padding: windowWidth < 768 ? '0.75rem' : '1rem', 
              height: '45%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'
            }}>
              <div>
                <p className="has-text-link has-text-weight-bold is-size-7 mb-1">{actu.date}</p>
                <h3 className={`title ${windowWidth < 768 ? 'is-6' : 'is-5'} mb-2`} style={{ 
                  height: windowWidth < 768 ? '2.4em' : '3em', 
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical'
                }}>{actu.title}</h3>
              </div>
              <a 
                href="#" 
                className="button is-link is-small"
                style={{ 
                  alignSelf: 'flex-start',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(18, 119, 198, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Lire la suite
              </a>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div 
      className="carousel-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(18, 119, 198, 0.15)',
        height: windowWidth < 768 ? '450px' : '500px',
        marginBottom: '2rem',
        perspective: windowWidth < 768 ? '600px' : '1200px',
        transformStyle: 'preserve-3d',
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
      
      {/* Boutons de navigation avec effet 3D */}
      <button 
        onClick={prevSlide} 
        className="button is-rounded carousel-nav prev"
        style={{
          position: 'absolute',
          top: '50%',
          left: windowWidth < 768 ? '5px' : '10px',
          transform: 'translateY(-50%)',
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          width: windowWidth < 768 ? '36px' : '44px',
          height: windowWidth < 768 ? '36px' : '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          padding: 0,
          boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
        }}
        aria-label="Précédent"
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      <button 
        onClick={nextSlide} 
        className="button is-rounded carousel-nav next"
        style={{
          position: 'absolute',
          top: '50%',
          right: windowWidth < 768 ? '5px' : '10px',
          transform: 'translateY(-50%)',
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          width: windowWidth < 768 ? '36px' : '44px',
          height: windowWidth < 768 ? '36px' : '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          padding: 0,
          boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
        }}
        aria-label="Suivant"
      >
        <i className="fas fa-chevron-right"></i>
      </button>
      
      {/* Indicateurs avec animation 3D */}
      {windowWidth >= 768 && (
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
  );
}