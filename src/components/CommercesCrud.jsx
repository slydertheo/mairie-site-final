import React, { useState, useEffect } from 'react';

// Toast component
function Toast({ message, type = "success", onClose, actions }) {
  return (
    <div
      className={`notification is-${type}`}
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 9999,
        minWidth: 260,
        maxWidth: 350,
        boxShadow: "0 2px 12px #1277c620",
        borderRadius: 12,
        animation: "fadeIn 0.3s",
        padding: "1.2rem 2.5rem 1.2rem 1.2rem"
      }}
    >
      <button
        className="delete"
        style={{
          right: 12,
          top: 12,
          position: "absolute"
        }}
        onClick={onClose}
      ></button>
      <div style={{ paddingRight: 16 }}>{message}</div>
      {actions && (
        <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
          {actions}
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}

const CATEGORIES = [
  { value: 'alimentaire', label: 'Commerces alimentaires' },
  { value: 'restauration', label: 'Restaurants et cafés' },
  { value: 'services', label: 'Services' },
  { value: 'artisanat', label: 'Artisanat local' }
];

export default function CommercesCrud() {
  const [commerces, setCommerces] = useState([]);
  const [form, setForm] = useState({ nom: '', description: '', adresse: '', telephone: '', horaires: '', image: '', site: '', categorie: 'alimentaire', id: null });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

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
    setToast({
      message: form.id ? "Commerce modifié avec succès !" : "Commerce ajouté avec succès !",
      type: "success"
    });
  };

  const handleEdit = c => setForm(c);

  // Nouvelle méthode de suppression avec toast de confirmation
  const handleDelete = id => {
    setPendingDelete(id);
    setToast({
      message: "Supprimer ce commerce ?",
      type: "warning",
      actions: [
        <button
          key="yes"
          className="button is-danger is-small"
          style={{ display: "flex", alignItems: "center" }}
          onClick={async () => {
            setToast(null);
            setLoading(true);
            await fetch('/api/commerces', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id })
            });
            setLoading(false);
            setPendingDelete(null);
            fetch('/api/commerces').then(res => res.json()).then(setCommerces);
            setToast({ message: "Commerce supprimé.", type: "success" });
          }}
        >
          <span className="icon is-small" style={{ marginRight: 4 }}>
            <i className="fas fa-trash"></i>
          </span>
          Supprimer
        </button>,
        <button
          key="no"
          className="button is-light is-small"
          style={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            setToast(null);
            setPendingDelete(null);
          }}
        >
          <span className="icon is-small" style={{ marginRight: 4 }}>
            <i className="fas fa-edit"></i>
          </span>
          Annuler
        </button>
      ]
    });
  };

  // Auto-hide toast after 2.5s (sauf si confirmation)
  useEffect(() => {
    if (toast && !toast.actions) {
      const timer = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="box mt-5" style={{ background: '#f8fafc', borderRadius: 16 }}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => { setToast(null); setPendingDelete(null); }}
          actions={toast.actions}
        />
      )}
      <h2 className="title is-5 has-text-primary mb-4">
        <span role="img" aria-label="shop" style={{ marginRight: 8 }}>🏪</span>
        Gestion des commerces
      </h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="columns is-multiline is-mobile">
          <div className="column is-3">
            <input className="input" name="nom" placeholder="Nom *" value={form.nom} onChange={handleChange} required />
          </div>
          <div className="column is-3">
            <input className="input" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          </div>
          <div className="column is-3">
            <input className="input" name="adresse" placeholder="Adresse" value={form.adresse} onChange={handleChange} />
          </div>
          <div className="column is-3">
            <input className="input" name="telephone" placeholder="Téléphone" value={form.telephone} onChange={handleChange} />
          </div>
          <div className="column is-3">
            <input className="input" name="horaires" placeholder="Horaires" value={form.horaires} onChange={handleChange} />
          </div>
          <div className="column is-3">
            <input className="input" name="image" placeholder="URL image" value={form.image} onChange={handleChange} />
          </div>
          <div className="column is-3">
            <input className="input" name="site" placeholder="Site web" value={form.site} onChange={handleChange} />
          </div>
          <div className="column is-3">
            <div className="select is-fullwidth">
              <select name="categorie" value={form.categorie} onChange={handleChange}>
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="column is-12 has-text-right">
            <button className={`button is-link mr-2${loading ? ' is-loading' : ''}`} type="submit">
              {form.id ? 'Modifier' : 'Ajouter'}
            </button>
            {form.id && (
              <button
                className="button is-light"
                type="button"
                onClick={() => setForm({ nom: '', description: '', adresse: '', telephone: '', horaires: '', image: '', site: '', categorie: 'alimentaire', id: null })}
              >
                Annuler
              </button>
            )}
          </div>
        </div>
      </form>
      <div style={{ overflowX: 'auto' }}>
        <table className="table is-fullwidth is-striped is-hoverable" style={{ borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Adresse</th>
              <th>Téléphone</th>
              <th>Horaires</th>
              <th>Site</th>
              <th>Image</th>
              <th style={{ width: 110 }}></th>
            </tr>
          </thead>
          <tbody>
            {commerces.map(c => (
              <tr key={c.id}>
                <td><strong>{c.nom}</strong></td>
                <td>{CATEGORIES.find(cat => cat.value === c.categorie)?.label || c.categorie}</td>
                <td>{c.adresse}</td>
                <td>{c.telephone}</td>
                <td>{c.horaires}</td>
                <td>
                  {c.site && (
                    <a href={c.site} target="_blank" rel="noopener noreferrer" title="Voir le site">
                      🌐
                    </a>
                  )}
                </td>
                <td>
                  {c.image && (
                    <figure className="image is-48x48" style={{ margin: 0 }}>
                      <img src={c.image} alt={c.nom} style={{ objectFit: 'cover', borderRadius: 8 }} />
                    </figure>
                  )}
                </td>
                <td>
                  <button className="button is-small is-info mr-2" title="Modifier" onClick={() => handleEdit(c)}>
                    <span className="icon is-small"><i className="fas fa-edit"></i></span>
                  </button>
                  <button className="button is-small is-danger" title="Supprimer" onClick={() => handleDelete(c.id)}>
                    <span className="icon is-small"><i className="fas fa-trash"></i></span>
                  </button>
                </td>
              </tr>
            ))}
            {commerces.length === 0 && (
              <tr>
                <td colSpan={8} className="has-text-centered has-text-grey">
                  Aucun commerce enregistré.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}