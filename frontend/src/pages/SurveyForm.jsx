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
    preferredSuburbs: '',
    groupTypes: [],
    studyApproach: []
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
        <h1>Church Connect Groups Survey</h1>
        <div className="survey-subtitle">
          <p>At the Refuge, Connect Groups are what we call our Home or Bible Study groups.</p>
          <p>We want to see how we can better serve the needs and circumstances of our Refuge family through the Connect Group network.</p>
          <p>Please take a few minutes to complete the survey.</p>
          <p>Blessings,<br />The Refuge Team.</p>
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
          <label>Which day(s) of the week would suit you best if you were to attend a Connect Group? (select all that apply)</label>
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
          <label>What time of the day would best suit your circumstances?</label>
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
          <label htmlFor="preferredSuburbs">What would be your preferred suburb(s) for a Connect Group?</label>
          <input
            type="text"
            id="preferredSuburbs"
            name="preferredSuburbs"
            value={responses.preferredSuburbs}
            onChange={handleInputChange}
            required
          />
        </div>
        <hr className="question-divider" />

        <div className="form-group">
          <label>Which of the following types of Connect Groups would you prefer attending: (select all that apply)</label>
          <div className="checkbox-group">
            {[
              'Young Peoples Group (teenagers)',
              'Young Adults group (mixed)',
              'Young Married Group',
              'Adult group (mixed)',
              'Men only group',
              'Women only group',
              'Seniors Group (mix)'
            ].map(type => (
              <label key={type} className="checkbox-label">
                <input
                  type="checkbox"
                  name="groupTypes"
                  value={type}
                  checked={responses.groupTypes.includes(type)}
                  onChange={handleCheckboxChange}
                />
                {type}
              </label>
            ))}
          </div>
        </div>
        <hr className="question-divider" />

        <div className="form-group">
          <label>Which approach(es) would you prefer for Connect Groups: (select all that apply)</label>
          <div className="checkbox-group">
            {[
              'Each Connect Group to study material based on the previous Sunday\'s message',
              'Each Connect Group to study the same Bible study series',
              'Each Connect Group free to study Bible Study material that is relevant to the needs and circumstances of their group'
            ].map(approach => (
              <label key={approach} className="checkbox-label">
                <input
                  type="checkbox"
                  name="studyApproach"
                  value={approach}
                  checked={responses.studyApproach.includes(approach)}
                  onChange={handleCheckboxChange}
                />
                {approach}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-button">Submit Survey</button>
      </form>
    </div>
  );
}

export default SurveyForm; 