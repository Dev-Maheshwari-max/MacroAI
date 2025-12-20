const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ MacroAI server is running");
});

app.post("/ask", async (req, res) => {
  try {
    const question = req.body.question;

    if (!question) {
      return res.json({ answer: "Please ask a valid question." });
    }

    const url =
      "https://en.wikipedia.org/api/rest_v1/page/summary/" +
      encodeURIComponent(question);

    const response = await fetch(url, {
      headers: { "User-Agent": "MacroAI/1.0" }
    });

    if (!response.ok) {
      return res.json({
        answer: "I couldn't find a reliable answer yet. Try rephrasing."
      });
    }

    const data = await response.json();

    res.json({
      answer: data.extract || "No clear answer found."
    });
  } catch (err) {
    res.json({ answer: "Internet error. Try again." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 MacroAI running on port", PORT);
});
