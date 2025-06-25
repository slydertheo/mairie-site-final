import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';

export default function PageAcceuil() {
  const [contact, setContact] = useState({ nom: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  const events = [
    { date: '2024-06-28', title: 'Atelier créatif enfants' },
    { date: '2024-07-02', title: 'Réunion publique' },
    { date: '2024-07-10', title: 'Fête du village' },
  ];

  function handleContactChange(e) {
    setContact({ ...contact, [e.target.name]: e.target.value });
  }
  function handleContactSubmit(e) {
    e.preventDefault();
    setContactSent(true);
    setContact({ nom: '', email: '', message: '' });
  }

  return (
    <div className="has-background-light" style={{ minHeight: '100vh' }}>
      {/* Bandeau image + titre */}
      <section className="hero is-primary is-medium" style={{
        backgroundImage: 'linear-gradient(180deg,rgba(10,37,64,0.55),rgba(10,37,64,0.25)),url("/village.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '0 0 32px 32px',
        boxShadow: '0 8px 32px #0a254030',
        marginBottom: 32,
      }}>
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
      <div className="container" style={{
        maxWidth: 1200,
        margin: '0 auto 40px auto',
        background: '#fff',
        borderRadius: 22,
        boxShadow: '0 8px 32px #1277c610',
        padding: 40,
        position: 'relative',
        top: -40,
      }}>
        {/* Dernières actualités */}
        <h2 className="title is-4 has-text-primary mb-5">Dernières actualités</h2>
        <div className="columns is-multiline is-variable is-4 mb-6">
          <div className="column is-one-third">
            <ActualiteCard
              img="/ballons.jpg"
              date="12 avril 2024"
              title="Fête locale : dates et programme"
              color="#1277c6"
            />
          </div>
          <div className="column is-one-third">
            <ActualiteCard
              img="/cones.jpg"
              date="5 avril 2024"
              title="Travaux de voirie : point d’avancement"
              color="#1277c6"
            />
          </div>
          <div className="column is-one-third">
            <ActualiteCard
              img="/conseil.jpg"
              date="28 mars 2024"
              title="Prochain conseil municipal le 15 avril"
              color="#1277c6"
            />
          </div>
        </div>

        {/* Grille infos */}
        <div className="columns is-variable is-5">
          {/* Colonne 1 : Démarches rapides + Mot du Maire */}
          <div className="column is-two-thirds">
            <h2 className="title is-5 has-text-primary mb-3">Démarches rapides</h2>
            <div className="columns is-multiline">
              <div className="column is-half">
                <QuickBox icon="📄" label="Demande d’acte de naissance" />
              </div>
              <div className="column is-half">
                <QuickBox icon="🗳️" label="Inscription sur les listes électorales" />
              </div>
              <div className="column is-half">
                <QuickBox icon="🏠" label="Urbanisme / Permis de construire" />
              </div>
              <div className="column is-half">
                <QuickBox icon="📅" label="Prendre rendez-vous" />
              </div>
            </div>
            <h2 className="title is-5 has-text-primary mb-2 mt-5">Mot du Maire</h2>
            <div className="box" style={{ display: 'flex', alignItems: 'center', gap: 18, background: '#f8fafc' }}>
              <figure className="image is-96x96 mr-4">
                <img
                  className="is-rounded"
                  src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=128&q=80"
                  alt="Maire"
                  style={{ objectFit: 'cover', border: '3px solid #1277c6' }}
                  onError={e => { e.currentTarget.src = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=128&q=80"; }}
                />
              </figure>
              <div>
                <div className="has-text-link has-text-weight-bold mb-1">Chères habitantes, chers habitants</div>
                <div style={{ fontSize: 15, color: '#444' }}>
                  Je vous souhaite la bienvenue sur le site de notre commune...!
                </div>
              </div>
            </div>

            {/* AJOUT : Galerie photo en bas à gauche */}
            <div className="box mt-5" style={{ background: '#f8fafc' }}>
              <h2 className="subtitle is-6 has-text-link mb-2">Galerie du village</h2>
              <div className="columns is-mobile is-multiline is-gapless">
                <div className="column is-one-quarter">
                  <figure className="image is-64x64">
                    <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=128&q=80" alt="Vue 1" style={{ objectFit: 'cover', borderRadius: 8 }} />
                  </figure>
                </div>
                <div className="column is-one-quarter">
                  <figure className="image is-64x64">
                    <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=128&q=80" alt="Vue 2" style={{ objectFit: 'cover', borderRadius: 8 }} />
                  </figure>
                </div>
                <div className="column is-one-quarter">
                  <figure className="image is-64x64">
                    <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=128&q=80" alt="Vue 3" style={{ objectFit: 'cover', borderRadius: 8 }} />
                  </figure>
                </div>
                <div className="column is-one-quarter">
                  <figure className="image is-64x64">
                    <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=128&q=80" alt="Vue 4" style={{ objectFit: 'cover', borderRadius: 8 }} />
                  </figure>
                </div>
              </div>
              <div className="has-text-right mt-2">
                <a href="#" className="is-link is-underlined" style={{ fontSize: 14 }}>Voir toutes les photos</a>
              </div>
            </div>
            {/* FIN AJOUT */}
          </div>
          {/* Colonne 2 : Agenda + Infos pratiques + Calendrier + Contact */}
          <div className="column is-one-third">
            <h2 className="title is-5 has-text-primary mb-3">Agenda des événements</h2>
            <div className="mb-4">
              <AgendaItem title="Exposition à la médiathèque" date="20 avril 2024" />
              <AgendaItem title="Marché de producteurs" date="28 avril 2024" />
              <a href="#" className="is-link is-underlined ml-4" style={{ fontWeight: 700, fontSize: 15 }}>Voir tous les événements</a>
            </div>
            <h2 className="title is-5 has-text-primary mb-2">Infos pratiques</h2>
            <div className="mb-2"><span style={infoIcon}>🕒</span>
              <b>Horaires d’ouverture</b><br />
              Lun, mar, jeu, ven : 2h00 - 12h / 14h00 - 17h00<br />
              Mer : 8h40 - 12h00
            </div>
            <div className="mb-2"><span style={infoIcon}>📍</span>
              10 Rue de la Mairie<br />
              12345 Nom de la commune
            </div>
            <div className="mb-2"><span style={infoIcon}>📞</span>
              01 23 45 67 99
            </div>
            <div className="mb-4"><span style={infoIcon}>✉️</span>
              contact@commune.fr
            </div>

            {/* Calendrier simple */}
            <h2 className="title is-5 has-text-primary mb-2 mt-5">Calendrier</h2>
            <div className="box" style={{ background: '#f8fafc', marginBottom: 18 }}>
              <Calendar events={events} />
            </div>

            {/* Interface de contact */}
            <h2 className="title is-5 has-text-primary mb-2 mt-5">Contactez la mairie</h2>
            <div className="box" style={{ background: '#f8fafc' }}>
              {contactSent ? (
                <div className="notification is-success">Votre message a bien été envoyé !</div>
              ) : (
                <form onSubmit={handleContactSubmit}>
                  <div className="field">
                    <label className="label">Nom</label>
                    <div className="control">
                      <input className="input" type="text" name="nom" value={contact.nom} onChange={handleContactChange} required />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                      <input className="input" type="email" name="email" value={contact.email} onChange={handleContactChange} required />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Message</label>
                    <div className="control">
                      <textarea className="textarea" name="message" value={contact.message} onChange={handleContactChange} required />
                    </div>
                  </div>
                  <div className="field is-grouped is-grouped-right">
                    <div className="control">
                      <button className="button is-link" type="submit">Envoyer</button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Autres idées utiles */}
            <div className="box" style={{ background: '#f8fafc', marginTop: 24 }}>
              <h2 className="subtitle is-6 has-text-link mb-2">Liens utiles</h2>
              <ul style={{ paddingLeft: 18, fontSize: 15 }}>
                <li><a href="#" className="has-text-link is-underlined">Portail citoyen</a></li>
                <li><a href="#" className="has-text-link is-underlined">Menus cantine</a></li>
                <li><a href="#" className="has-text-link is-underlined">Associations locales</a></li>
                <li><a href="#" className="has-text-link is-underlined">Transports scolaires</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Widgets supplémentaires */}
        <div className="columns">
          <div className="column is-2">
            {/* Widget météo */}
            <div className="box has-text-centered" style={{ background: '#eaf6ff' }}>
              <span style={{ fontSize: 38 }}>🌤️</span>
              <div className="has-text-link has-text-weight-bold mt-2">Météo à Friesen</div>
              <div style={{ fontSize: 15 }}>22°C, Ensoleillé</div>
              <div className="is-size-7 has-text-grey">Prévisions fictives</div>
            </div>
            {/* Carte Google Maps */}
            <div className="box mt-4" style={{ padding: 0 }}>
              <iframe
                title="Carte Friesen"
                src="https://www.openstreetmap.org/export/embed.html?bbox=7.2,47.6,7.3,47.7&amp;layer=mapnik"
                style={{ width: '100%', height: 120, border: 0, borderRadius: 8 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
          <div className="column is-8">
            {/* ...Ton contenu principal ici... */}
          </div>
          <div className="column is-2">
            {/* Widget réseaux sociaux */}
            <div className="box has-text-centered" style={{ background: '#f8fafc' }}>
              <div className="has-text-link has-text-weight-bold mb-2">Suivez-nous</div>
              <a href="#" style={{ fontSize: 28, margin: 8 }}>📘</a>
              <a href="#" style={{ fontSize: 28, margin: 8 }}>📸</a>
              <a href="#" style={{ fontSize: 28, margin: 8 }}>🐦</a>
            </div>
            {/* Numéros d'urgence */}
            <div className="box mt-4" style={{ background: '#fffbe6' }}>
              <div className="has-text-danger has-text-weight-bold mb-1">Urgences</div>
              <div style={{ fontSize: 15 }}>
                🚒 Pompiers : <b>18</b><br />
                🚓 Police : <b>17</b><br />
                🚑 SAMU : <b>15</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour une actu
function ActualiteCard({ img, date, title, color }) {
  // Images libres de droits pour chaque actu
  const images = {
    "Fête locale : dates et programme": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&q=80",
    "Travaux de voirie : point d’avancement": "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=400&q=80",
    "Prochain conseil municipal le 15 avril": "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&q=80",
  };
  const defaultImg = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=400&q=80";
  const imgSrc = images[title] || img || defaultImg;

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-image">
        <figure className="image is-4by3">
          <img
            src={imgSrc}
            alt={title}
            style={{ objectFit: 'cover' }}
            onError={e => { e.currentTarget.src = defaultImg; }}
          />
        </figure>
      </div>
      <div className="card-content">
        <p className="has-text-link has-text-weight-bold is-size-7 mb-1">{date}</p>
        <p className="has-text-dark has-text-weight-semibold">{title}</p>
      </div>
    </div>
  );
}

// Composant pour une démarche rapide
function QuickBox({ icon, label }) {
  // Ajout d'une image illustrative pour chaque démarche rapide
  const images = {
    "Demande d’acte de naissance": "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=256&q=80",
    "Inscription sur les listes électorales": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=256&q=80",
    "Urbanisme / Permis de construire": "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=256&q=80",
    "Prendre rendez-vous": "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=256&q=80",
  };
  const imgSrc = images[label] || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=256&q=80";
  return (
    <div className="box has-text-centered" style={{ background: '#f4f8fb', border: '1.5px solid #e0e7ef', cursor: 'pointer', transition: 'box-shadow 0.18s, border 0.18s' }}>
      <figure className="image is-64x64" style={{ margin: '0 auto 8px auto' }}>
        <img src={imgSrc} alt={label} style={{ objectFit: 'cover', borderRadius: 8, width: 48, height: 48 }} onError={e => { e.currentTarget.src = "/default.jpg"; }} />
      </figure>
      <span style={{ fontSize: 32, color: '#1277c6' }}>{icon}</span>
      <div className="mt-2 has-text-weight-semibold">{label}</div>
    </div>
  );
}

// Composant pour un événement d'agenda
function AgendaItem({ title, date }) {
  // Ajout d'une image illustrative pour chaque événement
  const images = {
    "Exposition à la médiathèque": "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=128&q=80",
    "Marché de producteurs": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=128&q=80",
  };
  const imgSrc = images[title] || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=128&q=80";
  return (
    <div className="box is-flex is-align-items-center mb-2" style={{ background: '#f8fafc', gap: 10, padding: '8px 12px' }}>
      <figure className="image is-48x48">
        <img src={imgSrc} alt={title} style={{ objectFit: 'cover', borderRadius: 8, width: 36, height: 36 }} onError={e => { e.currentTarget.src = "/default.jpg"; }} />
      </figure>
      <div>
        <div className="has-text-weight-semibold has-text-dark">{title}</div>
        <div className="has-text-link is-size-7">{date}</div>
      </div>
    </div>
  );
}

// Petit composant calendrier simple
function Calendar({ events }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function getEventForDay(day) {
    const d = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.find(ev => ev.date === d);
  }

  return (
    <table className="table is-bordered is-narrow is-fullwidth has-background-white-ter" style={{ fontSize: 14 }}>
      <thead>
        <tr>
          <th colSpan={7} className="has-background-link has-text-white has-text-centered">
            {today.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
          </th>
        </tr>
        <tr>
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(j => <th key={j} className="has-text-centered">{j}</th>)}
        </tr>
      </thead>
      <tbody>
        {(() => {
          const firstDay = new Date(year, month, 1).getDay() || 7;
          const rows = [];
          let cells = [];
          let dayNum = 1;
          for (let i = 1; i < firstDay; i++) cells.push(<td key={`empty-${i}`}></td>);
          for (let i = firstDay; i <= 7; i++) {
            if (dayNum <= daysInMonth) {
              const ev = getEventForDay(dayNum);
              cells.push(
                <td key={dayNum} style={{ background: ev ? '#eaf6ff' : undefined, fontWeight: ev ? 700 : 400 }}>
                  {dayNum}
                  {ev && <div style={{ fontSize: 10, color: '#1277c6' }}>{ev.title}</div>}
                </td>
              );
              dayNum++;
            }
          }
          rows.push(<tr key="row-1">{cells}</tr>);
          while (dayNum <= daysInMonth) {
            cells = [];
            for (let i = 0; i < 7; i++) {
              if (dayNum <= daysInMonth) {
                const ev = getEventForDay(dayNum);
                cells.push(
                  <td key={dayNum} style={{ background: ev ? '#eaf6ff' : undefined, fontWeight: ev ? 700 : 400 }}>
                    {dayNum}
                    {ev && <div style={{ fontSize: 10, color: '#1277c6' }}>{ev.title}</div>}
                  </td>
                );
                dayNum++;
              } else {
                cells.push(<td key={`empty-${dayNum + i}`}></td>);
              }
            }
            rows.push(<tr key={`row-${dayNum}`}>{cells}</tr>);
          }
          return rows;
        })()}
      </tbody>
    </table>
  );
}

const infoIcon = {
  fontSize: 18,
  color: '#1277c6',
  marginRight: 8,
};