import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CandidatePage from './pages/CandidatePage';
import RecruiterPage from './pages/RecruiterPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/candidate" element={<CandidatePage />} />
        <Route path="/recruiter" element={<RecruiterPage />} />
      </Routes>
    </Router>
  );
}

export default App;