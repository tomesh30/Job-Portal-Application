import Application from '../models/Application.js';
import User from '../models/Users.js';
import Job from '../models/job.js';

// Create a new application
export async function createApplication(req, res) {
  try {
    // If a recruiter is creating an application for a candidate, use the candidateId from the request
    // Otherwise, use the current user's ID
    const candidateId = req.user.role === 'recruiter' && req.body.candidateId 
      ? req.body.candidateId 
      : req.user.id;
    
    // Check if the candidate exists
    const candidate = await User.findByPk(candidateId);
    if (!candidate || candidate.role !== 'candidate') {
      return res.status(400).json({ message: 'Invalid candidate' });
    }
    
    // Check if the job exists
    const job = await Job.findByPk(req.body.jobId);
    if (!job) {
      return res.status(400).json({ message: 'Job not found' });
    }
    
    // Create the application
    const application = await Application.create({
      ...req.body,
      candidateId: candidateId
    });
    
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get all applications (for recruiters only)
export async function getApplication(req, res) {
  try {
    const applications = await Application.findAll({
      include: [
        { 
          model: User, 
          as: 'User', // Using the association name instead of 'candidate'
          attributes: ['id', 'name', 'email', 'experience', 'skills'] 
        },
        { 
          model: Job, 
          include: [{ 
            model: User, 
            attributes: ['id', 'name', 'email', 'company'] 
          }] 
        }
      ]
    });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get applications by candidate ID
export async function getApplicationByCandidate(req, res) {
  try {
    // Ensure the user can only access their own applications unless they're a recruiter
    if (req.user.role !== 'recruiter' && req.user.id !== parseInt(req.params.candidateId)) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }
    
    const applications = await Application.findAll({
      where: { candidateId: req.params.candidateId },
      include: [{ 
        model: Job, 
        include: [{ 
          model: User, 
          attributes: ['id', 'name', 'email', 'company'] 
        }] 
      }]
    });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get applications by job ID
export async function getApplicationByJob(req, res) {
  try {
    // Get the job to check permissions
    const job = await Job.findByPk(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // If user is a candidate, they can only see their own applications
    if (req.user.role === 'candidate') {
      const applications = await Application.findAll({
        where: { 
          jobId: req.params.jobId,
          candidateId: req.user.id
        },
        include: [{ 
          model: User, 
          as: 'User', 
          attributes: ['id', 'name', 'email', 'experience', 'skills'] 
        }]
      });
      return res.json(applications);
    }
    
    // If user is a recruiter, they can see all applications for the job
    // but preferably only if they created the job
    if (job.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }
    
    const applications = await Application.findAll({
      where: { jobId: req.params.jobId },
      include: [{ 
        model: User, 
        as: 'User', 
        attributes: ['id', 'name', 'email', 'experience', 'skills'] 
      }]
    });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update application status
export async function updateApplicationStatus(req, res) {
  try {
    // Find the application
    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job }]
    });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Ensure the recruiter is the one who posted the job
    const job = await Job.findByPk(application.jobId);
    if (!job || job.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }
    
    const [updated] = await Application.update(
      { status: req.body.status },
      { where: { id: req.params.id } }
    );
    
    if (updated) {
      const updatedApplication = await Application.findByPk(req.params.id);
      res.json(updatedApplication);
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}