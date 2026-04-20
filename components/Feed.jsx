const { useState } = React;

const Feed = ({ posts, newPostText, setNewPostText, onCreate, onDelete, onViewProfile, onAddComment }) => {
    // Tracks what is being typed in the comment box for each individual post
    const [commentTexts, setCommentTexts] = useState({});

    const handleCommentChange = (postId, text) => {
        setCommentTexts(prev => ({...prev, [postId]: text}));
    };

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

                        {post.author === "Anirudh Chopra" && (
                            <button 
                                onClick={() => onDelete(post._id)}
                                style={{ background: 'none', border: 'none', color: '#999', fontSize: '1.2rem', cursor: 'pointer', padding: '5px' }}
                                title="Delete Post"
                            >
                                🗑️
                            </button>
                        )}
                    </div>
                    
                    {/* Post Content */}
                    <div style={{ padding: '0 16px 12px' }}>
                        <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}>{post.text}</p>
                        {post.postImage && (
                            <img src={post.postImage} style={{ width: '100%', borderRadius: '8px', border: '1px solid #eee' }} alt="Post content" />
                        )}
                    </div>

                    {/* FEATURE 3: LINKEDIN STYLE COMMENTS SECTION */}
                    <div style={{ padding: '12px 16px', borderTop: '1px solid #eee', backgroundColor: '#fafafa', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
                        {post.comments && post.comments.map((c, i) => (
                            <div key={i} style={{ background: '#fff', padding: '8px 12px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #eee' }}>
                                <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>{c.author}</span>
                                <span style={{ fontSize: '0.75rem', color: '#666', marginLeft: '8px' }}>{c.time}</span>
                                <p style={{ fontSize: '0.85rem', margin: '4px 0 0', color: '#333' }}>{c.text}</p>
                            </div>
                        ))}
                        
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                            <div className="post-avatar" style={{ width: '30px', height: '30px', fontSize: '0.7rem', background: '#0a66c2', color: 'white', lineHeight: '30px' }}>AC</div>
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                value={commentTexts[post._id] || ""}
                                onChange={(e) => handleCommentChange(post._id, e.target.value)}
                                style={{ flex: 1, padding: '8px 12px', borderRadius: '20px', border: '1px solid #ccc', outline: 'none', fontSize: '0.85rem' }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onAddComment(post._id, commentTexts[post._id]);
                                        setCommentTexts(prev => ({...prev, [post._id]: ""}));
                                    }
                                }}
                            />
                            <button 
                                className="btn-primary" 
                                style={{ padding: '4px 16px', borderRadius: '20px', fontSize: '0.85rem' }}
                                onClick={() => {
                                    onAddComment(post._id, commentTexts[post._id]);
                                    setCommentTexts(prev => ({...prev, [post._id]: ""}));
                                }}
                                disabled={!commentTexts[post._id]}
                            >
                                Reply
                            </button>
                        </div>
                    </div>

                </div>
            ))}
        </section>
    );
};
