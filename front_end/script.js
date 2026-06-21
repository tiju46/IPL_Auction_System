console.log("LOGIN FUNCTION CALLED");

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("http://127.0.0.1:5000/login", {
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
const API = "http://127.0.0.1:5000";
