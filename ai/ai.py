import json
import sys
from pathlib import Path

MEMORY_FILE = Path(__file__).parent.parent / "memory.json"

def load_memory():
    if not MEMORY_FILE.exists():
        return {}
    return json.loads(MEMORY_FILE.read_text())

def save_memory(memory):
    MEMORY_FILE.write_text(json.dumps(memory, indent=2))

def generate_answer(question):
    memory = load_memory()

    # Reuse learned answer
    if question in memory:
        return memory[question]

    # Basic AI response (can be upgraded later)
    answer = (
        "I am a general-purpose AI. "
        "I learn from users over time.\n\n"
        f"You asked: {question}"
    )

    memory[question] = answer
    save_memory(memory)
    return answer

if __name__ == "__main__":
    question = sys.argv[1]
    print(generate_answer(question))
