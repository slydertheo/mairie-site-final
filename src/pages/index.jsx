import React, { useEffect, useState, useRef } from 'react';
// import 'bulma/css/bulma.min.css'; // Bulma est déjà importé globalement dans _app.tsx
import QuickBoxEcole from '../components/QuickBoxEcole';
import ActualiteCarousel from '../components/CarrouselPublic';
import useHeroImage from '../hooks/useHeroImage';

// Hook personnalisé pour les animations au défilement
function useOnScreen(options) {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
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
function AnimateOnScroll({ children, animation = "fade-up", delay = 0, duration = 800, threshold = 0.1, once = true }) {
  const [ref, isVisible] = useOnScreen({ threshold: threshold, triggerOnce: once });

  // Enhanced animations with Apple-like subtlety
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
    "bounce": {
      hidden: { opacity: 0, transform: 'translateY(50px)' },
      visible: { opacity: 1, transform: 'translateY(0)', transition: 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)' }
    },
    "slide-up": {  // New: Apple-style slide
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

export default function PageAcceuil() {
  const heroImage = useHeroImage();
  const [contact, setContact] = useState({ nom: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);
  const [content, setContent] = useState({});
  const [events, setEvents] = useState([]);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAllEventsModal, setShowAllEventsModal] = useState(false); // Nouvel état
  const [actualites, setActualites] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Ajout pour navigation
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Ajout pour navigation
  const [panneauItems, setPanneauItems] = useState([]); // Ajout
  const [selectedPanneauItem, setSelectedPanneauItem] = useState(null); // Ajout
  const [showPanneauDetailModal, setShowPanneauDetailModal] = useState(false); // Ajout
  const [elus, setElus] = useState([]); // Ajouter cet état
  const [showAllElus, setShowAllElus] = useState(false); // AJOUTER cet état

  useEffect(() => {
    fetch('/api/pageContent?page=accueil')
      .then(res => res.json())
      .then(pageContent => {
        const pageContentData = pageContent[0] || {};
        setContent(pageContentData);

        let agendaEvents = [];
        if (pageContentData.agendaItems_json) {
          try {
            const raw = typeof pageContentData.agendaItems_json === 'string'
              ? JSON.parse(pageContentData.agendaItems_json)
              : pageContentData.agendaItems_json;

            if (Array.isArray(raw)) {
              agendaEvents = raw.map((item, idx) => ({
                id: item.id || `event-${idx}`,
                // accepte "titre" ou "title"
                titre: (item.titre ?? item.title ?? '').toString(),
                date: (item.date ?? '').toString(),
                description: (item.description ?? '').toString(),
                image: (item.image ?? '').toString(),
                lieu: (item.lieu ?? '').toString(),
              }));
            } else {
              console.warn('agendaItems_json n’est pas un tableau:', raw);
            }
          } catch (e) {
            console.error('Failed to parse agendaItems_json:', e);
          }
        }

        // Fallback si pas de JSON valide
        if (agendaEvents.length === 0) {
          if (pageContentData.agenda1_title || pageContentData.agenda1_date) {
            agendaEvents.push({
              id: 'event-0',
              // ces champs sont nommés *_title côté contenu
              titre: pageContentData.agenda1_title || '',
              date: pageContentData.agenda1_date || '',
              description: pageContentData.agenda1_description || '',
              image: '',
              lieu: '',
            });
          }
          if (pageContentData.agenda2_title || pageContentData.agenda2_date) {
            agendaEvents.push({
              id: 'event-1',
              titre: pageContentData.agenda2_title || '',
              date: pageContentData.agenda2_date || '',
              description: pageContentData.agenda2_description || '',
              image: '',
              lieu: '',
            });
          }
        }

        setEvents(agendaEvents);

        // Charger panneauItems avec toutes les propriétés
        if (pageContentData.panneauItems_json) {
          try {
            const items = typeof pageContentData.panneauItems_json === 'string'
              ? JSON.parse(pageContentData.panneauItems_json)
              : pageContentData.panneauItems_json;
            
            // S'assurer que tous les champs sont présents
            const normalizedItems = (Array.isArray(items) ? items : []).map(item => ({
              id: item.id,
              titre: item.titre || '',
              description: item.description || '',
              image: item.image || '', // Important: s'assurer que l'image est bien récupérée
              date: item.date || '',
              lieu: item.lieu || '',
              categorie: item.categorie || 'arrete',
              dateDebut: item.dateDebut || '',
              dateFin: item.dateFin || '',
              dureeAffichage: item.dureeAffichage || 7
            }));
            
            setPanneauItems(normalizedItems);
            console.log('PanneauItems chargés:', normalizedItems); // Debug
          } catch (e) {
            console.error('Erreur parsing panneauItems_json:', e);
            setPanneauItems([]);
          }
        }

        // Charger les élus - AJOUTER APRÈS panneauItems
        if (pageContentData.elus_json) {
          try {
            const elusData = typeof pageContentData.elus_json === 'string'
              ? JSON.parse(pageContentData.elus_json)
              : pageContentData.elus_json;
            
            // Trier par nom de famille (ordre alphabétique)
            const elusSorted = Array.isArray(elusData) 
              ? elusData.sort((a, b) => {
                  const nomA = (a.nom || '').toLowerCase();
                  const nomB = (b.nom || '').toLowerCase();
                  return nomA.localeCompare(nomB, 'fr');
                })
              : [];
            
            setElus(elusSorted);
          } catch (e) {
            console.error('Erreur parsing elus_json:', e);
          }
        }


      })
      .catch(error => {
        console.error('Erreur lors du chargement des données:', error);
      });
  }, []);

  useEffect(() => {
    fetch('/api/actualites')
      .then(res => res.json())
      .then(setActualites);
  }, []);

  function handleContactChange(e) {
    setContact({ ...contact, [e.target.name]: e.target.value });
  }
  function handleContactSubmit(e) {
    e.preventDefault();
    setContactSent(true);
    setContact({ nom: '', email: '', message: '' });
  }

  const handleMonthChange = (direction) => { // Fonction pour changer de mois
    let newMonth = currentMonth + direction;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  // Définir les catégories
  const CATEGORIES = {
    'arrete': { label: "Arrêtés du Maire", icon: '📜', bg: "#fffbe6", border: "2px dashed #a97c50", color: "#a97c50", shadow: "#a97c5030" },
    'compte-rendu': { label: "Comptes rendus", icon: '📋', bg: "#eaf6ff", border: "2px solid #1277c6", color: "#1277c6", shadow: "#1277c630" },
    'mariage': { label: "Bancs mariages", icon: '💒', bg: "#f0f9ff", border: "2px solid #1b9bd7", color: "#1b9bd7", shadow: "#1b9bd730" },
    'convocation': { label: "Convocations CM+", icon: '📢', bg: "#fef3c7", border: "2px solid #eab308", color: "#eab308", shadow: "#eab30830" },
    'urbanisme': { label: "Urbanisme / Permis", icon: '🏗️', bg: "#e0ffe6", border: "2px dashed #22c55e", color: "#22c55e", shadow: "#22c55e30" },
    'eau': { label: "Analyses d'eau", icon: '💧', bg: "#e0f2fe", border: "2px solid #0ea5e9", color: "#0ea5e9", shadow: "#0ea5e930" },
    'divers': { label: "Divers", icon: '📌', bg: "#f3e8ff", border: "2px solid #a855f7", color: "#a855f7", shadow: "#a855f730" },
  };

  // AJOUTER cette fonction helper pour filtrer les élus
  const getElusToDisplay = () => {
    if (!elus || elus.length === 0) return [];
    
    // Filtrer les fonctions principales (Maire, Premier(ère) adjoint(e), Adjoint(e)s)
    const fonctionsPrincipales = elus.filter(elu => {
      const fonction = elu.fonction.toLowerCase();
      return fonction.includes('maire') || fonction.includes('adjoint'); // ✅ Ajout des adjoints
    });

    // Si on veut tout afficher ou s'il y a peu d'élus
    if (showAllElus || elus.length <= 6) {
      return elus;
    }

    // Sinon, afficher seulement les fonctions principales (Maire + Adjoints)
    return fonctionsPrincipales;
  };

  return (
    <div className="has-background-light" style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Bandeau image + titre avec animation avancée */}
      <section className="hero is-primary is-medium" style={{
        backgroundImage: `linear-gradient(180deg,rgba(10,37,64,0.55),rgba(10,37,64,0.25)),url("${heroImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        borderRadius: '0 0 32px 32px',
        boxShadow: '0 8px 32px #0a254030',
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Particules flottantes */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.4,
          background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 800 800\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'400\' cy=\'400\' fill=\'%23ffffff\' r=\'1\'/%3E%3Ccircle cx=\'200\' cy=\'300\' fill=\'%23ffffff\' r=\'1.2\'/%3E%3Ccircle cx=\'600\' cy=\'200\' fill=\'%23ffffff\' r=\'0.8\'/%3E%3Ccircle cx=\'100\' cy=\'500\' fill=\'%23ffffff\' r=\'1.1\'/%3E%3Ccircle cx=\'700\' cy=\'300\' fill=\'%23ffffff\' r=\'0.9\'/%3E%3Ccircle cx=\'300\' cy=\'600\' fill=\'%23ffffff\' r=\'1.2\'/%3E%3Ccircle cx=\'500\' cy=\'100\' fill=\'%23ffffff\' r=\'0.7\'/%3E%3C/svg%3E")',
          animation: 'floatEffect 60s linear infinite, fadeIn 2s ease-out'
        }}></div>
        <div className="hero-body">
          <div className="container has-text-centered">
            <AnimateOnScroll animation="slide-up" duration={1200}>
              <h1 className="title is-2 has-text-weight-bold" style={{
                color: '#fff',
                textShadow: '0 4px 24px #0a2540a0',
                letterSpacing: 1,
                background: 'linear-gradient(45deg, #fff, #ffd700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'Merriweather, serif',
                fontSize: 44,
                marginBottom: 8
              }}>
                {content.hero_titre || <>Bienvenue sur le site officiel de<br />la Mairie de <span style={{ color: '#ffd700', textShadow: '0 2px 8px rgb(255, 255, 255)' }}>Friesen</span></>}
              </h1>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 10px' }}>
        <AnimateOnScroll animation="fade-up">
          <h2 className="title is-4 has-text-primary mb-5" style={{
            fontFamily: 'Merriweather, serif',
            fontWeight: 800,
            letterSpacing: 1,
            color: '#1277c6'
          }}>{content.actualites_titre || "Dernières actualités"}</h2>
        </AnimateOnScroll>
        
        <AnimateOnScroll animation="zoom-in" threshold={0.2}>
          <ActualiteCarousel actualites={actualites} />
        </AnimateOnScroll>

        <div className="columns is-variable is-5" style={{ margin: '0 -0.75rem' }}>
          {/* Colonne 1 : Mot du Maire + Panneau d'affichage + Calendrier */}
          <div className="column is-two-thirds" style={{ padding: '0 0.75rem' }}>
            <AnimateOnScroll animation="fade-right" delay={100}>
              <h2 className="title is-5 has-text-primary mb-2 mt-5" style={{
                fontFamily: 'Merriweather, serif',
                fontWeight: 700,
                color: '#a97c50'
              }}>{content.motMaire_titre || "Mot du Maire"}</h2>
              <div className="box p-5" style={{
                background: 'linear-gradient(120deg, #f8fafc 80%, #eaf6ff 100%)',
                borderRadius: 16,
                marginBottom: 24,
                boxShadow: '0 6px 24px #1277c610'
              }}>
                <div className="columns is-vcentered">
                  {/* Colonne pour la photo */}
                  <div className="column is-narrow">
                    <figure className="image is-128x128" style={{ margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: '4px solid #a97c50', boxShadow: '0 2px 12px #a97c5022' }}>
                      <img
                        className="is-rounded"
                        src={content.motMaire_photo || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=200&q=80"}
                        alt="Maire"
                        style={{
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%'
                        }}
                        onError={e => { e.currentTarget.src = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=200&q=80"; }}
                      />
                    </figure>
                  </div>
                  {/* Colonne pour le texte */}
                  <div className="column">
                    <div className="has-text-link has-text-weight-bold mb-3" style={{
                      fontSize: '1.15rem',
                      fontFamily: 'Merriweather, serif'
                    }}>
                      {content.motMaire_accroche || "Chères habitantes, chers habitants"}
                    </div>
                    <div style={{
                      fontSize: 17,
                      color: '#444',
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.7',
                      fontFamily: 'Merriweather, serif'
                    }}>
                      {content.motMaire}
                    </div>
                    <div className="has-text-right mt-4">
                      <div className="has-text-weight-bold" style={{ color: '#a97c50', fontSize: 17 }}>{content.motMaire_nom || "Pierre Durand"}</div>
                      <div className="is-italic" style={{ fontSize: '0.95rem', color: '#888' }}>{content.motMaire_titre_signature || "Maire de Friesen"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
            
            {/* Panneau d'affichage - REMPLACER la section existante */}
            <AnimateOnScroll animation="fade-up" delay={200} threshold={0.5}>
              <div style={{
                position: 'relative',
                marginBottom: 36,
                marginTop: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                {/* Pieds du panneau */}
                <div style={{
                  position: 'absolute',
                  left: '14%',
                  bottom: -32,
                  width: 18,
                  height: 48,
                  background: 'linear-gradient(120deg, #bfa16b 60%, #8d6e3c 100%)',
                  borderRadius: 8,
                  boxShadow: '0 6px 16px #0002',
                  zIndex: 0
                }} />
                <div style={{
                  position: 'absolute',
                  right: '14%',
                  bottom: -32,
                  width: 18,
                  height: 48,
                  background: 'linear-gradient(120deg, #bfa16b 60%, #8d6e3c 100%)',
                  borderRadius: 8,
                  boxShadow: '0 6px 16px #0002',
                  zIndex: 0
                }} />
                
                {/* Panneau principal */}
                <div className="box panneau-village" style={{
                  background: 'repeating-linear-gradient(135deg, #f8fafc 0 40px, #e9e4d7 40px 80px), url("https://www.transparenttextures.com/patterns/wood-pattern.png")',
                  backgroundBlendMode: 'multiply',
                  borderRadius: 28,
                  marginBottom: 0,
                  padding: '40px 28px 32px 28px',
                  boxShadow: '0 16px 48px #bfa16b55, 0 4px 16px #0001, 0 1.5px 0 #bfa16b',
                  border: '4px solid #bfa16b',
                  borderTop: '12px solid #bfa16b',
                  borderBottom: '10px solid #bfa16b',
                  position: 'relative',
                  zIndex: 1,
                  minWidth: 340,
                  maxWidth: 950,
                  width: '100%',
                  transition: 'box-shadow 0.3s',
                  filter: 'drop-shadow(0 2px 8px #bfa16b33)'
                }}>
                  {/* Vis de fixation */}
                  <div style={{
                    position: 'absolute', top: 12, left: 28, width: 22, height: 22, background: 'radial-gradient(circle at 60% 40%, #e5d3a1 70%, #bfa16b 100%)', borderRadius: '50%',
                    border: '2.5px solid #bfa16b', boxShadow: '0 2px 6px #0002, 0 0 0 2px #fff8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <div style={{ width: 7, height: 7, background: '#bfa16b', borderRadius: '50%', opacity: 0.7 }} />
                  </div>
                  <div style={{
                    position: 'absolute', top: 12, right: 28, width: 22, height: 22, background: 'radial-gradient(circle at 60% 40%, #e5d3a1 70%, #bfa16b 100%)', borderRadius: '50%',
                    border: '2.5px solid #bfa16b', boxShadow: '0 2px 6px #0002, 0 0 0 2px #fff8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <div style={{ width: 7, height: 7, background: '#bfa16b', borderRadius: '50%', opacity: 0.7 }} />
                  </div>
                  
                  <h2 className="title is-4 has-text-primary mb-5" style={{
                    textAlign: 'center',
                    letterSpacing: 1,
                    fontWeight: 800,
                    textShadow: '0 2px 8px #fff, 0 1px 0 #bfa16b',
                    color: '#a97c50',
                    marginBottom: 32,
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                    fontFamily: 'serif'
                  }}>
                    🗂️ Panneau d'affichage du village
                  </h2>
                  
                  <div style={{
                    display: 'flex',
                    gap: 28,
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}>
                    {panneauItems
                      .filter(item => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const dateDebut = new Date(item.dateDebut);
                        const dateFin = new Date(item.dateFin);
                        dateDebut.setHours(0, 0, 0, 0);
                        dateFin.setHours(0, 0, 0, 0);
                        return dateDebut <= today && dateFin >= today;
                      })
                      .map((item, idx) => {
                        const cat = CATEGORIES[item.categorie] || CATEGORIES['arrete'];
                        
                        return (
                          <div
                            key={item.id}
                            className="affiche-card"
                            style={{
                              background: `linear-gradient(120deg, ${cat.bg} 80%, #f8fafc 100%), url("https://www.transparenttextures.com/patterns/paper-fibers.png")`,
                              border: cat.border,
                              borderRadius: 18,
                              boxShadow: `0 6px 24px ${cat.shadow}, 0 2px 8px #bfa16b22`,
                              padding: '26px 18px 18px 18px',
                              minWidth: 180,
                              maxWidth: 230,
                              fontWeight: 500,
                              color: cat.color,
                              fontSize: 15,
                              position: 'relative',
                              cursor: 'pointer',
                              textAlign: 'center',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              transition: 'all 0.25s cubic-bezier(.4,2,.3,1)',
                              backdropFilter: 'blur(2px)',
                              borderBottom: `5px solid ${cat.color}33`,
                              transform: `rotate(${(idx % 2 === 0 ? -1 : 1) * (2 + Math.random() * 1.5)}deg)`,
                              filter: 'drop-shadow(0 2px 4px #bfa16b22)'
                            }}
                            tabIndex={0}
                            onClick={() => {
                              setSelectedPanneauItem(item);
                              setShowPanneauDetailModal(true);
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px) scale(1.05) rotate(0deg)'}
                            onMouseLeave={e => e.currentTarget.style.transform = `rotate(${(idx % 2 === 0 ? -1 : 1) * (2 + Math.random() * 1.5)}deg) scale(1)`}
                          >
                            <span style={{
                              fontSize: 22,
                              position: 'absolute',
                              top: 10,
                              right: 14,
                              opacity: 0.7
                            }}>📌</span>
                            
                            {item.image && (
                              item.image.toLowerCase().endsWith('.pdf') ? (
                                // Miniature pour PDF
                                <div style={{
                                  width: 54,
                                  height: 54,
                                  margin: '0 auto 12px auto',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: 12,
                                  background: '#fff',
                                  boxShadow: `0 2px 8px ${cat.shadow}`,
                                  border: `1.5px solid ${cat.color}22`,
                                  fontSize: 32
                                }}>
                                  📄
                                </div>
                              ) : (
                                // Miniature image normale
                                <img
                                  src={item.image}
                                  alt={item.titre}
                                  style={{
                                    width: 54,
                                    height: 54,
                                    objectFit: 'cover',
                                    margin: '0 auto 12px auto',
                                    display: 'block',
                                    borderRadius: 12,
                                    background: '#fff',
                                    boxShadow: `0 2px 8px ${cat.shadow}`,
                                    border: `1.5px solid ${cat.color}22`
                                  }}
                                  onError={e => { e.currentTarget.src = "https://via.placeholder.com/54?text=Doc"; }}
                                />
                              )
                            )}
                            
                            <div style={{
                              fontWeight: 700,
                              fontSize: 16,
                              marginBottom: 6,
                              letterSpacing: 0.2,
                              fontFamily: 'serif'
                            }}>{cat.label}</div>
                            
                            <div style={{
                              fontWeight: 600,
                              fontSize: 14,
                              marginBottom: 8,
                              color: '#333'
                            }}>{item.titre}</div>
                            
                            <div style={{
                              marginTop: 4,
                              fontSize: 13,
                              color: cat.color,
                              fontWeight: 400,
                              opacity: 0.85,
                              background: '#fff',
                              borderRadius: 8,
                              padding: '2px 10px',
                              boxShadow: `0 1px 6px ${cat.shadow}`,
                              display: 'inline-block',
                              fontFamily: 'monospace'
                            }}>
                              {new Date(item.dateDebut).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        );
                      })}
                      
                      {panneauItems.filter(item => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const dateDebut = new Date(item.dateDebut);
                        const dateFin = new Date(item.dateFin);
                        dateDebut.setHours(0, 0, 0, 0);
                        dateFin.setHours(0, 0, 0, 0);
                        return dateDebut <= today && dateFin >= today;
                      }).length === 0 && (
                        <div className="has-text-centered" style={{ padding: '40px 20px', color: '#888' }}>
                          <span style={{ fontSize: 48, opacity: 0.3 }}>📋</span>
                          <p style={{ marginTop: 12, fontSize: 16 }}>Aucun document actuellement affiché</p>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Calendrier amélioré */}
            <AnimateOnScroll animation="fade-up" delay={550} threshold={0.2}>
              <h2 className="title is-5 has-text-primary mb-2 mt-5" style={{
                fontFamily: 'Merriweather, serif',
                fontWeight: 700,
                color: '#1277c6'
              }}>{content.calendrier_titre || "Calendrier"}</h2>
              <div className="box" style={{
                background: 'linear-gradient(120deg, #f8fafc 80%, #eaf6ff 100%)',
                marginBottom: 24,
                borderRadius: 14,
                boxShadow: '0 4px 16px #1277c610',
                overflow: 'hidden'
              }}>
                <Calendar
                  events={events}
                  onDayClick={evs => { setSelectedDayEvents(evs); setShowModal(true); }} 
                  currentMonth={currentMonth}
                  currentYear={currentYear}
                  onMonthChange={handleMonthChange}
                />
              </div>
            </AnimateOnScroll>
          </div>

          {/* Colonne 2 : Agenda + Infos pratiques + Contact + Liens utiles */}
          <div className="column is-one-third" style={{ padding: '0 0.75rem' }}>
            <AnimateOnScroll animation="fade-left" delay={150}>
              <h2 className="title is-5 has-text-primary mb-3" style={{
                fontFamily: 'Merriweather, serif',
                fontWeight: 700,
                color: '#1277c6'
              }}>{content.agenda_titre || "Agenda des événements"}</h2>
              <div className="mb-4">
                {events.length > 0 ? (
                  events.map((event, index) => (
                    <AgendaItem
                      key={event.id || index}
                      title={event.titre || event.title}
                      date={event.date}
                      image={event.image}
                      lieu={event.lieu}
                    />
                  ))
                ) : (
                  <p className="has-text-grey has-text-centered">Aucun événement à venir</p>
                )}
                <a
                  href="#"
                  className="is-link is-underlined ml-4"
                  style={{ fontWeight: 700, fontSize: 15, display: 'block', marginTop: '12px' }}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAllEventsModal(true);
                  }}
                >
                  {content.agenda_lien_label || "Voir tous les événements"}
                </a>
                {content.agenda_link && (
                  <a
                    href={content.agenda_link}
                    className="is-link is-underlined ml-3"
                    style={{ fontWeight: 500, fontSize: 14 }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                  </a>
                )}
              </div>
            </AnimateOnScroll>
            
            <AnimateOnScroll animation="fade-left" delay={250}>
              <h2 className="title is-5 has-text-primary mb-2" style={{
                fontFamily: 'Merriweather, serif',
                fontWeight: 700,
                color: '#1277c6'
              }}>{content.infos_titre || "Infos pratiques"}</h2>
              <div className="box" style={{
                background: 'linear-gradient(120deg, #f8fafc 80%, #eaf6ff 100%)',
                padding: '16px',
                borderRadius: 14,
                marginBottom: 24,
                boxShadow: '0 2px 8px #1277c610'
              }}>
                <div className="mb-3"><span style={infoIcon}>🕒</span>
                  <b>{content.horaires_titre || "Horaires d'ouverture"}</b><br />
                  {(content.horaires || "").split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
                </div>
                <div className="mb-3"><span style={infoIcon}>📍</span>
                  {(content.adresse || "").split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
                </div>
                <div className="mb-3"><span style={infoIcon}>📞</span>
                  {content.telephone}
                </div>
                <div className="mb-3"><span style={infoIcon}>✉️</span>
                  {content.email}
                </div>
              </div>
            </AnimateOnScroll>
            
            <AnimateOnScroll animation="fade-up" delay={450} threshold={0.2}>
              <h2 className="title is-5 has-text-primary mb-2 mt-5" style={{
                fontFamily: 'Merriweather, serif',
                fontWeight: 700,
                color: '#1277c6'
              }}>{content.contact_titre || "Contactez la mairie"}</h2>
              <div className="box" style={{
                background: 'linear-gradient(120deg, #f8fafc 80%, #eaf6ff 100%)',
                padding: '20px',
                borderRadius: 14,
                marginBottom: 24,
                boxShadow: '0 2px 8px #1277c610'
              }}>
                {/* En-tête avec icône */}
                <div className="has-text-centered mb-4">
                  <span style={{ fontSize: 42 }}>✉️</span>
                  <p className="has-text-grey mt-2" style={{ 
                    fontSize: 15,
                    lineHeight: 1.5
                  }}>
                    Nous sommes à votre écoute !<br />
                    Choisissez votre moyen de contact
                  </p>
                </div>

                {/* Boutons de contact */}
                <div className="buttons is-centered mb-4" style={{ gap: 12 }}>
                  <a
                    href={`mailto:${content.email || 'mairie@friesen.fr'}?subject=Contact depuis le site web`}
                    className="button is-link"
                    style={{
                      borderRadius: 10,
                      fontWeight: 600,
                      fontSize: 15,
                      padding: '10px 20px',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      boxShadow: '0 2px 8px #1277c620'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px #1277c640';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px #1277c620';
                    }}
                  >
                    <span style={{ fontSize: 18 }}>📧</span>
                    <span>Envoyer un email</span>
                  </a>

                  <a
                    href={`tel:${(content.telephone || '').replace(/\s/g, '')}`}
                    className="button is-info is-light"
                    style={{
                      borderRadius: 10,
                      fontWeight: 600,
                      fontSize: 15,
                      padding: '10px 20px',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      border: '2px solid #1b9bd7',
                      background: 'white'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#1b9bd7';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.color = '#1b9bd7';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <span style={{ fontSize: 18 }}>📞</span>
                    <span>Appeler</span>
                  </a>
                </div>

                {/* Informations de contact en cartes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Email */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 14px',
                    background: 'white',
                    borderRadius: 10,
                    border: '1px solid #e0e7ef',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 1px 4px #1277c610'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                  >
                    <span style={{ 
                      fontSize: 20,
                      width: 38,
                      height: 38,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #1277c6 0%, #1b9bd7 100%)',
                      borderRadius: '50%',
                      flexShrink: 0,
                      boxShadow: '0 2px 6px #1277c630'
                    }}>📧</span>
                    <div style={{ flex: 1 }}>
                      <div className="is-size-7 has-text-grey mb-1" style={{ fontWeight: 500 }}>
                        Email
                      </div>
                      <a 
                        href={`mailto:${content.email || 'mairie@friesen.fr'}`}
                        className="has-text-link has-text-weight-semibold"
                        style={{ fontSize: 14 }}
                      >
                        {content.email || 'mairie@friesen.fr'}
                      </a>
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 14px',
                    background: 'white',
                    borderRadius: 10,
                    border: '1px solid #e0e7ef',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 1px 4px #1277c610'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                  >
                    <span style={{ 
                      fontSize: 20,
                      width: 38,
                      height: 38,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #1277c6 0%, #1b9bd7 100%)',
                      borderRadius: '50%',
                      flexShrink: 0,
                      boxShadow: '0 2px 6px #1277c630'
                    }}>📞</span>
                    <div style={{ flex: 1 }}>
                      <div className="is-size-7 has-text-grey mb-1" style={{ fontWeight: 500 }}>
                        Téléphone
                      </div>
                      <a 
                        href={`tel:${(content.telephone || '').replace(/\s/g, '')}`}
                        className="has-text-link has-text-weight-semibold"
                        style={{ fontSize: 14 }}
                      >
                        {content.telephone || '03 XX XX XX XX'}
                      </a>
                    </div>
                  </div>

                  {/* Horaires */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 14px',
                    background: 'white',
                    borderRadius: 10,
                    border: '1px solid #e0e7ef',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 1px 4px #1277c610'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                  >
                    <span style={{ 
                      fontSize: 20,
                      width: 38,
                      height: 38,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #1277c6 0%, #1b9bd7 100%)',
                      borderRadius: '50%',
                      flexShrink: 0,
                      boxShadow: '0 2px 6px #1277c630'
                    }}>🕒</span>
                    <div style={{ flex: 1 }}>
                      <div className="is-size-7 has-text-grey mb-1" style={{ fontWeight: 500 }}>
                        Horaires d'ouverture
                      </div>
                      <div className="has-text-weight-semibold" style={{ fontSize: 13, lineHeight: 1.4, color: '#333' }}>
                        {(content.horaires || "Lundi-Vendredi : 9h-12h / 14h-17h").split('\n').map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message d'encouragement */}
                <div className="has-text-centered mt-4">
                  <p className="has-text-grey" style={{
                    fontSize: 13,
                    fontStyle: 'italic'
                  }}>
                    💬 Nous vous répondrons dans les plus brefs délais
                  </p>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Municipalité - SECTION CORRIGÉE */}
            <AnimateOnScroll animation="fade-up" delay={500} threshold={0.2}>
              <h2 className="title is-5 has-text-primary mb-2 mt-5" style={{
                fontFamily: 'Merriweather, serif',
                fontWeight: 700,
                color: '#a97c50'
              }}>La Municipalité</h2>
              <div className="box" style={{
                background: 'linear-gradient(120deg, #fffbe6 80%, #f8fafc 100%)',
                padding: '18px',
                borderRadius: 14,
                boxShadow: '0 2px 8px #a97c5010'
              }}>
                {elus.length === 0 ? (
                  <div className="notification is-light has-text-centered">
                    <p>Aucun élu à afficher pour le moment</p>
                  </div>
                ) : (
                  <>
                    {/* Élus principaux (Maire + Adjoints) */}
                    <div className="columns is-multiline is-mobile">
                      {elus
                        .filter(elu => {
                          const fonction = elu.fonction.toLowerCase();
                          return fonction.includes('maire') || fonction.includes('adjoint');
                        })
                        .sort((a, b) => {
                          // Ordre : Maire, Première adjointe, Premier adjoint, puis les autres adjoints
                          const fonctionA = a.fonction.toLowerCase();
                          const fonctionB = b.fonction.toLowerCase();
                          
                          if (fonctionA.includes('maire') && !fonctionA.includes('adjoint')) return -1;
                          if (fonctionB.includes('maire') && !fonctionB.includes('adjoint')) return 1;
                          
                          if (fonctionA.includes('première') || fonctionA.includes('premier')) return -1;
                          if (fonctionB.includes('première') || fonctionB.includes('premier')) return 1;
                          
                          return a.ordre - b.ordre;
                        })
                        .map((elu, idx) => {
                          const colors = ['#a97c50', '#1277c6', '#1b9bd7', '#22c55e', '#eab308', '#ef4444'];
                          const color = colors[idx % colors.length];
                          
                          return (
                            <div key={elu.id} className="column is-half-mobile is-one-third-tablet has-text-centered">
                              <figure className="image is-96x96" style={{
                                margin: '0 auto',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: `3px solid ${color}`,
                                boxShadow: `0 2px 8px ${color}22`,
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                                e.currentTarget.style.boxShadow = `0 4px 16px ${color}44`;
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                                e.currentTarget.style.boxShadow = `0 2px 8px ${color}22`;
                              }}
                              >
                                <img
                                  src={elu.photo || 'https://via.placeholder.com/96?text=Photo'}
                                  alt={`${elu.prenom} ${elu.nom}`}
                                  style={{
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: '100%'
                                  }}
                                  onError={e => {
                                    e.currentTarget.src = "https://via.placeholder.com/96?text=Elu";
                                  }}
                                />
                              </figure>
                              <div className="has-text-weight-bold mt-2" style={{ 
                                color,
                                fontSize: 16,
                                fontFamily: 'Merriweather, serif'
                              }}>
                                {elu.prenom} {elu.nom}
                              </div>
                              <div className="is-size-7 has-text-grey" style={{ fontStyle: 'italic' }}>
                                {elu.fonction}
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {/* Bouton "Voir tous les élus" si plus de élus que juste maire + adjoints */}
                    {elus.filter(elu => {
                      const fonction = elu.fonction.toLowerCase();
                      return !fonction.includes('maire') && !fonction.includes('adjoint');
                    }).length > 0 && (
                      <div className="has-text-centered mt-4">
                        <button 
                          className="button is-medium"
                          onClick={() => setShowAllElus(true)}
                          style={{
                            borderRadius: 12,
                            fontWeight: 600,
                            fontSize: 16,
                            padding: '12px 32px',
                            border: '2px solid #a97c50',
                            color: '#a97c50',
                            background: 'transparent',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 8px #a97c5020',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            margin: '0 auto'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = '#a97c50';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px #a97c5040';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#a97c50';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px #a97c5020';
                          }}
                        >
                          <span style={{ fontSize: 20 }}>👥</span>
                          <span>Voir tous les élus ({elus.length})</span>
                        </button>
                      </div>
                    )}

                    {/* Lien vers la page municipalité */}
                    <div className="has-text-centered mt-3">
                      <a href="/municipalite" className="is-link" style={{ 
                        fontWeight: 600, 
                        fontSize: 15,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 16px',
                        borderRadius: 8,
                        background: '#a97c5010',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#a97c5020';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = '#a97c5010';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                      >
                        En savoir plus sur la municipalité
                        <span style={{ fontSize: 12 }}>→</span>
                      </a>
                    </div>
                  </>
                )}
              </div>
            </AnimateOnScroll>
          </div>
        </div>

        {/* Widgets améliorés */}
        <div className="columns mt-6 mb-0">
          <div className="column is-3">
            <AnimateOnScroll animation="zoom-in" delay={200} threshold={0.2}>
              <div className="box has-text-centered" style={{
                background: 'linear-gradient(120deg, #eaf6ff 80%, #f8fafc 100%)',
                padding: '24px',
                borderRadius: 14,
                boxShadow: '0 2px 8px #1277c610'
              }}>
                <span style={{ fontSize: 40 }}>🌤️</span>
                <div className="has-text-link has-text-weight-bold mt-2" style={{ fontSize: 18 }}>{content.meteo}</div>
                <div style={{ fontSize: 15 }}>{content.meteo_legende}</div>
              </div>
            </AnimateOnScroll>
          </div>
          <div className="column is-3">
            <AnimateOnScroll animation="zoom-in" delay={300} threshold={0.2}>
              <div className="box has-text-centered" style={{
                background: 'linear-gradient(120deg, #f8fafc 80%, #eaf6ff 100%)',
                padding: '24px',
                borderRadius: 14,
                boxShadow: '0 2px 8px #1277c610'
              }}>
                <div className="has-text-link has-text-weight-bold mb-2" style={{ fontSize: 18 }}>{content.reseaux_titre || "Suivez-nous"}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  {content.facebook && (
                    <a href={content.facebook} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-block', transition: 'transform 0.3s' }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.25) rotate(5deg)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0)'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#3b5998">
                        <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                      </svg>
                    </a>
                  )}
                  {content.intramuros && (
                    <a href={content.intramuros} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-block', transition: 'transform 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#1B9BD7',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: 'white'
                      }}>
                        IM
                      </div>
                    </a>
                  )}
                </div>
                {content.intramuros && (
                  <div className="mt-2" style={{ fontSize: '12px', color: '#666' }}>
                    Application IntraMuros disponible
                  </div>
                )}
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll animation="zoom-in" delay={400} threshold={0.2}>
              <div className="box mt-4" style={{
                background: 'linear-gradient(120deg, #fffbe6 80%, #f8fafc 100%)',
                padding: '24px',
                borderRadius: 14,
                boxShadow: '0 2px 8px #a97c5010'
              }}>
                <div className="has-text-danger has-text-weight-bold mb-1" style={{ fontSize: 18 }}>{content.urgences_titre || "Urgences"}</div>
                <div style={{ fontSize: 15 }}>
                  🚒 Pompiers : <b>{content.urgence_pompiers}</b><br />
                  🚓 Police : <b>{content.urgence_police}</b><br />
                  🚑 SAMU : <b>{content.urgence_samu}</b>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
          <div className="column is-3">
            <AnimateOnScroll animation="zoom-in" delay={500} threshold={0.2}>
              <div className="box has-text-centered" style={{
                background: 'linear-gradient(120deg, #f0f9ff 80%, #f8fafc 100%)',
                padding: '24px',
                borderRadius: 14,
                boxShadow: '0 2px 8px #1b9bd710'
              }}>
                <span style={{ fontSize: 40 }}>📰</span>
                <div className="has-text-link has-text-weight-bold mt-2" style={{ fontSize: 18 }}>Actualités</div>
                <div style={{ fontSize: 15 }}>Consultez les dernières nouvelles</div>
                <a href="#" className="button is-small is-link mt-3">Voir plus</a>
              </div>
            </AnimateOnScroll>
          </div>
          <div className="column is-3">
            <AnimateOnScroll animation="zoom-in" delay={600} threshold={0.2}>
              <div className="box has-text-centered" style={{
                background: 'linear-gradient(120deg, #fef3c7 80%, #f8fafc 100%)',
                padding: '24px',
                borderRadius: 14,
                boxShadow: '0 2px 8px #eab30810'
              }}>
                <span style={{ fontSize: 40 }}>🏛️</span>
                <div className="has-text-link has-text-weight-bold mt-2" style={{ fontSize: 18 }}>Services</div>
                <div style={{ fontSize: 15 }}>Accès aux démarches administratives</div>
                <a href="#" className="button is-small is-link mt-3">Accéder</a>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </div>

      {/* Animation CSS globale */}
      <style jsx global>{`
        @keyframes floatEffect {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes ripple {
          to { transform: scale(4); opacity: 0; }
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .highlight-on-scroll {
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .highlight-on-scroll:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 10px 20px rgba(18, 119, 198, 0.2);
        }
        
        /* Apple-like smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Enhanced shadows for depth */
        .box {
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          transition: box-shadow 0.3s ease;
        }
        
        .box:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }

        /* Fix pour mobile - empêcher le débordement horizontal */
        @media screen and (max-width: 768px) {
          body {
            overflow-x: hidden;
          }
          
          .container {
            padding-left: 10px !important;
            padding-right: 10px !important;
            max-width: 100% !important;
          }
          
          .columns {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          
          .column {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
          }
        }
      `}</style>
      
      {/* Modal existant */}
      {showModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowModal(false)}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Événements du jour</p>
              <button className="delete" aria-label="close" onClick={() => setShowModal(false)}></button>
            </header>
            <section className="modal-card-body">
              {selectedDayEvents.map(ev => (
                <div key={ev.id} className="box mb-3">
                  <div className="has-text-weight-bold">{ev.titre}</div>
                  <div className="is-size-7 has-text-link">{ev.date}</div>
                  {ev.lieu && <div className="is-size-7">📍 {ev.lieu}</div>}
                  {ev.description && <div className="mt-2">{ev.description}</div>}
                </div>
              ))}
            </section>
          </div>
        </div>
      )}

      {/* Ajouter le nouveau modal pour tous les événements */}
      {showAllEventsModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowAllEventsModal(false)}></div>
          <div className="modal-card" style={{ maxWidth: "800px", width: "90%" }}>
            <header className="modal-card-head">
              <p className="modal-card-title">Tous les événements</p>
              <button 
                className="delete" 
                aria-label="close" 
                onClick={() => setShowAllEventsModal(false)}
              ></button>
            </header>
            <section className="modal-card-body">
              {events.length > 0 ? (
                <div className="events-grid">
                  {events.map(ev => (
                    <div key={ev.id} className="box mb-3">
                      <div className="columns is-mobile">
                        <div className="column is-narrow">
                          <figure className="image is-64x64">
                            <img 
                              src={ev.image || "https://via.placeholder.com/128?text=Event"} 
                              alt={ev.titre} 
                              style={{ objectFit: 'cover', borderRadius: 8 }} 
                              onError={e => { e.currentTarget.src = "https://via.placeholder.com/128?text=Event"; }} 
                            />
                          </figure>
                        </div>
                        <div className="column">
                          <div className="has-text-weight-bold is-size-5">{ev.titre}</div>
                          <div className="is-size-6 has-text-link mb-1">{ev.date}</div>
                          {ev.lieu && <div className="is-size-7 mb-1">📍 {ev.lieu}</div>}
                          {ev.description && <div className="mt-2 is-size-7">{ev.description}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="notification is-info is-light">
                  Aucun événement n'est programmé pour le moment.
                </div>
              )}
            </section>
            <footer className="modal-card-foot" style={{ justifyContent: 'flex-end' }}>
              <button 
                className="button" 
                onClick={() => setShowAllEventsModal(false)}
              >
                Fermer
              </button>
              {content.agenda_link && (
                <a 
                  href={content.agenda_link} 
                  className="button is-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Voir sur le site externe</span>
                </a>
              )}
            </footer>
          </div>
        </div>
      )}

      {/* Modal détail panneau d'affichage - CORRIGER selectedPanneauDetailModal en selectedPanneauItem */}
      {showPanneauDetailModal && selectedPanneauItem && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowPanneauDetailModal(false)}></div>
          <div className="modal-card" style={{ maxWidth: "700px", width: "90%" }}>
            <header className="modal-card-head" style={{ 
              background: CATEGORIES[selectedPanneauItem.categorie]?.bg || '#fffbe6',
              borderBottom: `3px solid ${CATEGORIES[selectedPanneauItem.categorie]?.color || '#a97c50'}`
            }}>
              <p className="modal-card-title" style={{ 
                color: CATEGORIES[selectedPanneauItem.categorie]?.color || '#a97c50',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                <span style={{ fontSize: 24 }}>
                  {CATEGORIES[selectedPanneauItem.categorie]?.icon || '📄'}
                </span>
                {CATEGORIES[selectedPanneauItem.categorie]?.label || 'Document'}
              </p>
              <button 
                className="delete" 
                aria-label="close" 
                onClick={() => setShowPanneauDetailModal(false)}
              ></button>
            </header>
            
            <section className="modal-card-body">
              {/* IMAGE OU PDF EN GRAND */}
              {selectedPanneauItem.image && selectedPanneauItem.image.trim() !== '' ? (
                selectedPanneauItem.image.toLowerCase().endsWith('.pdf') ? (
                  // Affichage PDF avec iframe
                  <div className="mb-4">
                    <iframe
                      src={selectedPanneauItem.image}
                      style={{
                        width: '100%',
                        height: '600px',
                        border: `3px solid ${CATEGORIES[selectedPanneauItem.categorie]?.color}44`,
                        borderRadius: 12,
                        boxShadow: `0 4px 16px ${CATEGORIES[selectedPanneauItem.categorie]?.shadow}`
                      }}
                      title={selectedPanneauItem.titre}
                    />
                  </div>
                ) : (
                  // Affichage image normal
                  <figure className="image mb-4" style={{ 
                    maxHeight: '500px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#f8fafc',
                    borderRadius: 12,
                    padding: 20,
                    border: `3px solid ${CATEGORIES[selectedPanneauItem.categorie]?.color}44`,
                    boxShadow: `0 4px 16px ${CATEGORIES[selectedPanneauItem.categorie]?.shadow}`
                  }}>
                    <img 
                      src={selectedPanneauItem.image} 
                      alt={selectedPanneauItem.titre}
                      style={{ 
                        maxHeight: '460px',
                        maxWidth: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        borderRadius: 8,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                        cursor: 'pointer'
                      }}
                      onClick={() => window.open(selectedPanneauItem.image, '_blank')}
                      onError={e => { 
                        console.error('Erreur chargement image:', selectedPanneauItem.image);
                        e.currentTarget.src = "https://via.placeholder.com/400x300?text=Document+non+disponible"; 
                      }}
                    />
                  </figure>
                )
              ) : (
                <div className="notification is-light" style={{ 
                  textAlign: 'center',
                  padding: '40px',
                  background: '#f8fafc',
                  borderRadius: 12,
                  border: '2px dashed #ddd'
                }}>
                  <span style={{ fontSize: 48, opacity: 0.3 }}>📄</span>
                  <p style={{ marginTop: 12, color: '#888' }}>Aucune image associée à ce document</p>
                </div>
              )}
              
              <div className="content">
                <h3 className="title is-4 mb-3" style={{ 
                  color: CATEGORIES[selectedPanneauItem.categorie]?.color || '#a97c50'
                }}>
                  {selectedPanneauItem.titre}
                </h3>
                
                <div className="mb-4" style={{ 
                  display: 'flex', 
                  gap: 20, 
                  flexWrap: 'wrap',
                  padding: '12px',
                  background: '#f8fafc',
                  borderRadius: 8
                }}>
                  <div>
                    <strong style={{ color: '#666' }}>📅 Date de publication :</strong>
                    <br />
                    <span style={{ fontSize: 15 }}>
                      {new Date(selectedPanneauItem.dateDebut).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  {selectedPanneauItem.date && (
                    <div>
                      <strong style={{ color: '#666' }}>📆 Date du document :</strong>
                      <br />
                      <span style={{ fontSize: 15 }}>
                        {new Date(selectedPanneauItem.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                  
                  {selectedPanneauItem.lieu && (
                    <div>
                      <strong style={{ color: '#666' }}>📍 Lieu :</strong>
                      <br />
                      <span style={{ fontSize: 15 }}>{selectedPanneauItem.lieu}</span>
                    </div>
                  )}
                </div>
                
                {selectedPanneauItem.description && (
                  <div style={{ 
                    padding: '16px',
                    background: '#fff',
                    border: `1px solid ${CATEGORIES[selectedPanneauItem.categorie]?.color}22`,
                    borderRadius: 8,
                    lineHeight: '1.8',
                    fontSize: 16
                  }}>
                    <strong style={{ 
                      display: 'block', 
                      marginBottom: 12,
                      color: CATEGORIES[selectedPanneauItem.categorie]?.color || '#a97c50'
                    }}>
                      Description :
                    </strong>
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                      {selectedPanneauItem.description}
                    </div>
                  </div>
                )}
                
                <div className="notification is-light mt-4" style={{ 
                  borderLeft: `4px solid ${CATEGORIES[selectedPanneauItem.categorie]?.color || '#a97c50'}`,
                  background: CATEGORIES[selectedPanneauItem.categorie]?.bg || '#fffbe6'
                }}>
                  <p className="is-size-7">
                    <strong>ℹ️ Affichage valable du :</strong><br />
                    {new Date(selectedPanneauItem.dateDebut).toLocaleDateString('fr-FR')} 
                    {' au '}
                    {new Date(selectedPanneauItem.dateFin).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </section>
            <footer className="modal-card-foot" style={{ justifyContent: 'space-between' }}>
              <button 
                className="button" 
                onClick={() => setShowPanneauDetailModal(false)}
              >
                Fermer
              </button>
              {selectedPanneauItem.image && selectedPanneauItem.image.trim() !== '' && (
                <>
                  <a 
                    href={selectedPanneauItem.image} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="button is-link is-light"
                  >
                    <span className="icon">
                      <i className="fas fa-external-link-alt"></i>
                    </span>
                    <span>Ouvrir dans un nouvel onglet</span>
                  </a>
                  <a 
                    href={selectedPanneauItem.image} 
                    download
                    className="button is-success"
                  >
                    <span className="icon">
                      <i className="fas fa-download"></i>
                    </span>
                    <span>Télécharger</span>
                  </a>
                </>
              )}
            </footer>
          </div>
        </div>
      )}
      
      {/* Modal "Tous les élus" - AJOUTER AVANT LA FERMETURE DE LA DIV PRINCIPALE (avant le dernier </div>) */}
      {showAllElus && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowAllElus(false)}></div>
          <div className="modal-card" style={{ maxWidth: "900px", width: "90%" }}>
            <header className="modal-card-head" style={{ 
              background: 'linear-gradient(120deg, #fffbe6 80%, #f8fafc 100%)',
              borderBottom: '3px solid #a97c50'
            }}>
              <p className="modal-card-title" style={{ 
                color: '#a97c50',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: 'Merriweather, serif'
              }}>
                <span style={{ fontSize: 28 }}>👥</span>
                Conseil Municipal de Friesen
              </p>
              <button 
                className="delete" 
                aria-label="close" 
                onClick={() => setShowAllElus(false)}
              ></button>
            </header>
            
            <section className="modal-card-body" style={{ 
              maxHeight: '70vh', 
              overflowY: 'auto',
              padding: '2rem'
            }}>
              {/* Maire */}
              {elus.filter(elu => elu.fonction.toLowerCase().includes('maire') && !elu.fonction.toLowerCase().includes('adjoint')).length > 0 && (
                <div className="mb-5">
                  <h3 className="title is-5 mb-3" style={{ 
                    color: '#a97c50',
                    borderBottom: '2px solid #a97c50',
                    paddingBottom: 8
                  }}>
                    🏛️ Maire
                  </h3>
                  <div className="columns is-multiline">
                    {elus
                      .filter(elu => elu.fonction.toLowerCase().includes('maire') && !elu.fonction.toLowerCase().includes('adjoint'))
                      .map(elu => (
                        <div key={elu.id} className="column is-one-third">
                          <div className="box has-text-centered" style={{
                            background: 'linear-gradient(120deg, #fffbe6 80%, #fff 100%)',
                            border: '2px solid #a97c50',
                            borderRadius: 12,
                            padding: '1.5rem',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px #a97c5030';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                          >
                            <figure className="image is-128x128" style={{
                              margin: '0 auto 1rem',
                              borderRadius: '50%',
                              overflow: 'hidden',
                              border: '4px solid #a97c50',
                              boxShadow: '0 4px 12px #a97c5030'
                            }}>
                              <img
                                src={elu.photo || 'https://via.placeholder.com/128?text=Photo'}
                                alt={`${elu.prenom} ${elu.nom}`}
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                onError={e => { e.currentTarget.src = "https://via.placeholder.com/128?text=Maire"; }}
                              />
                            </figure>
                            <div className="has-text-weight-bold" style={{ 
                              color: '#a97c50',
                              fontSize: 18,
                              marginBottom: 4
                            }}>
                              {elu.prenom} {elu.nom}
                            </div>
                            <div className="is-size-7 has-text-grey" style={{ fontStyle: 'italic' }}>
                              {elu.fonction}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Adjoints */}
              {elus.filter(elu => elu.fonction.toLowerCase().includes('adjoint')).length > 0 && (
                <div className="mb-5">
                  <h3 className="title is-5 mb-3" style={{ 
                    color: '#1277c6',
                    borderBottom: '2px solid #1277c6',
                    paddingBottom: 8
                  }}>
                    👔 Adjoints
                  </h3>
                  <div className="columns is-multiline">
                    {elus
                      .filter(elu => elu.fonction.toLowerCase().includes('adjoint'))
                      .sort((a, b) => {
                        const fonctionA = a.fonction.toLowerCase();
                        const fonctionB = b.fonction.toLowerCase();
                        if (fonctionA.includes('première') || fonctionA.includes('premier')) return -1;
                        if (fonctionB.includes('première') || fonctionB.includes('premier')) return 1;
                        return a.ordre - b.ordre;
                      })
                      .map((elu, idx) => {
                        const colors = ['#1277c6', '#1b9bd7', '#22c55e', '#eab308'];
                        const color = colors[idx % colors.length];
                        
                        return (
                          <div key={elu.id} className="column is-one-third">
                            <div className="box has-text-centered" style={{
                              background: 'linear-gradient(120deg, #eaf6ff 80%, #fff 100%)',
                              border: `2px solid ${color}`,
                              borderRadius: 12,
                              padding: '1.5rem',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.transform = 'translateY(-5px)';
                              e.currentTarget.style.boxShadow = `0 8px 24px ${color}30`;
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                            >
                              <figure className="image is-96x96" style={{
                                margin: '0 auto 1rem',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: `3px solid ${color}`,
                                boxShadow: `0 2px 8px ${color}30`
                              }}>
                                <img
                                  src={elu.photo || 'https://via.placeholder.com/96?text=Photo'}
                                  alt={`${elu.prenom} ${elu.nom}`}
                                  style={{
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: '100%'
                                  }}
                                  onError={e => { e.currentTarget.src = "https://via.placeholder.com/96?text=Adjoint"; }}
                                />
                              </figure>
                              <div className="has-text-weight-bold" style={{ 
                                color,
                                fontSize: 16,
                                marginBottom: 4
                              }}>
                                {elu.prenom} {elu.nom}
                              </div>
                              <div className="is-size-7 has-text-grey" style={{ fontStyle: 'italic' }}>
                                {elu.fonction}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Conseillers municipaux */}
              {elus.filter(elu => {
                const fonction = elu.fonction.toLowerCase();
                return fonction.includes('conseiller') || fonction.includes('conseillère');
              }).length > 0 && (
                <div>
                  <h3 className="title is-5 mb-3" style={{ 
                    color: '#22c55e',
                    borderBottom: '2px solid #22c55e',
                    paddingBottom: 8
                  }}>
                    📋 Conseillers Municipaux
                  </h3>
                  <div className="columns is-multiline">
                    {elus
                      .filter(elu => {
                        const fonction = elu.fonction.toLowerCase();
                        return fonction.includes('conseiller') || fonction.includes('conseillère');
                      })
                      .sort((a, b) => a.ordre - b.ordre)
                      .map(elu => (
                        <div key={elu.id} className="column is-one-quarter">
                          <div className="box has-text-centered" style={{
                            background: '#fff',
                            border: '1px solid #e0e7ef',
                            borderRadius: 10,
                            padding: '1rem',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px #22c55e30';
                            e.currentTarget.style.borderColor = '#22c55e';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = '#e0e7ef';
                          }}
                          >
                            <figure className="image is-64x64" style={{
                              margin: '0 auto 0.5rem',
                              borderRadius: '50%',
                              overflow: 'hidden',
                              border: '2px solid #22c55e'
                            }}>
                              <img
                                src={elu.photo || 'https://via.placeholder.com/64?text=Photo'}
                                alt={`${elu.prenom} ${elu.nom}`}
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                onError={e => { e.currentTarget.src = "https://via.placeholder.com/64?text=CM"; }}
                              />
                            </figure>
                            <div className="has-text-weight-bold" style={{ 
                              fontSize: 14,
                              marginBottom: 2,
                              color: '#333'
                            }}>
                              {elu.prenom} {elu.nom}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </section>
            <footer className="modal-card-foot" style={{ justifyContent: 'space-between' }}>
              <button 
                className="button" 
                onClick={() => setShowAllElus(false)}
              >
                Fermer
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

// Composant pour une actu
function ActualiteCard({ img, date, title, color }) {
  // Images libres de droits pour chaque actu
  const images = {

    "Fête locale : dates et programme": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&q=80",
    "Travaux de voirie : point d’avancement": "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=400&q=80",
    "Prochain conseil municipal le 15 avril": "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&q=80",
  };
  const defaultImg = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=400&q=80";
  const imgSrc = images[title] || img || defaultImg;

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-image">
        <figure className="image is-4by3">
          <img
            src={imgSrc}
            alt={title}
            style={{ objectFit: 'cover' }}
            onError={e => { e.currentTarget.src = defaultImg; }}
          />
        </figure>
      </div>
      <div className="card-content">
        <p className="has-text-link has-text-weight-bold is-size-7 mb-1">{date}</p>
        <p className="has-text-dark has-text-weight-semibold">{title}</p>
      </div>
    </div>
  );
}

// Composant pour un événement d'agenda
function AgendaItem({ title, date, image, lieu }) {
  const fallback = "https://via.placeholder.com/64?text=EVT";
  const imgSrc = image || fallback;
  return (
    <div className="box is-flex is-align-items-center mb-2" style={{ background: '#f8fafc', gap: 10, padding: '8px 12px' }}>
      <figure className="image is-48x48">
        <img
          src={imgSrc}
          alt={title}
          style={{ objectFit: 'cover', borderRadius: 8, width: 36, height: 36 }}
          onError={e => { e.currentTarget.src = fallback; }}
        />
      </figure>
      <div>
        <div className="has-text-weight-semibold has-text-dark">{title}</div>
        <div className="has-text-link is-size-7">{date}</div>
        {lieu ? <div className="is-size-7">📍 {lieu}</div> : null}
      </div>
    </div>
  );
}

// Petit composant calendrier simple - VERSION RESPONSIVE
function Calendar({ events, onDayClick, currentMonth, currentYear, onMonthChange }) {
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay() || 7; // Lundi = 1

  function getEventsForDay(day) {
    const d = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(ev => ev.date === d);
  }

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const rows = [];
  let cells = [];
  let dayNum = 1;

  // Jours vides avant le premier jour
  for (let i = 1; i < firstDay; i++) {
    cells.push(<td key={`empty-${i}`}></td>);
  }

  // Jours du mois
  for (let i = firstDay; i <= 7; i++) {
    if (dayNum <= daysInMonth) {
      const dayEvents = getEventsForDay(dayNum);
      cells.push(
        <td
          key={dayNum}
          className={`has-text-centered ${dayEvents.length ? 'has-background-info-light' : ''}`}
          style={{
            cursor: dayEvents.length ? 'pointer' : 'default',
            padding: '4px',
            border: '1px solid #e0e7ef',
            borderRadius: 4,
            fontSize: '0.85rem'
          }}
          onClick={() => dayEvents.length && onDayClick(dayEvents)}
        >
          <div className="has-text-weight-bold" style={{ fontSize: '0.9rem' }}>{dayNum}</div>
          {dayEvents.length > 0 && (
            <div style={{ 
              width: 6, 
              height: 6, 
              borderRadius: '50%', 
              background: '#1277c6', 
              margin: '2px auto 0' 
            }}></div>
          )}
        </td>
      );
      dayNum++;
    }
  }
  rows.push(<tr key="row-1">{cells}</tr>);

  // Semaines suivantes
  while (dayNum <= daysInMonth) {
    cells = [];
    for (let i = 0; i < 7; i++) {
      if (dayNum <= daysInMonth) {
        const dayEvents = getEventsForDay(dayNum);
        cells.push(
          <td
            key={dayNum}
            className={`has-text-centered ${dayEvents.length ? 'has-background-info-light' : ''}`}
            style={{
              cursor: dayEvents.length ? 'pointer' : 'default',
              padding: '4px',
              border: '1px solid #e0e7ef',
              borderRadius: 4,
              fontSize: '0.85rem'
            }}
            onClick={() => dayEvents.length && onDayClick(dayEvents)}
          >
            <div className="has-text-weight-bold" style={{ fontSize: '0.9rem' }}>{dayNum}</div>
            {dayEvents.length > 0 && (
              <div style={{ 
                width: 6, 
                height: 6, 
                borderRadius: '50%', 
                background: '#1277c6', 
                margin: '2px auto 0' 
              }}></div>
            )}
          </td>
        );
        dayNum++;
      } else {
        cells.push(<td key={`empty-${dayNum + i}`}></td>);
      }
    }
    rows.push(<tr key={`row-${dayNum}`}>{cells}</tr>);
  }

  return (
    <div style={{ 
      borderRadius: 12, 
      border: '1.5px solid #e0e7ef', 
      background: '#fff',
      padding: '12px',
      overflow: 'hidden',
      width: '100%'
    }}>
      <div className="level mb-3" style={{ flexWrap: 'wrap', margin: '0 -0.5rem' }}>
        <div className="level-left" style={{ padding: '0 0.5rem' }}>
          <button 
            className="button is-small" 
            onClick={() => onMonthChange(-1)}
            style={{ minWidth: 'auto' }}
          >
            ←
          </button>
        </div>
        <div className="level-item" style={{ padding: '0 0.5rem' }}>
          <h3 className="title is-6 has-text-link" style={{ margin: 0, whiteSpace: 'nowrap', fontSize: '0.9rem' }}>
            {monthNames[currentMonth]} {currentYear}
          </h3>
        </div>
        <div className="level-right" style={{ padding: '0 0.5rem' }}>
          <button 
            className="button is-small" 
            onClick={() => onMonthChange(1)}
            style={{ minWidth: 'auto' }}
          >
            →
          </button>
        </div>
      </div>
      <div style={{ 
        overflowX: 'auto', 
        WebkitOverflowScrolling: 'touch',
        margin: '0 -12px',
        padding: '0 12px'
      }}>
        <table className="table is-fullwidth is-bordered" style={{ 
          borderRadius: 8,
          minWidth: '280px',
          fontSize: '0.85rem',
          width: '100%'
        }}>
          <thead>
            <tr className="has-background-link has-text-white">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(j => (
                <th key={j} className="has-text-centered" style={{ 
                  padding: '6px 2px',
                  fontSize: '0.7rem',
                  fontWeight: 600
                }}>
                  {j}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </div>
  );
}

const infoIcon = {
  fontSize: 18,
  color: '#1277c6',
  marginRight: 8,
};