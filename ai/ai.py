import json
import sys
import random
from pathlib import Path
import requests

MEMORY_FILE = Path(__file__).parent.parent / "memory.json"
SERPAPI_KEY = "YOUR_SERPAPI_KEY"  # Replace with your SerpAPI key

def load_memory():
    if not MEMORY_FILE.exists():
        return {}
    return json.loads(MEMORY_FILE.read_text())

def save_memory(memory):
    MEMORY_FILE.write_text(json.dumps(memory, indent=2))

def is_greeting(text):
    greetings = ["hi", "hello", "hey", "hii", "hola"]
    return text.lower().strip() in greetings

def search_internet(query):
    url = f"https://serpapi.com/search.json?q={query}&api_key={SERPAPI_KEY}"
    try:
        response = requests.get(url, timeout=5)
        data = response.json()
        # Try to get first snippet from results
        if "organic_results" in data and len(data["organic_results"]) > 0:
            snippet = data["organic_results"][0].get("snippet")
            if snippet:
                return snippet
    except Exception as e:
        print("Search error:", e)
    return None

def generate_answer(question):
    memory = load_memory()

    # Greetings
    if is_greeting(question):
        return random.choice([
            "Hello! 👋 How can I help you today?",
            "Hi! 😊 Ask me anything.",
            "Hey! I'm ready to help.",
        ])

    # Learned response
    if question in memory:
        return memory[question]

    # Try to get web answer
    web_answer = search_internet(question)
    if web_answer:
        answer = f"From the web: {web_answer}"
    else:
        # Fallback
        answer = (
            "That's an interesting question.\n\n"
            "I'm still learning, but here's my understanding:\n"
            f"{question.capitalize()} is something worth exploring deeper."
        )

    # Save to memory
    memory[question] = answer
    save_memory(memory)

    return answer

if __name__ == "__main__":
    question = sys.argv[1]
    print(generate_answer(question))
