import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
const backendURL = import.meta.env.VITE_BACKEND_URL;
const frontenedURL = import.meta.env.VITE_FRONTENED_URL;
import "./Login.css"; // ✅ dedicated styling for login

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendURL}/api/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data._id);
      console.log(res);
      
      console.log("token is", localStorage.getItem('token'));
      
      // alert("Logged in successfully");
      const navigateLink = `/feature/academic-org`
      navigate(navigateLink);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <input
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
          />
          <button type="submit" className="login-btn">Login</button>
        </form>
        <p className="login-footer">
          Don’t have an account?{" "}
          <Link to="/register" className="login-register-link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}