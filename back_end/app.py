import datetime
from flask import Flask, request, jsonify
import json
import os
from flask_cors import CORS
from google.cloud import storage
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
CORS(app)

BUCKET_NAME = "ipl-auction-data"   # <--  bucket name

client = storage.Client()
bucket = client.bucket(BUCKET_NAME)

def load_json(filename):
    blob = bucket.blob(filename)
    data = blob.download_as_text()
    return json.loads(data)

def save_json(filename, data):
    blob = bucket.blob(filename)
    blob.upload_from_string(
        json.dumps(data, indent=4),
        content_type="application/json"
    )


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    users = load_json("users.json")

    for u in users:
        if u["username"] == username:
            if check_password_hash(u["password"], password):
                return jsonify({"success": True})
            else:
                return jsonify({"success": False}), 401

    return jsonify({"success": False}), 401



@app.route("/players", methods=["GET"])
def get_players():
    players = load_json("players.json")
    print("DEBUG: PLAYERS LOADED =", players)
    return jsonify(players)

@app.route("/players", methods=["POST"])
def add_player():
    try:
        data = request.json
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
        
        name = data.get("name")
        role = data.get("role")
        base_price = data.get("base_price")
        image = data.get("image") or "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"

        if not name or not role or not base_price:
            return jsonify({"success": False, "error": "Missing required fields"}), 400

        players = load_json("players.json")

        new_player = {
            "id": len(players) + 1,
            "name": name,
            "role": role,
            "base_price": base_price,
            "team": None,
            "image": image
        }
        players.append(new_player)
        save_json("players.json", players)
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

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

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    name = data.get("name")
    email = data.get("email")
    if not username or not password:
        return jsonify({"success": False, "error": "Missing fields"}), 400
    users = load_json("users.json")

    
    for u in users:
        if u["username"] == username:
            return jsonify({"success": False, "error": "User already exists"}), 409
   
    hashed = generate_password_hash(password)
    time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    new_user = {
        "username": username,
        "password": hashed,
        "name": name,
        "email": email,
        "role": "Administrator",
        "last_login": time,
        "avatar": "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
    }

    users.append(new_user)
    save_json("users.json", users)

    return jsonify({"success": True}), 200

@app.route("/admin/profile", methods=['GET'])
def admin_profile():
    admin_data = load_json("users.json")
    return jsonify(admin_data)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)