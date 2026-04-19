const Feed = ({ posts, newPostText, setNewPostText, onCreate, onDelete, onViewProfile }) => {
    return (
        <section className="feed">
            {/* Create Post Box */}
            <div className="card" style={{ padding: '1.2rem' }}>
                <form onSubmit={onCreate}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div className="post-avatar" style={{ background: '#0a66c2', color: 'white' }}>AC</div>
                        <textarea 
                            placeholder="Start a post" 
                            value={newPostText} 
                            onChange={(e) => setNewPostText(e.target.value)} 
                            style={{ width: '100%', borderRadius: '25px', padding: '12px 16px', border: '1px solid #ddd', resize: 'none', outline: 'none' }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button type="submit" className="btn-primary" disabled={!newPostText.trim()}>Post</button>
                    </div>
                </form>
            </div>

            {/* Post Feed */}
            {posts.map(post => (
                <div key={post._id} className="card" style={{ marginBottom: '1rem', animation: 'fadeIn 0.3s ease' }}>
                    
                    {/* Post Header */}
                    <div style={{ display: 'flex', padding: '12px 16px', alignItems: 'center' }}>
                        {post.avatar ? (
                            <img src={post.avatar} className="post-avatar" alt={post.author} style={{ objectFit: 'cover' }} />
                        ) : (
                            <div className="post-avatar" style={{ background: '#0a66c2', color: 'white' }}>
                                {post.author ? post.author.substring(0, 2).toUpperCase() : "??"}
                            </div>
                        )}
                        
                        <div style={{ marginLeft: '12px', flexGrow: 1 }}>
                            <div style={{ fontWeight: '600', cursor: 'pointer' }} onClick={() => onViewProfile(post)}>
                                {post.author}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#666' }}>{post.time}</div>
                        </div>

                        {/* DELETE BUTTON: Only shows if the post belongs to Anirudh Chopra */}
                        {post.author === "Anirudh Chopra" && (
                            <button 
                                onClick={() => onDelete(post._id)}
                                style={{ 
                                    background: 'none', border: 'none', color: '#999', 
                                    fontSize: '1.2rem', cursor: 'pointer', padding: '5px' 
                                }}
                                title="Delete Post"
                            >
                                🗑️
                            </button>
                        )}
                    </div>
                    
                    {/* Post Content */}
                    <div style={{ padding: '0 16px 12px' }}>
                        <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}>{post.text}</p>
                        
                        {/* Rendering the attached images */}
                        {post.postImage && (
                            <img 
                                src={post.postImage} 
                                style={{ width: '100%', borderRadius: '8px', border: '1px solid #eee' }} 
                                alt="Post content" 
                            />
                        )}
                    </div>
                </div>
            ))}
        </section>
    );
};