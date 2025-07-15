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
  const [active, setActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState('danger'); // 'danger' ou 'success'
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
            {/* Lien Admin visible pour tous */}
            <div className="navbar-item">
              <Link
                href="/Interface_admin"
                className="button is-warning is-rounded"
                style={{
                  fontWeight: 700,
                  fontSize: 17,
                  marginRight: 10,
                  boxShadow: '0 2px 12px #f7b50040',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 18px',
                  transition: 'background 0.2s, box-shadow 0.2s',
                }}
              >
                <span>Admin</span>
              </Link>
            </div>
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
