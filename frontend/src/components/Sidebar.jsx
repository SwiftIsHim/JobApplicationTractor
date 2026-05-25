import { LogOut, BriefcaseBusiness, LayoutDashboard, Plus, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Stat({ label, count, dot }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        <span className="text-slate-600">{label}</span>
      </div>
      <span className="font-semibold text-slate-900">{count}</span>
    </div>
  );
}

export default function Sidebar({ jobs = [], onAddApplication, mobileOpen = false, onCloseMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const counts = {
    Applied: jobs.filter((j) => j.status === "Applied").length,
    Interview: jobs.filter((j) => j.status === "Interview").length,
    Rejected: jobs.filter((j) => j.status === "Rejected").length,
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAdd = (status) => {
    onAddApplication?.(status);
    onCloseMobile?.();
  };

  const userInitial = user?.name?.[0]?.toUpperCase() || "?";

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-5 transition-transform duration-200 md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <button
          onClick={onCloseMobile}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 md:hidden"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      <div>
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <BriefcaseBusiness size={18} />
          </div>
          <span className="text-base font-semibold text-slate-900">Job Tracker</span>
        </div>

        <nav className="space-y-1">
          <a
            href="/"
            className="flex items-center gap-3 rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700"
          >
            <LayoutDashboard size={18} /> Dashboard
          </a>
        </nav>

        <div className="mt-8">
          <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Overview
          </p>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-medium text-slate-500">Total applications</span>
              <span className="text-sm font-semibold text-slate-900">{jobs.length}</span>
            </div>
            <div className="space-y-1.5">
              <Stat label="Applied" count={counts.Applied} dot="bg-blue-500" />
              <Stat label="Interview" count={counts.Interview} dot="bg-amber-500" />
              <Stat label="Rejected" count={counts.Rejected} dot="bg-rose-500" />
            </div>
          </div>
        </div>

        {onAddApplication && (
          <button onClick={() => handleAdd("Applied")} className="btn-primary mt-6 w-full">
            <Plus size={16} /> Add Application
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
            {userInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{user?.name}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
      </aside>
    </>
  );
}
