import json
import sys
import random
from pathlib import Path

MEMORY_FILE = Path(__file__).parent.parent / "memory.json"

def load_memory():
    if not MEMORY_FILE.exists():
        return {}
    return json.loads(MEMORY_FILE.read_text())

def save_memory(memory):
    MEMORY_FILE.write_text(json.dumps(memory, indent=2))

def is_greeting(text):
    greetings = ["hi", "hello", "hey", "hii", "hola"]
    return text.lower().strip() in greetings

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

    # Natural AI response
    answer = (
        "That's an interesting question.\n\n"
        "I'm still learning, but here's my understanding:\n"
        f"{question.capitalize()} is something worth exploring deeper."
    )

    # Learn from this interaction
    memory[question] = answer
    save_memory(memory)

    return answer

if __name__ == "__main__":
    question = sys.argv[1]
    print(generate_answer(question))
