import React, { useState, useEffect } from 'react';

export default function MarchesCrud() {
  const [marches, setMarches] = useState([]);
  const [form, setForm] = useState({ titre: '', texte: '', adresse: '', jour: '', horaires: '', produits: '', image: '', id: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/marches').then(res => res.json()).then(setMarches);
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/marches', {
      method: form.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ titre: '', texte: '', adresse: '', jour: '', horaires: '', produits: '', image: '', id: null });
    setLoading(false);
    fetch('/api/marches').then(res => res.json()).then(setMarches);
  };

  const handleEdit = m => setForm(m);

  const handleDelete = async id => {
    if (!window.confirm('Supprimer ce marché ?')) return;
    setLoading(true);
    await fetch('/api/marches', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    setLoading(false);
    fetch('/api/marches').then(res => res.json()).then(setMarches);
  };

  return (
    <div className="box mt-5" style={{ background: '#f8fafc', borderRadius: 16, maxWidth: 900, margin: '0 auto' }}>
      <h2 className="title is-4 has-text-primary mb-4">Marché hebdomadaire (CRUD dynamique)</h2>
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="columns is-multiline">
          <div className="column is-half">
            <div className="field">
              <label className="label">Titre</label>
              <input className="input" name="titre" placeholder="Titre" value={form.titre} onChange={handleChange} required />
            </div>
          </div>
          <div className="column is-half">
            <div className="field">
              <label className="label">Texte d’intro</label>
              <input className="input" name="texte" placeholder="Texte d’intro" value={form.texte} onChange={handleChange} />
            </div>
          </div>
          <div className="column is-half">
            <div className="field">
              <label className="label">Adresse</label>
              <input className="input" name="adresse" placeholder="Adresse" value={form.adresse} onChange={handleChange} />
            </div>
          </div>
          <div className="column is-half">
            <div className="field">
              <label className="label">Jour</label>
              <input className="input" name="jour" placeholder="Jour" value={form.jour} onChange={handleChange} />
            </div>
          </div>
          <div className="column is-half">
            <div className="field">
              <label className="label">Horaires</label>
              <input className="input" name="horaires" placeholder="Horaires" value={form.horaires} onChange={handleChange} />
            </div>
          </div>
          <div className="column is-half">
            <div className="field">
              <label className="label">Produits proposés</label>
              <textarea className="textarea" name="produits" placeholder="Produits proposés" value={form.produits} onChange={handleChange} rows={2} />
            </div>
          </div>
          <div className="column is-half">
            <div className="field">
              <label className="label">Image (URL)</label>
              <input className="input" name="image" placeholder="URL image" value={form.image} onChange={handleChange} />
            </div>
          </div>
          <div className="column is-full is-flex is-align-items-center is-justify-content-flex-end">
            <button className={`button is-link mr-2${loading ? ' is-loading' : ''}`} type="submit">
              {form.id ? 'Modifier' : 'Ajouter'}
            </button>
            {form.id && (
              <button className="button" type="button" onClick={() => setForm({ titre: '', texte: '', adresse: '', jour: '', horaires: '', produits: '', image: '', id: null })}>Annuler</button>
            )}
          </div>
        </div>
      </form>
      <div className="columns is-multiline">
        {marches.map(m => (
          <div className="column is-full" key={m.id}>
            <div className="card" style={{ borderRadius: 12, boxShadow: '0 2px 12px #1277c620', marginBottom: 16 }}>
              <div className="card-content">
                <div className="columns is-vcentered">
                  <div className="column is-3">
                    {m.image && (
                      <figure className="image is-square" style={{ borderRadius: 8, overflow: 'hidden' }}>
                        <img src={m.image} alt={m.titre} style={{ objectFit: 'cover', borderRadius: 8 }} />
                      </figure>
                    )}
                  </div>
                  <div className="column is-9">
                    <h3 className="title is-5 has-text-link mb-2">{m.titre}</h3>
                    <p className="mb-2">{m.texte}</p>
                    <div className="content mb-2">
                      <p className="has-text-grey mb-1"><span style={{ fontSize: 16, marginRight: 8 }}>📍</span> {m.adresse}</p>
                      <p className="has-text-grey mb-1"><span style={{ fontSize: 16, marginRight: 8 }}>🗓️</span> {m.jour}</p>
                      <p className="has-text-grey mb-1"><span style={{ fontSize: 16, marginRight: 8 }}>🕒</span> {m.horaires}</p>
                      <div className="notification is-primary is-light mt-2 mb-2">
                        <strong>Produits proposés :</strong> {m.produits}
                      </div>
                    </div>
                    <div>
                      <button className="button is-small is-info mr-2" onClick={() => handleEdit(m)}>✏️ Modifier</button>
                      <button className="button is-small is-danger" onClick={() => handleDelete(m.id)}>🗑️ Supprimer</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {marches.length === 0 && (
          <div className="column is-full has-text-centered has-text-grey">
            Aucun marché enregistré.
          </div>
        )}
      </div>
    </div>
  );
}