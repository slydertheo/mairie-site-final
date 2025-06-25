import Link from 'next/link';
import { useState } from 'react';

// Icône connexion
const LoginIcon = ({ color = "#fff" }) => (
  <svg width="20" height="20" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1"/>
  </svg>
);

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/actualites', label: 'Actualités' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [hovered, setHovered] = useState(null);

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 40px',
      background: '#f8fafc',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 2px 8px rgba(10,37,64,0.03)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      {/* Logo à gauche */}
      <div style={{
        fontWeight: 700,
        fontSize: 24,
        color: '#1277c6',
        letterSpacing: 1,
        fontFamily: 'Segoe UI, Arial, sans-serif',
        userSelect: 'none',
        flex: 1,
      }}>
        Mairie Friesen
      </div>
      {/* Liens au centre */}
      <div style={{
        display: 'flex',
        gap: 18,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 2,
      }}>
        {navLinks.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              color: hovered === i ? '#1277c6' : '#222',
              background: hovered === i ? '#e6f0fa' : 'transparent',
              textDecoration: 'none',
              fontWeight: 500,
              padding: '8px 18px',
              borderRadius: 8,
              fontSize: 16,
              letterSpacing: 0.5,
              transition: 'all 0.18s',
              boxShadow: hovered === i ? '0 2px 8px #1277c610' : 'none',
              display: 'block',
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {link.label}
          </Link>
        ))}
      </div>
      {/* Connexion à droite */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-end'
      }}>
        <Link href="/login" style={{
          background: '#1277c6',
          color: '#fff',
          borderRadius: 8,
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontWeight: 600,
          fontSize: 16,
          boxShadow: '0 1px 4px #1277c620',
          border: 'none',
          textDecoration: 'none',
          transition: 'background 0.18s, box-shadow 0.18s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#0e5ea8'}
        onMouseLeave={e => e.currentTarget.style.background = '#1277c6'}
        aria-label="Connexion"
        >
          <LoginIcon />
        </Link>
      </div>
    </nav>
  );
}
