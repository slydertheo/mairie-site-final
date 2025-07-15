import React, { useEffect, useState } from 'react';

export default function UserCrud() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch('/api/users');
    setUsers(await res.json());
    setLoading(false);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async e => {
    e.preventDefault();
    setLoading(true);
    const r = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (r.ok) {
      setMsg('Utilisateur ajouté !');
      setForm({ nom: '', prenom: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } else {
      setMsg('Erreur lors de l’ajout');
    }
    setLoading(false);
    setTimeout(() => setMsg(''), 2000);
  };

  const handleDelete = async id => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    setLoading(true);
    await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchUsers();
    setLoading(false);
  };

  const handleRoleChange = async (id, newRole) => {
    setLoading(true);
    await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role: newRole })
    });
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    setLoading(false);
  };

  const handleEditClick = user => {
    setEditUser(user);
    setForm({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      password: '', // Laisser vide pour ne pas changer le mot de passe
      role: user.role
    });
  };

  const handleEditSave = async e => {
    e.preventDefault();
    setLoading(true);
    const r = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, id: editUser.id })
    });
    if (r.ok) {
      setMsg('Utilisateur modifié !');
      setEditUser(null);
      setForm({ nom: '', prenom: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } else {
      setMsg('Erreur lors de la modification');
    }
    setLoading(false);
    setTimeout(() => setMsg(''), 2000);
  };

  // Filtrage et pagination
  const filteredUsers = users.filter(u =>
    u.nom.toLowerCase().includes(search.toLowerCase()) ||
    u.prenom.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <section className="section">
      <div className="container">
        <div className="card mb-5">
          <header className="card-header">
            <p className="card-header-title">
              {editUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
            </p>
          </header>
          <div className="card-content">
            <form onSubmit={editUser ? handleEditSave : handleAdd}>
              <div className="columns is-multiline is-mobile">
                <div className="column is-12-mobile is-3-tablet">
                  <input
                    className="input"
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    placeholder="Nom"
                    required
                  />
                </div>
                <div className="column is-12-mobile is-3-tablet">
                  <input
                    className="input"
                    name="prenom"
                    value={form.prenom}
                    onChange={handleChange}
                    placeholder="Prénom"
                    required
                  />
                </div>
                <div className="column is-12-mobile is-3-tablet">
                  <input
                    className="input"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    type="email"
                    disabled={!!editUser} // Empêche de modifier l'email
                  />
                </div>
                <div className="column is-12-mobile is-3-tablet">
                  <input
                    className="input"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={editUser ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
                    type="password"
                    required={!editUser}
                  />
                </div>
                <div className="column is-12-mobile is-3-tablet">
                  <div className="select is-fullwidth">
                    <select name="role" value={form.role} onChange={handleChange} required>
                      <option value="user">Utilisateur</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="column is-12-mobile is-2-tablet has-text-centered">
                  <button
                    className={`button is-link is-fullwidth${loading ? ' is-loading' : ''}`}
                    type="submit"
                    disabled={loading}
                  >
                    {editUser ? "Enregistrer" : "Ajouter"}
                  </button>
                  {editUser && (
                    <button
                      type="button"
                      className="button is-light is-fullwidth mt-2"
                      onClick={() => {
                        setEditUser(null);
                        setForm({ nom: '', prenom: '', email: '', password: '', role: 'user' });
                      }}
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>
              {msg && (
                <div className="notification is-info is-light mt-2 mb-0 py-2 px-3">{msg}</div>
              )}
            </form>
          </div>
        </div>

        <div className="card">
          <header className="card-header">
            <p className="card-header-title">Liste des utilisateurs</p>
          </header>
          <div className="card-content">
            <div className="field mb-4">
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="text"
                  placeholder="Rechercher par nom, prénom ou email"
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <span className="icon is-left">
                  <i className="fas fa-search"></i>
                </span>
              </div>
            </div>
            <div className="table-container">
              <table className="table is-fullwidth is-hoverable is-striped is-bordered">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map(u => (
                    <tr key={u.id}>
                      <td>{u.nom}</td>
                      <td>{u.prenom}</td>
                      <td>{u.email}</td>
                      <td>
                        <div className="select is-small is-fullwidth">
                          <select
                            value={u.role}
                            onChange={e => handleRoleChange(u.id, e.target.value)}
                            disabled={loading}
                          >
                            <option value="user">Utilisateur</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleEditClick(u)}
                          className="button is-info is-small mr-2"
                          disabled={loading}
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="button is-danger is-small"
                          disabled={loading}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="has-text-centered has-text-grey">
                        Aucun utilisateur trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination controls */}
            <div className="pagination is-centered mt-4">
              <button
                className="pagination-previous button is-primary is-small"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
              >
                Précédent
              </button>
              <button
                className="pagination-next button is-link is-small"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages || totalPages === 0 || loading}
              >
                Suivant
              </button>
            </div>
            <div className="has-text-centered mt-2">
              <span className="tag is-medium is-light">
                Page {currentPage} sur {totalPages === 0 ? 1 : totalPages}
              </span>
              <span className="ml-3 has-text-grey">
                {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}