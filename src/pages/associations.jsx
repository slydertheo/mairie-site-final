import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';
import Link from 'next/link';

export default function Associations() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [content, setContent] = useState({});

  useEffect(() => {
    fetch('/api/pageContent?page=associations')
      .then(res => res.json())
      .then(data => setContent(data[0] || {}));
  }, []);

  // Associations dynamiques (stockées dans content.associations)
  const associationsList = content.associations || {};

  // Événements dynamiques (stockés dans content.events)
  const events = content.events || [];

  // Fonctions utilitaires inchangées
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

  const associationsArray = Array.isArray(associationsList) ? associationsList : Object.values(associationsList).flat();

  const filterAssociations = () => {
    return associationsArray.filter(association =>
      (activeTab === 'all' || association.categorie === activeTab) &&
      (
        association.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        association.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const filteredAssociations = filterAssociations();

  const categories = Array.from(new Set(associationsArray.map(a => a.categorie).filter(Boolean)));

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
              {content.hero_titre || (
                <>
                  Bienvenue sur le site officiel de<br />
                  la Mairie de <span style={{ color: '#ffd700', textShadow: '0 2px 8px #1277c6' }}>Friesen</span>
                </>
              )}
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
            {content.page_titre || "Les associations de Friesen"}
          </h1>
          
          <div className="content mb-5">
            <div className="notification is-info is-light">
              <p className="is-size-5 mb-3">
                <strong>{content.notification_titre || "Un tissu associatif dynamique !"}</strong>
              </p>
              <p>
                {content.notification_texte || "Les associations constituent le cœur battant de notre village. Qu'elles soient sportives, culturelles, solidaires ou environnementales, elles créent du lien entre les habitants et animent notre commune tout au long de l'année. Découvrez leurs activités et n'hésitez pas à les rejoindre !"}
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
                    {categories.map(category => (
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
                      <p className="tag is-info is-light mb-2">{formatCategory(association.categorie)}</p>
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
            <h2 className="title is-4 has-text-primary mb-4">{content.agenda_titre || "Agenda des événements associatifs"}</h2>
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
                <h2 className="title is-5 has-text-primary mb-3">{content.subventions?.titre || "Subventions aux associations"}</h2>
                <p className="mb-3">
                  {content.subventions?.texte || "La commune de Friesen soutient activement la vie associative locale par l'attribution de subventions annuelles."}
                </p>
                <p className="mb-4">
                  <strong>Date limite de dépôt des demandes :</strong> {content.subventions?.date_limite || "30 septembre 2025"}
                </p>
                <Link href={content.subventions?.formulaire_url || "/documents/formulaire-subvention.pdf"} className="button is-link is-light">
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
                <h2 className="title is-5 has-text-primary mb-3">{content.creation?.titre || "Créer une association"}</h2>
                <p className="mb-3">
                  {content.creation?.texte || "Vous avez un projet associatif pour notre commune ? La mairie vous accompagne dans vos démarches de création."}
                </p>
                <p className="mb-4">
                  <strong>Permanence conseil :</strong> {content.creation?.permanence || "1er jeudi du mois de 14h à 16h"}
                </p>
                <Link href={content.creation?.contact_url || "/contact"} className="button is-link is-light">
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
                <h2 className="title is-5 has-text-primary mb-3">{content.salles?.titre || "Salles communales pour les associations"}</h2>
                <p className="mb-2">
                  {content.salles?.texte || "La commune met à disposition des associations plusieurs salles pour leurs activités et événements."}
                </p>
                <ul style={{ marginBottom: 20 }}>
                  {(content.salles?.liste || [
                    "Salle polyvalente (capacité 200 personnes)",
                    "Salle de réunion de la mairie (capacité 30 personnes)",
                    "Local des associations (capacité 50 personnes)",
                    "Salles de classe (disponibles hors temps scolaire)"
                  ]).map((salle, idx) => (
                    <li key={idx}>{salle}</li>
                  ))}
                </ul>
                <Link href={content.salles?.contact_url || "/contact"} className="button is-link">
                  Réserver une salle
                </Link>
              </div>
              <div className="column">
                <figure className="image is-16by9">
                  <img
                    src={content.salles?.image || "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80"}
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
                {content.forum?.image ? (
                  <img
                    src={content.forum.image}
                    alt={content.forum?.titre || "Forum des associations"}
                    style={{ maxWidth: "100%", borderRadius: 12 }}
                  />
                ) : (
                  <span style={{ fontSize: 64 }}>📅</span>
                )}
              </div>
              <div className="column">
                <h3 className="title is-5 mb-2">{content.forum?.titre || "Forum des associations 2025"}</h3>
                <p className="mb-2">{content.forum?.date || "Le samedi 6 septembre 2025 de 10h à 17h à la salle polyvalente"}</p>
                <p>{content.forum?.texte || "Une occasion unique de découvrir toutes les associations de Friesen et de vous inscrire aux activités pour la nouvelle saison !"}</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="has-text-centered mt-6">
            <p className="mb-4">
              {content.contact?.texte || "Vous souhaitez en savoir plus sur la vie associative de notre commune ?"}
            </p>
            <Link href={content.contact?.contact_url || "/contact"} className="button is-link">
              Contactez la mairie
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}