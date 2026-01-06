import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const LoginIcon = ({ color = "#fff" }) => (
  <svg width="20" height="20" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1"/>
  </svg>
);

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/demarches', label: 'Démarches' },
  { href: '/ecoles', label: 'École Evelyne Nirouet' },
  { href: '/commerces', label: 'Commerces' },
  { href: '/intercommunalite', label: 'Intercommunalité' },
  { href: '/associations', label: 'Associations' },
  { href: '/decouvrir_friesen', label: 'Découvrir Friesen' },
  { href: '/infos_pratiques', label: 'Infos Pratiques' },
];

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;
  return score;
}

function getStrengthLabel(score) {
  if (score <= 2) return { label: "Faible", color: "danger" };
  if (score <= 4) return { label: "Moyen", color: "warning" };
  return { label: "Fort", color: "success" };
}

export default function Navbar() {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState('danger');
  const [registerMode, setRegisterMode] = useState(false);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [navbarImages, setNavbarImages] = useState({});

  // Charger les images de navbar
  useEffect(() => {
    fetch('/api/navbar-images')
      .then(res => res.json())
      .then(data => {
        if (data.images) {
          setNavbarImages(data.images);
        }
      })
      .catch(err => console.error('Erreur chargement images navbar:', err));
  }, []);

  // Déterminer l'image à afficher selon la page
  const getCurrentPageImage = () => {
    const path = router.pathname;
    let pageSlug = 'accueil';

    if (path === '/') pageSlug = 'accueil';
    else if (path === '/demarches') pageSlug = 'demarches';
    else if (path === '/ecoles') pageSlug = 'ecoles';
    else if (path === '/commerces') pageSlug = 'commerces';
    else if (path === '/intercommunalite') pageSlug = 'intercommunalite';
    else if (path === '/associations') pageSlug = 'associations';
    else if (path === '/decouvrir_friesen') pageSlug = 'decouvrir_friesen';
    else if (path === '/infos_pratiques') pageSlug = 'infos_pratiques';

    return navbarImages[pageSlug] || '/LogoFriesen.png';
  };

  // Pour empêcher la navigation lors du clic sur Connexion
  const handleLoginClick = (e) => {
    e.preventDefault();
    setShowModal(true);
    setError('');
    setEmail('');
    setPassword('');
  };

  // Connexion
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setErrorType('danger');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) setError("Utilisateur ou mot de passe incorrect.");
        else if (res.status === 400) setError("Veuillez remplir tous les champs.");
        else setError("Une erreur technique est survenue. Veuillez réessayer plus tard.");
        setErrorType('danger');
      } else {
        // Stocke le JWT et l'utilisateur
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess("Connexion réussie !");
        setError('');
        setErrorType('success');
        setTimeout(() => {
          setShowModal(false);
          window.location.reload();
        }, 1200); // Laisse le temps d'afficher le message
      }
    } catch (err) {
      setError("Impossible de se connecter au serveur.");
      setErrorType('danger');
    }
    setLoading(false);
  };

  // Inscription
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setErrorType('danger');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nom, prenom }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) setError("Cet email est déjà utilisé.");
        else if (res.status === 400) setError("Veuillez remplir tous les champs.");
        else setError("Une erreur est survenue. Veuillez réessayer.");
        setErrorType('danger');
      } else {
        setRegisterMode(false);
        setError("Compte créé ! Connectez-vous.");
        setErrorType('success');
        setNom('');
        setPrenom('');
        setPassword('');
      }
    } catch (err) {
      setError("Impossible de créer le compte.");
      setErrorType('danger');
    }
    setLoading(false);
  };

  // Handler pour l'oubli de mot de passe
  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setForgotMsg('');
    setError('');
    try {
      // Ici tu pourrais appeler une API réelle, ici on simule juste la réponse
      // const res = await fetch('/api/forgot', { ... });
      // const data = await res.json();
      // if (!res.ok) setForgotMsg("Aucun compte trouvé avec cet email.");
      // else setForgotMsg("Un email de réinitialisation a été envoyé.");
      setTimeout(() => {
        setForgotMsg("Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.");
        setLoading(false);
      }, 1000);
    } catch (err) {
      setForgotMsg("Erreur lors de la demande. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 40px',
        background: 'rgba(248,250,252,0.97)',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(10,37,64,0.03)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
        flexWrap: 'wrap',
      }}>
        {/* Logo à gauche */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          textDecoration: 'none',
          flex: '0 0 auto',
        }}>
          <img
            src="/LogoFriesen.png"
            alt="Logo de la mairie de Friesen"
            style={{
              height: 50,
              width: 50,
              objectFit: 'contain',
              borderRadius: '50%',
              boxShadow: '0 2px 8px rgba(18,119,198,0.2)',
            }}
          />
          <span style={{
            fontWeight: 800,
            fontSize: 24,
            background: 'linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%)',
            color: '#1277c6',
            padding: '8px 20px',
            borderRadius: 12,
            letterSpacing: 1.2,
            fontFamily: 'Segoe UI, Arial, sans-serif',
            userSelect: 'none',
            boxShadow: '0 2px 8px rgba(255, 217, 61, 0.4)',
            whiteSpace: 'nowrap',
          }}>
            Mairie Friesen
          </span>
        </Link>

        {/* Menu burger pour mobile */}
        <button
          className={`navbar-burger ${active ? 'is-active' : ''}`}
          onClick={() => setActive(!active)}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          <span style={{ display: 'block', width: 24, height: 2, background: '#1277c6', margin: '5px 0', transition: 'all 0.3s' }}></span>
          <span style={{ display: 'block', width: 24, height: 2, background: '#1277c6', margin: '5px 0', transition: 'all 0.3s' }}></span>
          <span style={{ display: 'block', width: 24, height: 2, background: '#1277c6', margin: '5px 0', transition: 'all 0.3s' }}></span>
        </button>

        {/* Liens au centre */}
        <div className={`navbar-links ${active ? 'is-active' : ''}`} style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          justifyContent: 'center',
          flex: '1 1 auto',
          flexWrap: 'wrap',
        }}>
          {navLinks.map((link) => {
            const isActive = router.pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setActive(false)}
                style={{
                  color: isActive ? '#0a3970' : '#1277c6',
                  background: isActive ? '#e6f0fa' : 'transparent',
                  textDecoration: 'none',
                  fontWeight: isActive ? 600 : 500,
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 15,
                  letterSpacing: 0.3,
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 2px 8px rgba(18,119,198,0.1)' : 'none',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#f0f7fc';
                    e.currentTarget.style.color = '#0a3970';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#1277c6';
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Boutons Admin & Connexion à droite */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flex: '0 0 auto',
        }}>
          <Link
            href="/Interface_admin"
            onClick={() => setActive(false)}
            style={{
              fontWeight: 600,
              fontSize: 15,
              background: '#FFB4D5',
              color: '#2d3748',
              boxShadow: '0 2px 8px rgba(255,180,213,0.3)',
              border: 'none',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#FF99C8';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,153,200,0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#FFB4D5';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,180,213,0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>⚙️</span>
            <span>Admin</span>
          </Link>
          
          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              setActive(false);
              handleLoginClick(e);
            }}
            style={{
              background: '#1277c6',
              color: '#fff',
              borderRadius: 8,
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontWeight: 600,
              fontSize: 15,
              boxShadow: '0 2px 8px rgba(18,119,198,0.3)',
              border: 'none',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#0a3970';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(10,57,112,0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#1277c6';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(18,119,198,0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <LoginIcon />
            <span>Connexion</span>
          </a>
        </div>
      </nav>

      {/* Styles pour le responsive */}
      <style jsx>{`
        @media (max-width: 1024px) {
          nav {
            padding: 12px 20px !important;
          }
          .navbar-links {
            gap: 8px !important;
          }
          .navbar-links a {
            font-size: 14px !important;
            padding: 6px 12px !important;
          }
        }

        @media (max-width: 768px) {
          .navbar-burger {
            display: block !important;
          }
          .navbar-links {
            display: none !important;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(248,250,252,0.98);
            backdrop-filter: blur(10px);
            flex-direction: column;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(10,37,64,0.1);
            border-radius: 0 0 12px 12px;
          }
          .navbar-links.is-active {
            display: flex !important;
          }
          .navbar-links a {
            width: 100%;
            text-align: center;
            padding: 12px 20px !important;
          }
          nav {
            flex-wrap: wrap;
          }
          nav > div:last-child {
            margin-top: 12px;
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
                  color: '#2d3748',
                  fontSize: '13px',
                  letterSpacing: 0.3,
                  margin: '0',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: `0 1px 4px ${link.color}30`,
                  transition: 'all 0.25s ease',
                  background: link.color,
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = link.hoverColor;
                  e.currentTarget.style.boxShadow = `0 3px 10px ${link.hoverColor}50`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.color = '#1a202c';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = link.color;
                  e.currentTarget.style.boxShadow = `0 1px 4px ${link.color}30`;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.color = '#2d3748';
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="navbar-end" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
          }}>
            {/* Lien Admin visible pour tous */}
            <Link
              href="/Interface_admin"
              className="navbar-item"
              onClick={() => setActive(false)}
              style={{
                fontWeight: 600,
                fontSize: '13px',
                background: '#FFB4D5',
                color: '#2d3748',
                boxShadow: '0 1px 4px #FFB4D530',
                border: 'none',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 12px',
                margin: '0',
                transition: 'all 0.25s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#FF99C8';
                e.currentTarget.style.boxShadow = '0 3px 10px #FF99C850';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#FFB4D5';
                e.currentTarget.style.boxShadow = '0 1px 4px #FFB4D530';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>⚙️ Admin</span>
            </Link>
            <a
              href="/login"
              className="navbar-item"
              style={{
                fontWeight: 600,
                fontSize: '13px',
                background: '#B4E7FF',
                color: '#2d3748',
                boxShadow: '0 1px 4px #B4E7FF30',
                border: 'none',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                margin: '0',
                transition: 'all 0.25s ease',
                whiteSpace: 'nowrap',
              }}
              onClick={(e) => {
                setActive(false);
                handleLoginClick(e);
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#8ED9FF';
                e.currentTarget.style.boxShadow = '0 3px 10px #8ED9FF50';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#B4E7FF';
                e.currentTarget.style.boxShadow = '0 1px 4px #B4E7FF30';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>🔐 Connexion</span>
            </a>
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
            <figure className="image is-10000x10000" style={{ margin: '0 auto' }}>
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
              {forgotMode ? "Réinitialiser le mot de passe" : "Connexion à votre espace"}
            </h2>
            {/* Mot de passe oublié */}
            {forgotMode ? (
              <form onSubmit={handleForgot}>
                <div className="field">
                  <div className="control has-icons-left">
                    <input
                      className="input is-medium"
                      type="email"
                      placeholder="Votre email"
                      required
                      style={{ fontSize: 18, padding: '1.25rem 1rem' }}
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                    />
                    <span className="icon is-small is-left">
                      <i className="fas fa-envelope"></i>
                    </span>
                  </div>
                </div>
                {forgotMsg && (
                  <div className="notification is-info is-light" style={{ marginBottom: 12 }}>
                    {forgotMsg}
                    <button className="delete" onClick={() => setForgotMsg('')}></button>
                  </div>
                )}
                <button
                  className={`button is-link is-fullwidth is-medium${loading ? ' is-loading' : ''}`}
                  type="submit"
                  style={{
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 18,
                    padding: '1.1rem 0',
                    marginTop: 8,
                    boxShadow: '0 2px 12px #1277c640',
                  }}
                  disabled={loading}
                >
                  Envoyer le lien de réinitialisation
                </button>
                <div className="has-text-centered mt-3">
                  <button
                    type="button"
                    className="button is-text"
                    style={{ color: '#1277c6', fontWeight: 700 }}
                    onClick={() => { setForgotMode(false); setForgotMsg(''); }}
                  >
                    Retour à la connexion
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={registerMode ? handleRegister : handleSubmit}>
                {registerMode && (
                  <>
                    <div className="field">
                      <input
                        className="input is-medium"
                        type="text"
                        placeholder="Nom"
                        required
                        value={nom}
                        onChange={e => setNom(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <input
                        className="input is-medium"
                        type="text"
                        placeholder="Prénom"
                        required
                        value={prenom}
                        onChange={e => setPrenom(e.target.value)}
                      />
                    </div>
                  </>
                )}
                <div className="field">
                  <div className="control has-icons-left">
                    <input
                      className="input is-medium"
                      type="email"
                      placeholder="Votre email"
                      required
                      style={{ fontSize: 18, padding: '1.25rem 1rem' }}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                    <span className="icon is-small is-left">
                      <i className="fas fa-envelope"></i>
                    </span>
                  </div>
                </div>
                <div className="field">
                  <div className="control has-icons-left has-icons-right">
                    <input
                      className="input is-medium"
                      type={showPassword ? "text" : "password"}
                      placeholder="Votre mot de passe"
                      required
                      style={{ fontSize: 18, padding: '1.25rem 1rem' }}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <span className="icon is-small is-left">
                      <i className="fas fa-lock"></i>
                    </span>
                    <span
                      className="icon is-small is-right"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setShowPassword(v => !v)}
                      tabIndex={0}
                      title={showPassword ? "Masquer" : "Afficher"}
                    >
                      <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                    </span>
                  </div>
                  {/* Indicateur de sécurité */}
                  {registerMode && password && (
                    <div style={{ marginTop: 6 }}>
                      {(() => {
                        const score = getPasswordStrength(password);
                        const { label, color } = getStrengthLabel(score);
                        return (
                          <>
                            <progress
                              className={`progress is-${color}`}
                              value={score}
                              max="6"
                              style={{ height: 6 }}
                            ></progress>
                            <span className={`has-text-${color} is-size-7`} style={{ fontWeight: 600 }}>
                              Sécurité : {label}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
                {error && (
                  <div className={`notification is-light ${errorType === 'success' ? 'is-success' : 'is-danger'}`} style={{ marginBottom: 12 }}>
                    {error}
                    <button className="delete" onClick={() => setError('')}></button>
                  </div>
                )}
                {success && (
                  <div className="notification is-success is-light" style={{ marginBottom: 12 }}>
                    {success}
                    <button className="delete" onClick={() => setSuccess('')}></button>
                  </div>
                )}
                <div className="field has-text-right mb-3">
                  <a
                    href="#"
                    className="is-size-7"
                    style={{ color: '#1277c6' }}
                    onClick={e => { e.preventDefault(); setForgotMode(true); setForgotMsg(''); }}
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
                <button
                  className={`button is-link is-fullwidth is-medium${loading ? ' is-loading' : ''}`}
                  type="submit"
                  style={{
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 18,
                    padding: '1.1rem 0',
                    marginTop: 8,
                    boxShadow: '0 2px 12px #1277c640',
                  }}
                  disabled={loading}
                >
                  {registerMode ? "Créer mon compte" : "Se connecter"}
                </button>
                <div className="has-text-centered mt-3">
                  <button
                    type="button"
                    className="button is-text"
                    style={{ color: '#1277c6', fontWeight: 700 }}
                    onClick={() => {
                      setRegisterMode(!registerMode);
                      setError('');
                    }}
                  >
                    {registerMode ? "J'ai déjà un compte" : "Créer un compte"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
