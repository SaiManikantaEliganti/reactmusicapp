import React, { useState } from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export default function AuthForm({ user, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "register") {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        setUser(userCred.user);
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        setUser(userCred.user);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (user) {
    return (
      <div className="auth-welcome">
        <span>Welcome, {user.email}!</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>{mode === "login" ? "Login" : "Register"}</h2>
      {error && <div className="auth-error">{error}</div>}
      <input
        type="email"
        placeholder="Email"
        autoFocus
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
      <button type="submit">{mode === "login" ? "Login" : "Register"}</button>
      <button
        type="button"
        className="auth-switch"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login" ? "Need an account? Register" : "Already have an account? Login"}
      </button>
    </form>
  );
}