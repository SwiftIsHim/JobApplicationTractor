import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import JobCard from "./JobCard.jsx";

const styles = {
  Applied: { header: "text-blue-700", bg: "bg-blue-50/60", action: "text-blue-700" },
  Interview: { header: "text-amber-700", bg: "bg-amber-50/60", action: "text-amber-700" },
  Rejected: { header: "text-rose-700", bg: "bg-rose-50/60", action: "text-rose-700" },
};

export default function KanbanColumn({ status, jobs, onAdd }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const s = styles[status];

  return (
    <div className={`flex h-full flex-col rounded-2xl ${s.bg} p-3 transition ${isOver ? "ring-2 ring-brand-300" : ""}`}>
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className={`text-sm font-semibold ${s.header}`}>{status}</h3>
          <span className={`rounded-md bg-white px-1.5 py-0.5 text-xs font-medium ${s.header}`}>
            {jobs.length}
          </span>
        </div>
      </div>

      <SortableContext items={jobs.map((j) => j._id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </SortableContext>

      <button
        onClick={() => onAdd(status)}
        className={`mt-3 flex items-center justify-center gap-1 rounded-lg py-2 text-sm font-medium ${s.action} hover:bg-white/60`}
      >
        <Plus size={16} /> Add Application
      </button>
    </div>
  );
}
