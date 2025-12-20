async function ask() {
  const input = document.getElementById("q");
  const question = input.value.trim();
  if (!question) return;

  chat.innerHTML += `<div class="msg user">You: ${question}</div>`;
  input.value = "";

  const res = await fetch("/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  const data = await res.json();
  chat.innerHTML += `<div class="msg ai">Macro AI: ${data.answer}</div>`;
}
