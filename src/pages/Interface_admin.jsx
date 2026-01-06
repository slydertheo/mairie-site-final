import React, { useState } from 'react';
import UserCrud from './UserCrud';
import PageContentEditor from '../components/PageContentEditor';
import ActualiteAdmin from '../components/CarrouselAdmin.jsx';
import DemarchesEditor from '../components/DemarchesEditor';
import EcolesEditor from '../components/EcolesEditor';
import CommercesCrud from '../components/CommercesCrudAdmin.jsx';
import MarchesCrud from '../components/MarchesCrud';
import IntercommunaliteEditor from '../components/EditeurIntercomunalité.jsx';
import AssociationsEditor from '../components/AssociationsEditor';
import EditeurDecouvrirFriesen from '../components/EditeurDecouvrirFriesen'; 
import EditeurInfosPratiques from '../components/EditeurInfosPratiques';
import EditeurNavbar from '../components/EditeurNavbar'; // NOUVEAU

const PAGES = [
  { slug: 'accueil', title: 'Accueil' },
  { slug: 'demarches', title: 'Démarches' },
  { slug: 'ecoles', title: 'Écoles' },
  { slug: 'commerces', title: 'Commerces' },
  { slug: 'intercommunalite', title: 'Intercommunalité' },
  { slug: 'associations', title: 'Associations' }, 
  { slug: 'decouvrir', title: 'Découvrir Friesen' }, 
  { slug: 'infos_pratiques', title: 'Infos Pratiques' }, 
];

export default function InterfaceAdmin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPage, setSelectedPage] = useState('accueil');

  return (
    <div className="section" style={{ minHeight: '100vh', background: '#fafdff' }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        <h1
          className="title is-2 has-text-link mb-5"
          style={{ textAlign: 'center', marginTop: 70 }}
        >
          Interface d'administration
        </h1>
        <div className="tabs is-toggle is-fullwidth mb-5">
          <ul>
            <li className={activeTab === 'users' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('users')}>Utilisateurs</a>
            </li>
            <li className={activeTab === 'content' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('content')}>Contenus du site</a>
            </li>
            <li className={activeTab === 'navbar' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('navbar')}>Images Navbar</a>
            </li>
            <li className={activeTab === 'settings' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('settings')}>Paramètres</a>
            </li>
          </ul>
        </div>

        {activeTab === 'dashboard' && (
          <div>
            <h2 className="title is-4">Bienvenue sur l'admin</h2>
            <p>Utilisez les onglets ci-dessus pour gérer le site et les utilisateurs.</p>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 className="title is-4">Gestion des utilisateurs</h2>
            <UserCrud />
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            <h2 className="title is-4">Gestion du contenu</h2>
            <div className="field mb-4" style={{ maxWidth: 350 }}>
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
            {selectedPage === 'accueil' && (
              <>
                <PageContentEditor />
                <ActualiteAdmin />
              </>
            )}
            {selectedPage === 'demarches' && <DemarchesEditor />}
            {selectedPage === 'ecoles' && <EcolesEditor />}
            {selectedPage === 'commerces' && (
              <>
                <MarchesCrud />
                <CommercesCrud />
              </>
            )}
            {selectedPage === 'intercommunalite' && <IntercommunaliteEditor />}
            {selectedPage === 'associations' && <AssociationsEditor />}
            {selectedPage === 'decouvrir' && <EditeurDecouvrirFriesen />}
            {selectedPage === 'infos_pratiques' && <EditeurInfosPratiques />} 
          </div>
        )}

        {activeTab === 'navbar' && (
          <div>
            <h2 className="title is-4">Gestion des images de la navbar</h2>
            <EditeurNavbar />
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="title is-4">Paramètres du site</h2>
            <p>Fonctionnalités à développer : paramètres généraux, sécurité, etc.</p>
          </div>
        )}

      </div>
    </div>
  );
}