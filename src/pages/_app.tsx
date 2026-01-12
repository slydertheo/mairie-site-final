import 'bulma/css/bulma.min.css'; // ou "@/styles/globals.css" si tu importes Bulma dedans
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Vérifier le mode maintenance
    fetch('/api/pageContent?page=site_settings')
      .then(res => res.json())
      .then(data => {
        if (data && data[0]) {
          setMaintenanceMode(data[0].maintenanceMode || false);
          setMaintenanceMessage(data[0].maintenanceMessage || 'Site en maintenance. Nous serons de retour bientôt.');
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router.pathname]);

  // Pages qui restent accessibles en mode maintenance
  const allowedPages = ['/Interface_admin', '/api/login'];
  const isAllowedPage = allowedPages.some(page => router.pathname.startsWith(page));

  // Afficher la page de maintenance si activé et pas sur une page autorisée
  if (loading) {
    return (
      <div className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="has-text-centered">
          <div className="loader" style={{ width: 60, height: 60, margin: '0 auto' }}></div>
        </div>
      </div>
    );
  }

  if (maintenanceMode && !isAllowedPage) {
    return (
      <div className="hero is-fullheight" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="box" style={{ 
              maxWidth: 600, 
              margin: '0 auto',
              borderRadius: 20,
              padding: '3rem'
            }}>
              <div className="mb-5">
                <span className="icon is-large has-text-warning">
                  <i className="fas fa-tools fa-4x"></i>
                </span>
              </div>
              <h1 className="title is-2 mb-4">🔧 Site en maintenance</h1>
              <div className="content is-size-5" style={{ whiteSpace: 'pre-wrap' }}>
                {maintenanceMessage}
              </div>
              <hr />
              <p className="has-text-grey">
                Merci de votre patience et de votre compréhension.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
