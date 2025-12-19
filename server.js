const fetch = require("node-fetch"); // install with: npm install node-fetch

app.post("/ask", async (req, res) => {
    const { question, classLevel } = req.body;
    if (!question) return res.json({ answer: "Please ask a valid question." });

    const memory = readMemory();

    if (memory[question]) {
        return res.json({ answer: memory[question] });
    }

    try {
        // Example: fetch from OpenAI (replace with your key & endpoint)
        const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer YOUR_OPENAI_API_KEY"
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: question,
                max_tokens: 150
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
        res.json({ answer: "Sorry, I couldn't fetch an answer right now." });
    }
});
