# IPL Auction Tracking System  
A full‑stack web application designed to simulate and manage IPL‑style player auctions.  
The system includes user authentication, admin management tools, player CRUD operations, team assignment workflows, and a fan‑friendly homepage.
---

# Table of Contents

1. Overview  
2. System Architecture  
3. Frontend Pages  
   - Home Page (index.html)  
   - Login Page  
   - Create Account Page  
   - Admin Profile Page  
   - Change Password  
   - Players Page  
   - Add / Edit / Delete Player  
   - Assign Player to Team  
   - Teams Page  
4. Backend Architecture  
5. JSON Database Structure  
6. Cloud Deployment (Cloud Run + Cloud Storage)   
7. References  

---

# 1.  Overview

The IPL Auction System is a cloud‑hosted web application that allows:

- Users to create accounts  
- Admins to manage players and teams  
- Fans to browse player and team information  
- Secure login and profile management  
- Real‑time updates stored in Google Cloud Storage  

The project uses:

- Frontend: HTML, CSS, JavaScript  
- Backend: Flask (Python)  
- Database: Google Cloud Storage (JSON files)  
- Hosting: Google Cloud Run  

Live Frontend: https://ipl-auction-front-end-academic-121464328452.europe-west1.run.app/index.html
---

# 2. System Architecture

### **Frontend**
Runs entirely in the browser and communicates with the backend using REST APIs.

### **Backend (Flask)**
Provides APIs for:

- Signup  
- Login  
- Player CRUD  
- Team management  
- Admin profile  
- Password change  

### **Database (Google Cloud Storage)**
Stores data in JSON format:

### **Hosting (Google Cloud Run)**
- Serverless  
- Auto‑scaling  
- HTTPS endpoints  
- Integrated with Cloud Storage  

---

# 3. Frontend Pages (Detailed Explanation)

## 3.1 Home Page — `index.html`

The homepage is designed for **fans** and general users.

### Features:
- Displays all players in a clean, card‑based layout  
- Shows player role, base price, and team assignment  
- No admin controls  
- Navigation bar linking to Login 

This page is **read‑only** and does not require authentication.

---

## 3.2 Login Page — `login.html`

Allows existing users to log in.

### Workflow:
1. User enters username and password  
2. Frontend sends POST request to `/login`  
3. Backend validates credentials using hashed passwords  
4. On success:
   - User is redirected to Player Management PAge 

### Error Handling:
- Invalid username  
- Incorrect password  
- Server errors  
- JSON parsing errors  

---

## 3.3 Create Account Page — `signup.html`

Allows new users to register.

### Fields:
- Name  
- UserName  
- Email    
- Password  

### Backend stores:
```json
{
  "username": "...",
  "password": "<hashed>",
  "name": "First Last",
  "email": "...",
  "role": "Administrator",
  "last_login": "YYYY-MM-DD HH:MM:SS",
  "avatar": "default avatar URL"
}
```

## 3.4 Admin Profile Page — admin.html
This console allows registered administrators to view and manage their personal session details.

Features:
Dynamically retrieves user details from /admin/profile?username=<username>

Displays details like user name, email, account role, and last login time

Provides a link to the password management module


## 3.5 Change Password Page
Enables verified users to rotate credentials securely.

Workflow:
User inputs username, currentPassword, and newPassword

Frontend issues a POST request to /change-password

Backend retrieves the user data array, validates the old password using check_password_hash, and generates a secure update using generate_password_hash

On verification, the JSON database saves the transaction and responds with {"success": true}

## 3.6 Players Page (Auction Hub) — players.html
The operational dashboard where admins view and manage the current auction pool.

Features:
Grabs full player list via GET /players

Integrates action toggles (Edit, Delete, Assign) next to each player profile card

Strictly protected via frontend logic checking for authentication tokens/sessions

## 3.7 Add / Edit / Delete Player
Admins can perform full CRUD operations on players using interactive HTML modal forms on players.html.

Operations:
Add Player: Sends POST /players with player fields. If an image is omitted, a placeholder image is assigned automatically.

Edit Player: Sends PUT /players/<id> with modified entries (e.g., updating base price).

Delete Player: Sends DELETE /players/<id> to cleanly erase player parameters from the database.

## 3.8 Assign Player to Team
This tool links a drafted player profile to an active IPL franchise.

Workflow:
Admin clicks Assign on a player's card, triggering a modal dropdown populated with teams retrieved from GET /teams

Selecting a franchise and saving fires a PUT /assign request payload to the backend

Backend matches the player ID, updates "team_id" inside the array, saves the updated database, and updates the UI state

## 3.9 Teams Page — teams.html
Displays the active list of franchises and their squads.

Features:
Pulls team list from GET /teams

Groups drafted players dynamically under their respective franchise cards

Helps admins track which franchise still has budget and slots available

4. Backend Architecture
The backend is built as a RESTful Python Flask API server. It manages data routing, authentication security, and remote database transactions.

Core Modules:
app.py: Houses endpoint routings, input validations, and cloud stream handlers.

werkzeug.security: Protects passwords using SHA256 password-hashing.

flask_cors (CORS): Prevents cross-origin blocking between the frontend pages and the deployed API service.

google.cloud.storage: Reads and writes database files to Google Cloud Storage.

5. JSON Database Structure
Data is stored as standardized JSON arrays of objects.

6. Cloud Deployment (Cloud Run + Cloud Storage)
The application is deployed on Google Cloud to ensure scale, stability, and high availability.

Google Cloud Storage (GCS)
A bucket named ipl-auction-data is used for persistent storage.

Data Flow: The backend calls load_json() to fetch a file as a string, edits the parsed array, and uses save_json() to upload the updated string back to the bucket.

Google Cloud Run Deployment
The services are containerized via Docker and deployed using Google Cloud Run


7. References
Flask API Routing: Flask Framework Documentation

Database Persistency Mocking: Built utilizing the Python unittest.mock Library to decouple cloud services during test execution.

Secure Hashing Framework: Configured according to security guidelines in Werkzeug Security Utilities.
-https://docs.python.org/3/library/unittest.html
-https://docs.python.org/3/library/unittest.mock.html
-https://stackoverflow.com/questions/64273301/python-flask-change-password-login-form
-https://javascript.info/localstorage
-https://stackoverflow.com/questions/14220321/how-to-return-the-response-from-an-asynchronous-call
-https://hub.docker.com/_/nginx
-https://flask.palletsprojects.com/en/stable/

Generative AI Assistance
Some part of this project were developed with assistance from Gemini (Google). Specifically, Gemini assisted with:

Cloud Deployment: Setting up and deploying the frontend and backend of the application onto Google Cloud.
Creating the backend Flask API routes to manage and update users, teams, and player data
Fixing Errors: Troubleshooting account permission issues that blocked the database and build logs from working.
Code Debugging: Helping trace the website code, specifically finding where the player image popup (openImageModal) is triggered.
Drafting the readme.
