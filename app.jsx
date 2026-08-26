const { useState, useEffect } = React;

const API_BASE_URL = "https://networx-api-69n9.onrender.com";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [currentView, setCurrentView] = useState('home');
    const [selectedUser, setSelectedUser] = useState(null);

    // Initial fallback data
    const [network, setNetwork] = useState([
        { _id: "101", name: "Anik Acharjee", role: "Principal Architect", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", status: "Connect" },
        { _id: "102", name: "Akanshu Goel", role: "Tech Lead @ HighScale", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", status: "Connect" },
        { _id: "103", name: "Yash Mahindroo", role: "Senior ML Infrastructure Lead", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", status: "Connect" },
        { _id: "104", name: "Shrishti Pandey", role: "Distributed Systems Dev", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", status: "Connect" },
        { _id: "105", name: "Rishav Kumar", role: "Backend Performance Engineer", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80", status: "Connect" }
    ]);

    const [posts, setPosts] = useState([
        { 
            _id: "P1", 
            author: "Anirudh Chopra", 
            role: "Full-Stack & GenAI Engineer",
            time: "2h ago", 
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80", 
            text: "Architected low-latency microservices handling 10k+ requests/sec using Node.js and Redis caching. Focused on minimizing database query bottlenecks and optimizing memory footprints for heavy payload pipelines.", 
            tags: ["#SystemDesign", "#NodeJS", "#BackendArchitecture"],
            likes: 42
        }
    ]);

    const [newPostText, setNewPostText] = useState("");

    // Fetch live posts from Render backend on load
    useEffect(() => {
        fetch(`${API_BASE_URL}/posts`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) setPosts(data);
            })
            .catch(err => console.warn("Backend loading offline, using default feeds:", err));
    }, []);

    const handleConnect = (id) => {
        setNetwork(prev => prev.map(u => u._id === id ? { ...u, status: "Requested" } : u));
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostText.trim()) return;

        const payload = {
            author: "Anirudh Chopra",
            role: "Full-Stack & GenAI Engineer",
            text: newPostText,
            tags: ["#Engineering", "#Update"],
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
        };

        try {
            // Post directly to live FastAPI server
            const res = await fetch(`${API_BASE_URL}/posts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const savedPost = await res.json();
                setPosts([savedPost, ...posts]);
            } else {
                setPosts([{ _id: Date.now().toString(), time: "Just now", likes: 0, ...payload }, ...posts]);
            }
        } catch (err) {
            setPosts([{ _id: Date.now().toString(), time: "Just now", likes: 0, ...payload }, ...posts]);
        }
        setNewPostText("");
    };

    return (
        <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white flex flex-col justify-between">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-black/70 backdrop-blur-2xl border-b border-zinc-800/80">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
                        <div className="w-8 h-8 rounded-full bg-white text-black font-black flex items-center justify-center text-sm shadow-lg shadow-white/10">
                            N
                        </div>
                        <span className="font-semibold text-lg tracking-tight text-white">Networx</span>
                    </div>

                    <div className="flex items-center gap-6 text-sm font-medium text-zinc-400">
                        <button onClick={() => setCurrentView('home')} className="hover:text-white transition-colors">Feed</button>
                        <a href="https://github.com/anni88git" target="_blank" className="hover:text-white transition-colors">GitHub</a>
                        <a href="https://www.linkedin.com/in/anirudh-chopra-05622a275" target="_blank" className="hover:text-white transition-colors">LinkedIn</a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8 flex-1 space-y-10 w-full">
                <section className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight text-white">Engineered Insights</h2>
                            <p className="text-sm text-zinc-400">Curated software design & infrastructure topics</p>
                        </div>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x">
                        <div className="snap-start shrink-0 w-80 bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl backdrop-blur-xl hover:border-zinc-700 transition-all space-y-3">
                            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Architecture</span>
                            <h3 className="text-lg font-medium text-white">Designing High-Throughput REST APIs</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">Implementing event-driven architectures with Node.js to achieve sub-100ms response times.</p>
                        </div>

                        <div className="snap-start shrink-0 w-80 bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl backdrop-blur-xl hover:border-zinc-700 transition-all space-y-3">
                            <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">Databases</span>
                            <h3 className="text-lg font-medium text-white">MongoDB Index Optimization</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">Compound indexing strategies for instant profile lookups and fast data retrieval.</p>
                        </div>

                        <div className="snap-start shrink-0 w-80 bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl backdrop-blur-xl hover:border-zinc-700 transition-all space-y-3">
                            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Generative AI</span>
                            <h3 className="text-lg font-medium text-white">Production AI Pipelines</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">Building fine-tuned LLM workflows with fallback mechanisms for 99.9% uptime.</p>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-5 backdrop-blur-xl space-y-4">
                            <form onSubmit={handleCreatePost} className="space-y-3">
                                <textarea 
                                    value={newPostText}
                                    onChange={(e) => setNewPostText(e.target.value)}
                                    placeholder="Share a system design update or breakthrough..."
                                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-all resize-none"
                                    rows="3"
                                />
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-zinc-500 font-mono">Status: Connected to FastAPI / Render</span>
                                    <button type="submit" className="bg-white hover:bg-zinc-200 text-black font-medium text-xs px-5 py-2.5 rounded-full transition-all shadow-lg shadow-white/5 active:scale-95">
                                        Publish
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="space-y-4">
                            {posts.map((post) => (
                                <article key={post._id} className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-xl space-y-4 hover:border-zinc-700/60 transition-all">
                                    <div className="flex items-center gap-3">
                                        <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover border border-zinc-700" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-white">{post.author}</h4>
                                            <p className="text-xs text-zinc-500">{post.role} • {post.time}</p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-zinc-300 leading-relaxed">{post.text}</p>

                                    <div className="flex gap-2 flex-wrap">
                                        {post.tags.map((tag, idx) => (
                                            <span key={idx} className="text-[11px] font-mono bg-zinc-800/60 text-zinc-400 px-3 py-1 rounded-full border border-zinc-700/50">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-xl space-y-4">
                            <h3 className="text-sm font-semibold text-white">Recommended Engineering Network</h3>
                            <div className="space-y-4">
                                {network.map((user) => (
                                    <div key={user._id} className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-zinc-800" />
                                            <div>
                                                <p className="text-xs font-medium text-white">{user.name}</p>
                                                <p className="text-[11px] text-zinc-500">{user.role}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleConnect(user._id)}
                                            disabled={user.status === "Requested"}
                                            className={`text-xs px-4 py-1.5 rounded-full transition-all ${
                                                user.status === "Requested"
                                                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                                    : "bg-white text-black hover:bg-zinc-200 font-medium"
                                            }`}
                                        >
                                            {user.status === "Requested" ? "Pending" : "Connect"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <footer className="border-t border-zinc-800/80 bg-black/90 py-10 mt-16 backdrop-blur-2xl">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
                    <div>
                        <p className="font-semibold text-zinc-300 text-sm">Anirudh Chopra</p>
                        <p className="mt-1">Full-Stack Software Development & GenAI Architecture</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-zinc-400">
                        <a href="mailto:anirudhc422@gmail.com" className="hover:text-white transition-colors">anirudhc422@gmail.com</a>
                        <span>•</span>
                        <a href="tel:+918744858415" className="hover:text-white transition-colors">+91 8744858415</a>
                        <span>•</span>
                        <a href="https://github.com/anni88git" target="_blank" className="hover:text-white transition-colors">GitHub</a>
                        <span>•</span>
                        <a href="https://www.linkedin.com/in/anirudh-chopra-05622a275" target="_blank" className="hover:text-white transition-colors">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
