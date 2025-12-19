/*****************************************************
 *  Macro AI Server
 *  Made by DEV & MANAN SULYA
 *
 *  This server:
 *  - Serves the frontend (index.html, CSS, JS)
 *  - Handles AI questions via /ask API
 *  - Stores basic learning memory in memory.json
 *****************************************************/

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Render provides PORT automatically
const PORT = process.env.PORT || 10000;

/* ================================
   Middleware
================================ */

// Allows server to read JSON from requests
app.use(express.json());

// ✅ VERY IMPORTANT
// This makes index.html accessible at "/"
app.use(express.static(path.join(__dirname, "public")));

/* ================================
   Simple Learning Memory System
================================ */

const memoryFile = path.join(__dirname, "memory.json");

// Read stored memory
function readMemory() {
  if (!fs.existsSync(memoryFile)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(memoryFile, "utf8"));
}

// Save memory back to file
function saveMemory(memory) {
  fs.writeFileSync(memoryFile, JSON.stringify(memory, null, 2));
}

/* ================================
   AI Question Endpoint
================================ */

app.post("/ask", (req, res) => {
  const { question, classLevel } = req.body;

  if (!question) {
    return res.json({
      answer: "Please ask a valid question."
    });
  }

  const memory = readMemory();

  // If AI has seen this question before, reuse answer
  if (memory[question]) {
    return res.json({
      answer: memory[question]
    });
  }

  // New question → generate simple response
  const answer =
    `This is a class ${classLevel || "general"} level explanation of "${question}".`;

  // Store learned response
  memory[question] = answer;
  saveMemory(memory);

  res.json({ answer });
});

/* ================================
   Fallback Route
   (Fixes Render Not Found issue)
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
