/*****************************************************
 * Macro AI Server
 * Made by DEV & MANAN SULYA
 * Internet-powered AI (No API Key)
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

/* ================= Internet Search ================= */
async function searchInternet(query) {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(
    query
  )}&format=json&no_html=1&skip_disambig=1`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.AbstractText) return data.AbstractText;
    if (data.Answer) return data.Answer;

    return "I couldn't find a clear answer, but I'm learning.";
  } catch (err) {
    return "Error reaching the internet.";
  }
}

/* ================= AI Endpoint ================= */
app.post("/ask", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.json({ answer: "Please ask a valid question." });
  }

  const memory = readMemory();

  // Use memory if known
  if (memory[question]) {
    return res.json({ answer: memory[question] });
  }

  // Search internet
  const internetAnswer = await searchInternet(question);

  // Save learning
  memory[question] = internetAnswer;
  saveMemory(memory);

  res.json({
    answer: internetAnswer,
  });
});

/* ================= Fix Render Not Found ================= */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ================= Start Server ================= */
app.listen(PORT, () => {
  console.log("Macro AI Server running on port", PORT);
});
