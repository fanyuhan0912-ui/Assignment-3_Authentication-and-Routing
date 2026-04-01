import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || "/";

  async function handleLogin() {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await res.json();

      if (data.token) {
        login(data.token);
        navigate(redirectPath, { replace: true });
      } else {
        alert(data.message || "Login failed");
      }

    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  }

  return (
    <div className="login-container">

      <div className="login-card">

        <h1 className="login-title">Welcome Back</h1>
        <p className="login-sub">We miss you</p>

        <input
          className="login-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
          Sign In
        </button>

        <p className="register-text">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")} className="register-link">
            Sign Up
          </span>
        </p>

      </div>

    </div>
  );
}

export default Login;
