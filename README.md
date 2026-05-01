#  ETHARA PROJECT – Full Stack Task & Project Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing projects and tasks with role-based access control, secure authentication, and dashboard analytics.

---

##  Live Demo

🔗 Link: https://team-task-manager-frontend-omega.vercel.app/  


---

## 📂 GitHub Repository

link: https://github.com/v12977/Team-Task-Manager

---

##  Overview

This application allows users to:
- Register and login securely using JWT authentication
- Create and manage projects
- Assign tasks to team members
- Track task progress
- View analytics via dashboard

---

##  Tech Stack

Frontend:
- React.js
- React Router DOM
- Axios
- CSS

Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

Deployment:
- Railway (Backend)
- Vercel (Frontend)

---

##  Features

### 1. User Authentication
- Signup with Name, Email, Password
- Secure login using JWT
- Protected routes with middleware

### 2. Project Management
- Create projects (creator becomes Admin)
- Admin can add/remove members
- Members can view assigned projects

### 3. Task Management
- Create tasks (Title, Description, Due Date, Priority)
- Assign tasks to users
- Update task status (To Do, In Progress, Done)

### 4. Dashboard
- Total tasks
- Tasks by status
- Tasks per user
- Overdue tasks

### 5. Role-Based Access

Admin:
- Manage users, projects, and tasks

Member:
- View assigned tasks
- Update task status only

---

##  Project Structure

ETHARAPROJECT/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   ├── middleware/
│   │   ├── auth.js
│   ├── models/
│   │   ├── user.js
│   │   ├── project.js
│   │   ├── task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   └── .env
│
└── README.md

---

##  Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/v12977/Team-Task-Manager.git
cd Team-Task-Manager
