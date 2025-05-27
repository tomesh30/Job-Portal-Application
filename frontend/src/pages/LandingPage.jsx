import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserTie, FaUser } from 'react-icons/fa';

function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    navigate('/login', { state: { role } });
  };

  return (
    <div className="flex h-screen">
      {/* Recruiter Section */}
      <div className="w-1/2 bg-[#3CB371] flex flex-col items-center justify-center">
        <button
          onClick={() => handleLogin('recruiter')}
          className="bg-white text-[#3CB371] px-6 py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
        >
          Login as Recruiter
        </button>
      </div>

      {/* Candidate Section */}
      <div className="w-1/2 bg-[#0047AB] flex flex-col items-center justify-center">
        <button
          onClick={() => handleLogin('candidate')}
          className="bg-white text-[#0047AB] px-6 py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
        >
          Login as Candidate
        </button>
      </div>
    </div>
  );
}

export default LandingPage;