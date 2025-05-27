import React from 'react';
import { useState, useEffect } from 'react';
import { FaEdit, FaBriefcase } from 'react-icons/fa';

function CandidatePage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeJobsTab, setActiveJobsTab] = useState('available');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    city: '',
    skills: '',
    experience: ''
  });
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);

  // Load data from localStorage
  useEffect(() => {
    // Get current candidate from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser && currentUser.role === 'candidate') {
      setProfile(currentUser);
      setFormData(currentUser);
      
      // Load applied jobs for this specific candidate
      const savedAppliedJobs = JSON.parse(localStorage.getItem(`appliedJobs_${currentUser.email}`)) || [];
      setAppliedJobs(savedAppliedJobs);
      
      // Load all available jobs
      const allJobs = JSON.parse(localStorage.getItem('availableJobs')) || [];
      
      // Filter out jobs this candidate has already applied to
      const appliedJobIds = savedAppliedJobs.map(job => job.id);
      const filteredAvailableJobs = allJobs.filter(job => !appliedJobIds.includes(job.id));
      
      setAvailableJobs(filteredAvailableJobs);
    }
  }, []);

  // Save appliedJobs whenever it changes
  useEffect(() => {
    if (profile?.email) {
      localStorage.setItem(`appliedJobs_${profile.email}`, JSON.stringify(appliedJobs));
    }
  }, [appliedJobs, profile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProfile = { ...formData };
    setProfile(updatedProfile);
    setShowProfileForm(false);
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify({
      role: 'candidate',
      ...updatedProfile
    }));
    localStorage.setItem('candidateProfile', JSON.stringify(updatedProfile));
    
    // Update candidates list
    const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
    const updatedCandidates = candidates.map(c => 
      c.email === updatedProfile.email ? updatedProfile : c
    );
    localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleApply = (job) => {
    // Add job to applied jobs with timestamp
    const appliedJob = {
      ...job,
      appliedDate: new Date().toLocaleDateString()
    };
    
    const updatedAppliedJobs = [...appliedJobs, appliedJob];
    setAppliedJobs(updatedAppliedJobs);
    
    // Remove job from available jobs
    const updatedAvailableJobs = availableJobs.filter(j => j.id !== job.id);
    setAvailableJobs(updatedAvailableJobs);
    
    // Update localStorage for this candidate
    if (profile?.email) {
      localStorage.setItem(`appliedJobs_${profile.email}`, JSON.stringify(updatedAppliedJobs));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Tabs */}
        <div className="flex mb-6">
          <button
            className={`mr-4 px-4 py-2 rounded-lg ${
              activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'jobs' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
            onClick={() => setActiveTab('jobs')}
          >
            Jobs
          </button>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Profile</h2>
              {profile && !showProfileForm && (
                <button
                  onClick={() => {
                    setFormData(profile);
                    setShowProfileForm(true);
                  }}
                  className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                >
                  <FaEdit />
                </button>
              )}
            </div>

            {showProfileForm ? (
              <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Contact</label>
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Experience</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Skills</label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowProfileForm(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            ) : profile ? (
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Personal Info</h3>
                    <div className="mt-2 space-y-2">
                      <div>
                        <span className="font-medium">Name:</span> {profile.name}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {profile.email}
                      </div>
                      <div>
                        <span className="font-medium">Contact:</span> {profile.contact}
                      </div>
                      <div>
                        <span className="font-medium">City:</span> {profile.city}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Professional Info</h3>
                    <div className="mt-2 space-y-2">
                      <div>
                        <span className="font-medium">Experience:</span> {profile.experience}
                      </div>
                      <div>
                        <span className="font-medium">Skills:</span> {profile.skills}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No profile information found.</p>
                <p className="text-gray-600 mt-2">Please complete your registration or contact support.</p>
                <button
                  onClick={() => setShowProfileForm(true)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Create Profile
                </button>
              </div>
            )}
          </div>
        )}

        {/* Jobs Content */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Jobs Subtabs */}
            <div className="flex mb-6 border-b">
              <button
                className={`mr-4 px-4 py-2 ${
                  activeJobsTab === 'available' ? 'border-b-2 border-blue-500 text-blue-500 font-medium' : 'text-gray-500'
                }`}
                onClick={() => setActiveJobsTab('available')}
              >
                Available Jobs
              </button>
              <button
                className={`px-4 py-2 ${
                  activeJobsTab === 'applied' ? 'border-b-2 border-blue-500 text-blue-500 font-medium' : 'text-gray-500'
                }`}
                onClick={() => setActiveJobsTab('applied')}
              >
                Applied Jobs
              </button>
            </div>

            {/* Available Jobs Tab */}
            {activeJobsTab === 'available' && (
              <>
                <h2 className="text-2xl font-bold mb-6">Available Jobs</h2>
                {availableJobs.length > 0 ? (
                  <div className="space-y-6">
                    {availableJobs.map((job) => (
                      <div key={job.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                            <p className="text-gray-600 mb-1">{job.company} • {job.location}</p>
                          </div>
                          <button
                            onClick={() => handleApply(job)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          >
                            Apply Now
                          </button>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-700">Description:</h4>
                          <p className="text-gray-600 mt-1">{job.description}</p>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-700">Requirements:</h4>
                          <p className="text-gray-600 mt-1">{job.requirements}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No available jobs at the moment.</p>
                    <p className="text-gray-500">Check back later or browse your applied jobs.</p>
                  </div>
                )}
              </>
            )}

            {/* Applied Jobs Tab */}
            {activeJobsTab === 'applied' && (
              <>
                <h2 className="text-2xl font-bold mb-6">Applied Jobs</h2>
                {appliedJobs.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left">Title</th>
                          <th className="px-6 py-3 text-left">Company</th>
                          <th className="px-6 py-3 text-left">Location</th>
                          <th className="px-6 py-3 text-left">Applied On</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appliedJobs.map((job) => (
                          <tr key={job.id} className="border-t">
                            <td className="px-6 py-4 font-medium">{job.title}</td>
                            <td className="px-6 py-4">{job.company}</td>
                            <td className="px-6 py-4">{job.location}</td>
                            <td className="px-6 py-4">{job.appliedDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">You haven't applied to any jobs yet.</p>
                    <button
                      onClick={() => setActiveJobsTab('available')}
                      className="mt-2 text-blue-500 hover:text-blue-700"
                    >
                      Browse available jobs
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidatePage;