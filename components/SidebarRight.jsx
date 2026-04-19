const SidebarRight = ({ network, onConnect, onViewProfile }) => {
    return (
        <aside className="card" style={{ padding: '16px', position: 'sticky', top: '80px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>Add to your feed</h3>
            {network.map(user => (
                <div key={user.id} className="connection-row" style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid #eee' }}>
                    {user.avatar ? (
                        <img src={user.avatar} className="post-avatar" style={{ width: '45px', height: '45px' }} />
                    ) : (
                        <div className="post-avatar" style={{ width: '45px', height: '45px', fontSize: '0.8rem' }}>
                            {user.name.substring(0, 2).toUpperCase()}
                        </div>
                    )}
                    <div style={{ flex: 1 }}>
                        <div 
                            style={{ fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer' }} 
                            onClick={() => onViewProfile(user)}
                        >
                            {user.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>{user.role}</div>
                        <button 
                            className={`btn-connect ${user.status === 'Requested' ? 'requested' : ''}`}
                            onClick={() => onConnect(user.id)}
                        >
                            {user.status === "Connect" ? "+ Connect" : "✓ Requested"}
                        </button>
                    </div>
                </div>
            ))}
        </aside>
    );
};