const Navbar = ({ onHomeClick, onLogout, onSearch }) => {
    const [searchTerm, setSearchTerm] = React.useState(""); // Use React.useState here

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearch) onSearch(value);
    };

    return (
        <header className="dashboard-header">
            <div className="header-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h1 className="logo" onClick={onHomeClick} style={{ cursor: 'pointer' }}>Nx</h1>
                    <div style={{ position: 'relative' }}>
                        <input 
                            type="text" 
                            placeholder="Search" 
                            value={searchTerm}
                            onChange={handleSearchChange}
                            style={{ padding: '8px 12px 8px 35px', borderRadius: '4px', border: 'none', background: '#eef3f8', width: '250px' }} 
                        />
                        <span style={{ position: 'absolute', left: '10px', top: '7px' }}>🔍</span>
                    </div>
                </div>
                <nav style={{ display: 'flex', gap: '25px' }}>
                    <div onClick={onHomeClick} style={{ cursor: 'pointer' }}>Home</div>
                    <div onClick={onLogout} style={{ cursor: 'pointer' }}>Logout</div>
                </nav>
            </div>
        </header>
    );
};