import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config/production';
import './AvailableSurveys.css';

function AvailableSurveys() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await fetch(`${config.api.baseUrl}/api/surveys`);
      if (!response.ok) {
        throw new Error('Failed to fetch surveys');
      }
      const data = await response.json();
      setSurveys(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="surveys-container">
      <h1>Available Surveys</h1>
      <div className="surveys-grid">
        {surveys.map(survey => (
          <div key={survey._id} className="survey-card">
            <h2>Acme Widget Survey</h2>
            <p>What do you like and dislike about Acme's widget?</p>
            <button 
              className="take-survey-button"
              onClick={() => navigate(`/survey/${survey._id}`)}
            >
              Take Survey
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvailableSurveys; 