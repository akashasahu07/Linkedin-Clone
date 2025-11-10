// App.js - Main React Component
import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [postContent, setPostContent] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const fetchUser = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
        headers: {
          'Authorization': `Bearer ${token}`
        }
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="logo">LinkedIn Clone</h1>
          
          <div className="auth-tabs">
            <button 
              className={showLogin ? 'active' : ''} 
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
            <button 
              className={!showLogin ? 'active' : ''} 
              onClick={() => setShowLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {showLogin ? (
            <form onSubmit={handleLogin} className="auth-form">
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="auth-form">
              <input
                type="text"
                placeholder="Full Name"
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">LinkedIn Clone</h1>
          <div className="user-section">
            <span className="user-name">Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="create-post">
          <h2>Create a Post</h2>
          <form onSubmit={handleCreatePost}>
            <textarea
              placeholder="What's on your mind?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              rows="3"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Posting...' : 'Post'}
            </button>
          </form>
        </div>

        <div className="feed">
          <h2>Feed</h2>
          {posts.length === 0 ? (
            <p className="no-posts">No posts yet. Be the first to post!</p>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="post">
                <div className="post-header">
                  <div className="post-user">
                    <div className="avatar">{post.userName[0].toUpperCase()}</div>
                    <div>
                      <h3>{post.userName}</h3>
                      <p className="post-time">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                  {user?.id === post.userId && (
                    <div className="post-actions">
                      <button onClick={() => setEditingPost(post)}>Edit</button>
                      <button onClick={() => handleDeletePost(post._id)}>Delete</button>
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
                    <div>
                      <button 
                        onClick={() => {
                          const content = document.getElementById(`edit-${post._id}`).value;
                          handleUpdatePost(post._id, content);
                        }}
                      >
                        Save
                      </button>
                      <button onClick={() => setEditingPost(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="post-content">{post.content}</p>
                )}

                <div className="post-footer">
                  <button 
                    className={`like-btn ${post.likes?.includes(user?.id) ? 'liked' : ''}`}
                    onClick={() => handleLike(post._id)}
                  >
                    👍 {post.likes?.length || 0} {post.likes?.length === 1 ? 'Like' : 'Likes'}
                  </button>
                  <span>💬 {post.comments?.length || 0} {post.comments?.length === 1 ? 'Comment' : 'Comments'}</span>
                </div>

                {post.comments && post.comments.length > 0 && (
                  <div className="comments">
                    {post.comments.map((comment, idx) => (
                      <div key={idx} className="comment">
                        <div className="comment-avatar">{comment.userName[0].toUpperCase()}</div>
                        <div className="comment-content">
                          <strong>{comment.userName}</strong>
                          <p>{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="comment-form">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText[post._id] || ''}
                    onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleComment(post._id)}
                  />
                  <button onClick={() => handleComment(post._id)}>Comment</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;