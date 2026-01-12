import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Charger les paramètres au démarrage
  useEffect(() => {
    fetch('/api/pageContent?page=site_settings')
      .then(res => res.json())
      .then(data => {
        if (data && data[0]) {
          setMaintenanceMode(data[0].maintenanceMode || false);
          setMaintenanceMessage(data[0].maintenanceMessage || 'Site en maintenance. Nous serons de retour bientôt.');
        }
      })
      .catch(err => console.error('Erreur chargement paramètres:', err));
  }, []);

  // Sauvegarder les paramètres
  const saveSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pageContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'site_settings',
          maintenanceMode,
          maintenanceMessage
        })
      });

      if (response.ok) {
        toast.success('Paramètres sauvegardés !');
      } else {
        toast.error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      toast.error('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

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
          <div className="box" style={{ borderRadius: 16 }}>
            <h2 className="title is-4 mb-5">⚙️ Paramètres du site</h2>
            
            {/* Mode Maintenance */}
            <div className="box has-background-warning-light mb-5" style={{ borderRadius: 12 }}>
              <h3 className="title is-5 mb-4">
                <span className="icon-text">
                  <span className="icon">
                    <i className="fas fa-tools"></i>
                  </span>
                  <span>Mode Maintenance</span>
                </span>
              </h3>
              
              <div className="field">
                <label className="checkbox">
                  <input 
                    type="checkbox" 
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                  />
                  <span className="ml-2 has-text-weight-semibold">
                    Activer le mode maintenance (fermer le site aux visiteurs)
                  </span>
                </label>
              </div>

              {maintenanceMode && (
                <div className="notification is-warning mt-4">
                  <p className="has-text-weight-bold mb-2">⚠️ Attention</p>
                  <p>Quand le mode maintenance est activé, seuls les administrateurs peuvent accéder au site. Les visiteurs verront le message ci-dessous.</p>
                </div>
              )}

              <div className="field mt-4">
                <label className="label">Message de maintenance</label>
                <div className="control">
                  <textarea 
                    className="textarea" 
                    rows="4"
                    value={maintenanceMessage}
                    onChange={(e) => setMaintenanceMessage(e.target.value)}
                    placeholder="Message affiché aux visiteurs pendant la maintenance..."
                  />
                </div>
                <p className="help">Ce message sera affiché aux visiteurs quand le site est en maintenance.</p>
              </div>

              <div className="field mt-5">
                <div className="control">
                  <button 
                    className={`button is-primary ${loading ? 'is-loading' : ''}`}
                    onClick={saveSettings}
                    disabled={loading}
                  >
                    <span className="icon">
                      <i className="fas fa-save"></i>
                    </span>
                    <span>Enregistrer les paramètres</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Aperçu */}
            {maintenanceMode && (
              <div className="box" style={{ borderRadius: 12 }}>
                <h3 className="title is-5 mb-3">👁️ Aperçu du message</h3>
                <div className="notification is-warning">
                  <p className="is-size-5 has-text-weight-semibold mb-3">🔧 Site en maintenance</p>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{maintenanceMessage || 'Aucun message défini'}</p>
                </div>
              </div>
            )}
            
            <div className="notification is-info is-light">
              <p className="has-text-weight-semibold mb-2">💡 Informations</p>
              <p>
                Utilisez les autres onglets pour gérer le contenu du site :
              </p>
              <ul>
                <li><strong>Utilisateurs</strong> : Gestion des comptes administrateurs</li>
                <li><strong>Contenus du site</strong> : Édition des pages et actualités</li>
                <li><strong>Images Navbar</strong> : Personnalisation du menu de navigation</li>
              </ul>
            </div>
          </div>
        )}

      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}