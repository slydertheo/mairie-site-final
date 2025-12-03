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
  { href: '/demarches', label: 'Démarches', color: '#A8D8EA', hoverColor: '#7EC8E3' }, // Bleu pastel
  { href: '/ecoles', label: 'École Evelyne Nirouet', color: '#C9B8E4', hoverColor: '#B39DDB' }, // Lavande pastel
  { href: '/commerces', label: 'Commerces', color: '#FFB4B4', hoverColor: '#FF9898' }, // Rose pastel
  { href: '/intercommunalite', label: 'Intercommunalité', color: '#A3D9C9', hoverColor: '#7DC7B6' }, // Turquoise pastel
  { href: '/associations', label: 'Associations', color: '#B4E7B4', hoverColor: '#95DB95' }, // Vert pastel
  { href: '/decouvrir_friesen', label: 'Découvrir Friesen', color: '#FFD4A3', hoverColor: '#FFC780' }, // Pêche pastel
  { href: '/infos_pratiques', label: 'Infos Pratiques', color: '#C5DCFA', hoverColor: '#A3C7F2' }, // Bleu ciel pastel
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
              src={getCurrentPageImage()}
              alt="Logo de la mairie de Friesen"
              style={{
                height: 50,
                width: 50,
                objectFit: 'contain',
                borderRadius: '50%',
                boxShadow: '0 2px 8px #1277c620',
                marginRight: 12,
              }}
              onError={(e) => {
                e.currentTarget.src = '/LogoFriesen.png';
              }}
            />
            <span style={{
              fontWeight: 800,
              fontSize: 24,
              color: '#1277c6',
              background: 'linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%)',
              padding: '8px 20px',
              borderRadius: '12px',
              letterSpacing: 1.2,
              fontFamily: 'Segoe UI, Arial, sans-serif',
              userSelect: 'none',
              boxShadow: '0 2px 8px rgba(255, 217, 61, 0.4)',
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

        <div id="navbarBasic" className={`navbar-menu ${active ? 'is-active' : ''}`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', paddingLeft: '60px' }}>
          <div className="navbar-start" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="navbar-item"
                onClick={() => setActive(false)}
                style={{
                  fontWeight: 500,
                  color: '#2d3748',
                  fontSize: 15,
                  letterSpacing: 0.3,
                  margin: '0',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: `0 1px 4px ${link.color}30`,
                  transition: 'all 0.25s ease',
                  background: link.color,
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
          <div className="navbar-end" style={{ position: 'absolute', right: '20px', display: 'flex', gap: '12px' }}>
            {/* Lien Admin visible pour tous */}
            <Link
              href="/Interface_admin"
              style={{
                fontWeight: 600,
                fontSize: 16,
                background: '#FFB4D5',
                color: '#2d3748',
                boxShadow: '0 1px 4px #FFB4D530',
                border: 'none',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 22px',
                padding: '8px 18px',
                transition: 'all 0.25s ease',
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
              style={{
                fontWeight: 600,
                fontSize: 16,
                background: '#B4E7FF',
                color: '#2d3748',
                boxShadow: '0 1px 4px #B4E7FF30',
                border: 'none',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 22px',
                transition: 'all 0.25s ease',
              }}
              onClick={handleLoginClick}
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
