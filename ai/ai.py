from flask import Flask, request, jsonify
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch

app = Flask(__name__)

tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    prompt = data.get("prompt", "")

    if not prompt:
        return jsonify({"response": "Please ask something."})

    inputs = tokenizer.encode(prompt, return_tensors="pt")
    outputs = model.generate(
        inputs,
        max_length=150,
        do_sample=True,
        temperature=0.7,
        top_p=0.9
    )

    text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return jsonify({"response": text})

if __name__ == "__main__":
    app.run(port=5000)
