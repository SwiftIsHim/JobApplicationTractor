import express from "express";
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getJobs).post(createJob);
router.route("/:id").get(getJob).put(updateJob).delete(deleteJob);

export default router;
