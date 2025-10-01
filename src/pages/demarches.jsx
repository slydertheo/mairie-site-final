import React, { useEffect, useState } from 'react';

function QuickBox({ icon, label, href, isFile }) {
  // Déterminer si c'est un PDF (soit par le flag isFile ou par l'extension .pdf)
  const isPdf = isFile || (href && href.toLowerCase().endsWith('.pdf'));
  
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
      <span style={{ fontSize: 32 }}>{isPdf ? '📄' : icon}</span>
      <div>
        {label}
        {isPdf && <span className="tag is-small is-info is-light ml-2">PDF</span>}
      </div>
    </a>
  );
}

export default function Demarches() {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/pageContent?page=demarches')
      .then(res => res.json())
      .then(data => {
        setContent(data[0] || {});
      })
      .catch(err => {
        console.error("Erreur lors du chargement des démarches:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Créer des arrays à partir des données pour faciliter le rendu
  const demarchesRapides = [];
  const demarchesUrbanisme = [];
  const demarchesAutres = [];

  // Extraire les démarches rapides
  for (let i = 1; i <= 20; i++) {
    const labelKey = `demarche_rapide_${i}_label`;
    const urlKey = `demarche_rapide_${i}_url`;
    const iconKey = `demarche_rapide_${i}_icon`;
    if (content[labelKey]) {
      demarchesRapides.push({
        id: i,
        label: content[labelKey],
        url: content[urlKey] || '#',
        isFile: content[urlKey]?.toLowerCase().endsWith('.pdf') || false,
        icon: content[iconKey] || "📄"
      });
    }
  }

  // Extraire les démarches urbanisme
  for (let i = 1; i <= 20; i++) {
    const labelKey = `urbanisme_${i}_label`;
    const urlKey = `urbanisme_${i}_url`;
    const iconKey = `urbanisme_${i}_icon`;
    if (content[labelKey]) {
      demarchesUrbanisme.push({
        id: i,
        label: content[labelKey],
        url: content[urlKey] || '#',
        isFile: content[urlKey]?.toLowerCase().endsWith('.pdf') || false,
        icon: content[iconKey] || "🏡"
      });
    }
  }

  // Extraire les autres démarches
  for (let i = 1; i <= 20; i++) {
    const labelKey = `autre_${i}_label`;
    const urlKey = `autre_${i}_url`;
    const iconKey = `autre_${i}_icon`;
    if (content[labelKey]) {
      demarchesAutres.push({
        id: i,
        label: content[labelKey],
        url: content[urlKey] || '#',
        isFile: content[urlKey]?.toLowerCase().endsWith('.pdf') || false,
        icon: content[iconKey] || "🔗"
      });
    }
  }

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
              {content.hero_titre || <>Bienvenue sur le site officiel de<br />la Mairie de <span style={{ color: '#ffd700', textShadow: '0 2px 8px #1277c6' }}>Friesen</span></>}
            </h1>
            {content.intro && <p className="subtitle is-5" style={{ color: '#fff' }}>{content.intro}</p>}
          </div>
        </div>
      </section>

      {/* Contenu démarches */}
      <section className="section" style={{ background: '#fafdff', minHeight: '100vh', marginTop: 0 }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <h1 className="title is-3 has-text-link mb-5" style={{ textAlign: 'center' }}>
            {content.titre || "Démarches administratives"}
          </h1>

          {loading ? (
            <div className="has-text-centered py-6">
              <span className="icon is-large">
                <i className="fas fa-spinner fa-pulse fa-2x"></i>
              </span>
              <p className="mt-2">Chargement des démarches...</p>
            </div>
          ) : (
            <div className="columns is-variable is-5">
              {/* Colonne 1 : Démarches rapides */}
              <div className="column is-half">
                <h2 className="title is-5 has-text-primary mb-3">Démarches rapides</h2>
                {demarchesRapides.length === 0 ? (
                  <div className="notification is-light is-info">
                    Aucune démarche rapide n'a été configurée.
                  </div>
                ) : (
                  demarchesRapides.map((demarche) => (
                    <QuickBox 
                      key={demarche.id}
                      icon={demarche.icon}
                      label={demarche.label}
                      href={demarche.url}
                      isFile={demarche.isFile}
                    />
                  ))
                )}
              </div>

              {/* Colonne 2 : Urbanisme et autres liens */}
              <div className="column is-half">
                <h2 className="title is-5 has-text-primary mb-3">Urbanisme</h2>
                {demarchesUrbanisme.length === 0 ? (
                  <div className="notification is-light is-info">
                    Aucune démarche d'urbanisme n'a été configurée.
                  </div>
                ) : (
                  demarchesUrbanisme.map((demarche) => (
                    <QuickBox 
                      key={demarche.id}
                      icon={demarche.icon}
                      label={demarche.label}
                      href={demarche.url}
                      isFile={demarche.isFile}
                    />
                  ))
                )}

                {/* Autres démarches */}
                <div className="box mt-5" style={{ background: '#f4f8fb', border: '1.5px solid #e0e7ef', borderRadius: 14 }}>
                  <h3 className="subtitle is-6 has-text-link mb-2">Autres démarches utiles</h3>
                  {demarchesAutres.length === 0 ? (
                    <div className="notification is-light is-info is-size-7 py-2">
                      Aucune autre démarche n'a été configurée.
                    </div>
                  ) : (
                    <ul style={{ paddingLeft: 18, fontSize: 15 }}>
                      {demarchesAutres.map(demarche => (
                        <li key={demarche.id}>
                          <span style={{ fontSize: 20, marginRight: 6 }}>{demarche.icon}</span>
                          <a 
                            href={demarche.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="has-text-link is-underlined"
                          >
                            {demarche.label}
                            {demarche.isFile && <span className="tag is-small is-info is-light ml-1">PDF</span>}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* PDF Règlement */}
                {content.pdf_reglement_label && content.pdf_reglement_url && (
                  <div className="has-text-centered mt-4">
                    <a 
                      href={content.pdf_reglement_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="button is-link is-outlined"
                    >
                      <span className="icon">
                        <i className="fas fa-file-pdf"></i>
                      </span>
                      <span>{content.pdf_reglement_label}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}