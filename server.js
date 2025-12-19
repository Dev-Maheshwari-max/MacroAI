/*
  Macro AI Server
  Made by DEV & MANAN SULYA

  This server:
  - Handles login
  - Stores chat history
  - Learns from questions
  - Answers based on memory
*/

const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* ---------- LOAD MEMORY ---------- */
function loadMemory() {
  return JSON.parse(fs.readFileSync("memory.json", "utf-8"));
}

function saveMemory(data) {
  fs.writeFileSync("memory.json", JSON.stringify(data, null, 2));
}

/* ---------- UTILITIES ---------- */
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}

/* ---------- LOGIN ---------- */
app.post("/login", (req, res) => {
  const { username } = req.body;
  const memory = loadMemory();

  if (!memory.users[username]) {
    memory.users[username] = {
      chats: []
    };
    saveMemory(memory);
  }

  res.json({ success: true });
});

/* ---------- ASK AI ---------- */
app.post("/ask", (req, res) => {
  const { username, question, classLevel } = req.body;
  const memory = loadMemory();

  const cleanQ = normalize(question);

  let answer;

  // If AI already learned this question
  if (memory.knowledge[cleanQ]) {
    answer = memory.knowledge[cleanQ];
  } else {
    // Basic intelligence fallback
    answer =
      `I am Macro AI. Based on class ${classLevel}, ` +
      `this topic relates to "${question}". ` +
      `I will remember this and improve over time.`;

    // Learn new answer
    memory.knowledge[cleanQ] = answer;
  }

  // Save chat history
  memory.users[username].chats.push({
    question,
    answer,
    time: new Date().toISOString()
  });

  saveMemory(memory);

  res.json({ answer });
});

/* ---------- CHAT HISTORY ---------- */
app.post("/history", (req, res) => {
  const { username } = req.body;
  const memory = loadMemory();

  res.json({
    chats: memory.users[username]?.chats || []
  });
});

/* ---------- START SERVER ---------- */
app.listen(PORT, () => {
  console.log("Macro AI Server running on port " + PORT);
});
