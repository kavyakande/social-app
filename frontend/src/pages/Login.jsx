import { useState } from 'react';
import API from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.brand}>
          <div style={styles.logo}>⚡</div>
          <h1 style={styles.brandName}>SocialApp</h1>
          <p style={styles.brandText}>Connect. Share. Inspire.</p>
          <div style={styles.features}>
            <div style={styles.feature}>🌍 Share with the world</div>
            <div style={styles.feature}>❤️ Like and comment</div>
            <div style={styles.feature}>📸 Post photos</div>
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Welcome Back 👋</h2>
          <p style={styles.subtitle}>Login to your account</p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input style={styles.input} name="email"
                type="email" placeholder="you@example.com"
                onChange={handleChange} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} name="password"
                type="password" placeholder="••••••••"
                onChange={handleChange} required />
            </div>
            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </form>

          <p style={styles.link}>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh' },
  left: {
    flex: 1, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '2rem',
  },
  brand: { textAlign: 'center' },
  logo: { fontSize: '64px', marginBottom: '1rem' },
  brandName: { fontSize: '42px', fontWeight: '800',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem' },
  brandText: { fontSize: '18px', color: '#94a3b8', marginBottom: '2rem' },
  features: { display: 'flex', flexDirection: 'column', gap: '12px' },
  feature: { background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)',
    borderRadius: '8px', padding: '12px 20px', fontSize: '15px', color: '#a78bfa' },
  right: { flex: 1, display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '2rem', background: '#0a0a0f' },
  card: { width: '100%', maxWidth: '420px' },
  title: { fontSize: '32px', fontWeight: '700', color: '#fff', marginBottom: '8px' },
  subtitle: { color: '#64748b', marginBottom: '2rem', fontSize: '15px' },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171', padding: '12px', borderRadius: '8px', marginBottom: '1rem' },
  inputGroup: { marginBottom: '1.2rem' },
  label: { display: 'block', color: '#94a3b8', marginBottom: '6px', fontSize: '14px' },
  input: { width: '100%', padding: '14px', background: '#111827',
    border: '1px solid #1f2937', borderRadius: '10px', color: '#fff',
    fontSize: '15px', outline: 'none', transition: 'border 0.2s' },
  button: { width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: '#fff', border: 'none', borderRadius: '10px',
    fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem' },
  link: { textAlign: 'center', marginTop: '1.5rem', color: '#64748b' },
};