import React, { useEffect, useState, useRef } from 'react';
// import 'bulma/css/bulma.min.css'; // Bulma est déjà importé globalement dans _app.tsx
import QuickBoxEcole from '../components/QuickBoxEcole';
import ActualiteCarousel from '../components/ActualiteCarousel';

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

  // Définition des différentes animations
  const animations = {
    "fade-up": {
      hidden: { opacity: 0, transform: 'translateY(40px)' },
      visible: { opacity: 1, transform: 'translateY(0)' }
    },
    "fade-down": {
      hidden: { opacity: 0, transform: 'translateY(-40px)' },
      visible: { opacity: 1, transform: 'translateY(0)' }
    },
    "fade-left": {
      hidden: { opacity: 0, transform: 'translateX(40px)' },
      visible: { opacity: 1, transform: 'translateX(0)' }
    },
    "fade-right": {
      hidden: { opacity: 0, transform: 'translateX(-40px)' },
      visible: { opacity: 1, transform: 'translateX(0)' }
    },
    "zoom-in": {
      hidden: { opacity: 0, transform: 'scale(0.9)' },
      visible: { opacity: 1, transform: 'scale(1)' }
    },
    "zoom-out": {
      hidden: { opacity: 0, transform: 'scale(1.1)' },
      visible: { opacity: 1, transform: 'scale(1)' }
    },
    "flip-up": {
      hidden: { opacity: 0, transform: 'rotateX(30deg) translateY(40px)' },
      visible: { opacity: 1, transform: 'rotateX(0) translateY(0)' }
    },
    "bounce": {
      hidden: { opacity: 0, transform: 'translateY(40px)' },
      visible: { opacity: 1, transform: 'translateY(0)', transition: 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }
    }
  };

  const selectedAnimation = animations[animation] || animations["fade-up"];
  
  return (
    <div
      ref={ref}
      style={{
        ...selectedAnimation[isVisible ? 'visible' : 'hidden'],
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

export default function PageAcceuil() {
  const [contact, setContact] = useState({ nom: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);
  const [content, setContent] = useState({});
  const [events, setEvents] = useState([]);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAllEventsModal, setShowAllEventsModal] = useState(false); // Nouvel état
  const [actualites, setActualites] = useState([]);

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

  return (
    <div className="has-background-light" style={{ minHeight: '100vh' }}>
      {/* Bandeau image + titre avec animation avancée */}
      <section className="hero is-primary is-medium" style={{
        backgroundImage: 'linear-gradient(180deg,rgba(10,37,64,0.55),rgba(10,37,64,0.25)),url("village.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '0 0 32px 32px',
        boxShadow: '0 8px 32px #0a254030',
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Effet de particules animées */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.4,
          background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 800 800\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'400\' cy=\'400\' fill=\'%23ffffff\' r=\'1\'/%3E%3Ccircle cx=\'200\' cy=\'300\' fill=\'%23ffffff\' r=\'1.2\'/%3E%3Ccircle cx=\'600\' cy=\'200\' fill=\'%23ffffff\' r=\'0.8\'/%3E%3Ccircle cx=\'100\' cy=\'500\' fill=\'%23ffffff\' r=\'1.1\'/%3E%3Ccircle cx=\'700\' cy=\'300\' fill=\'%23ffffff\' r=\'0.9\'/%3E%3Ccircle cx=\'300\' cy=\'600\' fill=\'%23ffffff\' r=\'1.2\'/%3E%3Ccircle cx=\'500\' cy=\'100\' fill=\'%23ffffff\' r=\'0.7\'/%3E%3C/svg%3E")',
          animation: 'floatEffect 60s linear infinite'
        }}></div>
        
        <div className="hero-body">
          <div className="container has-text-centered">
            <AnimateOnScroll animation="zoom-out" duration={1200}>
              <h1 className="title is-2 has-text-weight-bold" style={{ color: '#fff', textShadow: '0 4px 24px #0a2540a0', letterSpacing: 1 }}>
                {content.hero_titre || <>Bienvenue sur le site officiel de<br />la Mairie de <span style={{ color: '#ffd700', textShadow: '0 2px 8px #1277c6' }}>Friesen</span></>}
                <br />
                <span style={{ fontSize: 24 }}>Site officiel de la commune</span>
              </h1>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <AnimateOnScroll animation="fade-up">
          <h2 className="title is-4 has-text-primary mb-5">{content.actualites_titre || "Dernières actualités"}</h2>
        </AnimateOnScroll>
        
        <AnimateOnScroll animation="zoom-in" threshold={0.2}>
          <ActualiteCarousel actualites={actualites} />
        </AnimateOnScroll>

        <div className="columns is-variable is-5">
          {/* Colonne 1 : Mot du Maire + Galerie + Panneau d'affichage */}
          <div className="column is-two-thirds">
            <AnimateOnScroll animation="fade-right" delay={100}>
              <h2 className="title is-5 has-text-primary mb-2 mt-5">{content.motMaire_titre || "Mot du Maire"}</h2>
              <div className="box p-5" style={{ background: '#f8fafc', borderRadius: 12 }}>
                <div className="columns">
                  {/* Colonne pour la photo */}
                  <div className="column is-narrow">
                    <figure className="image is-128x128" style={{ margin: '0 auto' }}>
                      <img
                        className="is-rounded"
                        src={content.motMaire_photo || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=200&q=80"}
                        alt="Maire"
                        style={{ 
                          objectFit: 'cover', 
                          border: '3px solid #1277c6',
                          boxShadow: '0 4px 12px rgba(18, 119, 198, 0.2)',
                          width: '100%',
                          height: '100%'
                        }}
                        onError={e => { e.currentTarget.src = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=200&q=80"; }}
                      />
                    </figure>
                  </div>
                  
                  {/* Colonne pour le texte */}
                  <div className="column">
                    <div className="has-text-link has-text-weight-bold mb-3" style={{ fontSize: '1.1rem' }}>
                      {content.motMaire_accroche || "Chères habitantes, chers habitants"}
                    </div>
                    <div style={{ 
                      fontSize: 16, 
                      color: '#444', 
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.6' 
                    }}>
                      {content.motMaire}
                    </div>
                    <div className="has-text-right mt-4">
                      <div className="has-text-weight-bold">{content.motMaire_nom || "Pierre Durand"}</div>
                      <div className="is-italic" style={{ fontSize: '0.9rem' }}>{content.motMaire_titre_signature || "Maire de Friesen"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
            
            {/* Panneau d'affichage avec animation */}
            <AnimateOnScroll animation="bounce" delay={200} threshold={0.3}>
              <div
                className="box"
                style={{
                  background: 'repeating-linear-gradient(135deg, #c2a77d 0px, #c2a77d 28px, #b3936b 28px, #b3936b 56px)',
                  borderRadius: 18,
                  minHeight: 220,
                  boxShadow: '0 4px 24px #a97c5020',
                  position: 'relative',
                  margin: '32px auto',
                  maxWidth: 900,
                  padding: '32px 24px'
                }}
              >
                <h2 className="title is-4 has-text-dark mb-4" style={{ textShadow: '0 2px 8px #fffbe6', textAlign: 'center', letterSpacing: 1 }}>
                  🗂️ Panneau d'affichage du village
                </h2>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {/* Animation séquencée pour les affiches */}
                  <AnimateOnScroll animation="flip-up" delay={300}>
                    <div style={{
                      background: '#fffbe6',
                      border: '2px dashed #a97c50',
                      borderRadius: 12,
                      boxShadow: '0 2px 12px #a97c5030',
                      padding: '18px 22px',
                      minWidth: 180,
                      maxWidth: 220,
                      marginBottom: 12,
                      fontWeight: 500,
                      color: '#a97c50',
                      fontSize: 16,
                      position: 'relative'
                    }}>
                      <span style={{ fontSize: 22, position: 'absolute', top: 8, right: 12 }}>📌</span>
                      <div>Fête du village<br /><b>Samedi 21 septembre</b></div>
                    </div>
                  </AnimateOnScroll>
                  
                  <AnimateOnScroll animation="flip-up" delay={450}>
                    <div style={{
                      background: '#eaf6ff',
                      border: '2px solid #1277c6',
                      borderRadius: 12,
                      boxShadow: '0 2px 12px #1277c630',
                      padding: '18px 22px',
                      minWidth: 180,
                      maxWidth: 220,
                      marginBottom: 12,
                      fontWeight: 500,
                      color: '#1277c6',
                      fontSize: 16,
                      position: 'relative'
                    }}>
                      <span style={{ fontSize: 22, position: 'absolute', top: 8, right: 12 }}>📌</span>
                      <div>Marché des producteurs<br /><b>Dimanche 6 octobre</b></div>
                    </div>
                  </AnimateOnScroll>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Colonne 2 : Agenda + Infos pratiques + Calendrier + Contact */}
          <div className="column is-one-third">
            <AnimateOnScroll animation="fade-left" delay={150}>
              <h2 className="title is-5 has-text-primary mb-3">{content.agenda_titre || "Agenda des événements"}</h2>
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
                    <span className="icon-text">
                      <span className="icon is-small">
                        <i className="fas fa-external-link-alt"></i>
                      </span>
                      <span>Site externe</span>
                    </span>
                  </a>
                )}
              </div>
            </AnimateOnScroll>
            
            <AnimateOnScroll animation="fade-left" delay={250}>
              <h2 className="title is-5 has-text-primary mb-2">{content.infos_titre || "Infos pratiques"}</h2>
              <div className="mb-2"><span style={infoIcon}>🕒</span>
                <b>{content.horaires_titre || "Horaires d'ouverture"}</b><br />
                {(content.horaires || "").split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
              </div>
              <div className="mb-2"><span style={infoIcon}>📍</span>
                {(content.adresse || "").split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
              </div>
              <div className="mb-2"><span style={infoIcon}>📞</span>
                {content.telephone}
              </div>
              <div className="mb-4"><span style={infoIcon}>✉️</span>
                {content.email}
              </div>
            </AnimateOnScroll>
            
            <AnimateOnScroll animation="fade-left" delay={350} threshold={0.2}>
              <h2 className="title is-5 has-text-primary mb-2 mt-5">{content.calendrier_titre || "Calendrier"}</h2>
              <div className="box" style={{ background: '#f8fafc', marginBottom: 18 }}>
                <Calendar
                  events={events}
                  onDayClick={evs => { setSelectedDayEvents(evs); setShowModal(true); }}
                />
              </div>
            </AnimateOnScroll>
            
            <AnimateOnScroll animation="fade-up" delay={450} threshold={0.2}>
              <h2 className="title is-5 has-text-primary mb-2 mt-5">{content.contact_titre || "Contactez la mairie"}</h2>
              <div className="box" style={{ background: '#f8fafc' }}>
                {contactSent ? (
                  <div className="notification is-success">Votre message a bien été envoyé !</div>
                ) : (
                  <form onSubmit={handleContactSubmit}>
                    <div className="field">
                      <label className="label">Nom</label>
                      <div className="control">
                        <input className="input" type="text" name="nom" value={contact.nom} onChange={handleContactChange} required />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Email</label>
                      <div className="control">
                        <input className="input" type="email" name="email" value={contact.email} onChange={handleContactChange} required />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Message</label>
                      <div className="control">
                        <textarea className="textarea" name="message" value={contact.message} onChange={handleContactChange} required />
                      </div>
                    </div>
                    <div className="field is-grouped is-grouped-right">
                      <div className="control">
                        <button className="button is-link" type="submit">Envoyer</button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </AnimateOnScroll>
          </div>
        </div>

        <div className="columns mt-6 mb-0"> {/* Changez mb-5 à mb-0 */}
          {/* Widgets avec animation */}
          <div className="column is-2">
            <AnimateOnScroll animation="zoom-in" delay={200} threshold={0.2}>
              {/* Widget météo */}
              <div className="box has-text-centered" style={{ background: '#eaf6ff' }}>
                <span style={{ fontSize: 38 }}>🌤️</span>
                <div className="has-text-link has-text-weight-bold mt-2">{content.meteo}</div>
                <div style={{ fontSize: 15 }}>{content.meteo_legende}</div>
              </div>
            </AnimateOnScroll>
          </div>
          <div className="column is-2">
            <AnimateOnScroll animation="zoom-in" delay={300} threshold={0.2}>
              {/* Widget réseaux sociaux */}
              <div className="box has-text-centered" style={{ background: '#f8fafc' }}>
                <div className="has-text-link has-text-weight-bold mb-2">{content.reseaux_titre || "Suivez-nous"}</div>
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
                      {/* Utilisation d'une div stylisée pour garantir l'affichage */}
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
              {/* Numéros d'urgence */}
              <div className="box mt-4" style={{ background: '#fffbe6' }}>
                <div className="has-text-danger has-text-weight-bold mb-1">{content.urgences_titre || "Urgences"}</div>
                <div style={{ fontSize: 15 }}>
                  🚒 Pompiers : <b>{content.urgence_pompiers}</b><br />
                  🚓 Police : <b>{content.urgence_police}</b><br />
                  🚑 SAMU : <b>{content.urgence_samu}</b>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
          {/* ... autres colonnes ... */}
        </div>
      </div>

      {/* Animation CSS globale */}
      <style jsx global>{`
        @keyframes floatEffect {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .highlight-on-scroll {
          transition: all 0.5s ease;
        }
        
        .highlight-on-scroll:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(18, 119, 198, 0.2);
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

// Petit composant calendrier simple
function Calendar({ events, onDayClick }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function getEventsForDay(day) {
    const d = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(ev => ev.date === d);
  }

  return (
    <table className="table is-bordered is-narrow is-fullwidth has-background-white-ter" style={{ fontSize: 14 }}>
      <thead>
        <tr>
          <th colSpan={7} className="has-background-link has-text-white has-text-centered">
            {today.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
          </th>
        </tr>
        <tr>
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(j => <th key={j} className="has-text-centered">{j}</th>)}
        </tr>
      </thead>
      <tbody>
        {(() => {
          const firstDay = new Date(year, month, 1).getDay() || 7;
          const rows = [];
          let cells = [];
          let dayNum = 1;
          for (let i = 1; i < firstDay; i++) cells.push(<td key={`empty-${i}`}></td>);
          for (let i = firstDay; i <= 7; i++) {
            if (dayNum <= daysInMonth) {
              const dayEvents = getEventsForDay(dayNum);
              cells.push(
                <td
                  key={dayNum}
                  style={{
                    background: dayEvents.length ? '#eaf6ff' : undefined,
                    fontWeight: dayEvents.length ? 700 : 400,
                    cursor: dayEvents.length ? 'pointer' : undefined
                  }}
                  onClick={() => dayEvents.length && onDayClick(dayEvents)}
                >
                  {dayNum}
                  {dayEvents.map(ev => (
                    <div key={ev.id} style={{ fontSize: 10, color: '#1277c6' }}>{ev.titre}</div>
                  ))}
                </td>
              );
              dayNum++;
            }
          }
          rows.push(<tr key="row-1">{cells}</tr>);
          while (dayNum <= daysInMonth) {
            cells = [];
            for (let i = 0; i < 7; i++) {
              if (dayNum <= daysInMonth) {
                const dayEvents = getEventsForDay(dayNum);
                cells.push(
                  <td
                    key={dayNum}
                    style={{
                      background: dayEvents.length ? '#eaf6ff' : undefined,
                      fontWeight: dayEvents.length ? 700 : 400,
                      cursor: dayEvents.length ? 'pointer' : undefined
                    }}
                    onClick={() => dayEvents.length && onDayClick(dayEvents)}
                  >
                    {dayNum}
                    {dayEvents.map(ev => (
                      <div key={ev.id} style={{ fontSize: 10, color: '#1277c6' }}>{ev.titre}</div>
                    ))}
                  </td>
                );
                dayNum++;
              } else {
                cells.push(<td key={`empty-${dayNum + i}`}></td>);
              }
            }
            rows.push(<tr key={`row-${dayNum}`}>{cells}</tr>);
          }
          return rows;
        })()}
      </tbody>
    </table>
  );
}

const infoIcon = {
  fontSize: 18,
  color: '#1277c6',
  marginRight: 8,
};