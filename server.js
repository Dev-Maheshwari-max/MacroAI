// server.js
import express from "express";
import cors from "cors";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const query = encodeURIComponent(message);
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${query}`;

    const response = await axios.get(wikiUrl);
    const data = response.data;

    let reply;

    if (data.extract) {
      reply = data.extract;
    } else {
      reply = "I couldn't find information on that topic. Could you please rephrase your question?";
    }

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.json({
      reply:
        "I encountered an error while fetching information. Please try again with a different query.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`MacroAI server is running on port ${PORT}`);
});
