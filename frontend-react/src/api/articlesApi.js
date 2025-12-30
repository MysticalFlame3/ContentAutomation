import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const fetchArticles = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/articles`);
        return response.data;
    } catch (error) {
        console.error("Error fetching articles", error);
        return [];
    }
};

export const fetchArticleDetails = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/articles/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching article details", error);
        return null;
    }
};

export const triggerArticleImprovement = async (id) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/articles/${id}/improve`, {});
        return response.data;
    } catch (error) {
        console.error("Error triggering article improvement", error);
        return null;
    }
};
