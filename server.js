/*****************************************************
 * Macro AI Server with DeepSeek R1
 * Made by DEV & MANAN SULYA
 * Uses OpenRouter free API (deepseek/deepseek-r1:free)
 *****************************************************/

const express = require("express");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 10000;

/* ================= Middleware ================= */
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ================= Memory System ================= */
const memoryFile = path.join(__dirname, "memory.json");

function readMemory() {
  if (!fs.existsSync(memoryFile)) return {};
  return JSON.parse(fs.readFileSync(memoryFile, "utf8"));
}

function saveMemory(memory) {
  fs.writeFileSync(memoryFile, JSON.stringify(memory, null, 2));
}

/* ================= DeepSeek R1 API ================= */
// ⚠️ API key included directly for testing
const OPENROUTER_API_KEY = "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";

async function askDeepSeek(question) {
  try {
    const res = await fetch("https://api.openrouter.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [{ role: "user", content: question }],
      }),
    });

    const data = await res.json();
    if (data.choices && data.choices[0].message.content) {
      return data.choices[0].message.content;
    } else {
      return "I couldn't get an answer from DeepSeek R1.";
    }
  } catch (err) {
    console.error("DeepSeek R1 API error:", err.message);
    return "Error reaching DeepSeek R1 API.";
  }
}

/* ================= AI Endpoint ================= */
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.json({ answer: "Please ask a valid question." });
  }

  const memory = readMemory();

  // Return from memory if known
  if (memory[question]) {
    return res.json({ answer: memory[question] });
  }

  // Ask DeepSeek R1
  const deepSeekAnswer = await askDeepSeek(question);

  // Save answer in memory
  memory[question] = deepSeekAnswer;
  saveMemory(memory);

  res.json({ answer: deepSeekAnswer });
});

/* ================= Fix Render Not Found ================= */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ================= Start Server ================= */
app.listen(PORT, () => {
  console.log("Macro AI Server running on port", PORT);
});
