import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import Link from 'next/link';

export default function Ecoles() {
  const [formData, setFormData] = useState({
    nomEnfant: '',
    prenomEnfant: '',
    dateNaissance: '',
    nomParent: '',
    prenomParent: '',
    telephone: '',
    email: '',
    adresse: '',
    classe: '',
    cantine: false,
    garderieMatin: false,
    garderieSoir: false
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulaire envoyé:', formData);
    setFormSubmitted(true);
    // Reset form after submission
    setFormData({
      nomEnfant: '',
      prenomEnfant: '',
      dateNaissance: '',
      nomParent: '',
      prenomParent: '',
      telephone: '',
      email: '',
      adresse: '',
      classe: '',
      cantine: false,
      garderieMatin: false,
      garderieSoir: false
    });
    
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
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
            Écoles et Services Périscolaires
          </h1>

          <div className="columns is-variable is-5">
            {/* Colonne 1 : Écoles */}
            <div className="column is-half">
              <div className="box" style={{ background: '#f8fafc', borderRadius: 16 }}>
                <h2 className="title is-4 has-text-primary mb-4">Nos écoles</h2>
                
                <div className="media mb-5">
                  <figure className="media-left">
                    <p className="image is-96x96">
                      <img 
                        src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=200&q=80" 
                        alt="École maternelle"
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                      />
                    </p>
                  </figure>
                  <div className="media-content">
                    <h3 className="subtitle is-5 has-text-link mb-2">École maternelle "Les Petits Explorateurs"</h3>
                    <p className="has-text-grey mb-2">
                      <span style={{ fontSize: 16, marginRight: 8 }}>📍</span> 3 Rue des Écoles, 68580 Friesen
                    </p>
                    <p className="has-text-grey mb-2">
                      <span style={{ fontSize: 16, marginRight: 8 }}>📞</span> 03.89.XX.XX.XX
                    </p>
                    <p className="has-text-grey">
                      <span style={{ fontSize: 16, marginRight: 8 }}>✉️</span> maternelle@ecole-friesen.fr
                    </p>
                  </div>
                </div>

                <div className="media">
                  <figure className="media-left">
                    <p className="image is-96x96">
                      <img 
                        src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=200&q=80" 
                        alt="École élémentaire"
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                      />
                    </p>
                  </figure>
                  <div className="media-content">
                    <h3 className="subtitle is-5 has-text-link mb-2">École élémentaire "Jean Moulin"</h3>
                    <p style={{ fontStyle: 'italic', fontSize: 15 }} className="mb-2">
                      En partenariat avec la commune d'Altkirch
                    </p>
                    <p className="has-text-grey mb-2">
                      <span style={{ fontSize: 16, marginRight: 8 }}>📍</span> 5 Rue des Écoles, 68130 Altkirch
                    </p>
                    <p className="has-text-grey mb-2">
                      <span style={{ fontSize: 16, marginRight: 8 }}>📞</span> 03.89.XX.XX.XX
                    </p>
                    <p className="has-text-grey">
                      <span style={{ fontSize: 16, marginRight: 8 }}>✉️</span> elementaire@ecole-altkirch.fr
                    </p>
                  </div>
                </div>

                <div className="notification is-info is-light mt-5">
                  <p className="has-text-weight-bold mb-2">📢 Information transport scolaire</p>
                  <p>Un service de ramassage scolaire est disponible pour les élèves de Friesen se rendant à l'école élémentaire d'Altkirch.</p>
                  <p className="mt-2">Consultez les <a href="#" className="has-text-link is-underlined">horaires et points de ramassage</a>.</p>
                </div>
              </div>

              {/* Calendrier scolaire */}
              <div className="box mt-5" style={{ background: '#f8fafc', borderRadius: 16 }}>
                <h2 className="title is-5 has-text-primary mb-3">Calendrier scolaire 2024-2025</h2>
                <table className="table is-fullwidth">
                  <thead>
                    <tr className="has-background-link-light">
                      <th>Vacances</th>
                      <th>Date de fin des cours</th>
                      <th>Date de reprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Rentrée scolaire</td>
                      <td>-</td>
                      <td>1 septembre 2024</td>
                    </tr>
                    <tr>
                      <td>Toussaint</td>
                      <td>18 octobre 2024</td>
                      <td>4 novembre 2024</td>
                    </tr>
                    <tr>
                      <td>Noël</td>
                      <td>20 décembre 2024</td>
                      <td>6 janvier 2025</td>
                    </tr>
                    <tr>
                      <td>Hiver</td>
                      <td>21 février 2025</td>
                      <td>10 mars 2025</td>
                    </tr>
                    <tr>
                      <td>Printemps</td>
                      <td>25 avril 2025</td>
                      <td>12 mai 2025</td>
                    </tr>
                    <tr>
                      <td>Été</td>
                      <td>4 juillet 2025</td>
                      <td>-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Colonne 2 : Périscolaire et formulaire */}
            <div className="column is-half">
              <div className="box" style={{ background: '#f8fafc', borderRadius: 16 }}>
                <h2 className="title is-4 has-text-primary mb-4">Services périscolaires</h2>
                
                <div className="media mb-4">
                  <figure className="media-left">
                    <p className="image is-64x64">
                      <img 
                        src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=200&q=80" 
                        alt="Cantine"
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                      />
                    </p>
                  </figure>
                  <div className="media-content">
                    <h3 className="subtitle is-5 has-text-link mb-1">Cantine scolaire</h3>
                    <p className="has-text-grey">
                      Lundi, mardi, jeudi, vendredi : 12h - 14h<br/>
                      Repas préparés par notre traiteur local avec produits frais
                    </p>
                    <a href="#" className="button is-small is-link is-light mt-2">
                      Voir les menus de la semaine
                    </a>
                  </div>
                </div>
                
                <div className="media mb-4">
                  <figure className="media-left">
                    <p className="image is-64x64">
                      <img 
                        src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=200&q=80" 
                        alt="Garderie"
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                      />
                    </p>
                  </figure>
                  <div className="media-content">
                    <h3 className="subtitle is-5 has-text-link mb-1">Garderie périscolaire</h3>
                    <p className="has-text-grey">
                      Matin : 7h30 - 8h30<br/>
                      Soir : 16h30 - 18h30<br/>
                      Activités encadrées et aide aux devoirs
                    </p>
                  </div>
                </div>

                <div className="media">
                  <figure className="media-left">
                    <p className="image is-64x64">
                      <img 
                        src="https://images.unsplash.com/photo-1560421683-6856ea585c78?auto=format&fit=crop&w=200&q=80" 
                        alt="Activités"
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                      />
                    </p>
                  </figure>
                  <div className="media-content">
                    <h3 className="subtitle is-5 has-text-link mb-1">Activités extrascolaires</h3>
                    <p className="has-text-grey">
                      Mercredi après-midi : 14h - 17h<br/>
                      Activités sportives, artistiques et culturelles
                    </p>
                    <a href="#" className="button is-small is-link is-light mt-2">
                      Programme des activités
                    </a>
                  </div>
                </div>
              </div>

              {/* Formulaire d'inscription */}
              <div className="box mt-5" style={{ background: '#f8fafc', borderRadius: 16 }}>
                <h2 className="title is-4 has-text-primary mb-4">Inscription aux services scolaires</h2>
                
                {formSubmitted ? (
                  <div className="notification is-success">
                    <button className="delete" onClick={() => setFormSubmitted(false)}></button>
                    Votre demande d'inscription a bien été enregistrée. Vous recevrez une confirmation par email.
                  </div>
                ) : null}

                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label className="label">Informations sur l'enfant</label>
                    <div className="columns">
                      <div className="column">
                        <div className="field">
                          <label className="label is-small">Nom</label>
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              name="nomEnfant"
                              value={formData.nomEnfant}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="field">
                          <label className="label is-small">Prénom</label>
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              name="prenomEnfant"
                              value={formData.prenomEnfant}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="field">
                      <label className="label is-small">Date de naissance</label>
                      <div className="control">
                        <input
                          className="input"
                          type="date"
                          name="dateNaissance"
                          value={formData.dateNaissance}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label className="label is-small">Classe</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select name="classe" value={formData.classe} onChange={handleChange} required>
                            <option value="">Sélectionnez une classe</option>
                            <option value="PS">Petite Section</option>
                            <option value="MS">Moyenne Section</option>
                            <option value="GS">Grande Section</option>
                            <option value="CP">CP</option>
                            <option value="CE1">CE1</option>
                            <option value="CE2">CE2</option>
                            <option value="CM1">CM1</option>
                            <option value="CM2">CM2</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="field mt-5">
                    <label className="label">Informations du responsable légal</label>
                    <div className="columns">
                      <div className="column">
                        <div className="field">
                          <label className="label is-small">Nom</label>
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              name="nomParent"
                              value={formData.nomParent}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="field">
                          <label className="label is-small">Prénom</label>
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              name="prenomParent"
                              value={formData.prenomParent}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="columns">
                      <div className="column">
                        <div className="field">
                          <label className="label is-small">Téléphone</label>
                          <div className="control">
                            <input
                              className="input"
                              type="tel"
                              name="telephone"
                              value={formData.telephone}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="field">
                          <label className="label is-small">Email</label>
                          <div className="control">
                            <input
                              className="input"
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="field">
                      <label className="label is-small">Adresse</label>
                      <div className="control">
                        <textarea
                          className="textarea"
                          name="adresse"
                          value={formData.adresse}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="field mt-5">
                    <label className="label">Services souhaités</label>
                    
                    <div className="field">
                      <div className="control">
                        <label className="checkbox">
                          <input
                            type="checkbox"
                            name="cantine"
                            checked={formData.cantine}
                            onChange={handleChange}
                          />
                          {' '}
                          Inscription à la cantine
                        </label>
                      </div>
                    </div>
                    
                    <div className="field">
                      <div className="control">
                        <label className="checkbox">
                          <input
                            type="checkbox"
                            name="garderieMatin"
                            checked={formData.garderieMatin}
                            onChange={handleChange}
                          />
                          {' '}
                          Garderie du matin (7h30 - 8h30)
                        </label>
                      </div>
                    </div>
                    
                    <div className="field">
                      <div className="control">
                        <label className="checkbox">
                          <input
                            type="checkbox"
                            name="garderieSoir"
                            checked={formData.garderieSoir}
                            onChange={handleChange}
                          />
                          {' '}
                          Garderie du soir (16h30 - 18h30)
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="field mt-5">
                    <div className="control">
                      <button 
                        className="button is-link is-medium is-fullwidth"
                        type="submit"
                        style={{
                          borderRadius: 10,
                          fontWeight: 700,
                          fontSize: 18,
                          padding: '1rem 0',
                          boxShadow: '0 2px 12px #1277c640',
                        }}
                      >
                        Envoyer la demande d'inscription
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="box mt-5" style={{ background: '#f8fafc', borderRadius: 16 }}>
                <h2 className="title is-5 has-text-primary mb-2">Documents utiles</h2>
                <ul style={{ paddingLeft: 18 }}>
                  <li style={{ marginBottom: 10 }}>
                    <a href="#" className="has-text-link is-underlined">
                      <span style={{ fontSize: 16, marginRight: 8 }}>📄</span>
                      Règlement intérieur des écoles
                    </a>
                  </li>
                  <li style={{ marginBottom: 10 }}>
                    <a href="#" className="has-text-link is-underlined">
                      <span style={{ fontSize: 16, marginRight: 8 }}>📋</span>
                      Fiche sanitaire à compléter
                    </a>
                  </li>
                  <li style={{ marginBottom: 10 }}>
                    <a href="#" className="has-text-link is-underlined">
                      <span style={{ fontSize: 16, marginRight: 8 }}>🍴</span>
                      Menus de la cantine (Juin 2025)
                    </a>
                  </li>
                  <li>
                    <a href="#" className="has-text-link is-underlined">
                      <span style={{ fontSize: 16, marginRight: 8 }}>🚌</span>
                      Horaires des transports scolaires
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