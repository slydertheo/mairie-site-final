function QuickBox({ icon, label, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="box is-flex is-align-items-center"
      style={{
        background: '#fff',
        gap: 12,
        fontWeight: 600,
        fontSize: 17,
        color: '#1277c6',
        border: '1.5px solid #e0e7ef',
        borderRadius: 12,
        marginBottom: 18,
        transition: 'box-shadow 0.18s, border 0.18s',
        cursor: 'pointer',
        textDecoration: 'none',
        boxShadow: '0 1px 6px #1277c610',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 4px 16px #1277c620';
        e.currentTarget.style.border = '1.5px solid #1277c6';
        e.currentTarget.style.background = '#fafdff';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 1px 6px #1277c610';
        e.currentTarget.style.border = '1.5px solid #e0e7ef';
        e.currentTarget.style.background = '#fff';
      }}
    >
      <span style={{ fontSize: 32 }}>{icon}</span>
      {label}
    </a>
  );
}

export default function Demarches() {
  return (
    <>
      {/* En-tête hero */}
      <section
        className="hero is-primary is-medium"
        style={{
          backgroundImage: 'linear-gradient(180deg,rgba(10,37,64,0.55),rgba(10,37,64,0.25)),url("village.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '0 0 32px 32px',
          boxShadow: '0 8px 32px #0a254030',
          marginBottom: 0,
        }}
      >
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title is-2 has-text-weight-bold" style={{ color: '#fff', textShadow: '0 4px 24px #0a2540a0', letterSpacing: 1 }}>
              Bienvenue sur le site officiel de<br />
              la Mairie de <span style={{ color: '#ffd700', textShadow: '0 2px 8px #1277c6' }}>Friesen</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Contenu démarches */}
      <section
        className="section"
        style={{
          background: '#fafdff',
          minHeight: '100vh',
          marginTop: 0,
        }}
      >
        <div className="container" style={{ maxWidth: 1100 }}>
          <h1 className="title is-3 has-text-link mb-5" style={{ textAlign: 'center' }}>
            Démarches administratives
          </h1>
          <div className="columns is-variable is-5">
            {/* Colonne 1 : Démarches rapides */}
            <div className="column is-half">
              <h2 className="title is-5 has-text-primary mb-3">Démarches rapides</h2>
              <QuickBox icon="📄" label="Demande d’acte de naissance" href="https://www.service-public.fr/particuliers/vosdroits/R1406" />
              <QuickBox icon="👨‍👩‍👧‍👦" label="Livret de famille" href="https://www.service-public.fr/particuliers/vosdroits/F119" />
              <QuickBox icon="📝" label="S'inscrire à Friesen" href="https://www.service-public.fr/particuliers/vosdroits/F1372" />
              <QuickBox icon="🗳️" label="Inscription sur les listes électorales" href="https://www.service-public.fr/particuliers/vosdroits/F1367" />
              <QuickBox icon="🪪" label="CNI / Passeport (Altkirch)" href="https://www.mairie-altkirch.fr/demarches/carte-nationale-didentite-et-passeport/" />
              <QuickBox icon="🎖️" label="Recensement militaire" href="https://www.service-public.fr/particuliers/vosdroits/F870" />
              <QuickBox icon="🤝" label="Espace France Services" href="https://www.france-services.gouv.fr/" />
            </div>
            {/* Colonne 2 : Urbanisme et autres liens */}
            <div className="column is-half">
              <h2 className="title is-5 has-text-primary mb-3">Urbanisme</h2>
              <QuickBox icon="🗺️" label="Point carte communale" href="https://www.geoportail-urbanisme.gouv.fr/" />
              <QuickBox icon="📄" label="Règlement téléchargeable" href="/docs/reglement-urbanisme.pdf" />
              <QuickBox icon="📝" label="Formulaires permis de construire (Guichet unique PETR)" href="https://guichet-unique.alsace-sud.fr/" />
              <QuickBox icon="📐" label="Cadastre (éditer/consulter un plan)" href="https://www.cadastre.gouv.fr/" />
              <div className="box mt-5" style={{ background: '#f4f8fb', border: '1.5px solid #e0e7ef', borderRadius: 14 }}>
                <h3 className="subtitle is-6 has-text-link mb-2">Autres démarches utiles</h3>
                <ul style={{ paddingLeft: 18, fontSize: 15 }}>
                  <li><a href="https://www.service-public.fr/" target="_blank" rel="noopener noreferrer" className="has-text-link is-underlined">Portail Service Public</a></li>
                  <li><a href="https://www.service-public.fr/particuliers/vosdroits/N19806" target="_blank" rel="noopener noreferrer" className="has-text-link is-underlined">Demander un acte d'état civil</a></li>
                  <li><a href="https://www.service-public.fr/particuliers/vosdroits/N19810" target="_blank" rel="noopener noreferrer" className="has-text-link is-underlined">Mariage / PACS</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}