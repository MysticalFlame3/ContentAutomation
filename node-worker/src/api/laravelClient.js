const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.LARAVEL_API_URL || 'http://127.0.0.1:8000/api';

const fetchArticles = async () => {
    try {
        const response = await axios.get(`${API_URL}/articles`);
        return response.data;
    } catch (error) {
        console.error("Error fetching articles:", error.message);
        return [];
    }
};

const updateArticle = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/articles/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating article ${id}:`, error.message);
        return null;
    }
};

const fetchArticleById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/articles/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching article ${id}:`, error.message);
        return null;
    }
};

module.exports = { fetchArticles, fetchArticleById, updateArticle };
