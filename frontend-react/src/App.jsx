import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { fetchArticles } from './api/articlesApi';
import ArticleCard from './components/ArticleCard';
import ArticleDetail from './components/ArticleDetail';
import './index.css';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      const data = await fetchArticles();
      const sorted = data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      setArticles(sorted);
      setLoading(false);
    };
    loadArticles();
  }, []);

  if (loading) return <p>Loading articles...</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
      {articles.length === 0 && (
        <p>No articles found. Has the backend scraped anything yet?</p>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="app-container">
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1>BeyondChats Blog Improver</h1>
        <p style={{ color: '#94a3b8' }}>AI-Powered Content Enhancement Engine</p>
      </header>

      <Routes>
        <Route path="/" element={<ArticleList />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
      </Routes>
    </div>
  );
}

export default App;
