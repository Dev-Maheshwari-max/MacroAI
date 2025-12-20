/*****************************************************
 * Macro AI Server
 * Made by DEV & MANAN SULYA
 * General-Purpose AI with Memory + Web Search
 *****************************************************/

const express = require("express");
const fs = require("fs");
const path = require("path");

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

/* ================= AI Logic ================= */
async function webSearch(query) {
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(
      query
    )}&format=json&no_html=1`;

    const res = await fetch(url);
    const data = await res.json();

    return (
      data.AbstractText ||
      data.Heading ||
      "I searched the web but couldn't find a clear answer."
    );
  } catch (err) {
    return "Web search failed.";
  }
}

/* ================= API ================= */
app.post("/ask", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.json({ answer: "Please ask something." });
  }

  const memory = readMemory();

  // If already learned
  if (memory[question]) {
    return res.json({
      answer: memory[question] + " (from memory)"
    });
  }

  // Search web
  const webAnswer = await webSearch(question);

  const finalAnswer =
    webAnswer ||
    `I am learning. I don't know much yet about "${question}".`;

  // Save learning
  memory[question] = finalAnswer;
  saveMemory(memory);

  res.json({ answer: finalAnswer });
});

/* ================= Fallback ================= */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ================= Start ================= */
app.listen(PORT, () => {
  console.log("Macro AI running on port", PORT);
});
