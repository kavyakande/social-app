import { useState } from 'react';
import API from '../api/axios';

export default function PostCard({ post, onUpdate }) {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const username = localStorage.getItem('username');
  const liked = post.likes.includes(username);

  const handleLike = async () => {
    await API.put(`/posts/${post._id}/like`);
    onUpdate();
  };

  const handleComment = async e => {
    e.preventDefault();
    if (!comment) return;
    await API.post(`/posts/${post._id}/comment`, { text: comment });
    setComment('');
    onUpdate();
  };

  const timeAgo = date => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return `${Math.floor(diff/86400)}d ago`;
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.avatar}>
          {post.username?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p style={styles.username}>{post.username}</p>
          <p style={styles.time}>{timeAgo(post.createdAt)}</p>
        </div>
      </div>

      {/* Content */}
      {post.text && <p style={styles.text}>{post.text}</p>}
      {post.image && (
        <img
          src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${post.image}`}
          alt="post"
          style={styles.image}
        />
      )}

      {/* Stats */}
      <div style={styles.stats}>
        <span style={styles.stat}>❤️ {post.likes.length} likes</span>
        <span style={styles.stat}>💬 {post.comments.length} comments</span>
      </div>

      {/* Action Buttons */}
      <div style={styles.actions}>
        <button style={{
          ...styles.actionBtn,
          background: liked ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)',
          border: liked ? '1px solid rgba(239,68,68,0.4)' : '1px solid #1f2937',
          color: liked ? '#f87171' : '#94a3b8',
        }} onClick={handleLike}>
          {liked ? '❤️ Liked' : '🤍 Like'}
        </button>

        <button style={styles.actionBtn}
          onClick={() => setShowComments(!showComments)}>
          💬 Comment
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div style={styles.commentsBox}>
          {post.comments.length > 0 && (
            <div style={styles.commentsList}>
              {post.comments.map((c, i) => (
                <div key={i} style={styles.comment}>
                  <div style={styles.commentAvatar}>
                    {c.username?.charAt(0).toUpperCase()}
                  </div>
                  <div style={styles.commentContent}>
                    <span style={styles.commentUser}>{c.username}</span>
                    <span style={styles.commentText}>{c.text}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleComment} style={styles.commentForm}>
            <div style={styles.commentAvatar}>
              {username?.charAt(0).toUpperCase()}
            </div>
            <input
              style={styles.commentInput}
              placeholder="Write a comment..."
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <button style={styles.sendBtn} type="submit">Send</button>
          </form>
        </div>
      )}
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
    transition: 'border-color 0.2s',
  },
  header: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' },
  avatar: {
    width: '44px', height: '44px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '18px', color: '#fff', flexShrink: 0,
  },
  username: { margin: 0, fontWeight: '700', color: '#e2e8f0', fontSize: '15px' },
  time: { margin: 0, fontSize: '12px', color: '#4b5563' },
  text: { color: '#d1d5db', fontSize: '15px', lineHeight: '1.6', marginBottom: '1rem' },
  image: { width: '100%', borderRadius: '12px', marginBottom: '1rem', maxHeight: '400px', objectFit: 'cover' },
  stats: { display: 'flex', gap: '16px', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #1f2937' },
  stat: { color: '#4b5563', fontSize: '13px' },
  actions: { display: 'flex', gap: '12px', marginBottom: '1rem' },
  actionBtn: {
    flex: 1, padding: '10px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid #1f2937',
    color: '#94a3b8', borderRadius: '10px',
    cursor: 'pointer', fontWeight: '600', fontSize: '14px',
  },
  commentsBox: { marginTop: '1rem' },
  commentsList: { marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' },
  comment: { display: 'flex', gap: '10px', alignItems: 'flex-start' },
  commentAvatar: {
    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '13px', color: '#fff',
  },
  commentContent: {
    background: 'rgba(255,255,255,0.05)', borderRadius: '10px',
    padding: '8px 12px', flex: 1,
  },
  commentUser: { color: '#a78bfa', fontWeight: '600', fontSize: '13px', marginRight: '8px' },
  commentText: { color: '#d1d5db', fontSize: '14px' },
  commentForm: { display: 'flex', gap: '10px', alignItems: 'center' },
  commentInput: {
    flex: 1, padding: '10px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid #1f2937', borderRadius: '10px',
    color: '#e2e8f0', fontSize: '14px', outline: 'none',
  },
  sendBtn: {
    padding: '10px 18px',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: '#fff', border: 'none', borderRadius: '10px',
    cursor: 'pointer', fontWeight: '600', fontSize: '14px',
  },
};