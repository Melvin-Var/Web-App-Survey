import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ThankYou.css';

function ThankYou() {
  const navigate = useNavigate();

  return (
    <div className="thank-you-container">
      <div className="thank-you-content">
        <h1>Thank You!</h1>
        <p>Your survey response has been successfully submitted.</p>
        <p>We appreciate your time and feedback.</p>
        <button 
          className="home-button"
          onClick={() => navigate('/')}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default ThankYou; 