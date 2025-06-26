import Link from 'next/link';

export default function QuickBoxEcole() {
  return (
    <Link href="/ecoles" passHref legacyBehavior>
      <a className="box has-text-centered" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        borderRadius: 18,
        boxShadow: '0 2px 12px #1277c620',
        transition: 'box-shadow 0.2s',
        fontSize: 20,
        cursor: 'pointer',
        background: '#fafdff',
        textDecoration: 'none',
        color: '#1277c6'
      }}>
        <span style={{ fontSize: 48, marginBottom: 12 }}>🏫</span>
        <span style={{ fontWeight: 700 }}>École & périscolaire</span>
        <span style={{ fontSize: 15, color: '#888', marginTop: 8 }}>Infos, inscription, menus, garderie…</span>
      </a>
    </Link>
  );
}