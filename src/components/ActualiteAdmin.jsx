import React, { useEffect, useState } from 'react';

export default function ActualiteAdmin() {
  const [actualites, setActualites] = useState([]);
  const [form, setForm] = useState({ imgSrc: '', date: '', title: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/actualites')
      .then(res => res.json())
      .then(setActualites);
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async e => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/actualites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ imgSrc: '', date: '', title: '' });
    const updated = await fetch('/api/actualites').then(res => res.json());
    setActualites(updated);
    setLoading(false);
  };

  const handleDelete = async id => {
    setLoading(true);
    await fetch('/api/actualites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const updated = await fetch('/api/actualites').then(res => res.json());
    setActualites(updated);
    setLoading(false);
  };

  return (
    <div className="box" style={{ borderRadius: 12 }}>
      <h2 className="title is-5">Gestion du carrousel d’actualités</h2>
      <form onSubmit={handleAdd} className="mb-4">
        <div className="field">
          <label className="label">Titre</label>
          <input className="input" name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="field">
          <label className="label">Date</label>
          <input className="input" type="date" name="date" value={form.date} onChange={handleChange} required />
        </div>
        <div className="field">
          <label className="label">Image (URL)</label>
          <input className="input" name="imgSrc" value={form.imgSrc} onChange={handleChange} />
        </div>
        <button className={`button is-link mt-2${loading ? ' is-loading' : ''}`} type="submit" disabled={loading}>Ajouter</button>
      </form>
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Date</th>
            <th>Titre</th>
            <th>Image</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {actualites.map(actu => (
            <tr key={actu.id}>
              <td>{actu.date}</td>
              <td>{actu.title}</td>
              <td>
                {actu.imgSrc && <img src={actu.imgSrc} alt={actu.title} style={{ width: 60, height: 40, objectFit: 'cover' }} />}
              </td>
              <td>
                <button className="button is-small is-danger" onClick={() => handleDelete(actu.id)} disabled={loading}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}