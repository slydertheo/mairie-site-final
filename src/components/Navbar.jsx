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
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess("Connexion réussie !");
        setError('');
        setErrorType('success');
        setTimeout(() => {
          setShowModal(false);
          window.location.reload();
        }, 1200);
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
        padding: '12px 40px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)',
        borderBottom: '1px solid rgba(18,119,198,0.08)',
        boxShadow: '0 4px 20px rgba(10,37,64,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(12px)',
        flexWrap: 'wrap',
      }}>
        {/* Logo à gauche */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          textDecoration: 'none',
          flex: '0 0 auto',
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <img
            src="/LogoFriesen.png"
            alt="Logo de la mairie de Friesen"
            style={{
              height: 55,
              width: 55,
              objectFit: 'contain',
              borderRadius: '50%',
              boxShadow: '0 4px 16px rgba(18,119,198,0.25)',
              border: '3px solid rgba(255,230,109,0.5)',
              background: 'white',
              padding: 2,
            }}
          />
          <span style={{
            fontWeight: 900,
            fontSize: 22,
            background: 'linear-gradient(135deg, #FFE66D 0%, #FFC837 50%, #FFD93D 100%)',
            color: '#1277c6',
            padding: '10px 24px',
            borderRadius: 14,
            letterSpacing: 1.5,
            fontFamily: 'Segoe UI, Arial, sans-serif',
            userSelect: 'none',
            boxShadow: '0 4px 12px rgba(255, 200, 55, 0.35), inset 0 2px 4px rgba(255,255,255,0.4)',
            whiteSpace: 'nowrap',
            position: 'relative',
          }}>
            Mairie Friesen
          </span>
        </Link>

        {/* Menu burger pour mobile */}
        <button
          className={`navbar-burger ${active ? 'is-active' : ''}`}
          onClick={() => setActive(!active)}
          aria-label="Menu"
          style={{
            display: 'none',
            background: active ? 'rgba(18,119,198,0.1)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '10px',
            borderRadius: 8,
            transition: 'all 0.3s ease',
          }}
        >
          <span style={{ 
            display: 'block', 
            width: 26, 
            height: 3, 
            background: '#1277c6', 
            margin: '5px 0', 
            borderRadius: 2,
            transition: 'all 0.3s ease',
            transform: active ? 'rotate(45deg) translateY(8px)' : 'none',
          }}></span>
          <span style={{ 
            display: 'block', 
            width: 26, 
            height: 3, 
            background: '#1277c6', 
            margin: '5px 0', 
            borderRadius: 2,
            transition: 'all 0.3s ease',
            opacity: active ? 0 : 1,
          }}></span>
          <span style={{ 
            display: 'block', 
            width: 26, 
            height: 3, 
            background: '#1277c6', 
            margin: '5px 0', 
            borderRadius: 2,
            transition: 'all 0.3s ease',
            transform: active ? 'rotate(-45deg) translateY(-8px)' : 'none',
          }}></span>
        </button>

        {/* Liens au centre */}
        <div className={`navbar-links ${active ? 'is-active' : ''}`} style={{
          display: 'flex',
          gap: 10,
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
                  color: isActive ? '#fff' : '#1277c6',
                  background: isActive ? 'linear-gradient(135deg, #1277c6 0%, #0a5ea8 100%)' : 'rgba(18,119,198,0.05)',
                  textDecoration: 'none',
                  fontWeight: isActive ? 700 : 500,
                  padding: '10px 18px',
                  borderRadius: 10,
                  fontSize: 14.5,
                  letterSpacing: 0.4,
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isActive ? '0 4px 12px rgba(18,119,198,0.25)' : '0 2px 6px rgba(18,119,198,0.08)',
                  whiteSpace: 'nowrap',
                  border: isActive ? 'none' : '1px solid rgba(18,119,198,0.15)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(18,119,198,0.12)';
                    e.currentTarget.style.color = '#0a5ea8';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(18,119,198,0.15)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(18,119,198,0.05)';
                    e.currentTarget.style.color = '#1277c6';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(18,119,198,0.08)';
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
          gap: 10,
          flex: '0 0 auto',
        }}>
          <Link
            href="/Interface_admin"
            onClick={() => setActive(false)}
            style={{
              fontWeight: 600,
              fontSize: 14.5,
              background: 'linear-gradient(135deg, #FFB4D5 0%, #FF99C8 100%)',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(255,153,200,0.3)',
              border: 'none',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #FF99C8 0%, #FF6FB5 100%)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,111,181,0.4)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #FFB4D5 0%, #FF99C8 100%)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,153,200,0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: 18 }}>⚙️</span>
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
              background: 'linear-gradient(135deg, #1277c6 0%, #0a5ea8 100%)',
              color: '#fff',
              borderRadius: 10,
              padding: '10px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontWeight: 600,
              fontSize: 14.5,
              boxShadow: '0 4px 12px rgba(18,119,198,0.35)',
              border: 'none',
              textDecoration: 'none',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              whiteSpace: 'nowrap',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #0a5ea8 0%, #084785 100%)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(10,57,112,0.5)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #1277c6 0%, #0a5ea8 100%)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(18,119,198,0.35)';
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
        @media (max-width: 1200px) {
          nav {
            padding: 10px 24px !important;
          }
          .navbar-links {
            gap: 8px !important;
          }
          .navbar-links a {
            font-size: 13.5px !important;
            padding: 8px 14px !important;
          }
        }

        @media (max-width: 1024px) {
          nav {
            padding: 10px 20px !important;
          }
          .navbar-links {
            gap: 6px !important;
          }
          .navbar-links a {
            font-size: 13px !important;
            padding: 7px 12px !important;
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
            background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%);
            backdrop-filter: blur(16px);
            flex-direction: column;
            padding: 24px;
            box-shadow: 0 8px 24px rgba(10,37,64,0.12);
            border-radius: 0 0 16px 16px;
            gap: 12px !important;
            animation: slideDown 0.3s ease;
          }
          .navbar-links.is-active {
            display: flex !important;
          }
          .navbar-links a {
            width: 100%;
            text-align: center;
            padding: 14px 20px !important;
            font-size: 15px !important;
          }
          nav {
            flex-wrap: wrap;
          }
          nav > div:last-child {
            gap: 8px !important;
          }
        }

        @media (max-width: 480px) {
          nav {
            padding: 8px 16px !important;
          }
          nav > div:last-child a {
            font-size: 13px !important;
            padding: 8px 12px !important;
          }
          nav > div:last-child a span:last-child {
            display: none;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

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
