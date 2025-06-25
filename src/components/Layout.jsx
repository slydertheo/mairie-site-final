import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #eaf1fa 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}