import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-header">
        <Link to="/admin/login" className="admin-link">Admin</Link>
      </div>
      <div className="title-section">
        <h1>Surveys for ACME Inc</h1>
        <p className="subtitle">Help us serve your needs better</p>
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