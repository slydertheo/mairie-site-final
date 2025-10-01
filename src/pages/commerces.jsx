import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.min.css';
import Link from 'next/link';

export default function Commerces() {
  const [commerces, setCommerces] = useState([]);
  const [content, setContent] = useState({});
  const [marches, setMarches] = useState([]);

  useEffect(() => {
    fetch('/api/commerces').then(res => res.json()).then(setCommerces);
    fetch('/api/pageContent?page=commerces')
      .then(res => res.json())
      .then(data => {
        const obj = {};
        data.forEach(d => { obj[d.section] = d.contenu || d.titre; });
        setContent(obj);
      });
    fetch('/api/marches').then(res => res.json()).then(setMarches);
  }, []);

  // Fonction pour formater une catégorie
  const formatCategory = (category) => {
    switch(category) {
      case 'alimentaire': return '🍎 Commerces alimentaires';
      case 'restauration': return '🍽️ Restaurants et cafés';
      case 'services': return '🛠️ Services';
      case 'artisanat': return '🔨 Artisanat local';
      default: return category;
    }
  };

  return (
    <>
      {/* En-tête hero */}
      <section
        className="hero is-primary is-medium"
        style={{
          backgroundImage: 'linear-gradient(180deg,rgba(10,37,64,0.6),rgba(10,37,64,0.3)),url("village.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '0 0 40px 40px',
          boxShadow: '0 10px 40px #0a254040',
          marginBottom: 0,
          position: 'relative'
        }}
      >
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title is-1 has-text-weight-bold" style={{ color: '#fff', textShadow: '0 4px 24px #0a2540a0', letterSpacing: 1.5, fontSize: '3rem' }}>
              {content.hero_titre || <>Bienvenue sur le site officiel de<br />la Mairie de <span style={{ color: '#ffd700', textShadow: '0 2px 8px #1277c6' }}>Friesen</span></>}
            </h1>
            <p className="subtitle is-4" style={{ color: '#e0e7ef', marginTop: 20 }}>
              Découvrez nos commerces et artisans locaux
            </p>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section
        className="section"
        style={{
          background: 'linear-gradient(135deg, #f7fafd 0%, #ffffff 100%)',
          minHeight: '100vh',
          marginTop: 0,
          paddingTop: 40
        }}
      >
        <div className="container" style={{ maxWidth: 1200 }}>
          <h1 className="title is-2 has-text-link mb-5" style={{ textAlign: 'center', letterSpacing: 1, marginBottom: 30 }}>
            {content.titre || "Commerces et artisans à Friesen"}
          </h1>
          
          <div className="content mb-6">
            <div className="notification is-info is-light" style={{ background: '#ffffff', border: '1px solid #e0e7ef', borderRadius: 12, boxShadow: '0 4px 16px #1277c620' }}>
              <p className="is-size-5 mb-3">
                <strong>{content.intro_titre || "Soutenez nos commerces locaux !"}</strong>
              </p>
              <p>
                {content.intro || "La commune de Friesen est fière de ses commerçants et artisans qui participent activement à la vie économique et sociale de notre village. Nous vous invitons à découvrir leurs produits et services de qualité, et à privilégier ces acteurs locaux pour vos achats du quotidien."}
              </p>
            </div>
          </div>

          {/* Liste des commerces par catégorie */}
          {['alimentaire', 'restauration', 'services', 'artisanat'].map(category => (
            <div key={category} className="mb-6">
              <h2 className="title is-3 has-text-primary mb-5" style={{ borderLeft: '5px solid #1277c6', paddingLeft: 15, fontWeight: 600 }}>
                {formatCategory(category)}
              </h2>
              
              <div className="columns is-multiline">
                {commerces.filter(c => c.categorie === category).map(commerce => (
                  <div key={commerce.id} className="column is-half">
                    <div
                      className="card commerce-card"
                      style={{
                        borderRadius: 16,
                        border: '1px solid #e0e7ef',
                        overflow: 'hidden',
                        boxShadow: '0 6px 24px #1277c620',
                        height: '100%',
                        background: '#ffffff',
                        transition: 'all 0.3s ease',
                        position: 'relative'
                      }}
                    >
                      <div className="card-image" style={{ background: '#ffffff', borderBottom: '1px solid #e0e7ef', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                        <figure
                          className="image"
                          style={{
                            aspectRatio: '4/3',
                            overflow: 'hidden',
                            background: '#ffffff',
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                            marginBottom: 0
                          }}
                        >
                          <img
                            src={commerce.image}
                            alt={commerce.nom}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              background: '#ffffff',
                              borderTopLeftRadius: 16,
                              borderTopRightRadius: 16,
                              transition: 'transform 0.3s ease'
                            }}
                            className="commerce-img"
                          />
                        </figure>
                      </div>
                      <div className="card-content" style={{ background: '#ffffff', padding: 20 }}>
                        <span
                          className="tag is-link"
                          style={{
                            position: 'absolute',
                            top: 15,
                            right: 15,
                            zIndex: 2,
                            fontSize: 12,
                            letterSpacing: 0.5,
                            fontWeight: 500
                          }}
                        >
                          {formatCategory(commerce.categorie).split(' ')[0]}
                        </span>
                        <p className="title is-4 has-text-link mb-2" style={{ marginTop: 10 }}>{commerce.nom}</p>
                        <p className="subtitle is-6 mb-4" style={{ color: '#6b7280' }}>{commerce.description}</p>
                        
                        <div className="content">
                          {commerce.adresse && (
                            <p className="has-text-grey mb-2">
                              <span style={{ fontSize: 18, marginRight: 10 }}>📍</span> {commerce.adresse}
                            </p>
                          )}
                          {commerce.telephone && (
                            <p className="has-text-grey mb-2">
                              <span style={{ fontSize: 18, marginRight: 10 }}>📞</span> {commerce.telephone}
                            </p>
                          )}
                          {commerce.horaires && (
                            <p className="has-text-grey mb-3">
                              <span style={{ fontSize: 18, marginRight: 10 }}>🕒</span> {commerce.horaires}
                            </p>
                          )}
                          <p>
                            {commerce.site ? (
                              <a
                                href={commerce.site}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button is-link"
                                style={{
                                  borderRadius: 8,
                                  fontWeight: 500,
                                  background: 'linear-gradient(135deg, #1277c6, #1e40af)',
                                  color: '#fff',
                                  border: 'none',
                                  transition: 'all 0.3s ease',
                                  boxShadow: '0 4px 12px #1277c640'
                                }}
                              >
                                <span style={{ marginRight: 8 }}>🌐</span> Visiter le site web
                              </a>
                            ) : (
                              <button
                                className="button is-light"
                                disabled
                                style={{
                                  borderRadius: 8,
                                  fontWeight: 500,
                                  background: '#f5f5f5',
                                  color: '#6b7280',
                                  border: '1px solid #e0e7ef',
                                  cursor: 'not-allowed'
                                }}
                              >
                                <span style={{ marginRight: 8 }}>🌐</span> Aucun site web
                              </button>
                            )}
                          </p>
                        </div>
                      </div>
                      <style jsx>{`
                        .commerce-card:hover {
                          boxShadow: 0 12px 40px #1277c640;
                          transform: translateY(-4px);
                        }
                        .commerce-card:hover .commerce-img {
                          transform: scale(1.05);
                        }
                        .commerce-card:hover .button {
                          background: linear-gradient(135deg, #1e40af, #1277c6);
                          boxShadow: 0 6px 16px #1277c660;
                        }
                      `}</style>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Section pour les marchés */}
          {marches.map(m => (
            <div
              key={m.id}
              className="box market-box"
              style={{
                borderRadius: 16,
                border: '1px solid #e0e7ef',
                boxShadow: '0 6px 24px #1277c620',
                background: '#ffffff',
                marginTop: 50,
                maxWidth: 1200,
                marginLeft: 'auto',
                marginRight: 'auto',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="columns">
                <div className="column is-8">
                  <h3 className="title is-3 has-text-primary mb-4" style={{ fontWeight: 600 }}>{m.titre}</h3>
                  <p className="subtitle is-5 mb-4" style={{ color: '#6b7280' }}>{m.texte}</p>
                  <div className="content">
                    {m.adresse && (
                      <p className="has-text-grey mb-3">
                        <span style={{ fontSize: 18, marginRight: 10 }}>📍</span> {m.adresse}
                      </p>
                    )}
                    {m.jour && (
                      <p className="has-text-grey mb-3">
                        <span style={{ fontSize: 18, marginRight: 10 }}>🗓️</span> {m.jour}
                      </p>
                    )}
                    {m.horaires && (
                      <p className="has-text-grey mb-4">
                        <span style={{ fontSize: 18, marginRight: 10 }}>🕒</span> {m.horaires}
                      </p>
                    )}
                    {m.produits && (
                      <div className="notification is-primary is-light" style={{ background: '#f0f9ff', border: '1px solid #e0e7ef', borderRadius: 12 }}>
                        <p>
                          <strong>Produits proposés :</strong> {m.produits}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="column is-4">
                  <figure className="image" style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#ffffff', borderRadius: 12, border: '1px solid #e0e7ef' }}>
                    <img
                      src={m.image || "..."}
                      alt={m.titre}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: 12,
                        background: '#ffffff',
                        transition: 'transform 0.3s ease'
                      }}
                      className="market-img"
                    />
                  </figure>
                </div>
              </div>
              <style jsx>{`
                .market-box:hover {
                  boxShadow: 0 12px 40px #1277c640;
                  transform: translateY(-4px);
                }
                .market-box:hover .market-img {
                  transform: scale(1.05);
                }
              `}</style>
            </div>
          ))}
    
        </div>
      </section>
    </>
  );
}