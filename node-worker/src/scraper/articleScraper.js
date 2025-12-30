const axios = require('axios');
const cheerio = require('cheerio');

const scrapeContent = async (url) => {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
            }
        });
        const $ = cheerio.load(response.data);

        // Remove scripts, styles
        // Remove non-content elements
        $('script, style, nav, footer, header, .ad, .advertisement, .sidebar, .menu').remove();

        // 3. Scrape main content smart selector
        let content = $('article').text();
        if (!content || content.length < 200) content = $('main').text();
        if (!content || content.length < 200) content = $('.content').text();
        if (!content || content.length < 200) content = $('.post-content').text();
        if (!content || content.length < 200) content = $('body').text();
        const text = content.replace(/\s+/g, ' ').trim();
        return text.substring(0, 5000); // Limit context window
    } catch (error) {
        console.error(`Failed to scrape ${url}:`, error.message);
        return "";
    }
};

module.exports = { scrapeContent };
