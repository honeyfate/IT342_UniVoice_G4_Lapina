import React, { useState } from 'react';
import Login from './login/Login';
import Register from './register/Register';
import './App.css'; // Just for the background container

function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="main-container">
      {isLogin ? (
        <Login onSwitch={() => setIsLogin(false)} />
      ) : (
        <Register onSwitch={() => setIsLogin(true)} />
      )}
    </div>
  );
}

export default App;