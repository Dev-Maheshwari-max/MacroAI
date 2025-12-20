// server.js
import express from "express";
import cors from "cors";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.json({ reply: "Please ask a valid question." });
  }

  try {
    // 1️⃣ SEARCH Wikipedia
    const searchUrl =
      "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" +
      encodeURIComponent(message) +
      "&format=json";

    const searchRes = await axios.get(searchUrl);
    const results = searchRes.data.query.search;

    if (!results || results.length === 0) {
      return res.json({
        reply: "I couldn't find information on that topic."
      });
    }

    // 2️⃣ Get best page title
    const pageTitle = results[0].title;

    // 3️⃣ Fetch summary
    const summaryUrl =
      "https://en.wikipedia.org/api/rest_v1/page/summary/" +
      encodeURIComponent(pageTitle);

    const summaryRes = await axios.get(summaryUrl);

    res.json({
      reply: summaryRes.data.extract || "No summary available."
    });

  } catch (err) {
    console.error(err.message);
    res.json({
      reply: "Wikipedia service is temporarily unavailable. Try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ MacroAI running on port ${PORT}`);
});
