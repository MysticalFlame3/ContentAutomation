const { getTopLinks } = require('./google/googleSearch');

const runTest = async () => {
    const query = "best crm for small business 2024";
    console.log(`Testing Google Search with query: "${query}"...`);

    try {
        const links = await getTopLinks(query);
        console.log("Found links:", links);

        if (links.length > 0) {
            console.log("SUCCESS: Search returned results.");
        } else {
            console.log("WARNING: Search returned no results. Check selectors or blocking.");
        }
    } catch (error) {
        console.error("Test failed:", error);
    }
};

runTest();
