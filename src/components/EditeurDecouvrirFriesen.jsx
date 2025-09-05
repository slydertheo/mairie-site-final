import React, { useState } from 'react';

export default function EditeurDecouvrirFriesen() {
  const [content, setContent] = useState({
    heroTitre: "Bienvenue sur le site officiel de la Mairie de Friesen",
    heroSousTitre: "la Mairie de Friesen",
    heroImage: "village.jpeg",
    guideIntro: "Friesen vous invite à découvrir son riche patrimoine architectural, ses traditions vivantes et ses magnifiques paysages.",
    guideBouton: "Télécharger le guide (PDF)",
    guidePlan: "Plan interactif",
    pointsInteret: [
      { nom: "", categorie: "", description: "", adresse: "", horaires: "", image: "" }
    ],
    circuitsPedestres: [
      { nom: "", distance: "", duree: "", difficulte: "", depart: "", description: "", points: [""], image: "" }
    ],
    circuitsVTT: [
      { nom: "", distance: "", duree: "", difficulte: "", depart: "", description: "", denivele: "", image: "" }
    ],
    installationsSportives: [
      { nom: "", description: "", equipements: [""], horaires: "", adresse: "", image: "" }
    ],
    officeTourisme: {
      adresse: "",
      tel: "",
      email: "",
      horaires: "",
      site: ""
    },
    infosPratiques: [
      { titre: "", texte: "" }
    ]
  });

  // Helpers pour listes
  const handleListChange = (section, idx, field, value) => {
    const arr = [...content[section]];
    arr[idx][field] = value;
    setContent({ ...content, [section]: arr });
  };
  const addListItem = (section, template) => {
    setContent({ ...content, [section]: [...content[section], template] });
  };
  const removeListItem = (section, idx) => {
    setContent({ ...content, [section]: content[section].filter((_, i) => i !== idx) });
  };

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <h1 className="title is-3 has-text-link mb-5">Éditeur - Découvrir Friesen</h1>
      
      {/* HERO */}
      <div className="box mb-4">
        <h2 className="subtitle is-5">En-tête (Hero)</h2>
        <label className="label">Titre principal</label>
        <input className="input mb-2" value={content.heroTitre} onChange={e => setContent({ ...content, heroTitre: e.target.value })} />
        <label className="label">Sous-titre</label>
        <input className="input mb-2" value={content.heroSousTitre} onChange={e => setContent({ ...content, heroSousTitre: e.target.value })} />
        <label className="label">Image de fond</label>
        <input className="input mb-2" value={content.heroImage} onChange={e => setContent({ ...content, heroImage: e.target.value })} />
      </div>

      {/* GUIDE */}
      <div className="box mb-4">
        <h2 className="subtitle is-5">Guide de visite</h2>
        <label className="label">Introduction</label>
        <textarea className="textarea mb-2" value={content.guideIntro} onChange={e => setContent({ ...content, guideIntro: e.target.value })} />
        <label className="label">Texte bouton PDF</label>
        <input className="input mb-2" value={content.guideBouton} onChange={e => setContent({ ...content, guideBouton: e.target.value })} />
        <label className="label">Texte bouton plan</label>
        <input className="input mb-2" value={content.guidePlan} onChange={e => setContent({ ...content, guidePlan: e.target.value })} />
      </div>

      {/* Points d'intérêt */}
      <div className="box mb-4">
        <h2 className="subtitle is-5">Points d'intérêt</h2>
        {content.pointsInteret.map((point, i) => (
          <div key={i} className="box mb-2" style={{ background: "#fafdff" }}>
            <label className="label">Nom</label>
            <input className="input mb-2" value={point.nom} onChange={e => handleListChange('pointsInteret', i, 'nom', e.target.value)} />
            <label className="label">Catégorie</label>
            <input className="input mb-2" value={point.categorie} onChange={e => handleListChange('pointsInteret', i, 'categorie', e.target.value)} />
            <label className="label">Description</label>
            <textarea className="textarea mb-2" value={point.description} onChange={e => handleListChange('pointsInteret', i, 'description', e.target.value)} />
            <label className="label">Adresse</label>
            <input className="input mb-2" value={point.adresse} onChange={e => handleListChange('pointsInteret', i, 'adresse', e.target.value)} />
            <label className="label">Horaires</label>
            <input className="input mb-2" value={point.horaires} onChange={e => handleListChange('pointsInteret', i, 'horaires', e.target.value)} />
            <label className="label">Image (URL)</label>
            <input className="input mb-2" value={point.image} onChange={e => handleListChange('pointsInteret', i, 'image', e.target.value)} />
            <button type="button" className="button is-danger is-small mt-2" onClick={() => removeListItem('pointsInteret', i)}>Supprimer</button>
          </div>
        ))}
        <button type="button" className="button is-link is-light is-small" onClick={() => addListItem('pointsInteret', { nom: "", categorie: "", description: "", adresse: "", horaires: "", image: "" })}>Ajouter un point d'intérêt</button>
      </div>

      {/* Circuits pédestres */}
      <div className="box mb-4">
        <h2 className="subtitle is-5">Circuits pédestres</h2>
        {content.circuitsPedestres.map((circuit, i) => (
          <div key={i} className="box mb-2" style={{ background: "#fafdff" }}>
            <label className="label">Nom</label>
            <input className="input mb-2" value={circuit.nom} onChange={e => handleListChange('circuitsPedestres', i, 'nom', e.target.value)} />
            <label className="label">Distance</label>
            <input className="input mb-2" value={circuit.distance} onChange={e => handleListChange('circuitsPedestres', i, 'distance', e.target.value)} />
            <label className="label">Durée</label>
            <input className="input mb-2" value={circuit.duree} onChange={e => handleListChange('circuitsPedestres', i, 'duree', e.target.value)} />
            <label className="label">Difficulté</label>
            <input className="input mb-2" value={circuit.difficulte} onChange={e => handleListChange('circuitsPedestres', i, 'difficulte', e.target.value)} />
            <label className="label">Départ</label>
            <input className="input mb-2" value={circuit.depart} onChange={e => handleListChange('circuitsPedestres', i, 'depart', e.target.value)} />
            <label className="label">Description</label>
            <textarea className="textarea mb-2" value={circuit.description} onChange={e => handleListChange('circuitsPedestres', i, 'description', e.target.value)} />
            <label className="label">Points d'intérêt (séparés par une virgule)</label>
            <input className="input mb-2" value={circuit.points.join(", ")} onChange={e => handleListChange('circuitsPedestres', i, 'points', e.target.value.split(",").map(s => s.trim()))} />
            <label className="label">Image (URL)</label>
            <input className="input mb-2" value={circuit.image} onChange={e => handleListChange('circuitsPedestres', i, 'image', e.target.value)} />
            <button type="button" className="button is-danger is-small mt-2" onClick={() => removeListItem('circuitsPedestres', i)}>Supprimer</button>
          </div>
        ))}
        <button type="button" className="button is-link is-light is-small" onClick={() => addListItem('circuitsPedestres', { nom: "", distance: "", duree: "", difficulte: "", depart: "", description: "", points: [""], image: "" })}>Ajouter un circuit pédestre</button>
      </div>

      {/* Circuits VTT */}
      <div className="box mb-4">
        <h2 className="subtitle is-5">Circuits VTT</h2>
        {content.circuitsVTT.map((circuit, i) => (
          <div key={i} className="box mb-2" style={{ background: "#fafdff" }}>
            <label className="label">Nom</label>
            <input className="input mb-2" value={circuit.nom} onChange={e => handleListChange('circuitsVTT', i, 'nom', e.target.value)} />
            <label className="label">Distance</label>
            <input className="input mb-2" value={circuit.distance} onChange={e => handleListChange('circuitsVTT', i, 'distance', e.target.value)} />
            <label className="label">Durée</label>
            <input className="input mb-2" value={circuit.duree} onChange={e => handleListChange('circuitsVTT', i, 'duree', e.target.value)} />
            <label className="label">Difficulté</label>
            <input className="input mb-2" value={circuit.difficulte} onChange={e => handleListChange('circuitsVTT', i, 'difficulte', e.target.value)} />
            <label className="label">Départ</label>
            <input className="input mb-2" value={circuit.depart} onChange={e => handleListChange('circuitsVTT', i, 'depart', e.target.value)} />
            <label className="label">Description</label>
            <textarea className="textarea mb-2" value={circuit.description} onChange={e => handleListChange('circuitsVTT', i, 'description', e.target.value)} />
            <label className="label">Dénivelé</label>
            <input className="input mb-2" value={circuit.denivele} onChange={e => handleListChange('circuitsVTT', i, 'denivele', e.target.value)} />
            <label className="label">Image (URL)</label>
            <input className="input mb-2" value={circuit.image} onChange={e => handleListChange('circuitsVTT', i, 'image', e.target.value)} />
            <button type="button" className="button is-danger is-small mt-2" onClick={() => removeListItem('circuitsVTT', i)}>Supprimer</button>
          </div>
        ))}
        <button type="button" className="button is-link is-light is-small" onClick={() => addListItem('circuitsVTT', { nom: "", distance: "", duree: "", difficulte: "", depart: "", description: "", denivele: "", image: "" })}>Ajouter un circuit VTT</button>
      </div>

      {/* Installations sportives */}
      <div className="box mb-4">
        <h2 className="subtitle is-5">Installations sportives</h2>
        {content.installationsSportives.map((inst, i) => (
          <div key={i} className="box mb-2" style={{ background: "#fafdff" }}>
            <label className="label">Nom</label>
            <input className="input mb-2" value={inst.nom} onChange={e => handleListChange('installationsSportives', i, 'nom', e.target.value)} />
            <label className="label">Description</label>
            <textarea className="textarea mb-2" value={inst.description} onChange={e => handleListChange('installationsSportives', i, 'description', e.target.value)} />
            <label className="label">Équipements (séparés par une virgule)</label>
            <input className="input mb-2" value={inst.equipements.join(", ")} onChange={e => handleListChange('installationsSportives', i, 'equipements', e.target.value.split(",").map(s => s.trim()))} />
            <label className="label">Horaires</label>
            <input className="input mb-2" value={inst.horaires} onChange={e => handleListChange('installationsSportives', i, 'horaires', e.target.value)} />
            <label className="label">Adresse</label>
            <input className="input mb-2" value={inst.adresse} onChange={e => handleListChange('installationsSportives', i, 'adresse', e.target.value)} />
            <label className="label">Image (URL)</label>
            <input className="input mb-2" value={inst.image} onChange={e => handleListChange('installationsSportives', i, 'image', e.target.value)} />
            <button type="button" className="button is-danger is-small mt-2" onClick={() => removeListItem('installationsSportives', i)}>Supprimer</button>
          </div>
        ))}
        <button type="button" className="button is-link is-light is-small" onClick={() => addListItem('installationsSportives', { nom: "", description: "", equipements: [""], horaires: "", adresse: "", image: "" })}>Ajouter une installation sportive</button>
      </div>

      {/* Office du tourisme */}
      <div className="box mb-4">
        <h2 className="subtitle is-5">Office du tourisme</h2>
        <label className="label">Adresse</label>
        <input className="input mb-2" value={content.officeTourisme.adresse} onChange={e => setContent({ ...content, officeTourisme: { ...content.officeTourisme, adresse: e.target.value } })} />
        <label className="label">Téléphone</label>
        <input className="input mb-2" value={content.officeTourisme.tel} onChange={e => setContent({ ...content, officeTourisme: { ...content.officeTourisme, tel: e.target.value } })} />
        <label className="label">Email</label>
        <input className="input mb-2" value={content.officeTourisme.email} onChange={e => setContent({ ...content, officeTourisme: { ...content.officeTourisme, email: e.target.value } })} />
        <label className="label">Horaires</label>
        <input className="input mb-2" value={content.officeTourisme.horaires} onChange={e => setContent({ ...content, officeTourisme: { ...content.officeTourisme, horaires: e.target.value } })} />
        <label className="label">Site web</label>
        <input className="input mb-2" value={content.officeTourisme.site} onChange={e => setContent({ ...content, officeTourisme: { ...content.officeTourisme, site: e.target.value } })} />
      </div>

      {/* Infos pratiques */}
      <div className="box mb-4">
        <h2 className="subtitle is-5">Informations pratiques</h2>
        {content.infosPratiques.map((info, i) => (
          <div key={i} className="box mb-2" style={{ background: "#fafdff" }}>
            <label className="label">Titre</label>
            <input className="input mb-2" value={info.titre} onChange={e => handleListChange('infosPratiques', i, 'titre', e.target.value)} />
            <label className="label">Texte</label>
            <textarea className="textarea mb-2" value={info.texte} onChange={e => handleListChange('infosPratiques', i, 'texte', e.target.value)} />
            <button type="button" className="button is-danger is-small mt-2" onClick={() => removeListItem('infosPratiques', i)}>Supprimer</button>
          </div>
        ))}
        <button type="button" className="button is-link is-light is-small" onClick={() => addListItem('infosPratiques', { titre: "", texte: "" })}>Ajouter une info pratique</button>
      </div>

      <button className="button is-link is-medium mt-4">Enregistrer</button>
    </div>
  );
}