import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import Link from 'next/link';

export default function Associations() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Liste des associations par catégorie
  const associationsList = {
    sport: [
      {
        id: 1,
        nom: "Football Club de Friesen",
        description: "Club de football proposant des équipes pour toutes les catégories d'âge, des débutants aux seniors.",
        contact: "Jean-Marc Weber - 06.XX.XX.XX.XX",
        email: "fc.friesen@example.com",
        activites: "Entraînements: Mer/Ven 18h-20h, Matchs: Dimanche",
        lieu: "Stade municipal, rue du Stade",
        image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=600&q=80",
        site: "https://fcfriesen.fr"
      },
      {
        id: 2,
        nom: "Tennis Club Friesen",
        description: "Pratique du tennis en loisir ou en compétition. École de tennis pour les jeunes et cours pour adultes.",
        contact: "Sophie Muller - 06.XX.XX.XX.XX",
        email: "tennis.friesen@example.com",
        activites: "Cours: Mar/Jeu 17h-21h, Sam 9h-12h",
        lieu: "Courts de tennis, allée des Sports",
        image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: 3,
        nom: "Gym Volontaire",
        description: "Association proposant des cours de gymnastique adaptés à tous les âges et tous les niveaux.",
        contact: "Marie Schneider - 06.XX.XX.XX.XX",
        email: "gym.friesen@example.com",
        activites: "Séances: Lun/Mer 19h-20h30, Ven 10h-11h30",
        lieu: "Salle polyvalente, place de la Mairie",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80"
      }
    ],
    culture: [
      {
        id: 4,
        nom: "Chorale Sainte-Cécile",
        description: "Chorale paroissiale animant les célébrations religieuses et proposant des concerts tout au long de l'année.",
        contact: "Pierre Kempf - 06.XX.XX.XX.XX",
        email: "chorale.friesen@example.com",
        activites: "Répétitions: Jeudi 20h-22h",
        lieu: "Église Saint-Martin, place de l'Église",
        image: "https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: 5,
        nom: "Amis du Patrimoine Friesenois",
        description: "Association dédiée à la préservation et à la valorisation du patrimoine historique et culturel de Friesen.",
        contact: "Claude Meyer - 06.XX.XX.XX.XX",
        email: "patrimoine.friesen@example.com",
        activites: "Réunions: 1er mardi du mois à 20h",
        lieu: "Salle du conseil municipal",
        image: "https://images.unsplash.com/photo-1608562719218-920013a7a230?auto=format&fit=crop&w=600&q=80",
        site: "https://patrimoine-friesen.fr"
      },
      {
        id: 6,
        nom: "Théâtre Alsacien de Friesen",
        description: "Troupe de théâtre amateur présentant des pièces en dialecte alsacien chaque année.",
        contact: "Hélène Walter - 06.XX.XX.XX.XX",
        email: "theatre.friesen@example.com",
        activites: "Répétitions: Mar/Ven 20h-22h (sept-mars)",
        lieu: "Salle des fêtes, rue des Tilleuls",
        image: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=600&q=80"
      }
    ],
    social: [
      {
        id: 7,
        nom: "Club des Aînés \"Les Tilleuls\"",
        description: "Association proposant des activités de loisirs et des moments de convivialité pour les seniors de la commune.",
        contact: "Irène Schmidt - 06.XX.XX.XX.XX",
        email: "aines.friesen@example.com",
        activites: "Rencontres: Mercredi 14h-17h",
        lieu: "Salle communale, place de la Fontaine",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: 8,
        nom: "Solidarité Friesen",
        description: "Association caritative venant en aide aux personnes en difficulté de la commune et des environs.",
        contact: "Thomas Becker - 06.XX.XX.XX.XX",
        email: "solidarite.friesen@example.com",
        activites: "Permanences: Lundi 14h-16h, Samedi 9h-11h",
        lieu: "Local associatif, 5 rue des Écoles",
        image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80"
      }
    ],
    jeunesse: [
      {
        id: 9,
        nom: "Association des Parents d'Élèves",
        description: "Association représentant les parents d'élèves des écoles de la commune et organisant des événements pour financer les projets scolaires.",
        contact: "Laure Fischer - 06.XX.XX.XX.XX",
        email: "ape.friesen@example.com",
        activites: "Réunions: 3ème jeudi du mois à 20h",
        lieu: "École élémentaire, rue des Écoles",
        image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: 10,
        nom: "Friesen Jeunesse",
        description: "Association pour les jeunes de 12 à 18 ans proposant des activités de loisirs et des sorties tout au long de l'année.",
        contact: "Nicolas Klein - 06.XX.XX.XX.XX",
        email: "jeunesse.friesen@example.com",
        activites: "Accueil: Mer 14h-18h, Ven 17h-22h, Sam 14h-18h",
        lieu: "Local jeunes, rue des Tilleuls",
        image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80",
        site: "https://jeunes-friesen.fr"
      }
    ],
    environnement: [
      {
        id: 11,
        nom: "Les Jardins Partagés de Friesen",
        description: "Association de jardinage collectif promouvant une culture respectueuse de l'environnement et créant du lien social.",
        contact: "Anne Zimmermann - 06.XX.XX.XX.XX",
        email: "jardins.friesen@example.com",
        activites: "Jardinage collectif: Sam 9h-12h, Ateliers: 1er dim du mois",
        lieu: "Jardins partagés, chemin du Lavoir",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: 12,
        nom: "Friesen Nature",
        description: "Association de protection de l'environnement menant des actions de préservation de la biodiversité locale.",
        contact: "Marc Hoffmann - 06.XX.XX.XX.XX",
        email: "nature.friesen@example.com",
        activites: "Sorties nature: 2ème dim du mois, Réunions: dernier vendredi du mois à 20h",
        lieu: "Maison des associations, place de la Mairie",
        image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=600&q=80",
        site: "https://friesen-nature.fr"
      }
    ]
  };

  // Événements associatifs à venir
  const events = [
    {
      date: "28 juin 2025",
      titre: "Tournoi de football inter-villages",
      association: "Football Club de Friesen",
      lieu: "Stade municipal"
    },
    {
      date: "12 juillet 2025",
      titre: "Concert d'été",
      association: "Chorale Sainte-Cécile",
      lieu: "Église Saint-Martin"
    },
    {
      date: "25 juillet 2025",
      titre: "Fête d'été",
      association: "Friesen Jeunesse",
      lieu: "Place de la Mairie"
    },
    {
      date: "15 août 2025",
      titre: "Marché aux puces",
      association: "Amis du Patrimoine Friesenois",
      lieu: "Rues du village"
    },
    {
      date: "6 septembre 2025",
      titre: "Forum des associations",
      association: "Mairie de Friesen",
      lieu: "Salle polyvalente"
    }
  ];

  // Fonction pour formater une catégorie
  const formatCategory = (category) => {
    switch(category) {
      case 'sport': return 'Sports et loisirs';
      case 'culture': return 'Culture et patrimoine';
      case 'social': return 'Social et solidarité';
      case 'jeunesse': return 'Jeunesse et éducation';
      case 'environnement': return 'Environnement';
      default: return category;
    }
  };

  // Fonction pour filtrer les associations en fonction de la recherche
  const filterAssociations = () => {
    let filtered = [];
    Object.keys(associationsList).forEach(category => {
      if (activeTab === 'all' || activeTab === category) {
        const categoryAssociations = associationsList[category].filter(association => 
          association.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          association.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        filtered = [...filtered, ...categoryAssociations];
      }
    });
    return filtered;
  };

  // Associations filtrées
  const filteredAssociations = filterAssociations();

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
            Les associations de Friesen
          </h1>
          
          <div className="content mb-5">
            <div className="notification is-info is-light">
              <p className="is-size-5 mb-3">
                <strong>Un tissu associatif dynamique !</strong>
              </p>
              <p>
                Les associations constituent le cœur battant de notre village. Qu'elles soient sportives, culturelles, 
                solidaires ou environnementales, elles créent du lien entre les habitants et animent notre commune 
                tout au long de l'année. Découvrez leurs activités et n'hésitez pas à les rejoindre !
              </p>
            </div>
          </div>

          {/* Recherche et filtres */}
          <div className="box" style={{ 
            borderRadius: 16, 
            boxShadow: '0 2px 12px #1277c620',
            background: '#f8fafc',
            marginBottom: 40
          }}>
            <div className="columns is-vcentered">
              <div className="column is-8">
                <div className="field">
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="text"
                      placeholder="Rechercher une association..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="icon is-small is-left">
                      <i className="fas fa-search"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="column">
                <div className="select is-fullwidth">
                  <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                  >
                    <option value="all">Toutes les catégories</option>
                    {Object.keys(associationsList).map((category) => (
                      <option key={category} value={category}>
                        {formatCategory(category)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des associations filtrées */}
          {filteredAssociations.length > 0 ? (
            <div className="columns is-multiline">
              {filteredAssociations.map((association) => (
                <div key={association.id} className="column is-half">
                  <div className="card" style={{ 
                    borderRadius: 16, 
                    overflow: 'hidden',
                    boxShadow: '0 2px 12px #1277c620',
                    height: '100%'
                  }}>
                    <div className="card-image">
                      <figure className="image is-3by2">
                        <img 
                          src={association.image} 
                          alt={association.nom} 
                          style={{ objectFit: 'cover' }}
                        />
                      </figure>
                    </div>
                    <div className="card-content">
                      <p className="title is-5 has-text-link mb-2">{association.nom}</p>
                      <p className="subtitle is-6 mb-3">{association.description}</p>
                      
                      <div className="content">
                        <p className="has-text-grey mb-2">
                          <span style={{ fontSize: 16, marginRight: 8 }}>👤</span> {association.contact}
                        </p>
                        <p className="has-text-grey mb-2">
                          <span style={{ fontSize: 16, marginRight: 8 }}>📧</span> {association.email}
                        </p>
                        <p className="has-text-grey mb-2">
                          <span style={{ fontSize: 16, marginRight: 8 }}>🕒</span> {association.activites}
                        </p>
                        <p className="has-text-grey mb-2">
                          <span style={{ fontSize: 16, marginRight: 8 }}>📍</span> {association.lieu}
                        </p>
                        {association.site && (
                          <p>
                            <a 
                              href={association.site} 
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
          ) : (
            <div className="notification is-warning">
              Aucune association ne correspond à votre recherche.
            </div>
          )}

          {/* Agenda des événements associatifs */}
          <div className="box mt-6" style={{ 
            borderRadius: 16, 
            boxShadow: '0 2px 12px #1277c620',
            background: '#f8fafc',
            marginTop: 50 
          }}>
            <h2 className="title is-4 has-text-primary mb-4">Agenda des événements associatifs</h2>
            <table className="table is-fullwidth">
              <thead>
                <tr className="has-background-link-light">
                  <th>Date</th>
                  <th>Événement</th>
                  <th>Association</th>
                  <th>Lieu</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, index) => (
                  <tr key={index}>
                    <td>{event.date}</td>
                    <td><strong>{event.titre}</strong></td>
                    <td>{event.association}</td>
                    <td>{event.lieu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Informations sur les subventions */}
          <div className="columns mt-6">
            <div className="column">
              <div className="box" style={{ 
                borderRadius: 16, 
                boxShadow: '0 2px 12px #1277c620',
                background: '#f0f7fd',
                height: '100%'
              }}>
                <h2 className="title is-5 has-text-primary mb-3">Subventions aux associations</h2>
                <p className="mb-3">
                  La commune de Friesen soutient activement la vie associative locale par l'attribution de subventions annuelles.
                </p>
                <p className="mb-4">
                  <strong>Date limite de dépôt des demandes :</strong> 30 septembre 2025
                </p>
                <Link href="/documents/formulaire-subvention.pdf" className="button is-link is-light">
                  Télécharger le formulaire de demande
                </Link>
              </div>
            </div>
            
            <div className="column">
              <div className="box" style={{ 
                borderRadius: 16, 
                boxShadow: '0 2px 12px #1277c620',
                background: '#f0f7fd',
                height: '100%'
              }}>
                <h2 className="title is-5 has-text-primary mb-3">Créer une association</h2>
                <p className="mb-3">
                  Vous avez un projet associatif pour notre commune ? La mairie vous accompagne dans vos démarches de création.
                </p>
                <p className="mb-4">
                  <strong>Permanence conseil :</strong> 1er jeudi du mois de 14h à 16h
                </p>
                <Link href="/contact" className="button is-link is-light">
                  Prendre rendez-vous
                </Link>
              </div>
            </div>
          </div>

          {/* Réservation de salles */}
          <div className="box mt-5" style={{ 
            borderRadius: 16, 
            boxShadow: '0 2px 12px #1277c620',
            background: '#f8fafc',
          }}>
            <div className="columns is-vcentered">
              <div className="column is-9">
                <h2 className="title is-5 has-text-primary mb-3">Salles communales pour les associations</h2>
                <p className="mb-2">
                  La commune met à disposition des associations plusieurs salles pour leurs activités et événements.
                </p>
                <ul style={{ marginBottom: 20 }}>
                  <li>Salle polyvalente (capacité 200 personnes)</li>
                  <li>Salle de réunion de la mairie (capacité 30 personnes)</li>
                  <li>Local des associations (capacité 50 personnes)</li>
                  <li>Salles de classe (disponibles hors temps scolaire)</li>
                </ul>
                <Link href="/contact" className="button is-link">
                  Réserver une salle
                </Link>
              </div>
              <div className="column">
                <figure className="image is-16by9">
                  <img
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80"
                    alt="Salle polyvalente"
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                  />
                </figure>
              </div>
            </div>
          </div>

          {/* Forum des associations */}
          <div className="notification is-link is-light mt-6" style={{ borderRadius: 16 }}>
            <div className="columns is-vcentered">
              <div className="column is-2 has-text-centered">
                <span style={{ fontSize: 64 }}>📅</span>
              </div>
              <div className="column">
                <h3 className="title is-5 mb-2">Forum des associations 2025</h3>
                <p className="mb-2">Le samedi 6 septembre 2025 de 10h à 17h à la salle polyvalente</p>
                <p>Une occasion unique de découvrir toutes les associations de Friesen et de vous inscrire aux activités pour la nouvelle saison !</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="has-text-centered mt-6">
            <p className="mb-4">
              Vous souhaitez en savoir plus sur la vie associative de notre commune ?
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