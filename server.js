const { execFile } = require("child_process");
const path = require("path");

app.post("/ask", (req, res) => {
  const { question, classLevel } = req.body;
  if (!question) return res.json({ answer: "Please ask a valid question." });

  const aiScript = path.join(__dirname, "ai", "ai.py");

  execFile("python3", [aiScript, question], (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return res.json({ answer: "Error processing the question." });
    }

    const answer = stdout.toString().trim();
    res.json({ answer });
  });
});
