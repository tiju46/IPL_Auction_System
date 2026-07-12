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

                    <td class="player-cell">
                    <img class="player-img" src="${p.image || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'}"
                    onclick="openImageModal('${p.image}')">
                    <input class="player-cellinput" id="name_${p.id}" value="${p.name}">
                    </td>

                    <td>
                    <span class="role-badge ${roleClass}">
                    ${p.role}
                    </span>
                    <input id="role_${p.id}" value="${p.role}" style="display:none;">
                    </td>

                    <td><input class="price-input" id="price_${p.id}" value="${p.base_price}"></td>

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

                    <td class="player-cell">
                    <img class="player-img" src="${p.image || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'}"
                    onclick="openImageModal('${p.image}')">
                    
                    <span class="player-name">${p.name}</span>

                    </td>

                    <td>
                    <span class="role-badge ${roleClass}">
                    ${p.role}
                    </span>
                    <input id="role_${p.id}" value="${p.role}" style="display:none;">
                    </td>

                    <td><span class="price-input">${p.base_price}</span></td>
                    

                    <td>${p.team_id ? p.team_id : "None"}</td>
                </tr>
        `;
    });

    }
}
function filterPlayers(value) {
    const query = document.getElementById("searchBox").value.toLowerCase();
    console.log("Query:", query);
    console.log("All players:", allPlayers);
    const filtered = allPlayers.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.role.toLowerCase().includes(query)
    );

    console.log("Filtered players:", filtered);
    displayPlayers(filtered, value);
}

// ---------------- ADD PLAYER ----------------
function addPlayer() {
    const name = document.getElementById("name").value;
    const role = document.getElementById("role").value;
    const base_price = document.getElementById("base_price").value;
    const image = document.getElementById("playerImage").value;

    fetch(`${API}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, base_price, image })
    })
    .then(res => res.json())
    .then(() => {
        loadPlayers();
        alert("Player added!");
        loadPlayers();             
        setTimeout(() => {
            window.location.reload();   
        }, 200);
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

// ---------------- UPDATE PLAYER ----------------
function updatePlayer(id) {
    const name = document.getElementById(`name_${id}`).value;
    const role = document.getElementById(`role_${id}`).value;
    const base_price = document.getElementById(`price_${id}`).value;

    fetch(`${API}/players/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, base_price })
    })
    .then(res => res.json())
    .then(() => {
        alert("Player updated!");
        loadPlayers();
    });
}

// ---------------- DELETE PLAYER ----------------
function deletePlayer(id) {
    fetch(`${API}/players/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(() => {
        alert("Player deleted!");
        loadPlayers();              // refresh table
        setTimeout(() => {
            window.location.reload();   // fallback refresh
        }, 200);
    });
}

if (window.location.pathname.includes("players.html")) {
    loadPlayers();
}

function openImageModal(src) {
    document.getElementById("modalImage").src = src;
    document.getElementById("imageModal").style.display = "block";
}

function closeImageModal() {
    document.getElementById("imageModal").style.display = "none";
}

// ---------------- LOAD TEAMS + PLAYERS FOR ASSIGNMENT ----------------
function loadTeamAssignment() {
    let teamsList = [];

    // Load teams first
    fetch(`${API}/teams`)
        .then(res => res.json())
        .then(teams => {
            teamsList = teams;

            // Populate team dropdown
            const teamSelect = document.getElementById("teamSelect");
            teamSelect.innerHTML = "";
            teams.forEach(t => {
                teamSelect.innerHTML += `<option value="${t.id}">${t.team_name}</option>`;
            });

            // Now load players
            return fetch(`${API}/players`);
        })
        .then(res => res.json())
        .then(players => {
            const playerSelect = document.getElementById("playerSelect");
            const teamTable = document.getElementById("teamTable");

            playerSelect.innerHTML = "";
            teamTable.innerHTML = "";

            players.forEach(p => {
                // Find team name
                const team = teamsList.find(t => t.id === p.team_id);
                const teamName = team ? team.team_name : "None";

                // Fill dropdown
                playerSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;

                // Fill table
                teamTable.innerHTML += `
                    <tr>
                        <td>${p.id}</td>
                        <td>${p.name}</td>
                        <td>${p.role}</td>
                        <td>${p.base_price}</td>
                        <td>${teamName}</td>
                    </tr>
                `;
            });
        });


    // Load teams
    fetch(`${API}/teams`)
        .then(res => res.json())
        .then(teams => {
            const teamSelect = document.getElementById("teamSelect");
            teamSelect.innerHTML = "";

            teams.forEach(t => {
                teamSelect.innerHTML += `<option value="${t.id}">${t.team_name}</option>`;
            });
        });
}

// Auto-load when teams.html opens
if (window.location.pathname.includes("teams.html")) {
    loadTeamAssignment();
}