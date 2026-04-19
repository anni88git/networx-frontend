const { useState, useEffect } = React;
const INTRO_SOUND = new Audio("./assets/intro.mp3");
const API_BASE_URL = "http://127.0.0.1:8000/api";

function App() {
    // --- 1. STATE MANAGEMENT ---
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isIntroActive, setIsIntroActive] = useState(false);
    const [currentView, setCurrentView] = useState('home'); 
    const [selectedUser, setSelectedUser] = useState(null);

    // Sidebar Network (The original squad)
    const initialNetwork = [
        { _id: "101", name: "Anik Acharjee", role: "Professor", avatar: "./assets/users/anik.jpeg", status: "Connect" },
        { _id: "103", name: "Akanshu Goel", role: "Technical Lead", avatar: "./assets/users/akanshu.jpeg", status: "Connect" },
        { _id: "104", name: "Yash Mahindroo", role: "ML Engineer", avatar: "./assets/users/yash.jpeg", status: "Connect" },
        { _id: "102", name: "Shrishti Pandey", role: "Blockchain Dev", avatar: "", status: "Connect" },
        { _id: "105", name: "Rishav", role: "Full Stack Developer", avatar: "", status: "Connect" }
    ];

    const [network, setNetwork] = useState(initialNetwork);
    const [posts, setPosts] = useState([]);
    const [newPostText, setNewPostText] = useState("");

    // --- 2. FETCH DATA ON LOGIN ---
    useEffect(() => {
        if (isLoggedIn) fetchPosts();
    }, [isLoggedIn]);

    const fetchPosts = async () => {
        // The original 5 legacy posts
        const legacyPosts = [
            { _id: "L5", author: "Yash Mahindroo", time: "1h ago", avatar: "./assets/users/yash.jpeg", text: "Sharing some critical references for our latest project modules.", postImage: "./assets/posts/post5.jpeg" },
            { _id: "L4", author: "Rishav", time: "3h ago", avatar: "", text: "Finalized the system architecture for the full-stack software design.", postImage: "./assets/posts/post4.webp" },
            { _id: "L3", author: "Akanshu Goel", time: "5h ago", avatar: "./assets/users/akanshu.jpeg", text: "The Real Story of Generative AI: My Breakthrough Insights. A well-crafted prompt isn’t just input—it’s intelligent intent.", postImage: "./assets/posts/post3.jpeg" },
            { _id: "L2", author: "Anik Acharjee", time: "1d ago", avatar: "./assets/users/anik.jpeg", text: "Honored to receive this certification in Advanced Machine Learning.", postImage: "./assets/posts/post2.jpeg" },
            { _id: "L1", author: "Anirudh Chopra", time: "2d ago", avatar: "", text: "Deep dive into Large Language Models today. Here is the flowchart.", postImage: "./assets/posts/post1.jpeg" }
        ];

        try {
            const response = await fetch(`${API_BASE_URL}/posts/`);
            const dbPosts = await response.json();
            // DB posts first, then legacy
            setPosts([...dbPosts, ...legacyPosts]);
        } catch (err) {
            console.warn("Backend offline, using legacy posts.");
            setPosts(legacyPosts);
        }
    };

    // --- 3. CORE HANDLERS ---
    const handleLogin = (e) => {
        e.preventDefault();
        // Play the sound and trigger the N overlay
        INTRO_SOUND.play().catch(() => console.log("Audio play blocked by browser"));
        setIsIntroActive(true);
        setTimeout(() => { 
            setIsIntroActive(false); 
            setIsLoggedIn(true); 
        }, 1800);
    };

    const handleSearch = async (query) => {
        if (!query.trim()) { setNetwork(initialNetwork); return; }
        try {
            const response = await fetch(`${API_BASE_URL}/users/search?q=${query}`);
            const data = await response.json();
            setNetwork(data.length > 0 ? data : initialNetwork);
        } catch (err) { console.error("Search Error"); }
    };

    const handleSendMessage = async (name) => {
        const txt = prompt(`Message ${name}:`);
        if (!txt || !txt.trim()) return;
        try {
            await fetch(`${API_BASE_URL}/messages/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sender: "Anirudh Chopra", receiver: name, text: txt })
            });
            alert(`Message to ${name} saved in MongoDB!`);
        } catch (e) { alert("Failed to save message."); }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostText.trim()) return;
        try {
            await fetch(`${API_BASE_URL}/posts/`, {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({author:"Anirudh Chopra", text:newPostText, avatar:"", postImage:"", time:"Just now"})
            });
            setNewPostText("");
            fetchPosts();
        } catch (err) { console.error(err); }
    };

    // The New Delete Logic
    const handleDeletePost = async (postId) => {
        // If it's a legacy post (ID starts with 'L'), just hide it locally
        if (postId.toString().startsWith('L')) {
            setPosts(posts.filter(p => p._id !== postId));
            return;
        }

        // If it's a real post, delete from DB
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
                method: "DELETE"
            });
            if (response.ok) {
                setPosts(posts.filter(p => p._id !== postId));
            } else {
                alert("Failed to delete post from database.");
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    // Standardizes the user object so ProfileView never crashes
    const handleViewProfile = (data) => {
        const userToDisplay = {
            ...data,
            name: data.name || data.author, 
            avatar: data.avatar || ""
        };
        setSelectedUser(userToDisplay);
        setCurrentView('profile');
        window.scrollTo(0, 0);
    };

    // --- 4. RENDER SCREENS ---
    if (isIntroActive) {
        return <div className="intro-overlay"><div className="intro-n">N</div></div>;
    }

    if (!isLoggedIn) {
        return (
            <div className="login-container">
                <div className="login-wrapper">
                    <div className="login-hero"><h1>Networx</h1><p>Connect with professionals.</p></div>
                    <div className="login-card">
                        <h2>Sign In</h2>
                        <form onSubmit={handleLogin}>
                            <input type="email" placeholder="Email" required />
                            <input type="password" placeholder="Password" required />
                            <button type="submit" className="btn-primary" style={{width:'100%'}}>Sign In</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <Navbar onHomeClick={() => setCurrentView('home')} onLogout={() => setIsLoggedIn(false)} onSearch={handleSearch} />
            <main className="dashboard-main">
                <SidebarLeft stats={{viewers: 16, impressions: 142}} />
                
                {currentView === 'home' ? (
                    <Feed 
                        posts={posts} 
                        newPostText={newPostText} 
                        setNewPostText={setNewPostText}
                        onCreate={handleCreatePost}
                        onDelete={handleDeletePost} 
                        onViewProfile={handleViewProfile}
                    />
                ) : (
                    <ProfileView 
                        user={selectedUser} 
                        onBack={() => setCurrentView('home')} 
                        onMessage={() => handleSendMessage(selectedUser.name)} 
                    />
                )}

                <SidebarRight 
                    network={network} 
                    onConnect={() => {}} 
                    onViewProfile={handleViewProfile}
                />
            </main>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);