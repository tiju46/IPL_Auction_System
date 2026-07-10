console.log("LOGIN FUNCTION CALLED");
const API = "https://ipl-auction-system-623648546215.europe-west1.run.app";

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            window.location.replace("players.html");
        } else {
            document.getElementById("message").innerText = "Invalid username or password";
        }
    })
    .catch(err => {
        document.getElementById("message").innerText = "Server error";
        console.error(err);
    });
}

let allPlayers = []; // store players globally
// ---------------- LOAD PLAYERS ----------------
function loadPlayers(value) {
    fetch(`${API}/players`)
        .then(res => res.json())
        .then(players => {
            allPlayers = players; // save full list
            displayPlayers(players, value);
        });
}
function displayPlayers(players, value) {
    const table = document.getElementById("playerTable");
    const table1 = document.getElementById("HomeplayerTable");
    //console.log(table.id);
    //console.log(value);
    if (value == "player") {       
        table.innerHTML = ""; 
        players.forEach(p => {
            let roleClass = "role-batsman";
            if (p.role.toLowerCase().includes("bowl")) roleClass = "role-bowler";
            if (p.role.toLowerCase().includes("all")) roleClass = "role-allrounder";

            table.innerHTML += `
                <tr>
                    <td>${p.id}</td>

                    <td><input id="name_${p.id}" value="${p.name}"></td>

                    <td>
                        <span class="role-badge ${roleClass}">
                        ${p.role}
                        </span>
                        <input id="role_${p.id}" value="${p.role}" style="display:none;">
                    </td>

                    <td><input id="price_${p.id}" value="${p.base_price}"></td>

                    <td>${p.team_id ? p.team_id : "None"}</td>

                    <td>
                        <button class="action-btn update" onclick="updatePlayer(${p.id})">✏️</button>
                        <button class="action-btn delete" onclick="deletePlayer(${p.id})">🗑️</button>
                    </td>
                </tr>
            `;
        });
    }
    else if (value == "home") {
        console.log(table1.id);
        table1.innerHTML = "";
        players.forEach(p => {
        let roleClass = "role-batsman";
        if (p.role.toLowerCase().includes("bowl")) roleClass = "role-bowler";
        if (p.role.toLowerCase().includes("all")) roleClass = "role-allrounder";

        table1.innerHTML += `
            <tr>
                <td>${p.id}</td>

                <td><input id="name_${p.id}" value="${p.name}"></td>

                <td>
                    <span class="role-badge ${roleClass}">
                        ${p.role}
                    </span>
                    <input id="role_${p.id}" value="${p.role}" style="display:none;">
                </td>

                <td><input id="price_${p.id}" value="${p.base_price}"></td>

                <td>${p.team_id ? p.team_id : "None"}</td>
            </tr>
        `;
    });

    }
}
function filterPlayers() {
    const query = document.getElementById("searchBox").value.toLowerCase();

    const filtered = allPlayers.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.role.toLowerCase().includes(query)
    );

    displayPlayers(filtered);
}

// ---------------- ADD PLAYER ----------------
function addPlayer() {
    const name = document.getElementById("name").value;
    const role = document.getElementById("role").value;
    const base_price = document.getElementById("base_price").value;

    fetch(`${API}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, base_price })
    })
    .then(res => res.json())
    .then(() => {
        loadPlayers();
        alert("Player added!");
    })
    .catch(err => {
    console.error("API ERROR:", err);
    alert("Failed to add player. Please check your backend.");
    });
}
// ---------------- SIGN UP ----------------
function signup() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Account created! You can now login.");
            window.location.replace("login.html");
        } else {
            document.getElementById("message").innerText = data.error || "Signup failed";
        }
    })
    .catch(err => {
        console.error(err);
        document.getElementById("message").innerText = "Server error";
    });
}