import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import SurveyResponses from './pages/SurveyResponses';
import ThankYou from './pages/ThankYou';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const SurveyList = lazy(() => import('./pages/SurveyList'));
const SurveyForm = lazy(() => import('./pages/SurveyForm'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/surveys" element={<SurveyList />} />
          <Route path="/surveys/:id" element={<SurveyForm />} />
          <Route path="/surveys/:id/responses" element={<SurveyResponses />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App; 