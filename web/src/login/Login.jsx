import React from 'react';
import './Login.css';

const Login = ({ onSwitch }) => {
  const handleLogin = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    console.log("Logging in with ID:", data.idNumber);
    alert("Login attempt for: " + data.idNumber);
  };

  return (
    <div className="auth-card">
      <h2>UniVoice Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>ID Number</label>
          <input name="idNumber" type="text" placeholder="00-0000-000" required />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input name="password" type="password" required />
        </div>
        <button type="submit" className="btn-blue">Login</button>
      </form>
      <p className="toggle-text">
        Don't have an account? <span onClick={onSwitch}>Register here</span>
      </p>
    </div>
  );
};

export default Login;