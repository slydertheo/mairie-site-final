export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(90deg, #0a2540 70%, #1277c6 100%)',
      color: '#fff',
      padding: '32px 0 18px 0',
      marginTop: 0, // Changer de 48px à 0
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
      }}>
        <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>
          Mairie de Friesen
        </div>
        <div style={{ fontSize: 15, opacity: 0.85 }}>
          10 Rue de la Mairie, 12345 Friesen<br />
          01 23 45 67 99 &nbsp;|&nbsp; contact@commune.fr
        </div>
        <div style={{ fontSize: 14, opacity: 0.7 }}>
          © {new Date().getFullYear()} Mairie de Friesen. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}