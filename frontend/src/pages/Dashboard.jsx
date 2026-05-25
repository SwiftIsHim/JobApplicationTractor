import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Menu } from "lucide-react";
import { DndContext, PointerSensor, useSensor, useSensors, closestCorners } from "@dnd-kit/core";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar.jsx";
import KanbanColumn from "../components/KanbanColumn.jsx";
import JobModal from "../components/JobModal.jsx";
import Loader from "../components/Loader.jsx";
import { listJobs, createJob, updateJob } from "../services/jobService";

const COLUMNS = ["Applied", "Interview", "Rejected"];

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState("Applied");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 8px activation distance keeps clicks (e.g. link tap) from triggering drag.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    (async () => {
      try {
        const data = await listJobs();
        setJobs(data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const grouped = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? jobs.filter(
          (j) =>
            j.company.toLowerCase().includes(q) ||
            j.role.toLowerCase().includes(q) ||
            (j.notes || "").toLowerCase().includes(q)
        )
      : jobs;
    return COLUMNS.reduce((acc, status) => {
      acc[status] = filtered.filter((j) => j.status === status);
      return acc;
    }, {});
  }, [jobs, search]);

  const openAdd = (status = "Applied") => {
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const handleCreate = async (payload) => {
    try {
      const created = await createJob(payload);
      setJobs((prev) => [created, ...prev]);
      toast.success("Application added");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create");
    }
  };

  // Drag end: if dropped into a different status column, update the job.
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    const activeJob = jobs.find((j) => j._id === activeId);
    if (!activeJob) return;

    // overId is either a column id (status string) or another card id.
    const newStatus = COLUMNS.includes(overId)
      ? overId
      : jobs.find((j) => j._id === overId)?.status;

    if (!newStatus || newStatus === activeJob.status) return;

    // Optimistic update
    const previous = jobs;
    setJobs((prev) => prev.map((j) => (j._id === activeId ? { ...j, status: newStatus } : j)));

    try {
      await updateJob(activeId, { status: newStatus });
    } catch (err) {
      setJobs(previous);
      toast.error("Failed to move job");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        jobs={jobs}
        onAddApplication={openAdd}
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      <main className="min-w-0 flex-1 px-4 py-6 md:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-50 md:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
              <p className="text-sm text-slate-500">Track and manage your job applications</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="input pl-9"
              />
            </div>
            <button onClick={() => openAdd("Applied")} className="btn-primary">
              <Plus size={16} /> Add Application
            </button>
          </div>
        </div>

        {/* Kanban */}
        {loading ? (
          <Loader />
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3" style={{ minHeight: "70vh" }}>
              {COLUMNS.map((status) => (
                <KanbanColumn key={status} status={status} jobs={grouped[status]} onAdd={openAdd} />
              ))}
            </div>
          </DndContext>
        )}
      </main>

      <JobModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        defaultStatus={defaultStatus}
      />
    </div>
  );
}
