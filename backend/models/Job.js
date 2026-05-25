import mongoose from "mongoose";

export const JOB_STATUSES = ["Applied", "Interview", "Rejected"];

const jobSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    status: { type: String, enum: JOB_STATUSES, default: "Applied" },
    notes: { type: String, default: "" },
    appliedDate: { type: Date, default: Date.now },
    jobLink: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
