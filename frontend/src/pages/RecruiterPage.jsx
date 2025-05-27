import React from 'react';
import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function RecruiterPage() {
  const [activeTab, setActiveTab] = useState('candidates');
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  
  // Initialize state from localStorage using lazy initialization
  // Use a different key for recruiter-managed candidates to keep them separate
  const [candidates, setCandidates] = useState(() => {
    const storedCandidates = localStorage.getItem('recruiter_candidates');
    return storedCandidates ? JSON.parse(storedCandidates) : [];
  });
  
  // Using 'availableJobs' as the common key for jobs
  const [jobs, setJobs] = useState(() => {
    const storedJobs = localStorage.getItem('availableJobs');
    return storedJobs ? JSON.parse(storedJobs) : [];
  });
  
  const [candidateFormData, setCandidateFormData] = useState({
    name: '',
    email: '',
    contact: '',
    city: '',
    skills: '',
    experience: '',
    password: ''
  });
  
  const [jobFormData, setJobFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: ''
  });

  // Update localStorage whenever candidates or jobs change
  useEffect(() => {
    localStorage.setItem('recruiter_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('availableJobs', JSON.stringify(jobs));
  }, [jobs]);

  const handleCandidateSubmit = (e) => {
    e.preventDefault();
    if (candidateFormData.id) {
      const updatedCandidates = candidates.map(c => 
        c.id === candidateFormData.id ? candidateFormData : c
      );
      setCandidates(updatedCandidates);
    } else {
      const newCandidate = { 
        ...candidateFormData, 
        id: Date.now(),
        dateCreated: new Date().toLocaleDateString(),
        recruiterManaged: true // Flag to identify recruiter-created candidates
      };
      setCandidates([...candidates, newCandidate]);
    }
    setShowCandidateForm(false);
    setCandidateFormData({
      name: '',
      email: '',
      contact: '',
      city: '',
      skills: '',
      experience: '',
      password: ''
    });
  };

  const handleJobSubmit = (e) => {
    e.preventDefault();
    if (jobFormData.id) {
      const updatedJobs = jobs.map(j => 
        j.id === jobFormData.id ? jobFormData : j
      );
      setJobs(updatedJobs);
    } else {
      const newJob = { 
        ...jobFormData, 
        id: Date.now(), 
        datePosted: new Date().toLocaleDateString() 
      };
      setJobs([...jobs, newJob]);
    }
    setShowJobForm(false);
    setJobFormData({
      title: '',
      company: '',
      location: '',
      description: '',
      requirements: ''
    });
  };

  const handleCandidateEdit = (candidate) => {
    setCandidateFormData(candidate);
    setShowCandidateForm(true);
  };

  const handleJobEdit = (job) => {
    setJobFormData(job);
    setShowJobForm(true);
  };

  const handleCandidateDelete = (id) => {
    const updatedCandidates = candidates.filter(c => c.id !== id);
    setCandidates(updatedCandidates);
  };

  const handleJobDelete = (id) => {
    const updatedJobs = jobs.filter(j => j.id !== id);
    setJobs(updatedJobs);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Recruiter Dashboard</h1>
        </div>
        
        {/* Tabs */}
        <div className="flex mb-6">
          <button
            className={`mr-4 px-4 py-2 rounded-lg ${
              activeTab === 'candidates' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
            onClick={() => setActiveTab('candidates')}
          >
            Candidates
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

        {/* Candidates Tab */}
        {activeTab === 'candidates' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Candidates</h2>
              <button
                onClick={() => setShowCandidateForm(true)}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
              >
                <FaPlus />
              </button>
            </div>

            {showCandidateForm && (
              <form onSubmit={handleCandidateSubmit} className="mb-6 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">{candidateFormData.id ? 'Update' : 'Create'} Candidate</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={candidateFormData.name}
                      onChange={(e) => setCandidateFormData({...candidateFormData, name: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={candidateFormData.email}
                      onChange={(e) => setCandidateFormData({...candidateFormData, email: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Contact</label>
                    <input
                      type="tel"
                      value={candidateFormData.contact}
                      onChange={(e) => setCandidateFormData({...candidateFormData, contact: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={candidateFormData.city}
                      onChange={(e) => setCandidateFormData({...candidateFormData, city: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Experience</label>
                    <input
                      type="text"
                      value={candidateFormData.experience}
                      onChange={(e) => setCandidateFormData({...candidateFormData, experience: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Skills</label>
                    <input
                      type="text"
                      value={candidateFormData.skills}
                      onChange={(e) => setCandidateFormData({...candidateFormData, skills: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                      placeholder="e.g. React, Node.js, MongoDB"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      value={candidateFormData.password}
                      onChange={(e) => setCandidateFormData({...candidateFormData, password: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCandidateForm(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    {candidateFormData.id ? 'Update' : 'Create'} Candidate
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Contact</th>
                    <th className="px-6 py-3 text-left">City</th>
                    <th className="px-6 py-3 text-left">Experience</th>
                    <th className="px-6 py-3 text-left">Skills</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr key={candidate.id} className="border-t">
                      <td className="px-6 py-4">{candidate.name}</td>
                      <td className="px-6 py-4">{candidate.email}</td>
                      <td className="px-6 py-4">{candidate.contact}</td>
                      <td className="px-6 py-4">{candidate.city}</td>
                      <td className="px-6 py-4">{candidate.experience}</td>
                      <td className="px-6 py-4">{candidate.skills}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleCandidateEdit(candidate)}
                          className="text-blue-500 hover:text-blue-600 mr-2"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleCandidateDelete(candidate.id)}
                          className="text-red-500 hover:text-red-600"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {candidates.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        No candidates found. Create one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Job Listings</h2>
              <button
                onClick={() => setShowJobForm(true)}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
              >
                <FaPlus />
              </button>
            </div>

            {showJobForm && (
              <form onSubmit={handleJobSubmit} className="mb-6 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">{jobFormData.id ? 'Update' : 'Post New'} Job</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Job Title</label>
                    <input
                      type="text"
                      value={jobFormData.title}
                      onChange={(e) => setJobFormData({...jobFormData, title: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      value={jobFormData.company}
                      onChange={(e) => setJobFormData({...jobFormData, company: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={jobFormData.location}
                      onChange={(e) => setJobFormData({...jobFormData, location: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700 mb-2">Job Description</label>
                  <textarea
                    value={jobFormData.description}
                    onChange={(e) => setJobFormData({...jobFormData, description: e.target.value})}
                    className="w-full p-2 border rounded"
                    rows="4"
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700 mb-2">Requirements</label>
                  <textarea
                    value={jobFormData.requirements}
                    onChange={(e) => setJobFormData({...jobFormData, requirements: e.target.value})}
                    className="w-full p-2 border rounded"
                    rows="4"
                    required
                  />
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowJobForm(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    {jobFormData.id ? 'Update' : 'Post'} Job
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left">Title</th>
                    <th className="px-6 py-3 text-left">Company</th>
                    <th className="px-6 py-3 text-left">Location</th>
                    <th className="px-6 py-3 text-left">Posted On</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-t">
                      <td className="px-6 py-4">{job.title}</td>
                      <td className="px-6 py-4">{job.company}</td>
                      <td className="px-6 py-4">{job.location}</td>
                      <td className="px-6 py-4">{job.datePosted}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleJobEdit(job)}
                          className="text-blue-500 hover:text-blue-600 mr-2"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleJobDelete(job.id)}
                          className="text-red-500 hover:text-red-600"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {jobs.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No jobs posted yet. Create one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecruiterPage;