import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Surveys for ACME Inc</h1>
        <p className="subtitle">Help us better serve your needs</p>
        <div className="button-container">
          <button className="action-button" onClick={() => navigate('/surveys')}>
            Take a Survey
          </button>
          <button className="action-button" onClick={() => navigate('/admin')}>
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage; 