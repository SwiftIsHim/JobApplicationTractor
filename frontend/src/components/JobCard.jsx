import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom";
import CompanyLogo from "./CompanyLogo.jsx";

const dotByStatus = {
  Applied: "bg-blue-500",
  Interview: "bg-amber-500",
  Rejected: "bg-rose-500",
};

export default function JobCard({ job }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: job._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group cursor-grab rounded-xl border border-slate-100 bg-white p-3 shadow-card transition hover:shadow-soft active:cursor-grabbing"
    >
      <div className="flex items-start gap-3">
        <CompanyLogo name={job.company} size={36} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <Link
              to={`/jobs/${job._id}`}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="truncate text-sm font-semibold text-slate-900 hover:underline"
            >
              {job.company}
            </Link>
            <span className={`h-2 w-2 shrink-0 rounded-full ${dotByStatus[job.status] || "bg-slate-300"}`} />
          </div>
          <p className="truncate text-xs text-slate-500">{job.role}</p>
          <p className="mt-1 text-[11px] text-slate-400">
            {job.status} on{" "}
            {new Date(job.appliedDate || job.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
