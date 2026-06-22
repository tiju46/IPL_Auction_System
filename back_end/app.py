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


@app.route("/players", methods=["GET"])
def get_players():
    return jsonify(load_json("players.json"))

@app.route("/players", methods=["POST"])
def add_player():
    try:
        data = request.json
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
        if "name" not in data or "role" not in data or "base_price" not in data:
            return jsonify({"success": False, "error": "Missing required fields"}), 400
               
        players = load_json("players.json")
        new_player = data
        print(new_player)
        new_player["id"] = len(players) + 1
        players.append(new_player)
        save_json("players.json", players)
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"success": False,"error": str(e)}), 500

@app.route("/players/<int:id>", methods=["PUT"])
def update_player(id):
    players = load_json("players.json")
    for p in players:
        if p["id"] == id:
            p.update(request.json)
            save_json("players.json", players)
            return jsonify({"success": True})
    return jsonify({"error": "Player not found"}), 404

@app.route("/players/<int:id>", methods=["DELETE"])
def delete_player(id):
    players = load_json("players.json")
    players = [p for p in players if p["id"] != id]
    save_json("players.json", players)
    return jsonify({"success": True})

@app.route("/assign", methods=["PUT"])
def assign_player():
    data = request.json
    player_id = data["player_id"]
    team_id = data["team_id"]

    players = load_json("players.json")

    for p in players:
        if p["id"] == player_id:
            p["team_id"] = team_id
            save_json("players.json", players)
            return jsonify({"success": True})

    return jsonify({"error": "Player not found"}), 404

@app.route("/teams", methods=["GET"])
def get_teams():
    return jsonify(load_json("teams.json"))

if __name__ == "__main__":
   app.run(debug=True)