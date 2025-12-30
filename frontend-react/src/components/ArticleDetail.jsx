import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchArticleDetails, triggerArticleImprovement } from '../api/articlesApi';

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentArticle, setCurrentArticle] = useState(null);
    const [view, setView] = useState('original');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!id) return;
            setLoading(true);
            const data = await fetchArticleDetails(id);
            if (data) {
                setCurrentArticle(data);
                setView(data.status === 'UPDATED' ? 'improved' : 'original');
            }
            setLoading(false);
        };
        load();
    }, [id]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        // Trigger the AI improvement process on the backend
        const result = await triggerArticleImprovement(id);

        if (!result) {
            console.error("Failed to trigger improvement.");
            alert("Failed to trigger update. Please check backend logs/connectivity.");
            setIsRefreshing(false);
            return;
        }

        // Poll for updates (every 3 seconds, up to 1 minute)
        let attempts = 0;
        const maxAttempts = 40;

        const poll = async () => {
            if (attempts >= maxAttempts) {
                setIsRefreshing(false);
                return;
            }

            const updated = await fetchArticleDetails(id);

            if (updated) {
                // Always update the UI with the latest status (e.g. PROCESSING)
                setCurrentArticle(updated);

                if (updated.status === 'UPDATED') {
                    // Success! Switch to improved view and stop polling
                    setView('improved');
                    setIsRefreshing(false);
                } else if (updated.status === 'PROCESSING' || updated.status === 'ORIGINAL') {
                    // Still working, keep polling
                    attempts++;
                    setTimeout(poll, 3000);
                } else {
                    // Unknown status, stop? Or keep trying? Let's stop to be safe.
                    setIsRefreshing(false);
                }
            } else {
                // Fetch failed (network error?), retry a few times
                attempts++;
                setTimeout(poll, 3000);
            }
        };

        setTimeout(poll, 2000);
    };

    if (loading) return <div className="app-container"><p>Loading article...</p></div>;
    if (!currentArticle) return <div className="app-container"><p>Article not found.</p></div>;

    const content = view === 'improved'
        ? (currentArticle.updated_content || "No updated content available yet.")
        : currentArticle.original_content;

    return (
        <div className="app-container">
            {/* Professional Header */}
            <div className="detail-header">
                <div className="detail-title-group">
                    <h1>{currentArticle.title}</h1>
                    <div className="metadata">
                        <span className={`status-badge status-${currentArticle.status}`}>
                            {currentArticle.status}
                        </span>
                        <span>ID: {currentArticle.id}</span>
                    </div>
                </div>

                <div className="actions-group">
                    <button
                        className={`fetch-btn ${isRefreshing ? 'loading' : ''}`}
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                    >
                        {isRefreshing ? '↻ Updating...' : '⚡ Fetch Updates'}
                    </button>
                    <button className="icon-btn" onClick={() => navigate('/')} aria-label="Close">
                        ✕
                    </button>
                </div>
            </div>

            {/* View Toggles */}
            <div className="toggle-switch">
                <div
                    className={`toggle-option ${view === 'original' ? 'active' : ''}`}
                    onClick={() => setView('original')}
                >
                    Original
                </div>
                <div
                    className={`toggle-option ${view === 'improved' ? 'active' : ''}`}
                    onClick={() => setView('improved')}
                >
                    Improved (AI)
                </div>
            </div>

            {/* Content Card */}
            <div className="card" style={{ cursor: 'default' }}>
                <div
                    className="content-area"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>

            {/* References Section */}
            {view === 'improved' && currentArticle.status === 'UPDATED' && currentArticle.references && currentArticle.references.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                        Sources & Citations
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {currentArticle.references.map((ref, idx) => (
                            <li key={idx} style={{ marginBottom: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                                <span>🔗</span>
                                <a href={ref.reference_url} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
                                    {ref.reference_url}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ArticleDetail;
