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
        await triggerArticleImprovement(id);

        // Poll for updates (every 3 seconds, up to 1 minute)
        let attempts = 0;
        const maxAttempts = 40;

        const poll = async () => {
            if (attempts >= maxAttempts) {
                setIsRefreshing(false);
                return;
            }

            const updated = await fetchArticleDetails(id);
            // We check if content has changed or just rely on successful fetch. 
            // Ideally check status, but if it was already UPDATED and we re-run, status won't change.
            // For now, we just assume if it returns valid data, we update.
            // But to show the "loading" effect, we really want to see the *new* data.
            // Since we can't easily detect "newness" without timestamps or status change, 
            // we will just poll until specific time or assume the user sees the spinner.

            if (updated && updated.status === 'UPDATED') {
                setCurrentArticle(updated);
                setView('improved');
                // If we were scraping a fresh article, status would go ORIGINAL -> UPDATED.
                setIsRefreshing(false);
            } else if (updated && updated.status === 'ORIGINAL') {
                // Still processing
                attempts++;
                setTimeout(poll, 2000);
            } else {
                // Error or other state
                attempts++;
                setTimeout(poll, 2000);
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
            {view === 'improved' && currentArticle.references && currentArticle.references.length > 0 && (
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
