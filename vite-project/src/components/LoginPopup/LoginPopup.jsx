import React, { useState , useContext } from "react";
import "./LoginPopup.css";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { StoreContext } from './../../content/StoreContext';

const LoginPopup = ({ setShowLogin }) => {
  const { setToken } = useContext(StoreContext);

  const [currentState, setCurrentState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
const API_URL = import.meta.env.VITE_API_URL; 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (currentState === "Sign Up") {
        // 🔹 REGISTER
        const res = await axios.post(
          API_URL+"/api/auth/register",
          { name, email, password }
        );

        setMessage(res.data.message || "Check your email to verify account");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        // 🔹 LOGIN
        const res = await axios.post(
          API_URL+"/api/auth/login",
          { email, password }
        );

        // ✅ save token
        localStorage.setItem("token", res.data.token);

        setShowLogin(false);
        setToken(res.data.token); // 🔥 déclenche refresh automatique
setShowLogin(false);
 // close popup
      }
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <IoClose
            onClick={() => setShowLogin(false)}
            className="close-icon"
          />
        </div>

        <div className="login-popup-inputs">
          {currentState === "Sign Up" && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button disabled={loading}>
          {loading
            ? "Please wait..."
            : currentState === "Sign Up"
            ? "Create account"
            : "Login"}
        </button>

        {message && <p className="auth-message">{message}</p>}

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>
            By continuing, I agree to the terms of use & policy.
          </p>
        </div>

        {currentState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrentState("Sign Up")}>
              Click here
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrentState("Login")}>
              Login here
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
