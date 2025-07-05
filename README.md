# 🛂 Learners Licence Application Management System

A full-stack application to manage learner’s licence applications.

- 🌐 **Frontend**: React + Vite (hosted on [Vercel](https://learners-licence-app.vercel.app))
- 🔧 **Backend**: Express + MongoDB + TypeScript (hosted on [Render](https://learners-licence-app.onrender.com))
- ☁️ **File Storage**: Cloudinary (currently public access)
- 🛢️ **Database**: MongoDB Atlas (private access, IP whitelisted)

---

## 🌟 Live Demo

- **Frontend**: [https://learners-licence-app.vercel.app](https://learners-licence-app.vercel.app)
- **Backend API**: [https://learners-licence-app.onrender.com](https://learners-licence-app.onrender.com)

---

## 🧰 Features

### 👩‍💼 Customer Form

- Full form validation: name, email, phone, DOB (18+), address
- File uploads:
  - Aadhaar (PDF)
  - Photo (JPG/PNG)
  - Signature (JPG/PNG)
- Max file size: 2MB
- Auto-generate submission ID
- Confirmation on submission

### 🛠️ Admin Dashboard

- Secure login with JWT
- List of submissions with:
  - Search
  - Sort by name, created date, or status
- Detail view with:
  - Document preview
  - Status update
  - Internal notes

---

## 📦 Tech Stack

| Layer       | Tech                                   |
|-------------|----------------------------------------|
| Frontend    | React 19, Vite, TypeScript, Tailwind CSS |
| Backend     | Node.js, Express, TypeScript           |
| Auth        | JWT (admin-only login)                 |
| DB          | MongoDB Atlas                          |
| File Upload | Multer + Cloudinary                    |
| Hosting     | Vercel (frontend), Render (backend)    |

---

## ⚙️ Assumptions

- Cloudinary is configured with **public file access** (no signed URLs).
- MongoDB Atlas allows connections **only from Render’s static IPs**.
- Admin login only (no frontend auth).
- Email notifications are **mocked** using `console.log` for demo purposes.

---

## 💻 Local Development Setup

### ✅ Prerequisites

- Node.js (v18+)
- MongoDB Atlas (or local MongoDB)
- Cloudinary account

---

### 📁 Project Structure

```bash
learners-licence-app/
├── backend/      # Node.js API (Express + MongoDB)
├── frontend/     # Vite + React
└── .gitignore
