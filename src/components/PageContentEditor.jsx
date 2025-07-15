import React, { useState, useEffect } from 'react';

const PAGES = [
  { slug: 'accueil', title: 'Accueil' },
  { slug: 'infos_pratiques', title: 'Infos pratiques' },
  { slug: 'decouvrir_friesen', title: 'Découvrir Friesen' },
  // Ajoute ici les autres pages à éditer
];

export default function PageContentEditor() {
  const [selectedPage, setSelectedPage] = useState(PAGES[0].slug);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Charger le contenu de la page sélectionnée
  useEffect(() => {
    setLoading(true);
    fetch(`/api/pages?slug=${selectedPage}`)
      .then(res => res.json())
      .then(data => setContent(data.content || ''))
      .catch(() => setContent(''))
      .finally(() => setLoading(false));
  }, [selectedPage]);

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/pages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: selectedPage, content }),
    });
    setMsg(res.ok ? 'Contenu enregistré !' : 'Erreur lors de la sauvegarde');
    setLoading(false);
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <div className="box" style={{ borderRadius: 12 }}>
      <div className="field mb-4">
        <label className="label">Page à éditer</label>
        <div className="control">
          <div className="select is-link">
            <select value={selectedPage} onChange={e => setSelectedPage(e.target.value)}>
              {PAGES.map(p => (
                <option key={p.slug} value={p.slug}>{p.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <form onSubmit={handleSave}>
        <div className="field">
          <label className="label">Contenu de la page</label>
          <div className="control">
            <textarea
              className="textarea"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={10}
              readOnly={loading}
              style={{ background: loading ? "#f5f5f5" : "white" }}
            />
          </div>
        </div>
        <div className="field is-grouped mt-3">
          <div className="control">
            <button className={`button is-link${loading ? ' is-loading' : ''}`} type="submit" disabled={loading}>
              Enregistrer
            </button>
          </div>
          {msg && <div className="notification is-info is-light py-2 px-3 ml-3">{msg}</div>}
        </div>
      </form>
    </div>
  );
}