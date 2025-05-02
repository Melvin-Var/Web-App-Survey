import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getConfig } from '../../config';
import './SurveyResponses.css';

const SurveyResponses = () => {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch survey details
        const surveyResponse = await fetch(`${getConfig('api.baseUrl')}/api/surveys/${id}`);
        if (!surveyResponse.ok) {
          throw new Error('Failed to fetch survey');
        }
        const surveyData = await surveyResponse.json();
        setSurvey(surveyData);

        // Fetch responses
        const responsesResponse = await fetch(`${getConfig('api.baseUrl')}/api/responses/survey/${id}`);
        if (!responsesResponse.ok) {
          throw new Error('Failed to fetch responses');
        }
        const responsesData = await responsesResponse.json();
        setResponses(responsesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDownloadCSV = async () => {
    try {
      const response = await fetch(`${getConfig('api.baseUrl')}/api/responses/survey/${id}/csv`);
      if (!response.ok) {
        throw new Error('Failed to download CSV');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${survey.name.replace(/\s+/g, '_')}_responses.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Loading responses...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!survey) return <div className="error">Survey not found</div>;

  return (
    <div className="responses-container">
      <div className="responses-header">
        <h1>{survey.name} - Responses</h1>
        <div className="responses-actions">
          <p className="responses-count">Total Responses: {responses.length}</p>
          <button onClick={handleDownloadCSV} className="download-button">
            Download CSV
          </button>
        </div>
      </div>

      <div className="responses-list">
        {responses.map((response, index) => (
          <div key={index} className="response-card">
            <div className="response-header">
              <h3>{response.name}</h3>
              <span className="response-email">{response.email}</span>
            </div>
            <div className="response-answers">
              {survey.questions.map((question, qIndex) => (
                <div key={qIndex} className="answer-item">
                  <h4>{question}</h4>
                  <p>{response.answers[qIndex]}</p>
                </div>
              ))}
            </div>
            <div className="response-footer">
              <span className="response-date">
                Submitted on: {new Date(response.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurveyResponses; 