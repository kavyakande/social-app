import { useState } from 'react';
import API from '../api/axios';

export default function CreatePost({ onPostCreated }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem('username');

  const handleImage = e => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!text && !image) return;
    setLoading(true);
    try {
      const formData = new FormData();
      if (text) formData.append('text', text);
      if (image) formData.append('image', image);
      await API.post('/posts', formData);
      setText('');
      setImage(null);
      setPreview(null);
      onPostCreated();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating post');
    }
    setLoading(false);
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.avatar}>
          {username?.charAt(0).toUpperCase()}
        </div>
        <textarea
          style={styles.textarea}
          placeholder="What's on your mind?"
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
        />
      </div>

      {preview && (
        <div style={styles.previewBox}>
          <img src={preview} alt="preview" style={styles.preview} />
          <button style={styles.removeBtn}
            onClick={() => { setImage(null); setPreview(null); }}>
            ✕ Remove
          </button>
        </div>
      )}

      <div style={styles.footer}>
        <label style={styles.imageBtn}>
          📸 Photo
          <input type="file" accept="image/*"
            onChange={handleImage} style={{ display: 'none' }} />
        </label>
        <button style={{
          ...styles.postBtn,
          opacity: (!text && !image) ? 0.5 : 1,
        }} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Posting...' : '🚀 Post'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  header: { display: 'flex', gap: '12px', marginBottom: '1rem' },
  avatar: {
    width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '18px', color: '#fff',
  },
  textarea: {
    flex: 1, background: 'rgba(255,255,255,0.05)',
    border: '1px solid #1f2937', borderRadius: '12px',
    padding: '12px', color: '#e2e8f0', fontSize: '15px',
    resize: 'none', outline: 'none', fontFamily: 'inherit',
  },
  previewBox: { position: 'relative', marginBottom: '1rem' },
  preview: { width: '100%', borderRadius: '12px', maxHeight: '300px', objectFit: 'cover' },
  removeBtn: {
    position: 'absolute', top: '8px', right: '8px',
    background: 'rgba(0,0,0,0.7)', color: '#fff',
    border: 'none', borderRadius: '6px', padding: '4px 10px',
    cursor: 'pointer', fontSize: '13px',
  },
  footer: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', borderTop: '1px solid #1f2937', paddingTop: '1rem',
  },
  imageBtn: {
    padding: '8px 16px', background: 'rgba(108,99,255,0.1)',
    border: '1px solid rgba(108,99,255,0.3)', color: '#a78bfa',
    borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
  },
  postBtn: {
    padding: '10px 24px',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: '#fff', border: 'none', borderRadius: '10px',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer',
  },
};