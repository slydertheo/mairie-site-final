import React from 'react';
import 'bulma/css/bulma.min.css';
import Link from 'next/link';

export default function Intercommunalite() {
  // Liste des organismes intercommunaux
  const organismes = [
    {
      id: "ccsal",
      nom: "Communauté de Communes Sud Alsace Largue (CCSAL)",
      logo: "https://www.sudalsace-largue.fr/wp-content/uploads/2019/08/logo_ccsal-300x137.png",
      description: "La Communauté de Communes Sud Alsace Largue regroupe 44 communes dont Friesen. Elle exerce des compétences essentielles dans l'aménagement du territoire, le développement économique, la gestion des déchets, et bien d'autres domaines pour améliorer le quotidien des habitants.",
      siteWeb: "https://www.sudalsace-largue.fr/",
      competences: [
        "Développement économique",
        "Aménagement de l'espace communautaire",
        "Gestion des milieux aquatiques",
        "Collecte et traitement des déchets ménagers",
        "Politique du logement et cadre de vie",
        "Protection et mise en valeur de l'environnement",
        "Actions sociales"
      ]
    },
    {
      id: "petr",
      nom: "Pôle d'Équilibre Territorial et Rural (PETR) du Pays du Sundgau",
      logo: "https://www.pays-sundgau.fr/media/4ef/107501-tampon_petr_noir-03-01.svg",
      description: "Le PETR du Pays du Sundgau est un établissement public qui regroupe les Communautés de Communes Sud Alsace Largue et Sundgau. Il élabore et met en œuvre le projet de territoire partagé pour un développement économique, écologique, culturel et social équilibré.",
      siteWeb: "https://www.pays-sundgau.fr/",
      competences: [
        "Schéma de Cohérence Territoriale (SCoT)",
        "Plan Climat Air Énergie Territorial (PCAET)",
        "Programme LEADER (fonds européens)",
        "Conseil en mobilité",
        "Développement touristique",
        "Habitat et urbanisme"
      ]
    },
    {
      id: "epage",
      nom: "Établissement Public d'Aménagement et de Gestion des Eaux (EPAGE) Largue",
      logo: "https://www.epage-largue.eu/medias/2021/10/logo.png",
      description: "L'EPAGE Largue est un syndicat mixte assurant la gestion de l'eau et des milieux aquatiques sur le bassin versant de la Largue et du Secteur de Montreux. Il intervient dans la prévention des inondations, la préservation des écosystèmes aquatiques et la gestion équilibrée de la ressource en eau.",
      siteWeb: "https://www.epage-largue.eu/",
      competences: [
        "Gestion des milieux aquatiques (GEMAPI)",
        "Prévention des inondations",
        "Restauration des cours d'eau",
        "Animation des sites Natura 2000",
        "Lutte contre la pollution diffuse",
        "Sensibilisation et éducation à l'environnement"
      ]
    }
  ];

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

          {/* Liste des organismes intercommunaux */}
          {organismes.map((organisme) => (
            <div key={organisme.id} className="box mb-6" style={{ 
              borderRadius: 16, 
              overflow: 'hidden',
              boxShadow: '0 2px 12px #1277c620',
              background: '#f8fafc',
            }}>
              <div className="columns">
                <div className="column is-one-quarter">
                  <figure className="image" style={{ maxWidth: 240, margin: '0 auto' }}>
                    <img 
                      src={organisme.logo} 
                      alt={`Logo ${organisme.nom}`} 
                      style={{ objectFit: 'contain', maxHeight: 120 }}
                    />
                  </figure>
                  <div className="has-text-centered mt-4">
                    <a 
                      href={organisme.siteWeb} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="button is-link"
                    >
                      Visiter le site web
                    </a>
                  </div>
                </div>
                <div className="column">
                  <h2 className="title is-4 has-text-primary mb-3">{organisme.nom}</h2>
                  <p className="mb-4">
                    {organisme.description}
                  </p>
                  
                  <h3 className="title is-5 has-text-link mb-2">Principales compétences</h3>
                  <div className="tags">
                    {organisme.competences.map((competence, index) => (
                      <span key={index} className="tag is-info is-light">{competence}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Section pour les projets intercommunaux */}
          <div className="box mt-6" style={{ 
            borderRadius: 16, 
            boxShadow: '0 2px 12px #1277c620',
            background: '#f0f7fd',
            padding: '2rem',
            marginTop: 50
          }}>
            <h2 className="title is-4 has-text-primary mb-4">Projets intercommunaux en cours</h2>
            <div className="columns is-multiline">
              <div className="column is-half">
                <div className="media">
                  <figure className="media-left">
                    <p className="image is-64x64">
                      <img 
                        src="https://images.unsplash.com/photo-1569466126773-842a038eae3e?auto=format&fit=crop&w=200&q=80" 
                        alt="Projet mobilité" 
                        style={{ borderRadius: 8, objectFit: 'cover' }}
                      />
                    </p>
                  </figure>
                  <div className="media-content">
                    <p className="title is-5">Plan de mobilité durable</p>
                    <p className="subtitle is-6">PETR du Pays du Sundgau</p>
                    <p className="is-size-7">
                      Développement des transports en commun et mobilités douces entre les communes du territoire
                    </p>
                  </div>
                </div>
              </div>
              <div className="column is-half">
                <div className="media">
                  <figure className="media-left">
                    <p className="image is-64x64">
                      <img 
                        src="https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=200&q=80" 
                        alt="Projet rivière" 
                        style={{ borderRadius: 8, objectFit: 'cover' }}
                      />
                    </p>
                  </figure>
                  <div className="media-content">
                    <p className="title is-5">Renaturation de la Largue</p>
                    <p className="subtitle is-6">EPAGE Largue</p>
                    <p className="is-size-7">
                      Restauration des berges et aménagement des zones humides pour prévenir les inondations
                    </p>
                  </div>
                </div>
              </div>
              <div className="column is-half">
                <div className="media">
                  <figure className="media-left">
                    <p className="image is-64x64">
                      <img 
                        src="https://images.unsplash.com/photo-1565631415828-349fa85dbf14?auto=format&fit=crop&w=200&q=80" 
                        alt="Projet numérique" 
                        style={{ borderRadius: 8, objectFit: 'cover' }}
                      />
                    </p>
                  </figure>
                  <div className="media-content">
                    <p className="title is-5">Transition numérique</p>
                    <p className="subtitle is-6">CCSAL</p>
                    <p className="is-size-7">
                      Déploiement de la fibre optique et formation aux outils numériques
                    </p>
                  </div>
                </div>
              </div>
              <div className="column is-half">
                <div className="media">
                  <figure className="media-left">
                    <p className="image is-64x64">
                      <img 
                        src="https://images.unsplash.com/photo-1501084291732-13b1ba8f0ebc?auto=format&fit=crop&w=200&q=80" 
                        alt="Projet tourisme" 
                        style={{ borderRadius: 8, objectFit: 'cover' }}
                      />
                    </p>
                  </figure>
                  <div className="media-content">
                    <p className="title is-5">Circuit touristique du Sundgau</p>
                    <p className="subtitle is-6">PETR du Pays du Sundgau</p>
                    <p className="is-size-7">
                      Valorisation du patrimoine local et développement de l'offre touristique
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section élus intercommunaux */}
          <div className="box mt-5" style={{ 
            borderRadius: 16, 
            boxShadow: '0 2px 12px #1277c620',
            background: '#f8fafc',
          }}>
            <h2 className="title is-4 has-text-primary mb-4">Représentants de Friesen dans les instances intercommunales</h2>
            
            <table className="table is-fullwidth">
              <thead>
                <tr className="has-background-link-light">
                  <th>Structure</th>
                  <th>Délégués titulaires</th>
                  <th>Délégués suppléants</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>CCSAL</td>
                  <td>Jean Dupont, Marie Martin</td>
                  <td>Pierre Schmitt</td>
                </tr>
                <tr>
                  <td>PETR du Pays du Sundgau</td>
                  <td>Jean Dupont</td>
                  <td>Sophie Weber</td>
                </tr>
                <tr>
                  <td>EPAGE Largue</td>
                  <td>Claude Meyer</td>
                  <td>Thomas Keller</td>
                </tr>
              </tbody>
            </table>
            
            <p className="has-text-grey is-size-7 mt-2">
              * Les noms mentionnés sont fictifs et à remplacer par les véritables représentants de la commune
            </p>
          </div>
          
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