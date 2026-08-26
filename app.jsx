import React, { useState, useEffect } from 'react';

const API_BASE = "https://networx-api-69n9.onrender.com";

// --- HARDCODED DUMMY DATA ---
const INITIAL_POSTS = [
  {
    _id: "mock1", author: "Satya Nadella",
    text: "Thrilled to announce our new integrations with OpenAI. The future of developer productivity is here, and it's powered by AI.",
    created_at: "1h ago", likes: 1420
  },
  {
    _id: "mock2", author: "Guido van Rossum",
    text: "Just reviewed the new FastAPI updates. Astonishing how quickly the Python web ecosystem is evolving. Great work to the team!",
    created_at: "3h ago", likes: 890
  },
  {
    _id: "mock3", author: "Anirudh Chopra",
    text: "Launched Networx V1! 🚀 Built with React, FastAPI, and MongoDB. The intro animation alone was worth the CSS grind.",
    created_at: "5h ago", likes: 234
  }
];

const SUGGESTED_USERS = [
  { id: "u1", name: "Sam Altman", role: "CEO @ OpenAI" },
  { id: "u2", name: "Linus Torvalds", role: "Creator of Linux" },
  { id: "u3", name: "Lex Fridman", role: "AI Researcher & Podcaster" }
];

export default function App() {
  // --- STATE ---
  const [showIntro, setShowIntro] = useState(true);
  const [user, setUser] = useState(null);
  const [isSignUp, setIsSignUp] = useState(true);
  
  const [authData, setAuthData] = useState({ username: '', email: '', password: '' });
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPostText, setNewPostText] = useState('');
  const [connectedUsers, setConnectedUsers] = useState({});

  // --- 1. INTRO ANIMATION LOGIC ---
  useEffect(() => {
    // Hide intro after the 1.8s animation completes
    const timer = setTimeout(() => setShowIntro(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  // --- 2. FETCH REAL POSTS ---
  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/posts`);
      if (res.ok) {
        const data = await res.json();
        // Merge real backend posts with hardcoded posts for a full feed
        if (data.length > 0) setPosts([...data, ...INITIAL_POSTS]);
      }
    } catch (err) {
      console.log("Backend offline, relying on hardcoded posts.");
    }
  };

  useEffect(() => {
    if (user) fetchPosts();
  }, [user]);

  // --- 3. AUTHENTICATION LOGIC ---
  const handleAuth = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      try {
        const res = await fetch(`${API_BASE}/api/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(authData)
        });
        if (res.ok) {
          setUser({ username: authData.username, headline: "Software Engineer | Networx" });
        } else alert("Signup failed, check backend.");
      } catch (err) {
        // Fallback for UI testing if backend is asleep
        setUser({ username: authData.username || "Guest", headline: "Software Engineer | Networx" });
      }
    } else {
      // Dummy Login simulation
      setUser({ username: authData.username || "Test User", headline: "Software Engineer | Networx" });
    }
  };

  // --- 4. POST CREATION LOGIC ---
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const dummyPost = {
      _id: Date.now().toString(),
      author: user.username,
      text: newPostText,
      created_at: "Just now",
      likes: 0
    };

    setPosts([dummyPost, ...posts]); // Optimistic UI update
    setNewPostText('');

    try {
      await fetch(`${API_BASE}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: user.username,
          headline: user.headline,
          text: newPostText
        })
      });
    } catch (err) { console.error("Failed to sync post to backend", err); }
  };

  const handleConnect = (id) => {
    setConnectedUsers(prev => ({ ...prev, [id]: true }));
  };


  // ==========================================
  // VIEW 1: INTRO ANIMATION
  // ==========================================
  if (showIntro) {
    return (
      <div className="intro-overlay">
        <div className="intro-n">N</div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: LOGIN / SIGNUP SCREEN
  // ==========================================
  if (!user) {
    return (
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-hero">
            <h1>Networx</h1>
            <p>Welcome to your professional community.</p>
          </div>
          <div className="login-card">
            <h2 style={{ marginBottom: '20px' }}>{isSignUp ? "Sign Up" : "Sign In"}</h2>
            <form onSubmit={handleAuth}>
              <input 
                type="text" 
                placeholder="Username" 
                required 
                value={authData.username}
                onChange={(e) => setAuthData({...authData, username: e.target.value})}
              />
              {isSignUp && (
                <input 
                  type="email" 
                  placeholder="Email" 
                  required 
                  value={authData.email}
                  onChange={(e) => setAuthData({...authData, email: e.target.value})}
                />
              )}
              <input 
                type="password" 
                placeholder="Password" 
                required 
                value={authData.password}
                onChange={(e) => setAuthData({...authData, password: e.target.value})}
              />
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                {isSignUp ? "Agree & Join" : "Sign In"}
              </button>
            </form>
            <p style={{ marginTop: '15px', fontSize: '0.9rem', textAlign: 'center' }}>
              {isSignUp ? "Already on Networx? " : "New to Networx? "}
              <span 
                style={{ color: 'var(--nx-blue)', cursor: 'pointer', fontWeight: 'bold' }} 
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Sign in" : "Join now"}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: MAIN DASHBOARD FEED
  // ==========================================
  return (
    <>
      {/* Navbar mapped to your CSS */}
      <header className="dashboard-header">
        <div className="header-content">
          <a className="logo">Networx</a>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ cursor: 'pointer', fontWeight: 600 }}>Home</span>
            <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>Network</span>
            <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>Messaging</span>
            <button className="btn-primary" onClick={() => setUser(null)} style={{ padding: '0.4rem 1rem' }}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid mapped to your CSS */}
      <main className="dashboard-main">
        
        {/* Left Sidebar */}
        <aside>
          <div className="card" style={{ textAlign: 'center', paddingBottom: '1rem' }}>
            <div className="profile-banner"></div>
            <div className="profile-avatar-main">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{user.username}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '0 10px' }}>
              {user.headline}
            </p>
            <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid var(--border)' }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 15px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Connections</span>
              <span style={{ color: 'var(--nx-blue)', fontWeight: 'bold' }}>42</span>
            </div>
          </div>
        </aside>

        {/* Center Feed */}
        <section>
          {/* Post Composer */}
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="post-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <form onSubmit={handleCreatePost} style={{ flex: 1, display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Start a post..." 
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  style={{ 
                    flex: 1, padding: '12px 20px', borderRadius: '30px', 
                    border: '1px solid var(--border)', fontSize: '0.95rem' 
                  }}
                />
                <button type="submit" className="btn-primary" disabled={!newPostText.trim()}>
                  Post
                </button>
              </form>
            </div>
          </div>

          {/* Posts Feed */}
          {posts.map(post => (
            <div className="card" key={post._id} style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div className="post-avatar">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>{post.author}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {post.created_at || "Just now"}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                {post.text}
              </p>
              <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid var(--border)' }}/>
              <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                <span style={{ cursor: 'pointer' }}>👍 Like {post.likes ? `(${post.likes})` : ''}</span>
                <span style={{ cursor: 'pointer' }}>💬 Comment</span>
                <span style={{ cursor: 'pointer' }}>🔁 Repost</span>
              </div>
            </div>
          ))}
        </section>

        {/* Right Sidebar - Hardcoded Connections */}
        <aside>
          <div className="card" style={{ padding: '1rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '10px' }}>Add to your feed</h3>
            {SUGGESTED_USERS.map(u => (
              <div className="connection-row" key={u.id}>
                <div className="post-avatar" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                  {u.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.9rem', margin: 0 }}>{u.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 5px' }}>{u.role}</p>
                  <button 
                    className={`btn-connect ${connectedUsers[u.id] ? 'requested' : ''}`}
                    onClick={() => handleConnect(u.id)}
                  >
                    {connectedUsers[u.id] ? 'Pending' : '+ Follow'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>

      </main>
    </>
  );
}
