let currentUser = "";

const chat = document.getElementById("chat");

async function login() {
  const username = document.getElementById("username").value;
  if (!username) return;

  await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  });

  currentUser = username;
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");

  loadHistory();
}

async function loadHistory() {
  const res = await fetch("/history", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: currentUser })
  });

  const data = await res.json();
  data.chats.forEach(c => {
    chat.innerHTML += `<div class="msg user">You: ${c.question}</div>`;
    chat.innerHTML += `<div class="msg ai">Macro AI: ${c.answer}</div>`;
  });
}

async function ask() {
  const q = document.getElementById("q");
  const question = q.value;
  if (!question) return;

  const classLevel = document.getElementById("classLevel").value;

  chat.innerHTML += `<div class="msg user">You: ${question}</div>`;
  q.value = "";

  const res = await fetch("/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: currentUser,
      question,
      classLevel
    })
  });

  const data = await res.json();
  chat.innerHTML += `<div class="msg ai">Macro AI: ${data.answer}</div>`;
  chat.scrollTop = chat.scrollHeight;
}
