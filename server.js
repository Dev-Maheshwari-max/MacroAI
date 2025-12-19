/*****************************************************
 * Macro AI Server – Online + Memory Learning
 * Made by DEV & MANAN SULYA
 *****************************************************/

const express = require("express");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch"); // fetch API
const app = express();
const PORT = process.env.PORT || 10000;

/* ================================ Middleware ================================ */
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ================================ Memory System ================================ */
const memoryFile = path.join(__dirname, "memory.json");

function readMemory() {
    if (!fs.existsSync(memoryFile)) return {};
    return JSON.parse(fs.readFileSync(memoryFile, "utf8"));
}

function saveMemory(memory) {
    fs.writeFileSync(memoryFile, JSON.stringify(memory, null, 2));
}

/* ================================ AI Question Endpoint ================================ */
app.post("/ask", async (req, res) => {
    const { question, classLevel } = req.body;
    if (!question) return res.json({ answer: "Please ask a valid question." });

    const memory = readMemory();

    // Check memory first
    if (memory[question]) {
        return res.json({ answer: memory[question] });
    }

    try {
        // Fetch answer from OpenAI API (replace with your key)
        const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer YOUR_OPENAI_API_KEY"
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: question,
                max_tokens: 200
            })
        });

        const data = await response.json();
        const answer = data.choices[0].text.trim();

        // Save to memory
        memory[question] = answer;
        saveMemory(memory);

        res.json({ answer });
    } catch (error) {
        console.error(error);
        res.json({ answer: "Sorry, I couldn't fetch an answer from the internet." });
    }
});

/* ================================ Fallback Route ================================ */
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ================================ Start Server ================================ */
app.listen(PORT, () => {
    console.log("Macro AI Server running on port", PORT);
});
