import React, { useState, useEffect } from 'react';
import { 
  Home, Users, MessageSquare, Bell, Search, 
  Image, Video, Calendar, ThumbsUp, MessageCircle, 
  Share2, Send, Bookmark, TrendingUp, LogOut, Loader2 
} from 'lucide-react';

const API_BASE = "https://networx-api-69n9.onrender.com";

export default function App() {
  // User state (null = show Sign Up page; object = logged in)
  const [user, setUser] = useState(null);
  
  // Auth Form State
  const [signUpData, setSignUpData] = useState({ username: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Feed State
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [postLoading, setPostLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});

  // 1. Fetch Posts from Backend
  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/posts`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  // 2. Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: signUpData.username,
          email: signUpData.email,
          password: signUpData.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Successfully registered -> Log user in and switch to Feed view
        setUser({
          username: signUpData.username,
          email: signUpData.email,
          headline: "Software Developer | Networx Member"
        });
      } else {
        setAuthError(data.detail || "Sign up failed. Please try again.");
      }
    } catch (err) {
      setAuthError("Could not connect to backend server. Make sure it is awake.");
    } finally {
      setAuthLoading(false);
    }
  };

  // 3. Handle Creating a Post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    setPostLoading(true);
    const postPayload = {
      author: user.username,
      headline: user.headline,
      text: newPostText
    };

    try {
      const res = await fetch(`${API_BASE}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postPayload)
      });

      if (res.ok) {
        setNewPostText('');
        await fetchPosts(); // Refresh feed to show new post
      } else {
        alert("Failed to create post. Check FastAPI backend logs.");
      }
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setPostLoading(false);
    }
  };

  const toggleLike = (postId) => {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  // ==========================================
  // VIEW 1: SIGN UP SCREEN (If not logged in)
  // ==========================================
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md bg-[#1e293b] border border-slate-700/60 rounded-2xl p-8 shadow-xl">
          
          <div className="flex flex-col items-center mb-6">
            <div className="bg-indigo-600 text-white font-black text-2xl px-3 py-1 rounded-lg tracking-wider mb-2">
              Networx
            </div>
            <h1 className="text-xl font-bold text-slate-100">Make the most of your professional life</h1>
          </div>

          {authError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-lg mb-4">
              {authError}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
              <input 
                type="text"
                required
                placeholder="e.g. anni88"
                value={signUpData.username}
                onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input 
                type="email"
                required
                placeholder="anirudh@example.com"
                value={signUpData.email}
                onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={signUpData.password}
                onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-full transition-colors flex justify-center items-center gap-2 mt-2"
            >
              {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Agree & Join Networx"}
            </button>
          </form>

        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: MAIN LINKEDIN FEED (If logged in)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#1e293b] border-b border-slate-700/60 px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white font-black text-xl px-2.5 py-1 rounded-md tracking-wider">
              N
            </div>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search Networx..."
                className="bg-[#0f172a] text-sm text-slate-200 pl-9 pr-4 py-1.5 rounded-md border border-slate-700 focus:outline-none focus:border-indigo-500 w-64"
              />
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <button className="flex flex-col items-center gap-1 text-xs text-indigo-400 border-b-2 border-indigo-400 pb-1">
              <Home className="w-5 h-5" /> Home
            </button>
            <button className="flex flex-col items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
              <Users className="w-5 h-5" /> Network
            </button>
            <button className="flex flex-col items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
              <MessageSquare className="w-5 h-5" /> Messaging
            </button>
            <button className="flex flex-col items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
              <Bell className="w-5 h-5" /> Notifications
            </button>
            
            <div className="h-6 w-px bg-slate-700"></div>

            <button 
              onClick={() => setUser(null)}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </nav>

        </div>
      </header>

      {/* 3-Column Layout */}
      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Profile Card */}
        <aside className="lg:col-span-3">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700/60 overflow-hidden shadow-sm">
            <div className="h-16 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
            <div className="px-4 pb-4 relative">
              <div className="w-14 h-14 rounded-full bg-indigo-600 border-4 border-[#1e293b] -mt-7 mb-2 flex items-center justify-center font-bold text-lg text-white">
                {user.username[0]?.toUpperCase()}
              </div>
              <h2 className="font-bold text-base text-slate-100">{user.username}</h2>
              <p className="text-xs text-slate-400 leading-snug mt-0.5">{user.headline}</p>
              
              <hr className="my-3 border-slate-700/60" />

              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Profile views</span>
                  <span className="text-indigo-400 font-semibold">1</span>
                </div>
                <div className="flex justify-between">
                  <span>Connections</span>
                  <span className="text-indigo-400 font-semibold">0</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Feed Column */}
        <section className="lg:col-span-6 space-y-4">
          
          {/* Post Composer */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700/60 p-4 shadow-sm">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shrink-0">
                {user.username[0]?.toUpperCase()}
              </div>
              <input 
                type="text" 
                placeholder="Start a post..."
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreatePost(e)}
                className="w-full bg-[#0f172a] text-slate-200 placeholder-slate-400 text-sm rounded-full px-4 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50 text-xs text-slate-400">
              <div className="flex gap-4">
                <span className="flex items-center gap-1 cursor-pointer hover:text-indigo-400"><Image className="w-4 h-4 text-sky-400" /> Photo</span>
                <span className="flex items-center gap-1 cursor-pointer hover:text-indigo-400"><Video className="w-4 h-4 text-emerald-400" /> Video</span>
              </div>
              <button 
                onClick={handleCreatePost}
                disabled={postLoading || !newPostText.trim()}
                className="bg-indigo-600 disabled:opacity-50 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-full font-medium transition-colors"
              >
                {postLoading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          {posts.length === 0 ? (
            <div className="bg-[#1e293b] rounded-xl border border-slate-700/60 p-8 text-center text-slate-400 text-sm">
              No posts yet. Be the first to share something above! 🚀
            </div>
          ) : (
            posts.map((post) => (
              <article key={post._id} className="bg-[#1e293b] rounded-xl border border-slate-700/60 p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold">
                    {post.author ? post.author[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-100">{post.author}</h3>
                    <p className="text-xs text-slate-400">{post.headline || "Networx Member"}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {post.text}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/50">
                  <button 
                    onClick={() => toggleLike(post._id)}
                    className={`flex items-center gap-1.5 hover:text-indigo-400 py-1.5 px-3 rounded-md hover:bg-slate-800 transition-colors ${likedPosts[post._id] ? 'text-indigo-400 font-semibold' : ''}`}
                  >
                    <ThumbsUp className="w-4 h-4" /> Like
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-indigo-400 py-1.5 px-3 rounded-md hover:bg-slate-800 transition-colors">
                    <MessageCircle className="w-4 h-4" /> Comment
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-indigo-400 py-1.5 px-3 rounded-md hover:bg-slate-800 transition-colors">
                    <Share2 className="w-4 h-4" /> Repost
                  </button>
                </div>
              </article>
            ))
          )}

        </section>

        {/* Right Sidebar */}
        <aside className="lg:col-span-3 hidden lg:block">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700/60 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-slate-200">Networx News</h3>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </div>
            <ul className="space-y-3 text-xs">
              <li className="cursor-pointer group">
                <p className="font-medium text-slate-300 group-hover:text-indigo-400 transition-colors">FastAPI Backend Live</p>
                <span className="text-[11px] text-slate-500">Connected to Render</span>
              </li>
              <li className="cursor-pointer group">
                <p className="font-medium text-slate-300 group-hover:text-indigo-400 transition-colors">Vercel Deployment Ready</p>
                <span className="text-[11px] text-slate-500">Continuous Integration Active</span>
              </li>
            </ul>
          </div>
        </aside>

      </main>
    </div>
  );
}
