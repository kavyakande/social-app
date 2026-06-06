import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');
    else fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const { data } = await API.get('/posts');
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>

        {/* Left Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sideCard}>
            <h3 style={styles.sideTitle}>🌟 Trending</h3>
            {['#React', '#MongoDB', '#NodeJS', '#WebDev', '#OpenSource'].map(tag => (
              <div key={tag} style={styles.tag}>{tag}</div>
            ))}
          </div>
          <div style={styles.sideCard}>
            <h3 style={styles.sideTitle}>💡 Tips</h3>
            <p style={styles.tip}>Share your thoughts, photos and connect with others!</p>
          </div>
        </div>

        {/* Main Feed */}
        <div style={styles.feed}>
          <CreatePost onPostCreated={fetchPosts} />

          {loading ? (
            <div style={styles.loadingBox}>
              <div style={styles.spinner}></div>
              <p style={styles.loadingText}>Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div style={styles.emptyBox}>
              <p style={styles.emptyIcon}>📭</p>
              <p style={styles.emptyText}>No posts yet. Be the first to post!</p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
            ))
          )}
        </div>

        {/* Right Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sideCard}>
            <h3 style={styles.sideTitle}>⚡ About</h3>
            <p style={styles.tip}>SocialApp — A place to share, connect and inspire others around the world.</p>
          </div>
          <div style={styles.sideCard}>
            <h3 style={styles.sideTitle}>🎯 Stats</h3>
            <div style={styles.statRow}>
              <span style={styles.statLabel}>Total Posts</span>
              <span style={styles.statValue}>{posts.length}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0f' },
  container: {
    maxWidth: '1200px', margin: '0 auto',
    padding: '1.5rem', display: 'flex', gap: '1.5rem',
  },
  feed: { flex: 1, minWidth: 0 },
  sidebar: { width: '260px', flexShrink: 0 },
  sideCard: {
    background: '#111827', border: '1px solid #1f2937',
    borderRadius: '16px', padding: '1.2rem', marginBottom: '1rem',
  },
  sideTitle: {
    color: '#e2e8f0', fontSize: '15px', fontWeight: '700', marginBottom: '1rem',
  },
  tag: {
    color: '#6c63ff', fontSize: '14px', padding: '6px 0',
    borderBottom: '1px solid #1f2937', cursor: 'pointer',
  },
  tip: { color: '#64748b', fontSize: '13px', lineHeight: '1.6' },
  statRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { color: '#64748b', fontSize: '13px' },
  statValue: {
    color: '#a78bfa', fontWeight: '700', fontSize: '18px',
  },
  loadingBox: { textAlign: 'center', padding: '3rem' },
  spinner: {
    width: '40px', height: '40px', borderRadius: '50%',
    border: '3px solid #1f2937', borderTop: '3px solid #6c63ff',
    margin: '0 auto 1rem', animation: 'spin 1s linear infinite',
  },
  loadingText: { color: '#4b5563' },
  emptyBox: { textAlign: 'center', padding: '3rem' },
  emptyIcon: { fontSize: '48px', marginBottom: '1rem' },
  emptyText: { color: '#4b5563', fontSize: '16px' },
};