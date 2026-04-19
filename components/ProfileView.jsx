const ProfileView = ({ user, onBack, onMessage }) => {
    // Failsafe so the screen never goes white
    if (!user) return <div className="card">Loading profile...</div>;

    const displayName = user.name || "User";

    return (
        <section className="profile-view" style={{ width: '100%', maxWidth: '800px', animation: 'fadeIn 0.3s ease' }}>
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ height: '140px', background: 'linear-gradient(to right, #0a66c2, #004182)' }}></div>
                
                <div style={{ padding: '0 24px 24px', marginTop: '-60px' }}>
                    {user.avatar ? (
                        <img 
                            src={user.avatar} 
                            alt={displayName}
                            className="post-avatar" 
                            style={{ width: '120px', height: '120px', border: '4px solid white', objectFit: 'cover' }} 
                        />
                    ) : (
                        <div className="post-avatar" style={{ 
                            width: '120px', 
                            height: '120px', 
                            fontSize: '3rem', 
                            border: '4px solid white', 
                            background: '#0a66c2', 
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%'
                        }}>
                            {displayName.substring(0,2).toUpperCase()}
                        </div>
                    )}
                    
                    <div style={{ marginTop: '15px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{displayName}</h2>
                        <p style={{ color: '#666', fontSize: '1rem' }}>{user.role || "Professional"}</p>
                        <p style={{ color: '#999', fontSize: '0.85rem' }}>Greater Noida, India</p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button className="btn-primary" onClick={onMessage}>Message</button>
                        <button onClick={onBack} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #666', background: 'white', cursor: 'pointer' }}>
                            Back to Feed
                        </button>
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginTop: '15px', padding: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>About</h3>
                <p style={{ color: '#333', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    Passionate professional focused on driving technical innovation and building robust full-stack applications.
                </p>
            </div>
        </section>
    );
};