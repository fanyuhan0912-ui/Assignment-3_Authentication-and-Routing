import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister() {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
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
      console.log(data);

      if (res.ok) {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }

    } catch (error) {
      console.error("Register error:", error);
      alert("Something went wrong.");
    }
  }

  return (
    <div className="login-container">

      <div className="login-card">

        <h1 className="login-title">Create Account</h1>
        <p className="login-sub">Join us today</p>

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

        <button className="login-btn" onClick={handleRegister}>
          Register
        </button>

        <p className="register-text">
          Already have an account?{" "}
          <span
            className="register-link"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

      </div>

    </div>
  );
}

export default Register;
