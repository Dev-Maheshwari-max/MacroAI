/*****************************************************
 * Macro AI Server
 * Internet + Memory AI (NO API KEYS)
 * Made by DEV & MANAN SULYA
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

/* ================= Free Internet Search ================= */
async function searchInternet(question) {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(
    question
  )}&format=json&no_html=1&skip_disambig=1`;

  try {
    const response = await fetch(url); // ✅ Native fetch (Node 22)
    const data = await response.json();

    if (data.AbstractText) return data.AbstractText;
    if (data.Answer) return data.Answer;

    return `I found information related to "${question}", but no short summary was available.`;
  } catch (err) {
    return "I couldn't access the internet right now.";
  }
}

/* ================= AI Endpoint ================= */
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.json({ answer: "Please ask something 🙂" });
  }

  const memory = readMemory();

  // Use learned memory
  if (memory[question]) {
    return res.json({ answer: memory[question] });
  }

  // Search internet
  const answer = await searchInternet(question);

  // Learn
  memory[question] = answer;
  saveMemory(memory);

  res.json({ answer });
});

/* ================= Render Fix ================= */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ================= Start Server ================= */
app.listen(PORT, () => {
  console.log("Macro AI Server running on port", PORT);
});
