import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("lisbon@gmail.com");
  const [password, setPassword] = useState("Lisbon@123");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(
        BASE_URL + "/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      return navigate("/feed");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Welcome Back</h2>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="Enter your email"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" style={styles.button} onClick={handleSubmit}>
          Sign In
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "40px",
    padding: "20px",
  },
  form: {
    backgroundColor: "rgba(30, 30, 40, 0.8)",
    padding: "2rem",
    borderRadius: "5px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  title: {
    color: "#e0e0e0",
    textAlign: "center",
    marginBottom: "1.5rem",
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: "1.2rem",
  },
  label: {
    display: "block",
    color: "#a0a0b0",
    marginBottom: "0.5rem",
    fontSize: "0.9rem",
  },
  input: {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "2px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(20, 20, 30, 0.7)",
    color: "#e0e0e0",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "0.8rem",
    backgroundColor: "#6464f0",
    color: "white",
    border: "none",
    borderRadius: "2px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
};

export default Login;
