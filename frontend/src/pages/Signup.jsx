import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, BriefcaseBusiness } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [show, setShow] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error("Fill in all fields");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    try {
      await signup(form.name, form.email, form.password);
      toast.success("Account created");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden flex-col justify-center bg-brand-50 px-12 md:flex">
        <div className="mx-auto max-w-sm">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-soft">
            <BriefcaseBusiness size={26} />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Organize. Track. Succeed.</h2>
          <p className="mt-3 text-slate-600">
            Create an account and take control of your job search journey.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-white px-6 py-12">
        <form onSubmit={submit} className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
          <p className="mt-1 text-sm text-slate-500">Sign up to get started</p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" placeholder="John Doe" value={form.name} onChange={update("name")} />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={update("email")}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={show ? "text" : "password"}
                  placeholder="Create a password"
                  value={form.password}
                  onChange={update("password")}
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
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-brand-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
