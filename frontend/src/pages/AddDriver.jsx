import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MdPerson, MdCreditCard, MdDateRange, MdSave, MdArrowBack } from "react-icons/md";

function AddDriver() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    licenseExpiryDate: "",
    safetyScore: 100,
    status: "Available"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let token = localStorage.getItem("transitops_token");
      const res = await fetch("http://localhost:3000/api/drivers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          licenseExpiryDate: new Date(formData.licenseExpiryDate).toISOString(),
          safetyScore: parseInt(formData.safetyScore, 10)
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add owner/driver");
      }

      navigate("/drivers");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/drivers")} className="p-2 bg-white/50 hover:bg-white border border-white/60 rounded-xl text-slate-600 transition-colors shadow-sm">
          <MdArrowBack className="text-xl" />
        </button>
        <div>
          <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Add New Owner</h1>
          <p className="text-sm text-slate-600 font-medium">Register a new driver/owner into the platform.</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-slate-200/50 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        {error && (
          <div className="bg-red-50/80 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 relative z-10 backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                placeholder="e.g. John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">License Number</label>
            <div className="relative">
              <MdCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="text"
                required
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                placeholder="e.g. DL-123456"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">License Expiry Date</label>
            <div className="relative">
              <MdDateRange className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="date"
                required
                value={formData.licenseExpiryDate}
                onChange={(e) => setFormData({ ...formData, licenseExpiryDate: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Initial Safety Score</label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={formData.safetyScore}
                onChange={(e) => setFormData({ ...formData, safetyScore: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Initial Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
              >
                <option value="Available">Available</option>
                <option value="Off Duty">Off Duty</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-white/40">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all disabled:opacity-70"
            >
              <MdSave className="text-xl" />
              {loading ? "Registering..." : "Register Owner"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default AddDriver;
