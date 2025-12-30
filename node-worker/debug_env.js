require('dotenv').config();

console.log("Checking Environment Variables...");
if (process.env.GROQ_API_KEY) {
    console.log("GROQ_API_KEY is SET.");
} else {
    console.log("GROQ_API_KEY is NOT set.");
}

if (process.env.GEMINI_API_KEY) {
    console.log("GEMINI_API_KEY is SET.");
} else {
    console.log("GEMINI_API_KEY is NOT set.");
}
