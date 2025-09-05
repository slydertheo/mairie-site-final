import React, { useEffect, useState } from 'react';

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
  const [content, setContent] = useState({});

  useEffect(() => {
    fetch('/api/pageContent?page=demarches')
      .then(res => res.json())
      .then(data => {
        setContent(data[0] || {});
      });
  }, []);

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
              {content.titre || "Bienvenue sur le site officiel de la Mairie de "}
              <span style={{ color: '#ffd700', textShadow: '0 2px 8px #1277c6' }}>Friesen</span>
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
          <div className="columns is-variable is-5">
            {/* Colonne 1 : Démarches rapides */}
            <div className="column is-half">
              <h2 className="title is-5 has-text-primary mb-3">Démarches rapides</h2>
              <QuickBox icon="📄" label={content.demarche_rapide_1_label || "Demande d’acte de naissance"} href={content.demarche_rapide_1_url || "#"} />
              <QuickBox icon="👨‍👩‍👧‍👦" label={content.demarche_rapide_2_label || "Livret de famille"} href={content.demarche_rapide_2_url || "#"} />
              <QuickBox icon="📝" label={content.demarche_rapide_3_label || "S'inscrire à Friesen"} href={content.demarche_rapide_3_url || "#"} />
              <QuickBox icon="🗳️" label={content.demarche_rapide_4_label || "Inscription sur les listes électorales"} href={content.demarche_rapide_4_url || "#"} />
              <QuickBox icon="🪪" label={content.demarche_rapide_5_label || "CNI / Passeport (Altkirch)"} href={content.demarche_rapide_5_url || "#"} />
              <QuickBox icon="🎖️" label={content.demarche_rapide_6_label || "Recensement militaire"} href={content.demarche_rapide_6_url || "#"} />
              <QuickBox icon="🤝" label={content.demarche_rapide_7_label || "Espace France Services"} href={content.demarche_rapide_7_url || "#"} />
            </div>
            {/* Colonne 2 : Urbanisme et autres liens */}
            <div className="column is-half">
              <h2 className="title is-5 has-text-primary mb-3">Urbanisme</h2>
              <QuickBox icon="🗺️" label={content.urbanisme_1_label || "Plan carte communale"} href={content.urbanisme_1_url || "#"} />
              <QuickBox icon="📄" label={content.urbanisme_2_label || "Règlement téléchargeable"} href={content.urbanisme_2_url || "#"} />
              <QuickBox icon="📝" label={content.urbanisme_3_label || "Formulaires permis de construire (Guichet unique PETR)"} href={content.urbanisme_3_url || "#"} />
              <QuickBox icon="📐" label={content.urbanisme_4_label || "Cadastre (éditer/consulter un plan)"} href={content.urbanisme_4_url || "#"} />
              <div className="box mt-5" style={{ background: '#f4f8fb', border: '1.5px solid #e0e7ef', borderRadius: 14 }}>
                <h3 className="subtitle is-6 has-text-link mb-2">Autres démarches utiles</h3>
                <ul style={{ paddingLeft: 18, fontSize: 15 }}>
                  <li>
                    <a href={content.autre_1_url || "#"} target="_blank" rel="noopener noreferrer" className="has-text-link is-underlined">
                      {content.autre_1_label || "Portail Service Public"}
                    </a>
                  </li>
                  <li>
                    <a href={content.autre_2_url || "#"} target="_blank" rel="noopener noreferrer" className="has-text-link is-underlined">
                      {content.autre_2_label || "Demander un acte d'état civil"}
                    </a>
                  </li>
                  <li>
                    <a href={content.autre_3_url || "#"} target="_blank" rel="noopener noreferrer" className="has-text-link is-underlined">
                      {content.autre_3_label || "Mariage / PACS"}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}