import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.min.css';
import Link from 'next/link';
import useHeroImage from '../hooks/useHeroImage';

export default function Intercommunalite() {
  const heroImage = useHeroImage();
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetch('/api/pageContent?page=intercommunalite')
      .then(res => res.json())
      .then(data => setContent(data[0] || null));
  }, []);

  return (
    <>
      {/* En-tête hero */}
      <section
        className="hero is-primary is-medium"
        style={{
          backgroundImage: `linear-gradient(180deg,rgba(10,37,64,0.55),rgba(10,37,64,0.25)),url("${heroImage}")`,
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

      {/* Contenu principal */}
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
            Intercommunalité et partenaires territoriaux
          </h1>
          
          <div className="content mb-5">
            <div className="notification is-info is-light">
              <p className="is-size-5 mb-3">
                <strong>Friesen, commune engagée dans la coopération territoriale</strong>
              </p>
              <p>
                Notre commune s'inscrit dans une dynamique de coopération territoriale à travers son appartenance 
                à plusieurs structures intercommunales. Ces partenariats permettent de mutualiser les ressources, 
                de développer des projets d'envergure et d'offrir des services de qualité aux habitants tout en 
                préservant l'identité et les spécificités de notre village.
              </p>
            </div>
          </div>

          {/* --- Organismes dynamiques (modifiables via admin) --- */}
          {content?.organismes && content.organismes.length > 0 && (
            <>
              <h2 className="title is-4 has-text-primary mb-4">
                {typeof content?.titre_organismes === 'string' && content.titre_organismes.trim()
                  ? content.titre_organismes
                  : "Organismes intercommunaux"}
              </h2>
              {content.organismes.map((organisme, idx) => (
                <div key={idx} className="box mb-6" style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 2px 12px #1277c620',
                  background: '#f8fafc',
                }}>
                  <div className="columns">
                    <div className="column is-one-quarter">
                      {organisme.logo && (
                        <figure className="image" style={{ maxWidth: 240, margin: '0 auto' }}>
                          <img src={organisme.logo} alt={`Logo ${organisme.nom}`} style={{ objectFit: 'contain', maxHeight: 120 }} />
                        </figure>
                      )}
                      {organisme.siteWeb && (
                        <div className="has-text-centered mt-4">
                          <a href={organisme.siteWeb} target="_blank" rel="noopener noreferrer" className="button is-link">
                            Visiter le site web
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="column">
                      <h2 className="title is-4 has-text-primary mb-3">{organisme.nom}</h2>
                      <p className="mb-4">{organisme.description}</p>
                      {organisme.competences && organisme.competences.length > 0 && (
                        <>
                          <h3 className="title is-5 has-text-link mb-2">Principales compétences</h3>
                          <div className="tags">
                            {organisme.competences.map((c, i) => (
                              <span key={i} className="tag is-info is-light">{c}</span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Projets dynamiques */}
          {content?.projets && content.projets.length > 0 && (
            <div className="box mt-6" style={{ 
              borderRadius: 16, 
              boxShadow: '0 2px 12px #1277c620',
              background: '#f0f7fd',
              padding: '2rem',
              marginTop: 50
            }}>
              <h2 className="title is-4 has-text-primary mb-4">
                {typeof content?.titre_projets === 'string' && content.titre_projets.trim()
                  ? content.titre_projets
                  : "Projets intercommunaux en cours"}
              </h2>
              <div className="columns is-multiline">
                {content.projets.map((proj, idx) => (
                  <div className="column is-half" key={idx}>
                    <div className="media">
                      {proj.image && (
                        <figure className="media-left">
                          <p className="image is-64x64">
                            <img 
                              src={proj.image} 
                              alt={proj.titre} 
                              style={{ borderRadius: 8, objectFit: 'cover' }}
                            />
                          </p>
                        </figure>
                      )}
                      <div className="media-content">
                        <p className="title is-5">{proj.titre}</p>
                        <p className="subtitle is-6">{proj.structure}</p>
                        <p className="is-size-7">{proj.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Représentants dynamiques */}
          {content?.representants && content.representants.length > 0 && (
            <div className="box mt-5" style={{ 
              borderRadius: 16, 
              boxShadow: '0 2px 12px #1277c620',
              background: '#f8fafc',
            }}>
              <h2 className="title is-4 has-text-primary mb-4">
                {typeof content?.titre_representants === 'string' && content.titre_representants.trim()
                  ? content.titre_representants
                  : "Représentants de Friesen dans les instances intercommunales"}
              </h2>
              <table className="table is-fullwidth">
                <thead>
                  <tr className="has-background-link-light">
                    <th>Structure</th>
                    <th>Délégués titulaires</th>
                    <th>Délégués suppléants</th>
                  </tr>
                </thead>
                <tbody>
                  {content.representants.map((rep, idx) => (
                    <tr key={idx}>
                      <td>{rep.structure}</td>
                      <td>{rep.titulaires}</td>
                      <td>{rep.suppleants}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Contact dynamique */}
          {content?.contact && (
            <div className="has-text-centered mt-6">
              <p className="mb-4">{content.contact}</p>
              <Link href="/contact" className="button is-link">
                Contactez la mairie
              </Link>
            </div>
          )}

          {/* Contact pour en savoir plus */}
          <div className="has-text-centered mt-6">
            <p className="mb-4">
              Vous souhaitez en savoir plus sur les projets intercommunaux qui concernent notre commune ?
            </p>
            <Link href="/contact" className="button is-link">
              Contactez la mairie
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}