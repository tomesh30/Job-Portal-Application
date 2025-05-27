import jwt from 'jsonwebtoken';
const { sign } = jwt;
import User from '../models/Users.js';
import dotenv from 'dotenv';
dotenv.config();

// Secret key for JWT 
const JWT_SECRET = process.env.JWT_SECRET ;

// Register a new user (either candidate or recruiter)
export async function register(req, res) {
  try {
    const existingUser = await User.findOne({ where: { email: req.body.email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    if (!['candidate', 'recruiter'].includes(req.body.role)) {
      return res.status(400).json({ message: 'Invalid role. Must be either candidate or recruiter' });
    }

    const user = await User.create(req.body);

    const token = sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        city: user.city,
        skills: user.skills,
        experience: user.experience,
        username: user.username,
        role: user.role
      },
      token
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Login for candidate or recruiter (shared login route)
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Get current user
export async function getCurrentUser(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// New: Recruiter Login API — safer and specific
export async function recruiterLogin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email, role: 'recruiter' } });
    if (!user) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Recruiter login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
