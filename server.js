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

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Clean the query
    const cleanQuery = message
      .trim()
      .replace(/\s+/g, "_")      // Replace spaces with underscores for Wikipedia
      .replace(/[^a-zA-Z0-9_]/g, ""); // Remove special characters

    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanQuery)}`;

    const response = await axios.get(wikiUrl, { timeout: 5000 }); // Add timeout
    const data = response.data;

    let reply;

    if (data.extract) {
      reply = data.extract;
    } else {
      reply =
        "I couldn't find information on that topic. Please try a slightly different query.";
    }

    res.json({ reply });
  } catch (error) {
    console.error(error.message);
    res.json({
      reply:
        "I encountered an error while fetching information. Please try again with a different query.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`MacroAI server is running on port ${PORT}`);
});
