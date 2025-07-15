import React, { useState } from 'react';
import UserCrud from './UserCrud'; // Assure-toi que le chemin d'importation est correct
import PageContentEditor from '../components/PageContentEditor';

export default function InterfaceAdmin() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="section" style={{ minHeight: '100vh', background: '#fafdff' }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        <h1
          className="title is-2 has-text-link mb-5"
          style={{ textAlign: 'center', marginTop: 70 }} // Décale le texte vers le bas
        >
          Interface d’administration
        </h1>
        <div className="tabs is-toggle is-fullwidth mb-5">
          <ul>
            <li className={activeTab === 'users' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('users')}>Utilisateurs</a>
            </li>
            <li className={activeTab === 'content' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('content')}>Contenus du site</a>
            </li>
            <li className={activeTab === 'settings' ? 'is-active' : ''}>
              <a onClick={() => setActiveTab('settings')}>Paramètres</a>
            </li>
          </ul>
        </div>

        {/* Contenu selon l’onglet actif */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="title is-4">Bienvenue sur l’admin</h2>
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
            <PageContentEditor />
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="title is-4">Paramètres du site</h2>
            {/* Ici tu pourras gérer les paramètres globaux du site */}
            <p>Fonctionnalités à développer : paramètres généraux, sécurité, etc.</p>
          </div>
        )}
      </div>
    </div>
  );
}