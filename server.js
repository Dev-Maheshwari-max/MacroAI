/*****************************************************
 * Macro AI Server
 * Made by DEV & MANAN SULYA
 *
 * - Serves frontend
 * - Connects to GPT-2 Python AI
 * - Stores chat memory
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

/* ================= Memory ================= */
const memoryFile = path.join(__dirname, "memory.json");

function readMemory() {
  if (!fs.existsSync(memoryFile)) return [];
  return JSON.parse(fs.readFileSync(memoryFile, "utf8"));
}

function saveMemory(data) {
  fs.writeFileSync(memoryFile, JSON.stringify(data, null, 2));
}

/* ================= AI Endpoint ================= */
app.post("/ask", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.json({ answer: "Ask something first." });
  }

  const memory = readMemory();
  memory.push({ role: "user", content: question });

  try {
    const aiRes = await fetch("http://127.0.0.1:5000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: question })
    });

    const data = await aiRes.json();
    memory.push({ role: "ai", content: data.response });
    saveMemory(memory);

    res.json({ answer: data.response });

  } catch (err) {
    res.json({ answer: "AI backend not running." });
  }
});

/* ================= Fallback ================= */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ================= Start ================= */
app.listen(PORT, () => {
  console.log("Macro AI Server running on port", PORT);
});
