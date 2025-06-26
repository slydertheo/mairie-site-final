import Link from 'next/link';
import { useState } from 'react';

const LoginIcon = ({ color = "#fff" }) => (
  <svg width="20" height="20" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1"/>
  </svg>
);

const navLinks = [
  { href: '/demarches', label: 'Démarches' },
  { href: '/ecoles', label: 'École Evelyne Nirouet' },
  { href: '/commerces', label: 'Commerces' },
  { href: '/intercommunalite', label: 'Intercommunalité' },
  { href: '/associations', label: 'Associations' },
  { href: '/decouvrir_friesen', label: 'Découvrir Friesen' },
  { href: '/infos_pratiques', label: 'Infos Pratiques' },
];

export default function Navbar() {
  const [active, setActive] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Pour empêcher la navigation lors du clic sur Connexion
  const handleLoginClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <>
      <nav className="navbar is-fixed-top has-shadow" style={{
        background: 'rgba(248,250,252,0.97)',
        borderRadius: '0 0 18px 18px',
        backdropFilter: 'blur(6px)',
        padding: 0,
      }}>
        <div className="navbar-brand">
          <Link
            href="/"
            className="navbar-item button is-link is-light is-rounded"
            style={{
              gap: 12,
              display: 'flex',
              alignItems: 'center',
              fontWeight: 600,
              color: '#1277c6',
              fontSize: 16,
              letterSpacing: 0.5,
              margin: '0 6px',
              border: 'none',
              boxShadow: '0 1px 6px #1277c610',
              transition: 'background 0.2s, color 0.2s',
              background: 'transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#d1e6fa';
              e.currentTarget.style.color = '#0a3970';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#1277c6';
            }}
          >
            <img
              src="/LogoFriesen.png"
              alt="Blason de la mairie de Friesen"
              style={{
                height: 40,
                width: 40,
                objectFit: 'contain',
                borderRadius: '50%',
                boxShadow: '0 2px 8px #1277c620',
                marginRight: 8,
              }}
            />
            <span style={{
              fontWeight: 800,
              fontSize: 24,
              color: 'inherit',
              letterSpacing: 1.2,
              fontFamily: 'Segoe UI, Arial, sans-serif',
              userSelect: 'none',
              textShadow: '0 2px 8px #1277c620',
              whiteSpace: 'nowrap',
            }}>
              Mairie Friesen
            </span>
          </Link>
          <a
            role="button"
            className={`navbar-burger ${active ? 'is-active' : ''}`}
            aria-label="menu"
            aria-expanded={active ? "true" : "false"}
            data-target="navbarBasic"
            onClick={() => setActive(!active)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasic" className={`navbar-menu ${active ? 'is-active' : ''}`}>
          <div className="navbar-start">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="navbar-item button is-link is-light is-rounded"
                onClick={() => setActive(false)}
                style={{
                  fontWeight: 600,
                  color: '#1277c6',
                  fontSize: 16,
                  letterSpacing: 0.5,
                  margin: '0 6px',
                  border: 'none',
                  boxShadow: '0 1px 6px #1277c610',
                  transition: 'background 0.2s, color 0.2s',
                  background: 'transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#d1e6fa';
                  e.currentTarget.style.color = '#0a3970';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#1277c6';
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <a
                href="/login"
                className="button is-link is-rounded"
                style={{
                  fontWeight: 700,
                  fontSize: 17,
                  boxShadow: '0 2px 12px #1277c640',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 18px',
                  transition: 'background 0.2s, box-shadow 0.2s',
                }}
                onClick={handleLoginClick}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#0a3970';
                  e.currentTarget.style.boxShadow = '0 4px 16px #0a397060';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '';
                  e.currentTarget.style.boxShadow = '0 2px 12px #1277c640';
                }}
              >
                <LoginIcon />
                <span>Connexion</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal de connexion */}
      <div className={`modal ${showModal ? 'is-active' : ''}`}>
        <div className="modal-background" onClick={() => setShowModal(false)}></div>
        <div
          className="modal-card"
          style={{
            borderRadius: 22,
            overflow: 'hidden',
            width: '90%',
            maxWidth: 500,
            margin: 'auto',
            boxShadow: '0 8px 32px #1277c640',
          }}
        >
          <header
            className="modal-card-head"
            style={{
              justifyContent: 'center',
              background: '#f5faff',
              borderBottom: 'none',
              padding: '2.5rem 2rem 1rem 2rem',
              position: 'relative',
            }}
          >
            <figure className="image is-96x96" style={{ margin: '0 auto' }}>
              <img
                src="/LogoFriesen.png"
                alt="Logo Friesen"
                style={{
                  borderRadius: '50%',
                  boxShadow: '0 2px 8px #1277c620',
                  width: 96,
                  height: 96,
                  objectFit: 'contain',
                  background: 'white',
                  display: 'block',
                }}
              />
            </figure>
            <button
              className="delete"
              aria-label="close"
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', right: 24, top: 24 }}
            ></button>
          </header>
          <section
            className="modal-card-body"
            style={{
              background: '#f5faff',
              padding: '2rem 2.5rem 2.5rem 2.5rem',
            }}
          >
            <h2
              className="title is-3 has-text-centered"
              style={{
                color: '#1277c6',
                marginBottom: 32,
                fontWeight: 800,
                letterSpacing: 1,
              }}
            >
              Connexion à votre espace
            </h2>
            <form>
              <div className="field">
                <div className="control has-icons-left">
                  <input
                    className="input is-medium"
                    type="email"
                    placeholder="Votre email"
                    required
                    style={{ fontSize: 18, padding: '1.25rem 1rem' }}
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-envelope"></i>
                  </span>
                </div>
              </div>
              <div className="field">
                <div className="control has-icons-left">
                  <input
                    className="input is-medium"
                    type="password"
                    placeholder="Votre mot de passe"
                    required
                    style={{ fontSize: 18, padding: '1.25rem 1rem' }}
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-lock"></i>
                  </span>
                </div>
              </div>
              <div className="field has-text-right mb-3">
                <a href="#" className="is-size-7" style={{ color: '#1277c6' }}>
                  Mot de passe oublié ?
                </a>
              </div>
              <button
                className="button is-link is-fullwidth is-medium"
                type="submit"
                style={{
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 18,
                  padding: '1.1rem 0',
                  marginTop: 8,
                  boxShadow: '0 2px 12px #1277c640',
                }}
              >
                Se connecter
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
