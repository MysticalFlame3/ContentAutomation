const { fetchArticles, fetchArticleById, updateArticle } = require('./api/laravelClient');
const { getTopLinks } = require('./google/googleSearch');
const { scrapeContent } = require('./scraper/articleScraper');
const { rewriteArticle } = require('./llm/geminiClient');

const main = async () => {
    console.log("Starting Node Worker");

    const targetId = process.argv[2];
    let articles = [];

    if (targetId) {
        console.log(`Targeting specific article ID: ${targetId}`);
        const article = await fetchArticleById(targetId);
        if (article) {
            articles = [article];
        } else {
            console.error(`Article ${targetId} not found.`);
            process.exit(1);
        }
    } else {
        // 1. Fetch all articles from Laravel
        articles = await fetchArticles();
        console.log(`Fetched ${articles.length} articles.`);
    }

    for (const article of articles) {
      

        if (!targetId && article.status === 'UPDATED') {
            console.log(`Skipping Article ${article.id} (already updated).`);
            continue;
        }

        console.log(`Processing Article: ${article.title}`);

        const topLinks = await getTopLinks(article.title);
        console.log(`Found ${topLinks.length} competitor links:`, topLinks);

        const referenceContents = [];
        for (const link of topLinks) {
            console.log(`Scraping ${link}...`);
            const content = await scrapeContent(link);
            if (content) referenceContents.push(content);
        }

        console.log("Generating rewritten content with LLM...");
        const newContent = await rewriteArticle(article.title, article.original_content, referenceContents, topLinks);

        if (!newContent) {
            console.error(`Failed to generate content for Article ${article.id}. Reverting status.`);
            await updateArticle(article.id, {
                status: 'ORIGINAL'
            });
            continue;
        }

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
