import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { config } from '../config/production';
import './SurveyForm.css';

function SurveyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responses, setResponses] = useState({
    name: '',
    contactNumber: '',
    ageBracket: '',
    preferredDays: [],
    preferredTime: '',
    preferredSuburbs: ''
  });

  useEffect(() => {
    fetchSurvey();
  }, [id]);

  const fetchSurvey = async () => {
    try {
      const response = await fetch(`${config.api.baseUrl}/api/surveys/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch survey');
      }
      const data = await response.json();
      setSurvey(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResponses(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setResponses(prev => ({
      ...prev,
      [name]: checked 
        ? [...prev[name], value]
        : prev[name].filter(item => item !== value)
    }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setResponses(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.api.baseUrl}/api/surveys/${id}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responses),
      });

      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }

      navigate('/thank-you');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="survey-form-container">
      <div className="top-bar">
        <button className="back-button" onClick={() => navigate('/')}>Back to Home</button>
      </div>
      <div className="survey-header">
        <h1>Acme Widget Survey</h1>
        <div className="survey-subtitle">
          <p>At ACME we care about our customers. Thank you for taking the time to complete this survey.</p>
          <p>-ACME Management</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="survey-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={responses.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <hr className="question-divider" />

        <div className="form-group">
          <label htmlFor="contactNumber">Contact Number:</label>
          <input
            type="text"
            id="contactNumber"
            name="contactNumber"
            value={responses.contactNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <hr className="question-divider" />

        <div className="form-group">
          <label>What is your age bracket?</label>
          <div className="radio-group">
            {['15-18', '19-30', '31-45', '46-60', '60+'].map(age => (
              <label key={age} className="radio-label">
                <input
                  type="radio"
                  name="ageBracket"
                  value={age}
                  checked={responses.ageBracket === age}
                  onChange={handleRadioChange}
                  required
                />
                {age}
              </label>
            ))}
          </div>
        </div>
        <hr className="question-divider" />

        <div className="form-group">
          <label>Which days of the week do you use your Widget?</label>
          <div className="checkbox-group">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <label key={day} className="checkbox-label">
                <input
                  type="checkbox"
                  name="preferredDays"
                  value={day}
                  checked={responses.preferredDays.includes(day)}
                  onChange={handleCheckboxChange}
                />
                {day}
              </label>
            ))}
          </div>
        </div>
        <hr className="question-divider" />

        <div className="form-group">
          <label>What time of the day do you use your Widget?</label>
          <div className="radio-group">
            {['Morning', 'Afternoon', 'Evening'].map(time => (
              <label key={time} className="radio-label">
                <input
                  type="radio"
                  name="preferredTime"
                  value={time}
                  checked={responses.preferredTime === time}
                  onChange={handleRadioChange}
                  required
                />
                {time}
              </label>
            ))}
          </div>
        </div>
        <hr className="question-divider" />

        <div className="form-group">
          <label htmlFor="preferredSuburbs">Which suburb did you buy your Widget from?</label>
          <input
            type="text"
            id="preferredSuburbs"
            name="preferredSuburbs"
            value={responses.preferredSuburbs}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">Submit Survey</button>
      </form>
    </div>
  );
}

export default SurveyForm; 