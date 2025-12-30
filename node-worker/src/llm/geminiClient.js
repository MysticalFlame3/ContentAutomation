const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.GROQ_API_KEY;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const rewriteArticle = async (originalTitle, originalContent, referenceContents, referenceLinks) => {
    if (!apiKey) {
        console.error("GROQ_API_KEY is not set.");
        return originalContent;
    }

    const systemPrompt = `You are an expert article editor.
    Your task is to improve the original article by aligning its structure, depth, and formatting style with the competitor articles, while keeping facts original and avoiding plagiarism.
    
    Guidelines:
    1. Make it comprehensive and engaging.
    2. Use insights from competitors to enrich the content (e.g., missing subtopics).
    3. Maintain the original core topic and facts.
    4. Format nicely with HTML (<h2>, <h3>, <ul>, <p>).
    5. Do NOT include a "References" section in the output. This will be added automatically by the system.
    6. Output ONLY the HTML body content.`;

    const userPrompt = `
    Article Title: ${originalTitle}
    
    Original Content:
    ${originalContent.substring(0, 2000)}

    Competitor Article 1:
    URL: ${referenceLinks && referenceLinks[0] ? referenceLinks[0] : 'N/A'}
    Content:
    ${referenceContents[0] || 'N/A'}

    Competitor Article 2:
    URL: ${referenceLinks && referenceLinks[1] ? referenceLinks[1] : 'N/A'}
    Content:
    ${referenceContents[1] || 'N/A'}
    `;

    const models = [
        "llama-3.3-70b-versatile",
        "mixtral-8x7b-32768",
        "llama-3.1-8b-instant"
    ];

    for (const model of models) {
        try {
            console.log(`Generating content with Groq (${model})...`);
            const response = await axios.post(API_URL, {
                model: model,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                stream: false,
                temperature: 0.7
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data.choices && response.data.choices.length > 0) {
                return response.data.choices[0].message.content;
            }
        } catch (error) {
            console.error(`Groq API Error (${model}):`, error.response ? error.response.data.error.message : error.message);
            // Continue to next model
        }
    }

    console.error("All models failed.");
    return null; // Return null to indicate failure
};

module.exports = { rewriteArticle };
