import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, BriefcaseBusiness } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Fill in all fields");
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Left feature panel */}
      <div className="hidden flex-col justify-center bg-brand-50 px-12 md:flex">
        <div className="mx-auto max-w-sm">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-soft">
            <BriefcaseBusiness size={26} />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Track your job applications in one place and stay organized.
          </h2>
          <ul className="mt-6 space-y-3 text-slate-600">
            <li className="flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-brand-600 text-center text-xs leading-5 text-white">✓</span>
              Add and organize applications
            </li>
            <li className="flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-brand-600 text-center text-xs leading-5 text-white">✓</span>
              Track status easily
            </li>
            <li className="flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-brand-600 text-center text-xs leading-5 text-white">✓</span>
              Never miss an opportunity
            </li>
          </ul>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center bg-white px-6 py-12">
        <form onSubmit={submit} className="w-full max-w-sm">
          <div className="mb-6 flex items-center gap-3 md:hidden">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
              <BriefcaseBusiness size={20} />
            </div>
            <span className="text-lg font-semibold text-slate-900">Job Application Tracker</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Welcome back 👋</h1>
          <p className="mt-1 text-sm text-slate-500">Login to continue to your account</p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={show ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-60">
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-brand-600 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
