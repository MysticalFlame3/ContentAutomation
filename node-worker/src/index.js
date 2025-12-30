const { fetchArticles, updateArticle } = require('./api/laravelClient');
const { getTopLinks } = require('./google/googleSearch');
const { scrapeContent } = require('./scraper/articleScraper');
const { rewriteArticle } = require('./llm/geminiClient');

const main = async () => {
    console.log("Starting Node Worker");

    // 1. Fetch articles from Laravel
    const articles = await fetchArticles();
    console.log(`Fetched ${articles.length} articles.`);

    for (const article of articles) {
        if (article.status === 'UPDATED') {
            console.log(`Skipping Article ${article.id} (already updated).`);
            continue;
        }

        console.log(`Processing Article: ${article.title}`);

        // 2. Search Google
        const topLinks = await getTopLinks(article.title);
        console.log(`Found ${topLinks.length} competitor links:`, topLinks);

        // 3. Scrape Competitors
        const referenceContents = [];
        for (const link of topLinks) {
            console.log(`Scraping ${link}...`);
            const content = await scrapeContent(link);
            if (content) referenceContents.push(content);
        }

        // 4. Gemini Rewrite
        console.log("Generating rewritten content with Gemini...");
        const newContent = await rewriteArticle(article.title, article.original_content, referenceContents, topLinks);

        // 5. Update Laravel
        console.log("Updating Laravel API...");
        await updateArticle(article.id, {
            updated_content: newContent,
            references: topLinks,
            status: 'UPDATED'
        });

        console.log(`Article ${article.id} updated successfully.\n`);
    }

    console.log("Worker finished.");
};

main();
