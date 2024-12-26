import React, { useState } from "react";

const LoginSignupPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormData({ username: "", password: "", email: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin
      ? "http://127.0.0.1:8000/api/login/" // Update with your login API
      : "http://127.0.0.1:8000/api/signup/"; // Update with your signup API

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (isLogin) {
          alert("Login successful!");
          localStorage.setItem("token", data.token); // Save token for future use
        } else {
          alert("Signup successful! You can now log in.");
          setIsLogin(true);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.detail || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isLogin ? "Login" : "Signup"}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </label>
        {!isLogin && (
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </label>
        )}
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </label>
        <button type="submit" style={styles.button}>
          {isLogin ? "Login" : "Signup"}
        </button>
      </form>
      <p style={styles.toggleText}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button onClick={handleToggle} style={styles.toggleButton}>
          {isLogin ? "Signup" : "Login"}
        </button>
      </p>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "25px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    padding:"5px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "100%",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  toggleText: {
    marginTop: "10px",
    textAlign: "center",
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default LoginSignupPage;
