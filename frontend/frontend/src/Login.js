import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isRegistering ? "/register" : "/login";
      const response = await axios.post(`${API_URL}${endpoint}`, formData);

      if (isRegistering) {
        setIsRegistering(false);
        setError("Registration successful! Please login.");
      } else {
        onLogin(response.data.token, response.data.userId);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? "Register" : "Login"}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : isRegistering ? "Register" : "Login"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setIsRegistering(!isRegistering)}
        className="switch-btn"
      >
        {isRegistering
          ? "Already have an account? Login"
          : "Need an account? Register"}
      </button>
    </div>
  );
}

export default Login;
