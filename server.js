const express = require("express");
const path = require("path");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// AI endpoint
app.post("/ask", (req, res) => {
  const question = req.body.question;
  if (!question) {
    return res.json({ answer: "Please ask a question." });
  }

  // Call Python AI
  exec(`python3 ai/ai.py "${question.replace(/"/g, "")}"`, (error, stdout) => {
    if (error) {
      console.error(error);
      return res.json({ answer: "AI failed to respond." });
    }
    res.json({ answer: stdout.trim() });
  });
});

// Fallback for Render (IMPORTANT)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log("Macro AI Server running on port", PORT);
});
