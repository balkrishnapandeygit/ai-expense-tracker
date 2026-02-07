# 🧠 AI Expense Tracker  
A Full-Stack Smart Expense Tracking App (MERN + AI)

This project is a complete **AI-powered expense tracker** built using **Node.js, Express, MongoDB, React, Context API**, and an optional AI categorization module.  
It includes **backend + frontend** with a clean, scalable folder structure.



## 📂 Project Folder Structure

AI-EXPENSE-TRACKER/
│
├── backend/
│ ├── config/ # DB config, environment setup
│ ├── controllers/ # Business logic for expenses, users, analytics
│ ├── middleware/ # Auth middleware, error handlers
│ ├── models/ # MongoDB models (Expense, User)
│ ├── routes/ # API routes (expense routes, user routes)
│ ├── server.js # Entry point of backend
│ ├── package.json
│ └── .env # Environment variables
│
├── frontend/
│ ├── node_modules/
│ ├── src/
│ │ ├── API/ # Axios API services
│ │ ├── asset/ # Images, icons
│ │ ├── components/ # Reusable UI components
│ │ ├── context/ # Global app state
│ │ ├── pages/ # Home, Login, Dashboard pages
│ │ ├── routes/ # Frontend routes
│ │ ├── style/ # Styling files
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── package.json
│
└── README.md



## 🚀 Features

### 🔐 User Authentication
- Login / Register  
- Secure JWT authentication  
- Protected routes (frontend + backend)

### 💵 Smart Expense Management
- Add, edit, delete expenses  
- AI auto-categorization  
- Daily, weekly, monthly summaries  

### 📊 Dashboard & Charts
- Beautiful visual charts  
- Category-wise breakdown  
- Monthly spending trends  

### 🤖 AI Features
- Smart text input → Automatically extracts:  
  - Amount  
  - Category  
  - Date  
  - Description  
- AI spending insights  
- Example:  
  _“Paid ₹200 for lunch yesterday” → Auto fills fields_

### 🎨 Beautiful UI
- Modern React UI  
- Clean reusable components  
- Fully responsive design  

---

## 🛠️ Tech Stack

### **Frontend**
- React.js  
- Context API  
- Axios  
- React Router  
- TailwindCSS / Custom CSS  

### **Backend**
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- bcrypt, dotenv  

### **AI Module**
- NLP model / Gemini / OpenAI  
- Auto-category prediction  
- Text extraction  

---

## ⚙️ Installation & Setup

### 🔧 Backend Setup

cd backend
npm install
npm start   # or nodemon server.js
Create a .env file:

MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
PORT=5000
💻 Frontend Setup
cd frontend
npm install
npm run dev
📡 API Endpoints
User Routes
Method	Endpoint	Description
POST	/api/user/register	Register new user
POST	/api/user/login	Login user
Expense Routes
Method	Endpoint	Description
GET	/api/expenses	Get all expenses
POST	/api/expenses	Add expense
PUT	/api/expenses/:id	Update expense
DELETE	/api/expenses/:id	Delete expense
🧠 AI Flow (Optional)
User input → NLP preprocessing → Extract info → Categorization
→ Save to MongoDB → Display in Dashboard
📸 Screenshots
🏠 Landing Page
<img src="https://github.com/user-attachments/assets/d042f478-a831-401b-8c70-aec691d94b71" width="900"/>
📊 Dashboard
<img src="https://github.com/user-attachments/assets/957a48ec-ba96-4add-a095-e88af31e2a9a" width="900"/>
➕ Add Expense
<img src="https://github.com/user-attachments/assets/4b7d38a9-296e-4373-9397-41505eb04c15" width="900"/>
📈 Reports
<img src="https://github.com/user-attachments/assets/4eee5bd3-84eb-4b92-baa7-a302958b4c8b" width="900"/>
🧠 AI Input Assistant
<img src="https://github.com/user-attachments/assets/21f84460-feb9-4d12-be17-bfa2ddbd66d1" width="900"/>
🛣️ Future Improvements
OCR receipt scanning

Monthly budget alerts

Dark mode

Voice input tracking

📜 License
This project is MIT Licensed.

⭐ Support
If you like this project, please ⭐ star the repository — it motivates me to build more! 🚀
