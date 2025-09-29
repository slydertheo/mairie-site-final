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
      case 'alimentaire': return 'Commerces alimentaires';
      case 'restauration': return 'Restaurants et cafés';
      case 'services': return 'Services';
      case 'artisanat': return 'Artisanat local';
      default: return category;
    }
  };

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
          backgroundColor: '#fff' // fond blanc pur
        }}
      >
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title is-2 has-text-weight-bold" style={{ color: '#fff', textShadow: '0 4px 24px #0a2540a0', letterSpacing: 1 }}>
              {content.hero_titre || <>Bienvenue sur le site officiel de<br />la Mairie de <span style={{ color: '#ffd700', textShadow: '0 2px 8px #1277c6' }}>Friesen</span></>}
            </h1>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section
        className="section"
        style={{
          background: '#fff', // fond blanc pur
          minHeight: '100vh',
          marginTop: 0,
        }}
      >
        <div className="container" style={{ maxWidth: 1100 }}>
          <h1 className="title is-3 has-text-link mb-5" style={{ textAlign: 'center' }}>
            {content.titre || "Commerces et artisans à Friesen"}
          </h1>
          
          <div className="content mb-5">
            <div className="notification is-info is-light" style={{ background: '#fff' }}>
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
              <h2 className="title is-4 has-text-primary mb-4">
                {formatCategory(category)}
              </h2>
              
              <div className="columns is-multiline">
                {commerces.filter(c => c.categorie === category).map(commerce => (
                  <div key={commerce.id} className="column is-half">
                    <div className="card" style={{ 
                      borderRadius: 8,
                      border: '1px solid #e0e7ef',
                      overflow: 'hidden',
                      boxShadow: '0 2px 12px #1277c610',
                      height: '100%',
                      background: '#fff'
                    }}>
                      <div className="card-image" style={{ background: '#fff', borderBottom: '1px solid #e0e7ef', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                        <figure className="image" style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                          <img 
                            src={commerce.image} 
                            alt={commerce.nom} 
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'contain',
                              background: '#fff',
                              borderTopLeftRadius: 8,
                              borderTopRightRadius: 8,
                              border: '1px solid #e0e7ef'
                            }}
                          />
                        </figure>
                      </div>
                      <div className="card-content" style={{ background: '#fff' }}>
                        <p className="title is-5 has-text-link mb-2">{commerce.nom}</p>
                        <p className="subtitle is-6 mb-3">{commerce.description}</p>
                        
                        <div className="content">
                          <p className="has-text-grey mb-2">
                            <span style={{ fontSize: 16, marginRight: 8 }}>📍</span> {commerce.adresse}
                          </p>
                          <p className="has-text-grey mb-2">
                            <span style={{ fontSize: 16, marginRight: 8 }}>📞</span> {commerce.telephone}
                          </p>
                          <p className="has-text-grey mb-2">
                            <span style={{ fontSize: 16, marginRight: 8 }}>🕒</span> {commerce.horaires}
                          </p>
                          {commerce.site && (
                            <p>
                              <a 
                                href={commerce.site} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="button is-small is-link is-light"
                              >
                                <span style={{ marginRight: 6 }}>🌐</span> Visiter le site web
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Section pour les marchés - version dynamique seulement */}
          {marches.map(m => (
            <div
              key={m.id}
              className="box"
              style={{
                borderRadius: 8, // min arrondi
                border: '1px solid #e0e7ef', // fine bordure
                boxShadow: '0 2px 12px #1277c610',
                background: '#fff',
                marginTop: 40,
                maxWidth: 1100,
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              <div className="columns">
                <div className="column is-9">
                  <h3 className="title is-4 has-text-primary mb-4">{m.titre}</h3>
                  <p className="subtitle is-6 mb-3">{m.texte}</p>
                  <div className="content">
                    <p className="has-text-grey mb-2">
                      <span style={{ fontSize: 16, marginRight: 8 }}>📍</span> {m.adresse}
                    </p>
                    <p className="has-text-grey mb-2">
                      <span style={{ fontSize: 16, marginRight: 8 }}>🗓️</span> {m.jour}
                    </p>
                    <p className="has-text-grey mb-4">
                      <span style={{ fontSize: 16, marginRight: 8 }}>🕒</span> {m.horaires}
                    </p>
                    <div className="notification is-primary is-light" style={{ background: '#fff' }}>
                      <p>
                        <strong>Produits proposés :</strong> {m.produits}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="column is-3">
                  <figure className="image" style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#fff', borderRadius: 8, border: '1px solid #e0e7ef' }}>
                    <img
                      src={m.image || "..."}
                      alt={m.titre}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain', 
                        borderRadius: 8, 
                        background: '#fff',
                        border: '1px solid #e0e7ef'
                      }}
                    />
                  </figure>
                </div>
              </div>
            </div>
          ))}
    
        </div>
      </section>
    </>
  );
}