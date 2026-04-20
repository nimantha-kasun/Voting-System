# 🗳️ SmartVote - MERN Stack Real-Time Voting System

SmartVote is a secure, transparent, and real-time digital voting platform designed for educational institutions. Built with the **MERN Stack**, it features live data visualization, role-based access control, and a modern, responsive user interface.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 🚀 Key Features

- **Real-time Analytics:** Interactive bar charts using `Recharts` to visualize live voting trends instantly.
- **Dual Dashboards:** Separate, optimized interfaces for **Admins** (Poll Management) and **Students** (Voting).
- **Smart Deadline Logic:** Automatically categorizes events into *Available* and *Ended* sections based on time.
- **Secure Authentication:** JWT-based login system with role-based navigation.
- **Engaging UI:** Smooth animations with `Framer Motion` and success celebrations with `Canvas-Confetti`.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Lucide React, Recharts, Axios.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose).
- **Security:** JSON Web Tokens (JWT) & Bcrypt.js.

## ⚙️ Quick Setup

### 1. Clone the Repository
```bash
git clone [Paste Your GitHub Repo Link Here]
cd [Your Repo Name]

cd server
npm install
# Create a .env file and add:
# PORT=5000
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_secret_key
npm run dev

cd client
npm install
npm run dev
