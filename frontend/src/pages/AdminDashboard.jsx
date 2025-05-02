import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config/production';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAdmin') === 'true';
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    // Fetch surveys
    const fetchSurveys = async () => {
      try {
        const response = await fetch(`${config.api.baseUrl}/api/surveys`);
        if (!response.ok) throw new Error('Failed to fetch surveys');
        const data = await response.json();
        setSurveys(data);
        if (data.length > 0) {
          setSelectedSurvey(data[0].id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [navigate]);

  useEffect(() => {
    // Fetch responses when a survey is selected
    if (selectedSurvey) {
      const fetchResponses = async () => {
        try {
          const response = await fetch(`${config.api.baseUrl}/api/responses/survey/${selectedSurvey}`);
          if (!response.ok) throw new Error('Failed to fetch responses');
          const data = await response.json();
          setResponses(data);
        } catch (err) {
          setError(err.message);
        }
      };

      fetchResponses();
    }
  }, [selectedSurvey]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await fetch(`${config.api.baseUrl}/api/responses/survey/${selectedSurvey}/csv`);
      if (!response.ok) throw new Error('Failed to download CSV');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `survey_responses_${selectedSurvey}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetClick = () => {
    setShowResetModal(true);
    setResetPassword('');
    setResetError('');
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (resetPassword === 'church2025reset') {
      try {
        const response = await fetch(`${config.api.baseUrl}/api/responses/survey/${selectedSurvey}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setResponses([]);
          setShowResetModal(false);
          setResetPassword('');
        } else {
          setResetError('Failed to reset survey responses');
        }
      } catch (err) {
        setResetError('Error resetting survey responses');
      }
    } else {
      setResetError('Invalid reset password');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <div className="survey-selector">
        <label htmlFor="survey-select">Select Survey:</label>
        <select
          id="survey-select"
          value={selectedSurvey}
          onChange={(e) => setSelectedSurvey(e.target.value)}
        >
          {surveys.map(survey => (
            <option key={survey.id} value={survey.id}>
              {survey.name}
            </option>
          ))}
        </select>
      </div>

      <div className="responses-actions">
        <button onClick={handleDownloadCSV} className="download-button">
          Download CSV
        </button>
        <button onClick={handleResetClick} className="reset-button">
          Reset Survey
        </button>
      </div>

      {showResetModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reset Survey Responses</h3>
            <p>This will delete all responses for the selected survey. This action cannot be undone.</p>
            <form onSubmit={handleResetSubmit}>
              <div className="form-group">
                <label htmlFor="reset-password">Reset Password:</label>
                <input
                  type="password"
                  id="reset-password"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  required
                />
              </div>
              {resetError && <div className="error-message">{resetError}</div>}
              <div className="modal-buttons">
                <button type="submit" className="confirm-button">Confirm Reset</button>
                <button type="button" className="cancel-button" onClick={() => setShowResetModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="responses-container">
        <h2>Responses</h2>
        {responses.length === 0 ? (
          <p>No responses found for this survey.</p>
        ) : (
          <div className="responses-list">
            {responses.map((response, index) => (
              <div key={index} className="response-card">
                <div className="response-header">
                  <h3 className="respondent-name">{response.name}</h3>
                  <div className="response-meta">
                    <div className="meta-item">
                      <span className="meta-label">Contact Number:</span>
                      <span className="meta-value">{response.contactNumber}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Submitted:</span>
                      <span className="meta-value">
                        {response.createdAt ? new Date(response.createdAt).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="response-answers">
                  <div className="answer-item">
                    <div className="question-text">Age Bracket</div>
                    <div className="answer-text">{response.ageBracket}</div>
                  </div>
                  <div className="answer-item">
                    <div className="question-text">Preferred Days</div>
                    <div className="answer-text">
                      {Array.isArray(response.preferredDays) ? response.preferredDays.join(', ') : response.preferredDays}
                    </div>
                  </div>
                  <div className="answer-item">
                    <div className="question-text">Preferred Time</div>
                    <div className="answer-text">{response.preferredTime}</div>
                  </div>
                  <div className="answer-item">
                    <div className="question-text">Preferred Suburbs</div>
                    <div className="answer-text">{response.preferredSuburbs}</div>
                  </div>
                  <div className="answer-item">
                    <div className="question-text">Group Types</div>
                    <div className="answer-text">
                      {Array.isArray(response.groupTypes) ? response.groupTypes.join(', ') : response.groupTypes}
                    </div>
                  </div>
                  <div className="answer-item">
                    <div className="question-text">Study Approach</div>
                    <div className="answer-text">
                      {Array.isArray(response.studyApproach) ? response.studyApproach.join(', ') : response.studyApproach}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 