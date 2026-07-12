import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MdEmail, MdLock, MdDirectionsCar, MdPerson } from "react-icons/md";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e, userEmail, userPassword) => {
    e?.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail || email, password: userPassword || password })
      });
      const data = await res.json();

      if (data.token) {
        localStorage.setItem("transitops_token", data.token);
        localStorage.setItem("transitops_role", data.user.role);
        localStorage.setItem("transitops_user", data.user.name);
        navigate("/");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const loginAsManager = async () => {
    setLoading(true);
    try {
      // Ensure manager account exists first
      await fetch("http://127.0.0.1:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "manager_test@transitops.com", password: "securepassword", name: "Test Manager", role: "Fleet Manager" })
      });
      setEmail("manager_test@transitops.com");
      setPassword("securepassword");
      await handleLogin(null, "manager_test@transitops.com", "securepassword");
    } catch (err) {
      setError("Failed to create/login dummy manager");
      setLoading(false);
    }
  };

  const loginAsDriver = async () => {
    setLoading(true);
    try {
      // Ensure driver account exists first
      await fetch("http://127.0.0.1:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "driver_test@transitops.com", password: "securepassword", name: "Test Driver", role: "Driver" })
      });
      setEmail("driver_test@transitops.com");
      setPassword("securepassword");
      await handleLogin(null, "driver_test@transitops.com", "securepassword");
    } catch (err) {
      setError("Failed to create/login dummy driver");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=3546&auto=format&fit=crop')] bg-cover bg-center flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="bg-indigo-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
              <MdDirectionsCar className="text-4xl" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">TransitOps</h1>
            <p className="text-slate-500 mt-2">Smart Transport Operations Platform</p>
          </div>

          <form id="loginForm" onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdEmail className="text-slate-400 text-xl" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/50 bg-white/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdLock className="text-slate-400 text-xl" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/50 bg-white/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50/80 border border-red-200 text-red-600 text-sm p-3 rounded-xl backdrop-blur-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200/50">
            <p className="text-sm text-slate-500 text-center mb-4 font-medium">Dummy Login (Quick Access)</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={loginAsManager}
                type="button"
                className="flex items-center justify-center gap-2 py-2 px-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 rounded-xl text-sm font-medium transition-colors"
              >
                <MdDirectionsCar /> Fleet Manager
              </button>
              <button 
                onClick={loginAsDriver}
                type="button"
                className="flex items-center justify-center gap-2 py-2 px-4 bg-teal-50 hover:bg-teal-100 border border-teal-100 text-teal-700 rounded-xl text-sm font-medium transition-colors"
              >
                <MdPerson /> Driver
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
