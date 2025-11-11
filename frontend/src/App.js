// App.js - Enhanced with Dark Mode & Animations
import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [postContent, setPostContent] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    }
    if (token) {
      fetchUser(token);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const fetchUser = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        setLoginData({ email: '', password: '' });
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      alert('Login error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        setSignupData({ name: '', email: '', password: '' });
      } else {
        alert(data.error || 'Signup failed');
      }
    } catch (error) {
      alert('Signup error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: postContent })
      });

      if (response.ok) {
        setPostContent('');
        fetchPosts();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create post');
      }
    } catch (error) {
      alert('Error creating post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId) => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });

      if (response.ok) {
        setCommentText({ ...commentText, [postId]: '' });
        fetchPosts();
      }
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleUpdatePost = async (postId, content) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });

      if (response.ok) {
        setEditingPost(null);
        fetchPosts();
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setPosts([]);
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Animated Bubbles Background
  const Bubbles = () => (
    <div className="bubbles-container">
      {[...Array(15)].map((_, i) => (
        <div key={i} className="bubble" style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 15}s`,
          animationDuration: `${15 + Math.random() * 10}s`
        }}></div>
      ))}
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <Bubbles />
        <div className="auth-card fade-in">
          <div className="logo-container">
            <i className="fas fa-briefcase logo-icon"></i>
            <h1 className="logo">LinkedIn Clone</h1>
          </div>

          <div className="auth-tabs">
            <button
              className={`auth-tab ${showLogin ? 'active' : ''}`}
              onClick={() => setShowLogin(true)}
            >
              <i className="fas fa-sign-in-alt"></i> Login
            </button>
            <button
              className={`auth-tab ${!showLogin ? 'active' : ''}`}
              onClick={() => setShowLogin(false)}
            >
              <i className="fas fa-user-plus"></i> Sign Up
            </button>
          </div>

          {showLogin ? (
            <form onSubmit={handleLogin} className="auth-form slide-in">
              <div className="input-group">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  type="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Logging in...</>
                ) : (
                  <><i className="fas fa-sign-in-alt"></i> Login</>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="auth-form slide-in">
              <div className="input-group">
                <i className="fas fa-user input-icon"></i>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  type="email"
                  placeholder="Email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type="password"
                  placeholder="Password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Creating Account...</>
                ) : (
                  <><i className="fas fa-user-plus"></i> Sign Up</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Bubbles />
      <header className="header slide-down">
        <div className="header-content">
          <div className="logo-section">
            <i className="fas fa-briefcase logo-icon-small"></i>
            <h1 className="logo">LinkedIn Clone</h1>
          </div>
          <div className="user-section">
            <button
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
            <div className="user-info">
              <i className="fas fa-user-circle user-icon"></i>
              <span className="user-name">{user?.name}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="create-post fade-in">
          <h2><i className="fas fa-edit"></i> Create a Post</h2>
          <form onSubmit={handleCreatePost}>
            <div className="post-input-wrapper">
              <i className="fas fa-pen post-icon"></i>
              <textarea
                placeholder="What's on your mind?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows="3"
                required
              />
            </div>
            <button type="submit" className="post-btn" disabled={loading}>
              {loading ? (
                <><i className="fas fa-spinner fa-spin"></i> Posting...</>
              ) : (
                <><i className="fas fa-paper-plane"></i> Post</>
              )}
            </button>
          </form>
        </div>

        <div className="feed">
          <h2><i className="fas fa-stream"></i> Feed</h2>
          {posts.length === 0 ? (
            <div className="no-posts fade-in">
              <i className="fas fa-inbox no-posts-icon"></i>
              <p>No posts yet. Be the first to post!</p>
            </div>
          ) : (
            posts.map((post, index) => (
              <div key={post._id} className="post fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="post-header">
                  <div className="post-user">
                    <div className="avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div>
                      <h3>{post.userName}</h3>
                      <p className="post-time">
                        <i className="far fa-clock"></i> {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  {user?.id === post.userId && (
                    <div className="post-actions">
                      <button onClick={() => setEditingPost(post)} title="Edit">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDeletePost(post._id)} title="Delete">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  )}
                </div>

                {editingPost?._id === post._id ? (
                  <div className="edit-form">
                    <textarea
                      defaultValue={post.content}
                      id={`edit-${post._id}`}
                      rows="3"
                    />
                    <div className="edit-actions">
                      <button
                        className="save-btn"
                        onClick={() => {
                          const content = document.getElementById(`edit-${post._id}`).value;
                          handleUpdatePost(post._id, content);
                        }}
                      >
                        <i className="fas fa-check"></i> Save
                      </button>
                      <button className="cancel-btn" onClick={() => setEditingPost(null)}>
                        <i className="fas fa-times"></i> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="post-content">{post.content}</p>
                )}

                <div className="post-footer">
                  <button
                    className={`action-btn like-btn ${post.likes?.includes(user?.id) ? 'liked' : ''}`}
                    onClick={() => handleLike(post._id)}
                  >
                    <i className={`${post.likes?.includes(user?.id) ? 'fas' : 'far'} fa-thumbs-up`}></i>
                    <span>{post.likes?.length || 0}</span>
                  </button>
                  <button
                    className="action-btn comment-btn"
                    onClick={() => toggleComments(post._id)}
                  >
                    <i className="far fa-comment"></i>
                    <span>{post.comments?.length || 0}</span>
                  </button>
                  <button className="action-btn share-btn">
                    <i className="fas fa-share"></i>
                    <span>Share</span>
                  </button>
                </div>

                {showComments[post._id] && (
                  <>
                    {post.comments && post.comments.length > 0 && (
                      <div className="comments slide-in">
                        {post.comments.map((comment, idx) => (
                          <div key={idx} className="comment">
                            <div className="comment-avatar">
                              <i className="fas fa-user"></i>
                            </div>
                            <div className="comment-content">
                              <strong>{comment.userName}</strong>
                              <p>{comment.text}</p>
                              <span className="comment-time">
                                <i className="far fa-clock"></i> {formatDate(comment.createdAt)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="comment-form">
                      <div className="comment-avatar-small">
                        <i className="fas fa-user"></i>
                      </div>
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentText[post._id] || ''}
                        onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && handleComment(post._id)}
                      />
                      <button onClick={() => handleComment(post._id)}>
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;