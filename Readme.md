🧠 AI Expense Tracker
A Full-Stack Smart Expense Tracking App (MERN + AI)

This project is a complete AI-powered expense tracker built using Node.js, Express, MongoDB, React, Context API, and an AI module (e.g. NLP-based smart categorization or AI insights).

It includes backend + frontend in a clean folder structure, making it scalable and developer friendly.

📂 Project Folder Structure
AI-EXPENSE-TRACKER/
│
├── backend/
│   ├── config/          # DB config, environment setup
│   ├── controllers/     # Business logic for expenses, users, analytics
│   ├── middleware/      # Auth middleware, error handlers
│   ├── models/          # MongoDB models (Expense, User)
│   ├── routes/          # API routes (expense routes, user routes)
│   ├── server.js        # Entry point of backend
│   ├── package.json
│   └── .env             # Environment variables
│
├── frontend/
│   ├── node_modules/
│   ├── src/
│   │   ├── API/         # Axios API services
│   │   ├── asset/       # Images, icons
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Global state (Auth, Theme, Expenses)
│   │   ├── pages/       # Main pages (Home, Login, Dashboard)
│   │   ├── routes/      # Frontend routes
│   │   ├── style/       # CSS / Tailwind / Styled components
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md

🚀 Features
🔐 User Authentication

Login / Register

Secure JWT-based authentication

Protected routes in frontend + backend

💵 Smart Expense Management

Add, edit, delete expenses

Auto-categorization with AI (optional module)

Daily / weekly / monthly summaries

📊 Dashboard & Charts

Visual charts for expenses

Category-wise breakdown

Month-wise spending graph

🤖 AI Features

Smart text input → AI extracts:

amount

category

date

description

Example: “Paid ₹200 for lunch yesterday” → AI auto fills fields

AI insights (high spend warnings, patterns)

🎨 Beautiful UI

Modern React UI

Reusable components

Clean folder structure

Fully responsive

🛠️ Tech Stack
Frontend

React.js

Context API

Axios

React Router

TailwindCSS / Custom CSS

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

dotenv, bcrypt

AI Module

(Depending on your implementation)

NLP model / Gemini API / OpenAI API

Classifies categories, extracts data

⚙️ Installation & Setup
🔧 Backend Setup
cd backend
npm install
npm start        # or nodemon server.js


Create .env file:

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
PUT	/api/expenses/:id	Update
DELETE	/api/expenses/:id	Delete
🧠 AI Flow (Optional)
User input → Text preprocessing → NLP extraction → Categorization → Save to DB → Show in dashboard

📸 Screenshots
<img width="1884" height="901" alt="image" src="https://github.com/user-attachments/assets/d042f478-a831-401b-8c70-aec691d94b71" />


🛣️ Future Improvements

OCR receipt scanning

Monthly budget alerts

Dark mode

Voice input expense tracking

📜 License

This project is MIT Licensed.

⭐ Support

If you like this project, please ⭐ star the repository — it motivates me to build more!
