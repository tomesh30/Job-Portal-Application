import Job from '../models/job.js';
import User from '../models/Users.js';

// Create a new job
export async function createJob(req, res) {
  try {
    // Add the userId from the authenticated user
    const jobData = {
      ...req.body,
      userId: req.user.id
    };
    
    const job = await Job.create(jobData);
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get all jobs
export async function getJobs(req, res) {
  try {
    const jobs = await Job.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get job by ID
export async function getJobById(req, res) {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update job
export async function updateJob(req, res) {
  try {
    // Find the job first to check if the user is authorized
    const job = await Job.findByPk(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if the user is the creator of the job
    if (job.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }
    
    const [updated] = await Job.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedJob = await Job.findByPk(req.params.id);
      res.json(updatedJob);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete job
export async function deleteJob(req, res) {
  try {
    // Find the job first to check if the user is authorized
    const job = await Job.findByPk(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if the user is the creator of the job
    if (job.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }
    
    const deleted = await Job.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).json({ message: 'Job deleted' });
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}