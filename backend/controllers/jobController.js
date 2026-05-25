import Job from "../models/Job.js";

// All routes are protected — req.user is set by authMiddleware.

// GET /api/jobs
export const getJobs = async (req, res) => {
  const jobs = await Job.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(jobs);
};

// GET /api/jobs/:id
export const getJob = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, userId: req.user._id });
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
};

// POST /api/jobs
export const createJob = async (req, res) => {
  const { company, role, status, notes, appliedDate, jobLink } = req.body;
  if (!company || !role) {
    return res.status(400).json({ message: "Company and role are required" });
  }
  const job = await Job.create({
    userId: req.user._id,
    company,
    role,
    status,
    notes,
    appliedDate,
    jobLink,
  });
  res.status(201).json(job);
};

// PUT /api/jobs/:id
export const updateJob = async (req, res) => {
  const job = await Job.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
};

// DELETE /api/jobs/:id
export const deleteJob = async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json({ message: "Job deleted" });
};
