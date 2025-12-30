import React from 'react';
import { useNavigate } from 'react-router-dom';

const ArticleCard = ({ article }) => {
    const navigate = useNavigate();

    return (
        <div className="card" onClick={() => navigate(`/article/${article.id}`)}>
            <h3>{article.title}</h3>
            <div className="metadata">
                <span className={`status-badge status-${article.status}`}>
                    {article.status}
                </span>
                <span>{new Date(article.updated_at).toLocaleDateString()}</span>
            </div>
            <p style={{ marginTop: '10px', color: '#94a3b8' }}>
                Click to read {article.status === 'UPDATED' ? 'improved' : 'original'} version.
            </p>
        </div>
    );
};

export default ArticleCard;
