import React, { useState, useEffect } from 'react';

export default function EditeurDecouvrirFriesen() {
  const [content, setContent] = useState({
    introVillage: "",
    guideBouton: "",
    guidePlan: "",
    accrocheVillage: "",
    infosVisiteGuidee: [],
    titrePedestre: "",
    textePedestre: "",
    circuitsPedestres: [],
    titreVTT: "",
    texteVTT: "",
    circuitsVTT: [],
    locationVTT: "",
    locationVTTInfos: [],
    consignesTitre: "",
    consignes: [],
    titreInstallations: "",
    texteInstallations: "",
    installationsSportives: [],
    equipementsSportifs: "",
    equipementsSportifsInfos: [],
    officeTourisme: {
      adresse: "",
      tel: "",
      email: "",
      horaires: "",
      site: ""
    },
    infosPratiques: [],
    pointsInteret: []
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/pageContent?page=decouvrir_friesen')
      .then(res => res.json())
      .then(data => {
        setContent({ ...content, ...(data[0] || {}) });
      });
    // eslint-disable-next-line
  }, []);

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

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/pageContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: 'decouvrir_friesen',
        ...content
      })
    });
    setLoading(false);
    setMsg('Modifications enregistrées !');
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <div className="container" style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 32 }}>
      <div className="box" style={{
        borderRadius: 16,
        background: '#fafdff',
        boxShadow: '0 2px 16px #e0e7ef',
        padding: '32px 24px'
      }}>
        <h1 className="title is-4 has-text-link mb-5" style={{ textAlign: 'center', letterSpacing: 1 }}>
          🏞️ Éditeur - Découvrir Friesen
        </h1>
        <form onSubmit={handleSave}>
          {/* Guide de visite */}
          <div className="box mb-6">
            <h2 className="title is-4 has-text-link mb-4">🏞️ Page : Guide de visite</h2>
            <label className="label">Accroche village</label>
            <input className="input mb-2" value={content.accrocheVillage} onChange={e => setContent({ ...content, accrocheVillage: e.target.value })} />
            <label className="label">Texte d’introduction</label>
            <textarea className="textarea mb-2" value={content.introVillage} onChange={e => setContent({ ...content, introVillage: e.target.value })} />
            <label className="label">Infos visites guidées (une ligne par info)</label>
            <textarea className="textarea mb-2" value={(content.infosVisiteGuidee || []).join('\n')}
              onChange={e => setContent({ ...content, infosVisiteGuidee: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })} rows={6} />
            <label className="label">Texte bouton PDF</label>
            <input className="input mb-2" value={content.guideBouton} onChange={e => setContent({ ...content, guideBouton: e.target.value })} />
            <label className="label">Texte bouton plan</label>
            <input className="input mb-2" value={content.guidePlan} onChange={e => setContent({ ...content, guidePlan: e.target.value })} />
          </div>

          {/* Points d'intérêt */}
          <div className="box mb-6">
            <h2 className="title is-4 has-text-primary mb-4">📍 Page : Points d'intérêt</h2>
            {(content.pointsInteret || []).map((point, i) => (
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
          <div className="box mb-6">
            <h2 className="title is-4 has-text-success mb-4">🚶‍♂️ Page : Circuits pédestres</h2>
            <label className="label">Titre section circuits pédestres</label>
            <input className="input mb-2" value={content.titrePedestre} onChange={e => setContent({ ...content, titrePedestre: e.target.value })} />
            <label className="label">Texte d’intro circuits pédestres</label>
            <textarea className="textarea mb-2" value={content.textePedestre} onChange={e => setContent({ ...content, textePedestre: e.target.value })} rows={3} />
            {(content.circuitsPedestres || []).map((circuit, i) => (
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
                <input className="input mb-2" value={(circuit.points || []).join(", ")} onChange={e => handleListChange('circuitsPedestres', i, 'points', e.target.value.split(",").map(s => s.trim()))} />
                <label className="label">Image (URL)</label>
                <input className="input mb-2" value={circuit.image} onChange={e => handleListChange('circuitsPedestres', i, 'image', e.target.value)} />
                <button type="button" className="button is-danger is-small mt-2" onClick={() => removeListItem('circuitsPedestres', i)}>Supprimer</button>
              </div>
            ))}
            <button type="button" className="button is-link is-light is-small" onClick={() => addListItem('circuitsPedestres', { nom: "", distance: "", duree: "", difficulte: "", depart: "", description: "", points: [""], image: "" })}>Ajouter un circuit pédestre</button>
          </div>

          {/* Circuits VTT */}
          <div className="box mb-6">
            <h2 className="title is-4 has-text-warning mb-4">🚵‍♂️ Page : Circuits VTT</h2>
            <label className="label">Titre section circuits VTT</label>
            <input className="input mb-2" value={content.titreVTT} onChange={e => setContent({ ...content, titreVTT: e.target.value })} />
            <label className="label">Texte d’intro circuits VTT</label>
            <textarea className="textarea mb-2" value={content.texteVTT} onChange={e => setContent({ ...content, texteVTT: e.target.value })} rows={3} />
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

          {/* Location de VTT */}
          <div className="box mb-6">
            <h2 className="title is-4 has-text-link mb-4">🚲 Page : Location de VTT</h2>
            <label className="label">Texte d’intro location VTT</label>
            <textarea className="textarea mb-2" value={content.locationVTT} onChange={e => setContent({ ...content, locationVTT: e.target.value })} rows={3} />
            <label className="label">Infos location VTT (une ligne par info)</label>
            <textarea className="textarea mb-2" value={(content.locationVTTInfos || []).join('\n')}
              onChange={e => setContent({ ...content, locationVTTInfos: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })} rows={4} />
          </div>

          {/* Consignes de sécurité */}
          <div className="box mb-6">
            <h2 className="title is-4 has-text-warning mb-4">⚠️ Page : Consignes de sécurité</h2>
            <label className="label">Titre consignes</label>
            <input className="input mb-2" value={content.consignesTitre} onChange={e => setContent({ ...content, consignesTitre: e.target.value })} />
            <label className="label">Liste des consignes (une ligne par consigne)</label>
            <textarea className="textarea mb-2" value={(content.consignes || []).join('\n')}
              onChange={e => setContent({ ...content, consignes: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })} rows={5} />
          </div>

          {/* Installations sportives */}
          <div className="box mb-6">
            <h2 className="title is-4 has-text-danger mb-4">🏟️ Page : Installations sportives</h2>
            <label className="label">Titre section installations sportives</label>
            <input className="input mb-2" value={content.titreInstallations} onChange={e => setContent({ ...content, titreInstallations: e.target.value })} />
            <label className="label">Texte d’intro installations sportives</label>
            <textarea className="textarea mb-2" value={content.texteInstallations} onChange={e => setContent({ ...content, texteInstallations: e.target.value })} rows={3} />
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

          {/* Équipements sportifs à louer */}
          <div className="box mb-6">
            <h2 className="title is-4 has-text-primary mb-4">🎾 Page : Équipements sportifs à louer</h2>
            <label className="label">Titre équipements sportifs à louer</label>
            <input className="input mb-2" value={content.equipementsSportifs} onChange={e => setContent({ ...content, equipementsSportifs: e.target.value })} />
            <label className="label">Liste des équipements à louer</label>
            <div className="columns is-multiline">
              {content.equipementsSportifsInfos.map((eq, i) => (
                <div key={i} className="column is-12-mobile is-6-tablet is-6-desktop">
                  <div className="box" style={{ background: "#fafdff", borderRadius: 12 }}>
                    <label className="label">Emoji</label>
                    <input className="input mb-2" value={eq.emoji} onChange={e => {
                      const arr = [...content.equipementsSportifsInfos];
                      arr[i].emoji = e.target.value;
                      setContent({ ...content, equipementsSportifsInfos: arr });
                    }} placeholder="🏀" />
                    <label className="label">Titre</label>
                    <input className="input mb-2" value={eq.titre} onChange={e => {
                      const arr = [...content.equipementsSportifsInfos];
                      arr[i].titre = e.target.value;
                      setContent({ ...content, equipementsSportifsInfos: arr });
                    }} placeholder="Ballons et matériel" />
                    <label className="label">Description</label>
                    <textarea className="textarea mb-2" value={eq.description} onChange={e => {
                      const arr = [...content.equipementsSportifsInfos];
                      arr[i].description = e.target.value;
                      setContent({ ...content, equipementsSportifsInfos: arr });
                    }} placeholder="Ballons (foot, basket, volley), raquettes de badminton et autres équipements disponibles à la mairie." />
                    <label className="label">Note (optionnel)</label>
                    <input className="input mb-2" value={eq.note} onChange={e => {
                      const arr = [...content.equipementsSportifsInfos];
                      arr[i].note = e.target.value;
                      setContent({ ...content, equipementsSportifsInfos: arr });
                    }} placeholder="Caution demandée. Réservation conseillée en période estivale." />
                    <button type="button" className="button is-danger is-light mt-2"
                      onClick={() => setContent({
                        ...content,
                        equipementsSportifsInfos: content.equipementsSportifsInfos.filter((_, idx) => idx !== i)
                      })}>
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="button is-link is-light is-small"
              onClick={() => setContent({
                ...content,
                equipementsSportifsInfos: [
                  ...content.equipementsSportifsInfos,
                  { emoji: "", titre: "", description: "", note: "" }
                ]
              })}>
              Ajouter une ligne
            </button>
          </div>

          {/* Office du tourisme */}
          <div className="box mb-6">
            <h2 className="title is-4 has-text-info mb-4">🏢 Page : Office du tourisme</h2>
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

          {/* Informations pratiques */}
          <div className="box mb-6">
            <h2 className="title is-4 has-text-grey mb-4">ℹ️ Page : Informations pratiques</h2>
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

          <button className={`button is-link is-medium mt-4${loading ? ' is-loading' : ''}`} type="submit" disabled={loading}>Enregistrer</button>
          {msg && <div className="notification is-info is-light py-2 px-3 mt-3">{msg}</div>}
        </form>
      </div>
    </div>
  );
}