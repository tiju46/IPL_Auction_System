from flask import Flask, request, jsonify
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def load_json(filename):
    with open(filename, "r") as f:
        return json.load(f)

def save_json(filename, data):
    with open(filename, "w") as f:
        json.dump(data, f, indent=4)

@app.route("/login", methods=["POST"])
def login():
    admin = load_json("admin.json")
    data = request.json

    if data["username"] == admin["username"] and data["password"] == admin["password"]:
        return jsonify({"success": True})
    return jsonify({"success": False}), 401