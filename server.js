const express = require("express");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch"); // import fetch
const app = express();

const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const memoryFile = path.join(__dirname, "memory.json");

function readMemory() {
  if (!fs.existsSync(memoryFile)) return {};
  return JSON.parse(fs.readFileSync(memoryFile, "utf8"));
}

function saveMemory(memory) {
  fs.writeFileSync(memoryFile, JSON.stringify(memory, null, 2));
}

async function askGrok(question) {
  const response = await fetch("https://api.grok.com/v1/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_GROK_API_KEY_HERE"
    },
    body: JSON.stringify({
      model: "grok-base",   // select your Grok model
      messages: [{ role: "user", content: question }]
    })
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Sorry, I couldn't get an answer.";
}

app.post("/ask", async (req, res) => {
  const { question, classLevel } = req.body;
  if (!question) return res.json({ answer: "Please ask a valid question." });

  const memory = readMemory();

  if (memory[question]) {
    return res.json({ answer: memory[question] });
  }

  try {
    const answer = await askGrok(question); // fetch answer from Grok API
    memory[question] = answer;
    saveMemory(memory);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.json({ answer: "Error fetching answer from Grok API." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log("Macro AI Server running on port", PORT);
});
