const SidebarLeft = ({ stats }) => {
    return (
        <aside className="card" style={{ position: 'sticky', top: '80px' }}>
            <div className="profile-banner"></div>
            <div className="profile-avatar-main">AC</div>
            <div style={{ textAlign: 'center', padding: '0 12px 16px', borderBottom: '1px solid #eee' }}>
                <h3 style={{ fontSize: '1rem' }}>Anirudh Chopra</h3>
                <p style={{ fontSize: '0.75rem', color: '#666' }}>Student at IILM University</p>
            </div>
            <div style={{ padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#666' }}>
                    <span>Profile viewers</span>
                    <span style={{ color: '#0a66c2', fontWeight: '600' }}>{stats.viewers}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#666', marginTop: '5px' }}>
                    <span>Post impressions</span>
                    <span style={{ color: '#0a66c2', fontWeight: '600' }}>{stats.impressions}</span>
                </div>
            </div>
        </aside>
    );
};