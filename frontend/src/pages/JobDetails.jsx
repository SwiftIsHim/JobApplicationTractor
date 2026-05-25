import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, Calendar, LinkIcon, StickyNote } from "lucide-react";
import toast from "react-hot-toast";

import Loader from "../components/Loader.jsx";
import JobModal from "../components/JobModal.jsx";
import CompanyLogo from "../components/CompanyLogo.jsx";
import { getJob, updateJob, deleteJob } from "../services/jobService";

const statusBadge = {
  Applied: "bg-blue-50 text-blue-700",
  Interview: "bg-amber-50 text-amber-700",
  Rejected: "bg-rose-50 text-rose-700",
};

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setJob(await getJob(id));
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load job");
        navigate("/");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const handleEdit = async (payload) => {
    try {
      const updated = await updateJob(id, payload);
      setJob(updated);
      toast.success("Application updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this application? This cannot be undone.")) return;
    try {
      await deleteJob(id);
      toast.success("Application deleted");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) return <Loader />;
  if (!job) return null;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => setEditOpen(true)} className="btn-ghost border border-slate-200">
            <Pencil size={14} /> Edit
          </button>
          <button onClick={handleDelete} className="btn-danger">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-start gap-4">
          <CompanyLogo name={job.company} size={48} className="!rounded-xl" />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-900">{job.company}</h1>
            <p className="text-sm text-slate-500">{job.role}</p>
            <span
              className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge[job.status]}`}
            >
              {job.status}
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-4 border-t border-slate-100 pt-6 text-sm">
          <div className="flex items-start gap-3">
            <Calendar size={16} className="mt-0.5 text-slate-400" />
            <div>
              <p className="text-slate-500">Date Applied</p>
              <p className="font-medium text-slate-900">
                {new Date(job.appliedDate || job.createdAt).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          {job.jobLink && (
            <div className="flex items-start gap-3">
              <LinkIcon size={16} className="mt-0.5 text-slate-400" />
              <div className="min-w-0">
                <p className="text-slate-500">Job Link</p>
                <a
                  href={job.jobLink}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate font-medium text-brand-600 hover:underline"
                >
                  {job.jobLink}
                </a>
              </div>
            </div>
          )}
          {job.notes && (
            <div className="flex items-start gap-3">
              <StickyNote size={16} className="mt-0.5 text-slate-400" />
              <div>
                <p className="text-slate-500">Notes</p>
                <p className="whitespace-pre-wrap text-slate-800">{job.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <JobModal open={editOpen} onClose={() => setEditOpen(false)} onSubmit={handleEdit} initial={job} />
    </div>
  );
}
