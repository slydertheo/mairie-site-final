import React from 'react';
import 'bulma/css/bulma.min.css';
import Link from 'next/link';

export default function Commerces() {
  // Liste des commerces par catégorie
  const commercesList = {
    alimentaire: [
      {
        id: 1,
        nom: "Boulangerie Pâtisserie Schmitt",
        description: "Pains artisanaux, viennoiseries et pâtisseries traditionnelles",
        adresse: "12 rue Principale, 68580 Friesen",
        telephone: "03.89.XX.XX.XX",
        horaires: "Lun-Sam: 6h30-19h, Dim: 7h-12h",
        image: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?auto=format&fit=crop&w=600&q=80",
        site: "https://boulangerie-schmitt.fr"
      },
      {
        id: 2,
        nom: "Épicerie du Village",
        description: "Produits locaux, fruits et légumes frais, épicerie fine",
        adresse: "8 rue des Écoles, 68580 Friesen",
        telephone: "03.89.XX.XX.XX",
        horaires: "Lun-Ven: 8h-19h30, Sam: 8h-18h, Dim: 9h-12h",
        image: "https://images.unsplash.com/photo-1506617564039-2f3b650b7010?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: 3,
        nom: "Boucherie Charcuterie Traiteur Meyer",
        description: "Viandes de qualité, charcuteries alsaciennes et plats traiteur",
        adresse: "15 rue Principale, 68580 Friesen",
        telephone: "03.89.XX.XX.XX",
        horaires: "Mar-Sam: 8h-12h30 et 14h30-19h",
        image: "https://images.unsplash.com/photo-1558030137-a56c1b004fa3?auto=format&fit=crop&w=600&q=80"
      }
    ],
    restauration: [
      {
        id: 4,
        nom: "Restaurant Aux Deux Clefs",
        description: "Cuisine alsacienne traditionnelle et spécialités régionales",
        adresse: "2 place de l'Église, 68580 Friesen",
        telephone: "03.89.XX.XX.XX",
        horaires: "Mar-Dim: 12h-14h et 19h-22h. Fermé le lundi",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
        site: "https://restaurant-aux-deux-clefs.fr"
      },
      {
        id: 5,
        nom: "Café de la Place",
        description: "Café, salon de thé et petite restauration",
        adresse: "4 place de la Mairie, 68580 Friesen",
        telephone: "03.89.XX.XX.XX",
        horaires: "Lun-Ven: 7h-20h, Sam-Dim: 8h-13h",
        image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=600&q=80"
      }
    ],
    services: [
      {
        id: 6,
        nom: "Salon de Coiffure L'Atelier",
        description: "Coiffure hommes, femmes et enfants",
        adresse: "9 rue des Artisans, 68580 Friesen",
        telephone: "03.89.XX.XX.XX",
        horaires: "Mar-Ven: 9h-18h, Sam: 8h-16h",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: 7,
        nom: "Pharmacie de Friesen",
        description: "Médicaments, conseils santé et parapharmacie",
        adresse: "11 rue Principale, 68580 Friesen",
        telephone: "03.89.XX.XX.XX",
        horaires: "Lun-Ven: 8h30-12h30 et 14h-19h, Sam: 8h30-12h30",
        image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=600&q=80",
        site: "https://pharmacie-friesen.fr"
      },
      {
        id: 8,
        nom: "Auto-École du Village",
        description: "Formation au permis de conduire et conduite accompagnée",
        adresse: "7 rue des Écoles, 68580 Friesen",
        telephone: "03.89.XX.XX.XX",
        horaires: "Lun-Ven: 10h-12h et 14h-19h, Sam: 10h-13h",
        image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80"
      }
    ],
    artisanat: [
      {
        id: 9,
        nom: "Poterie Artisanale Keller",
        description: "Poteries traditionnelles alsaciennes et céramiques contemporaines",
        adresse: "22 rue des Artisans, 68580 Friesen",
        telephone: "03.89.XX.XX.XX",
        horaires: "Mar-Sam: 10h-12h et 14h-18h",
        image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80",
        site: "https://poterie-keller.fr"
      },
      {
        id: 10,
        nom: "Menuiserie Walter",
        description: "Menuiserie, ébénisterie et agencements sur mesure",
        adresse: "18 rue des Artisans, 68580 Friesen",
        telephone: "03.89.XX.XX.XX",
        horaires: "Lun-Ven: 8h-12h et 13h30-17h30",
        image: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=600&q=80"
      }
    ]
  };

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
            Commerces et artisans à Friesen
          </h1>
          
          <div className="content mb-5">
            <div className="notification is-info is-light">
              <p className="is-size-5 mb-3">
                <strong>Soutenez nos commerces locaux !</strong>
              </p>
              <p>
                La commune de Friesen est fière de ses commerçants et artisans qui participent activement à la vie économique et sociale de notre village.
                Nous vous invitons à découvrir leurs produits et services de qualité, et à privilégier ces acteurs locaux pour vos achats du quotidien.
              </p>
            </div>
          </div>

          {/* Liste des commerces par catégorie */}
          {Object.keys(commercesList).map((category) => (
            <div key={category} className="mb-6">
              <h2 className="title is-4 has-text-primary mb-4">
                {formatCategory(category)}
              </h2>
              
              <div className="columns is-multiline">
                {commercesList[category].map((commerce) => (
                  <div key={commerce.id} className="column is-half">
                    <div className="card" style={{ 
                      borderRadius: 16, 
                      overflow: 'hidden',
                      boxShadow: '0 2px 12px #1277c620',
                      height: '100%'
                    }}>
                      <div className="card-image">
                        <figure className="image is-3by2">
                          <img 
                            src={commerce.image} 
                            alt={commerce.nom} 
                            style={{ objectFit: 'cover' }}
                          />
                        </figure>
                      </div>
                      <div className="card-content">
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
          
          {/* Section pour les marchés */}
          <div className="box" style={{ 
            borderRadius: 16, 
            boxShadow: '0 2px 12px #1277c620',
            background: '#f8fafc',
            marginTop: 40 
          }}>
            <div className="columns">
              <div className="column is-9">
                <h3 className="title is-4 has-text-primary mb-4">Marché hebdomadaire</h3>
                <p className="subtitle is-6 mb-3">
                  Retrouvez nos producteurs et artisans locaux lors du marché hebdomadaire de Friesen
                </p>
                
                <div className="content">
                  <p className="has-text-grey mb-2">
                    <span style={{ fontSize: 16, marginRight: 8 }}>📍</span> Place de la Mairie, 68580 Friesen
                  </p>
                  <p className="has-text-grey mb-2">
                    <span style={{ fontSize: 16, marginRight: 8 }}>🗓️</span> Tous les samedis matin
                  </p>
                  <p className="has-text-grey mb-4">
                    <span style={{ fontSize: 16, marginRight: 8 }}>🕒</span> De 8h à 13h
                  </p>
                  
                  <div className="notification is-primary is-light">
                    <p><strong>Produits proposés :</strong> Fruits et légumes, fromages, charcuterie, miel, vins, pains et pâtisseries, produits artisanaux...</p>
                  </div>
                </div>
              </div>
              <div className="column is-3">
                <figure className="image is-square">
                  <img 
                    src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=500&q=80" 
                    alt="Marché de Friesen" 
                    style={{ objectFit: 'cover', borderRadius: 12 }}
                  />
                </figure>
              </div>
            </div>
          </div>
          
          {/* Section pour ajouter son commerce */}
          <div className="box has-text-centered mt-6" style={{ 
            borderRadius: 16, 
            boxShadow: '0 2px 12px #1277c620',
            background: '#f8fafc',
            padding: '2rem'
          }}>
            <h3 className="title is-5 has-text-primary mb-3">Vous êtes commerçant ou artisan à Friesen ?</h3>
            <p className="mb-4">
              Vous souhaitez apparaître dans cette liste ou mettre à jour vos informations ?
            </p>
            <Link href="/contact" legacyBehavior>
              <a className="button is-link">
                Contactez-nous
              </a>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}