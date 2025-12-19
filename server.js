/*****************************************************
 * Macro AI Server
 * Made by DEV & MANAN SULYA
 *
 * Features:
 * - Serves frontend (HTML, CSS, JS)
 * - Handles /ask AI endpoint
 * - Stores learning memory in memory.json
 *****************************************************/

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

/* ================================
   PORT (Render compatible)
================================ */
const PORT = process.env.PORT || 10000;

/* ================================
   Middleware
================================ */
// Allow JSON body parsing
app.use(express.json());

// Serve frontend from /public folder
app.use(express.static(path.join(__dirname, "public")));

/* ================================
   Learning Memory System
================================ */
const memoryFile = path.join(__dirname, "memory.json");

function readMemory() {
  if (!fs.existsSync(memoryFile)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(memoryFile, "utf8"));
}

function saveMemory(memory) {
  fs.writeFileSync(memoryFile, JSON.stringify(memory, null, 2));
}

/* ================================
   AI Endpoint
================================ */
app.post("/ask", (req, res) => {
  const { question, classLevel } = req.body;

  if (!question) {
    return res.json({ answer: "Please ask a valid question." });
  }

  const memory = readMemory();

  // Reuse learned answer if exists
  if (memory[question]) {
    return res.json({ answer: memory[question] });
  }

  // Generate simple AI-style response
  const answer = `This is a class ${classLevel || "general"} level explanation of "${question}".`;

  // Learn from this interaction
  memory[question] = answer;
  saveMemory(memory);

  res.json({ answer });
});

/* ================================
   Fallback Route (IMPORTANT)
   Fixes Render "Not Found"
================================ */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ================================
   Start Server
================================ */
app.listen(PORT, () => {
  console.log("Macro AI Server running on port", PORT);
});
