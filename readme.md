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
7. Troubleshooting  
8. References  

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

