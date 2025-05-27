import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role || 'candidate';

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    city: '',
    skills: '',
    experience: '',
    password: ''
  });
  const [error, setError] = useState('');

  const RECRUITER_CREDENTIALS = {
    email: 'recruiter@example.com',
    password: 'recruiter123'
  };

  useEffect(() => {
    if (!localStorage.getItem('candidates')) {
      localStorage.setItem('candidates', JSON.stringify([]));
    }
    if (!localStorage.getItem('recruiter_candidates')) {
      localStorage.setItem('recruiter_candidates', JSON.stringify([]));
    }
    if (!localStorage.getItem('availableJobs')) {
      localStorage.setItem('availableJobs', JSON.stringify([]));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (role === 'recruiter') {
        if (formData.email === RECRUITER_CREDENTIALS.email &&
          formData.password === RECRUITER_CREDENTIALS.password) {
          localStorage.setItem('currentUser', JSON.stringify({
            role: 'recruiter',
            email: formData.email
          }));
          navigate('/recruiter');
        } else {
          setError('Invalid recruiter credentials');
        }
      } else {
        const regularCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
        const recruiterCandidates = JSON.parse(localStorage.getItem('recruiter_candidates') || '[]');
        const allCandidates = [...regularCandidates, ...recruiterCandidates];

        const candidate = allCandidates.find(c =>
          c.email === formData.email && c.password === formData.password
        );

        if (candidate) {
          localStorage.setItem('currentUser', JSON.stringify({
            role: 'candidate',
            ...candidate
          }));
          localStorage.setItem('candidateProfile', JSON.stringify(candidate));
          if (!localStorage.getItem(`appliedJobs_${candidate.email}`)) {
            localStorage.setItem(`appliedJobs_${candidate.email}`, JSON.stringify([]));
          }
          navigate('/candidate');
        } else {
          setError('Invalid email or password');
        }
      }
    } else {
      const regularCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
      const recruiterCandidates = JSON.parse(localStorage.getItem('recruiter_candidates') || '[]');

      if ([...regularCandidates, ...recruiterCandidates].some(c => c.email === formData.email)) {
        setError('Email already registered');
        return;
      }

      const newCandidate = { ...formData };
      regularCandidates.push(newCandidate);
      localStorage.setItem('candidates', JSON.stringify(regularCandidates));

      localStorage.setItem('currentUser', JSON.stringify({
        role: 'candidate',
        ...newCandidate
      }));
      localStorage.setItem('candidateProfile', JSON.stringify(newCandidate));
      localStorage.setItem(`appliedJobs_${newCandidate.email}`, JSON.stringify([]));

      navigate('/candidate');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleForm = () => {
    if (role === 'recruiter') return;
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <FaHome className="mr-2" />
          Home
        </button>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isLogin ? `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}` : 'Register as Candidate'}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {role === 'recruiter' && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
              <p className="text-sm">Email: recruiter@example.com, Password: recruiter123</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && role === 'candidate' && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Contact</label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Skills</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Experience (years)</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>

            {role === 'candidate' && (
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={toggleForm}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {isLogin ? 'New user? Register' : 'Already have an account? Login'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;