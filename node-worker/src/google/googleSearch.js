const axios = require('axios');
const cheerio = require('cheerio');

const getTopLinks = async (query) => {
    try {
        const response = await axios.get(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });

        const $ = cheerio.load(response.data);
        const links = [];

        $('.result__a').each((i, el) => {
            const link = $(el).attr('href');
            if (link && link.startsWith('http') && !link.includes('duckduckgo.com') && !link.includes('yandex')) {
                
                try {
                    const urlObj = new URL(link);
                    links.push(link);
                } catch (e) {
                }
            }
        });

      
        let uniqueLinks = [...new Set(links)];

        uniqueLinks = uniqueLinks.filter(link => !link.toLowerCase().endsWith('.pdf'));
        const scoredLinks = uniqueLinks.map(link => {
            let score = 0;
            const lower = link.toLowerCase();
            if (lower.includes('/blog') || lower.includes('/article') || lower.includes('/news') || lower.includes('/post')) score += 10;

            try {
                const urlObj = new URL(link);
                if (urlObj.pathname === '/' || urlObj.pathname.length < 2) score -= 5;
            } catch (e) { }

            return { link, score };
        });

        scoredLinks.sort((a, b) => b.score - a.score);

        return scoredLinks.map(item => item.link).slice(0, 2);
    } catch (error) {
        console.error("Search failed or blocked:", error.message);
        return [];
    }
};

module.exports = { getTopLinks };
