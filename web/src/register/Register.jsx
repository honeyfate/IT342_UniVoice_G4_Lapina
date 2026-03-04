import React from 'react';
import './Register.css';

const Register = ({ onSwitch }) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@cit\.edu$/;
  const idRegex = /^\d{2}-\d{4}-\d{3}$/;

  const handleRegister = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

    if (!emailRegex.test(data.email)) return alert("Use @cit.edu email");
    if (!idRegex.test(data.idNumber)) return alert("Format: 00-0000-000");
    if (data.password !== data.confirmPassword) return alert("Passwords mismatch");

    console.log("Registering:", data);
    alert("Registration Successful!");
  };

  return (
    <div className="auth-card">
      <h2>UniVoice Register</h2>
      <form onSubmit={handleRegister}>
        <div className="input-group">
          <label>Full Name</label>
          <input name="fullName" type="text" required />
        </div>
        <div className="input-group">
          <label>School Email</label>
          <input name="email" type="email" placeholder="name@cit.edu" required />
        </div>
        <div className="input-group">
          <label>ID Number</label>
          <input name="idNumber" type="text" placeholder="00-0000-000" required />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input name="password" type="password" required />
        </div>
        <div className="input-group">
          <label>Confirm Password</label>
          <input name="confirmPassword" type="password" required />
        </div>
        <button type="submit" className="btn-blue">Create Account</button>
      </form>
      <p className="toggle-text">
        Already have an account? <span onClick={onSwitch}>Login here</span>
      </p>
    </div>
  );
};

export default Register;