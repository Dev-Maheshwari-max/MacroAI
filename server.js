/*****************************************************
 * Macro AI Server
 * Made by DEV & MANAN SULYA
 * Internet-powered learning AI
 *****************************************************/

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ================= MEMORY ================= */

const memoryFile = path.join(__dirname, "memory.json");

function readMemory() {
  if (!fs.existsSync(memoryFile)) return {};
  return JSON.parse(fs.readFileSync(memoryFile, "utf8"));
}

function saveMemory(mem) {
  fs.writeFileSync(memoryFile, JSON.stringify(mem, null, 2));
}

/* ================= WIKIPEDIA SEARCH ================= */

async function searchWikipedia(query) {
  const url =
    "https://en.wikipedia.org/api/rest_v1/page/summary/" +
    encodeURIComponent(query);

  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.extract) return data.extract;
    return null;
  } catch {
    return null;
  }
}

/* ================= AI ENDPOINT ================= */

app.post("/ask", async (req, res) => {
  const question = req.body.question?.toLowerCase();
  if (!question) {
    return res.json({ answer: "Ask something valid." });
  }

  const memory = readMemory();

  // 1️⃣ Memory check
  if (memory[question]) {
    return res.json({ answer: memory[question] });
  }

  // 2️⃣ Internet search
  const wikiAnswer = await searchWikipedia(question);

  if (wikiAnswer) {
    memory[question] = wikiAnswer;
    saveMemory(memory);
    return res.json({ answer: wikiAnswer });
  }

  // 3️⃣ Fallback
  const fallback =
    "I couldn't find a reliable answer yet. Try rephrasing the question.";

  return res.json({ answer: fallback });
});

/* ================= FALLBACK ================= */

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ================= START ================= */

app.listen(PORT, () => {
  console.log("Macro AI running on port", PORT);
});
