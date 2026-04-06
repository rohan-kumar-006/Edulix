# Edulix - Student Toolkit

A full-stack, utility-focused web application built with React and Node.js for everyday student tasks. Edulix provides essential productivity tools such as image processing, PDF management, and focus timers in one clean, unified interface.

## 🛠️ Features

1.  **Background Remover** - Effortlessly remove image backgrounds using the `remove.bg` API.
2.  **Image Compressor** - Optimize file sizes with adjustable quality levels using **Sharp**.
3.  **PDF Merger** - Combine multiple PDF files into one, with easy reordering.
4.  **PDF Splitter** - Extract specific page ranges from your documents.
5.  **PDF Compressor** - High-efficiency compression using **rasterization** (Page → Canvas → JPEG → PDF rebuild) which provides significant file size reduction for scanned or image-heavy PDFs.
6.  **Pomodoro Timer** - Boost productivity with customizable work/break intervals.

---

## 🚀 Tech Stack

### **Frontend**
*   **Framework:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Client:** Axios
*   **Routing:** React Router DOM

### **Backend**
*   **Runtime:** [Node.js](https://nodejs.org/)
*   **Framework:** [Express](https://expressjs.com/)
*   **Utilities:**
    *   **Sharp** (Image processing)
    *   **Canvas** (PDF rendering)
    *   **pdf-lib** (PDF building/splitting/merging)
    *   **pdfjs-dist** (PDF to Image conversion)

---

## 📦 Setup & Installation

### **1. Backend Setup**
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file from the example:
```bash
# env variables
PORT=5000
REMOVE_BG_API_KEY=your_key_from_remove_bg
```
> Get your free API key at [remove.bg](https://www.remove.bg/api).

### **2. Frontend Setup**
Navigate to the frontend folder and install dependencies:
```bash
cd frontend
npm install
```
### **3. Start the Application**
Run both the frontend and backend to start the developer environment:
*   **Backend:** `npm start` (in `/backend`)
*   **Frontend:** `npm run dev` (in `/frontend`)

Your application will be available at `http://localhost:3000`.

---

## 🌎 Hosting Guide

### **Backend (Recommended: Render.com)**
Because the backend uses binary dependencies (Sharp/Canvas), it works best on platforms with persistent environments.
1.  Add a new **Web Service** on Render.
2.  Set **Root Directory** to `backend`.
3.  **Build Command:** `npm install`
4.  **Start Command:** `npm start`
5.  Set your `.env` variables in the dashboard.

### **Frontend (Vercel)**
1.  Connect your repo to Vercel.
2.  Select **Root Directory** as `frontend`.
3.  Add environment variable: `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com/api`.
4.  Deploy!

---

## 📝 Performance Notes
*   **PDF Compression:** For large PDFs (e.g., 20MB+), compression can take up to 20-30 seconds because each page is rendered to high-quality images before being reassembled.
*   **File Limits:**
    *   Images: Max 10MB
    *   PDFs: Max 50MB (Split/Merge), Max 25MB (Compressor)

---

Developed as a student project for building efficient daily toolsets.
