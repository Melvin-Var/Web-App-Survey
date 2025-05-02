import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config/production';
import './AdminLogin.css';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === 'acme2025') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else if (password === 'acme2025reset') {
      try {
        const response = await fetch(`${config.api.baseUrl}/api/surveys/reset`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error('Failed to reset survey');
        }

        navigate('/thank-you');
      } catch (err) {
        setError(err.message);
      }
    } else {
      setError('Invalid password');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-form">
        <h1>Admin Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" className="login-button">Login</button>
            <button type="button" className="back-button" onClick={handleBackToHome}>Back to Home</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 