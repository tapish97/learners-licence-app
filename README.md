# 🛂 Learners Licence Application Management System

A full-stack application to manage learner’s licence applications.

* 🌐 **Frontend**: React + Vite (hosted on [Vercel](https://learners-licence-app.vercel.app))
* 🔧 **Backend**: Express + MongoDB + TypeScript (hosted on [Render](https://learners-licence-app.onrender.com))
* ☁️ **File Storage**: Cloudinary (currently public access)
* 🛢️ **Database**: MongoDB Atlas (private access, IP whitelisted)

---

## 🌟 Live Demo

* **Frontend**: [https://learners-licence-app.vercel.app](https://learners-licence-app.vercel.app)
* **Backend API**: [https://learners-licence-app.onrender.com](https://learners-licence-app.onrender.com)

---

## 🧰 Features

### 👩‍💼 Customer Form

* Full form validation: name, email, phone, DOB (18+), address
* File uploads:

  * Aadhaar (PDF)
  * Photo (JPG/PNG)
  * Signature (JPG/PNG)
* Max file size: 2MB
* Auto-generate submission ID
* Confirmation on submission

### 🛠️ Admin Dashboard

* Secure login with JWT
* List of submissions with:

  * Search
  * Sort by name, created date, or status
* Detail view with:

  * Document preview
  * Status update
  * Internal notes

---

## 📦 Tech Stack

| Layer       | Tech                                     |
| ----------- | ---------------------------------------- |
| Frontend    | React 19, Vite, TypeScript, Tailwind CSS |
| Backend     | Node.js, Express, TypeScript             |
| Auth        | JWT (admin-only login)                   |
| DB          | MongoDB Atlas                            |
| File Upload | Multer + Cloudinary                      |
| Hosting     | Vercel (frontend), Render (backend)      |

---

## ⚙️ Assumptions

* Cloudinary is configured with **public file access** (no signed URLs).
* MongoDB Atlas allows connections **only from Render’s static IPs**.
* Admin login only (no frontend auth).
* Email notifications are **mocked** using `console.log` for demo purposes.

---

## 💻 Local Development Setup

### ✅ Prerequisites

* Node.js (v18+)
* MongoDB Atlas (or local MongoDB)
* Cloudinary account

---

## ⚙️ Backend Setup

```bash
cd learners-licence-app/backend
npm install
```

Create a `.env` file with the following contents:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/learners_db
ADMIN_EMAIL=admin@ll.com
ADMIN_PASSWORD=admin123
JWT_SECRET=supersecretkey123
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 🚀 Run the Backend

```bash
npm run build
npm run start
# or for development:
npm run dev
```

API will be available at:

```
http://localhost:5000
```

> ⚠️ **Note:** The deployed backend at [https://learners-licence-app.onrender.com](https://learners-licence-app.onrender.com) may take 1-2 minutes to respond initially if it was inactive. This is due to cold start behavior on Render's free tier.

---

## 🖥️ Frontend Setup

```bash
cd learners-licence-app/frontend
npm install
```

Create a `.env` file:

```env
VITE_API_BASE=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend will be available at:

```
http://localhost:5173
```

---

## 🚀 Deployment Instructions

### ✅ Backend (Render)

* Root Directory: `backend/`
* Build Command: `npm install && npm run build`
* Start Command: `npm run start`
* Add the same `.env` values in Render’s dashboard

### ✅ Frontend (Vercel)

* Root Directory: `frontend/`
* Build Command: `npm run build`
* Output Directory: `dist`
* Set this in Vercel Environment Variables:

```env
VITE_API_BASE=https://learners-licence-app.onrender.com/api
```

---

## 🔐 Demo Admin Credentials

```txt
Email: admin@ll.com
Password: admin123
```

---

## 📄 License

MIT — Free to use, fork, and contribute. PRs welcome!

---


