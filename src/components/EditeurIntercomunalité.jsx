import React, { useState, useEffect } from 'react';

export default function IntercommunaliteEditor() {
  const [content, setContent] = useState({
    hero_titre: '',
    titre: '',
    intro: '',
    titre_organismes: '',
    organismes: [],
    projets: [],
    representants: [],
    contact: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/pageContent?page=intercommunalite')
      .then(res => res.json())
      .then(data => setContent(data[0] || {}));
  }, []);

  // Handlers
  const handleChange = e => setContent({ ...content, [e.target.name]: e.target.value });
  const handleOrgChange = (i, field, value) => {
    const organismes = [...content.organismes];
    organismes[i][field] = value;
    setContent({ ...content, organismes });
  };
  const addOrg = () => setContent({
    ...content,
    organismes: [...(content.organismes || []), { nom: '', logo: '', description: '', siteWeb: '', competences: [''] }]
  });
  const removeOrg = i => setContent({ ...content, organismes: content.organismes.filter((_, idx) => idx !== i) });

  const handleProjChange = (i, field, value) => {
    const projets = [...content.projets];
    projets[i][field] = value;
    setContent({ ...content, projets });
  };
  const addProj = () => setContent({
    ...content,
    projets: [...(content.projets || []), { titre: '', image: '', structure: '', description: '' }]
  });
  const removeProj = i => setContent({ ...content, projets: content.projets.filter((_, idx) => idx !== i) });

  const handleRepChange = (i, field, value) => {
    const representants = [...content.representants];
    representants[i][field] = value;
    setContent({ ...content, representants });
  };
  const addRep = () => setContent({
    ...content,
    representants: [...(content.representants || []), { structure: '', titulaires: '', suppleants: '' }]
  });
  const removeRep = i => setContent({ ...content, representants: content.representants.filter((_, idx) => idx !== i) });

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/pageContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: 'intercommunalite',
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
        boxShadow: '0 2px 16px #e0e7ef'
      }}>
        <h2 className="title is-4 mb-4 has-text-link" style={{ textAlign: 'center', letterSpacing: 1 }}>
          🗂️ Page Intercommunalité
        </h2>
        <form onSubmit={handleSave}>
          {/* Organismes */}
          <div className="box mb-4" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
            <h3 className="subtitle is-5 mb-3" style={{ color: '#3273dc', fontWeight: 700 }}>🏢 Organismes intercommunaux</h3>
            <input
              className="input mb-2"
              name="titre_organismes"
              placeholder="Titre de la section organismes"
              value={content.titre_organismes || ''}
              onChange={handleChange}
            />
            {(content.organismes || []).map((org, i) => (
              <div key={i} className="box mb-3" style={{
                background: "#fafdff",
                borderRadius: 10,
                boxShadow: '0 1px 6px #e0e7ef'
              }}>
                <input className="input mb-2" placeholder="Nom" value={org.nom} onChange={e => handleOrgChange(i, 'nom', e.target.value)} />
                <input className="input mb-2" placeholder="Logo (URL)" value={org.logo} onChange={e => handleOrgChange(i, 'logo', e.target.value)} />
                <input className="input mb-2" placeholder="Site web" value={org.siteWeb} onChange={e => handleOrgChange(i, 'siteWeb', e.target.value)} />
                <textarea className="textarea mb-2" placeholder="Description" value={org.description} onChange={e => handleOrgChange(i, 'description', e.target.value)} />
                <label className="label is-small">Compétences (une par ligne)</label>
                <textarea className="textarea mb-2" placeholder="Compétences" value={org.competences ? org.competences.join('\n') : ''} onChange={e => handleOrgChange(i, 'competences', e.target.value.split('\n'))} />
                <button type="button" className="button is-danger is-small mt-2" onClick={() => removeOrg(i)}>Supprimer</button>
              </div>
            ))}
            <button type="button" className="button is-link is-light is-small" onClick={addOrg}>Ajouter un organisme</button>
          </div>
          {/* Projets */}
          <div className="box mb-4" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
            <h3 className="subtitle is-5 mb-3" style={{ color: '#3273dc', fontWeight: 700 }}>🛠️ Projets intercommunaux</h3>
            <input
              className="input mb-2"
              name="titre_projets"
              placeholder="Titre de la section projets"
              value={content.titre_projets || ''}
              onChange={handleChange}
            />
            {(content.projets || []).map((proj, i) => (
              <div key={i} className="box mb-3" style={{
                background: "#fafdff",
                borderRadius: 10,
                boxShadow: '0 1px 6px #e0e7ef'
              }}>
                <input className="input mb-2" placeholder="Titre" value={proj.titre} onChange={e => handleProjChange(i, 'titre', e.target.value)} />
                <input className="input mb-2" placeholder="Image (URL)" value={proj.image} onChange={e => handleProjChange(i, 'image', e.target.value)} />
                <input className="input mb-2" placeholder="Structure" value={proj.structure} onChange={e => handleProjChange(i, 'structure', e.target.value)} />
                <textarea className="textarea mb-2" placeholder="Description" value={proj.description} onChange={e => handleProjChange(i, 'description', e.target.value)} />
                <button type="button" className="button is-danger is-small mt-2" onClick={() => removeProj(i)}>Supprimer</button>
              </div>
            ))}
            <button type="button" className="button is-link is-light is-small" onClick={addProj}>Ajouter un projet</button>
          </div>
          {/* Représentants */}
          <div className="box mb-4" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
            <h3 className="subtitle is-5 mb-3" style={{ color: '#3273dc', fontWeight: 700 }}>👥 Représentants</h3>
            <input
              className="input mb-2"
              name="titre_representants"
              placeholder="Titre de la section représentants"
              value={content.titre_representants || ''}
              onChange={handleChange}
            />
            {(content.representants || []).map((rep, i) => (
              <div key={i} className="box mb-3" style={{
                background: "#fafdff",
                borderRadius: 10,
                boxShadow: '0 1px 6px #e0e7ef'
              }}>
                <input className="input mb-2" placeholder="Structure" value={rep.structure} onChange={e => handleRepChange(i, 'structure', e.target.value)} />
                <input className="input mb-2" placeholder="Délégués titulaires" value={rep.titulaires} onChange={e => handleRepChange(i, 'titulaires', e.target.value)} />
                <input className="input mb-2" placeholder="Délégués suppléants" value={rep.suppleants} onChange={e => handleRepChange(i, 'suppleants', e.target.value)} />
                <button type="button" className="button is-danger is-small mt-2" onClick={() => removeRep(i)}>Supprimer</button>
              </div>
            ))}
            <button type="button" className="button is-link is-light is-small" onClick={addRep}>Ajouter un représentant</button>
          </div>
          {/* Contact */}
          <div className="box mb-4" style={{ borderRadius: 12, border: '1.5px solid #e0e7ef', background: '#fff' }}>
            <h3 className="subtitle is-5 mb-3" style={{ color: '#3273dc', fontWeight: 700 }}>📞 Contact</h3>
            <div className="field">
              <label className="label">Texte de contact</label>
              <input className="input" name="contact" value={content.contact || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="field is-grouped mt-4" style={{ justifyContent: 'center' }}>
            <div className="control">
              <button className={`button is-link${loading ? ' is-loading' : ''}`} type="submit" disabled={loading}>
                Enregistrer
              </button>
            </div>
            {msg && <div className="notification is-info is-light py-2 px-3 ml-3">{msg}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}