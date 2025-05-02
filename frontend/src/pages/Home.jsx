import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-header">
        <Link to="/admin/login" className="admin-link">Admin</Link>
      </div>
      <div className="title-section">
        <h1>Surveys for The Refuge, Oran Park Baptist Church</h1>
        <p className="subtitle">Help us understand the needs of our church community</p>
      </div>
      <div className="home-content">
        <div className="button-container">
          <Link to="/surveys">
            <button className="primary-button">View Surveys</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home; 