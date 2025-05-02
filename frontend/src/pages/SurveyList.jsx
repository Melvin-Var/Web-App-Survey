import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { config } from '../config/production';
import './SurveyList.css';

function SurveyList() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      console.log('API Base URL:', config.api.baseUrl);
      console.log('Full URL:', `${config.api.baseUrl}/api/surveys`);
      
      const response = await fetch(`${config.api.baseUrl}/api/surveys`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const text = await response.text();
      console.log('Raw response:', text);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = JSON.parse(text);
      console.log('Parsed data:', data);
      setSurveys(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching surveys:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="survey-list-container">
      <div className="top-bar">
        <button className="back-button" onClick={() => navigate('/')}>Back to Home</button>
      </div>
      <div className="survey-list-header">
        <h1>Available Surveys</h1>
      </div>
      <div className="survey-list-content">
        {surveys.length === 0 ? (
          <p>No surveys found.</p>
        ) : (
          <div className="survey-card">
            <h2>Church Connect Groups Survey</h2>
            <p className="survey-subtitle">Help us create the best Connect Groups for our church community</p>
            <Link to={`/surveys/${surveys[0].id}`}>
              <button className="survey-list-take-button">Take Survey</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default SurveyList; 