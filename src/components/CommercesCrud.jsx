import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  { value: 'alimentaire', label: 'Commerces alimentaires' },
  { value: 'restauration', label: 'Restaurants et cafés' },
  { value: 'services', label: 'Services' },
  { value: 'artisanat', label: 'Artisanat local' }
];

// Exemple de FIELDS pour la page commerces
const FIELDS = [
  { key: 'hero_titre', label: 'Titre du bandeau (hero)', type: 'text' },
  { key: 'titre', label: 'Titre principal', type: 'text' },
  { key: 'intro_titre', label: 'Titre d’intro', type: 'text' },
  { key: 'intro', label: 'Texte d’introduction', type: 'textarea' },
  { key: 'marche_titre', label: 'Titre du marché', type: 'text' },
  { key: 'marche_texte', label: 'Texte d’intro', type: 'textarea' },
  { key: 'marche_adresse', label: 'Adresse', type: 'text' },
  { key: 'marche_jour', label: 'Jour', type: 'text' },
  { key: 'marche_horaires', label: 'Horaires', type: 'text' },
  { key: 'marche_produits', label: 'Produits proposés', type: 'textarea' },
  { key: 'marche_image', label: 'Image (URL)', type: 'text' },
  // Ajoute d’autres champs si besoin
];

export default function CommercesCrud() {
  const [commerces, setCommerces] = useState([]);
  const [form, setForm] = useState({ nom: '', description: '', adresse: '', telephone: '', horaires: '', image: '', site: '', categorie: 'alimentaire', id: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/commerces')
      .then(res => res.json())
      .then(setCommerces);
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/commerces', {
      method: form.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ nom: '', description: '', adresse: '', telephone: '', horaires: '', image: '', site: '', categorie: 'alimentaire', id: null });
    setLoading(false);
    fetch('/api/commerces').then(res => res.json()).then(setCommerces);
  };

  const handleEdit = c => setForm(c);

  const handleDelete = async id => {
    if (!window.confirm('Supprimer ce commerce ?')) return;
    setLoading(true);
    await fetch('/api/commerces', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    setLoading(false);
    fetch('/api/commerces').then(res => res.json()).then(setCommerces);
  };

  return (
    <div className="box mt-5" style={{ background: '#f8fafc', borderRadius: 16 }}>
      <h2 className="title is-5 has-text-primary mb-3">Commerces (CRUD dynamique)</h2>
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="field is-grouped is-flex-wrap-wrap">
          <div className="control is-expanded">
            <input className="input" name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required />
          </div>
          <div className="control is-expanded">
            <input className="input" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          </div>
          <div className="control is-expanded">
            <input className="input" name="adresse" placeholder="Adresse" value={form.adresse} onChange={handleChange} />
          </div>
          <div className="control">
            <input className="input" name="telephone" placeholder="Téléphone" value={form.telephone} onChange={handleChange} />
          </div>
          <div className="control">
            <input className="input" name="horaires" placeholder="Horaires" value={form.horaires} onChange={handleChange} />
          </div>
          <div className="control">
            <input className="input" name="image" placeholder="URL image" value={form.image} onChange={handleChange} />
          </div>
          <div className="control">
            <input className="input" name="site" placeholder="Site web" value={form.site} onChange={handleChange} />
          </div>
          <div className="control">
            <div className="select">
              <select name="categorie" value={form.categorie} onChange={handleChange}>
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="control">
            <button className={`button is-link${loading ? ' is-loading' : ''}`} type="submit">
              {form.id ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
          {form.id && (
            <div className="control">
              <button className="button" type="button" onClick={() => setForm({ nom: '', description: '', adresse: '', telephone: '', horaires: '', image: '', site: '', categorie: 'alimentaire', id: null })}>Annuler</button>
            </div>
          )}
        </div>
      </form>
      <table className="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Adresse</th>
            <th>Téléphone</th>
            <th>Horaires</th>
            <th>Site</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {commerces.map(c => (
            <tr key={c.id}>
              <td>{c.nom}</td>
              <td>{CATEGORIES.find(cat => cat.value === c.categorie)?.label || c.categorie}</td>
              <td>{c.adresse}</td>
              <td>{c.telephone}</td>
              <td>{c.horaires}</td>
              <td>{c.site && <a href={c.site} target="_blank" rel="noopener noreferrer">🌐</a>}</td>
              <td>
                <button className="button is-small is-info mr-2" onClick={() => handleEdit(c)}>✏️</button>
                <button className="button is-small is-danger" onClick={() => handleDelete(c.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}