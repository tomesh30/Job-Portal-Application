import jwt from 'jsonwebtoken';
const { verify } = jwt;
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET ;

// Middleware to verify JWT token
export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided' });
  }

  try {
    const decoded = verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

// Middleware to check if user is a recruiter
export function isRecruiter(req, res, next) {
  if (req.user && req.user.role === 'recruiter') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Recruiter role required' });
  }
}

// Middleware to check if user is a candidate
export function isCandidate(req, res, next) {
  if (req.user && req.user.role === 'candidate') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Candidate role required' });
  }
}

// Middleware to check if user is authorized (either the owner or a recruiter)
export function isAuthorized(req, res, next) {
  if (req.user && (req.user.id === parseInt(req.params.id) || req.user.role === 'recruiter')) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Not authorized' });
  }
}