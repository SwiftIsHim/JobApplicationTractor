import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STATUSES = ["Applied", "Interview", "Rejected"];

const empty = {
  company: "",
  role: "",
  status: "Applied",
  appliedDate: new Date().toISOString().slice(0, 10),
  jobLink: "",
  notes: "",
};

// Modal for both create and edit. Pass `initial` to edit.
export default function JobModal({ open, onClose, onSubmit, initial, defaultStatus }) {
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        company: initial.company || "",
        role: initial.role || "",
        status: initial.status || "Applied",
        appliedDate: (initial.appliedDate || initial.createdAt || new Date().toISOString()).slice(0, 10),
        jobLink: initial.jobLink || "",
        notes: initial.notes || "",
      });
    } else {
      setForm({ ...empty, status: defaultStatus || "Applied" });
    }
  }, [open, initial, defaultStatus]);

  if (!open) return null;

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company || !form.role) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {initial ? "Edit Application" : "Add New Application"}
          </h2>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="label">Company</label>
            <input className="input" placeholder="e.g. Google" value={form.company} onChange={update("company")} />
          </div>
          <div>
            <label className="label">Job Title</label>
            <input
              className="input"
              placeholder="e.g. Frontend Developer"
              value={form.role}
              onChange={update("role")}
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={update("status")}>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Date Applied</label>
            <input type="date" className="input" value={form.appliedDate} onChange={update("appliedDate")} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Job Link (Optional)</label>
            <input
              className="input"
              placeholder="e.g. https://careers.google.com/..."
              value={form.jobLink}
              onChange={update("jobLink")}
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">Notes (Optional)</label>
            <textarea
              rows={4}
              className="input resize-none"
              placeholder="Add any notes..."
              value={form.notes}
              onChange={update("notes")}
            />
          </div>

          <div className="md:col-span-2 mt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
              {submitting ? "Saving..." : initial ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
