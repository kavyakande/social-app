import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.left}>
        <span style={styles.logo}>⚡</span>
        <span style={styles.brandName}>SocialApp</span>
      </div>
      <div style={styles.right}>
        <div style={styles.userBadge}>
          <div style={styles.avatar}>
            {username?.charAt(0).toUpperCase()}
          </div>
          <span style={styles.username}>{username}</span>
        </div>
        <button style={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 32px',
    background: 'rgba(10,10,15,0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(108,99,255,0.2)',
    position: 'sticky', top: 0, zIndex: 100,
  },
  left: { display: 'flex', alignItems: 'center', gap: '10px' },
  logo: { fontSize: '24px' },
  brandName: {
    fontSize: '22px', fontWeight: '800',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  right: { display: 'flex', alignItems: 'center', gap: '16px' },
  userBadge: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: 'rgba(108,99,255,0.1)',
    border: '1px solid rgba(108,99,255,0.3)',
    borderRadius: '50px', padding: '6px 16px 6px 6px',
  },
  avatar: {
    width: '32px', height: '32px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '14px', color: '#fff',
  },
  username: { color: '#a78bfa', fontWeight: '600', fontSize: '14px' },
  logoutBtn: {
    padding: '8px 20px',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600', fontSize: '14px',
  },
};