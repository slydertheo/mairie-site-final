import React, { useState, useEffect } from 'react';

const FIELDS = [
  { key: 'marche_titre', label: 'Titre du marché', type: 'text', placeholder: 'Marché hebdomadaire' },
  { key: 'marche_texte', label: 'Texte d’intro', type: 'textarea', placeholder: 'Retrouvez nos producteurs et artisans locaux...' },
  { key: 'marche_adresse', label: 'Adresse', type: 'text', placeholder: 'Place de la Mairie, 68580 Friesen' },
  { key: 'marche_jour', label: 'Jour', type: 'text', placeholder: 'Tous les samedis matin' },
  { key: 'marche_horaires', label: 'Horaires', type: 'text', placeholder: 'De 8h à 13h' },
  { key: 'marche_produits', label: 'Produits proposés', type: 'textarea', placeholder: 'Fruits et légumes, fromages, ...' },
  { key: 'marche_image', label: 'Image (URL)', type: 'text', placeholder: 'https://...' },
];

export default function MarcheCrud() {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/pageContent?page=commerces')
      .then(res => res.json())
      .then(data => {
        const obj = {};
        data.forEach(d => { obj[d.section] = d.contenu || d.titre; });
        setContent(obj);
      });
  }, []);

  const handleChange = e => setContent({ ...content, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    await Promise.all(FIELDS.map(async field => {
      await fetch('/api/pageContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'commerces',
          section: field.key,
          contenu: content[field.key] || ''
        })
      });
    }));
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="box mt-5" style={{ background: '#f8fafc', borderRadius: 16, maxWidth: 900, margin: '0 auto' }}>
      <h2 className="title is-4 has-text-primary mb-4">🛒 Marché hebdomadaire – édition</h2>
      <form onSubmit={handleSubmit}>
        <div className="columns is-multiline">
          {FIELDS.map(field => (
            <div className="column is-full-mobile is-half-tablet" key={field.key}>
              <div className="field mb-4">
                <label className="label">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    className="textarea"
                    name={field.key}
                    value={content[field.key] || ''}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    rows={field.key === 'marche_produits' ? 3 : 2}
                  />
                ) : (
                  <input
                    className="input"
                    type="text"
                    name={field.key}
                    value={content[field.key] || ''}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="is-flex is-justify-content-space-between is-align-items-center mt-4">
          {saved && (
            <span className="has-text-success" style={{ fontWeight: 600 }}>
              ✅ Modifications enregistrées !
            </span>
          )}
          <button className={`button is-link is-medium${loading ? ' is-loading' : ''}`} type="submit">
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}