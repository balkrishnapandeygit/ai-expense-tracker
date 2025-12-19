import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../API/Axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <>
      <style>{`
        .auth-page {
          height: 100vh;
          background: linear-gradient(135deg, #020617, #0f172a);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: Arial, sans-serif;
        }

        .auth-card {
          background: #020617;
          padding: 30px;
          width: 360px;
          border-radius: 12px;
          color: white;
          box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        }

        .auth-card h2 {
          text-align: center;
          margin-bottom: 20px;
        }

        .auth-card input {
          width: 100%;
          padding: 12px;
          margin-bottom: 14px;
          border-radius: 8px;
          border: none;
          outline: none;
          background: #0f172a;
          color: white;
        }

        .auth-card button {
          width: 100%;
          padding: 12px;
          background: #38bdf8;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 5px;
        }

        .auth-card button:hover {
          opacity: 0.9;
        }

        .auth-card p {
          text-align: center;
          margin-top: 15px;
          font-size: 0.9rem;
        }

        .auth-card a {
          color: #38bdf8;
          text-decoration: none;
        }
      `}</style>

      <div className="auth-page">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Login</h2>

          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>

          <p>
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
