import { Router } from "express";
const router = Router();
import { getUsers, createUser, getUserById, updateUser, deleteUser } from "../controllers/staffController.js";
import { getJobs, createJob, getJobById, updateJob, deleteJob } from "../controllers/jobController.js";
import { createApplication, getApplication, getApplicationByCandidate, getApplicationByJob, updateApplicationStatus } from "../controllers/applicationController.js";
import { register, login, getCurrentUser, recruiterLogin } from "../controllers/authController.js";
import { authenticateToken, isRecruiter, isCandidate, isAuthorized } from "../middleware/authMiddleware.js";

// Auth routes (public)
router.post("/register", register);
router.post("/login", login);
router.post("/recruiter/login", recruiterLogin);
router.get("/me", authenticateToken, getCurrentUser);

// User routes
router.get("/users", authenticateToken, getUsers);
router.post("/users", authenticateToken, isRecruiter, createUser); // Only recruiters can create users
router.get("/users/:id", authenticateToken, getUserById);
router.put("/users/:id", authenticateToken, isAuthorized, updateUser); // Only self or recruiters
router.delete("/users/:id", authenticateToken, isAuthorized, deleteUser); // Only self or recruiters

// Job routes
router.get("/jobs", getJobs); // Public
router.post("/jobs", authenticateToken, isRecruiter, createJob); // Only recruiters
router.get("/jobs/:id", getJobById); // Public
router.put("/jobs/:id", authenticateToken, isRecruiter, updateJob); // Only recruiters
router.delete("/jobs/:id", authenticateToken, isRecruiter, deleteJob); // Only recruiters

// Application routes
router.post("/applications", authenticateToken, createApplication);
router.get("/applications", authenticateToken, isRecruiter, getApplication); // Only recruiters can see all
router.get("/applications/candidate/:candidateId", authenticateToken, isAuthorized, getApplicationByCandidate);
router.get("/applications/job/:jobId", authenticateToken, getApplicationByJob);
router.put("/applications/:id", authenticateToken, isRecruiter, updateApplicationStatus); // Only recruiters

export default router;