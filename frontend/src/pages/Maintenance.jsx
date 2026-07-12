import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdBuild, MdSearch, MdAdd, MdClose, MdCheckCircle } from "react-icons/md";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Maintenance() {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicleId: "",
    description: "",
    cost: "",
    date: ""
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchLogs = async () => {
    try {
      let token = localStorage.getItem("transitops_token");
      if (!token) return;

      const res = await fetch("http://localhost:3000/api/maintenance", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch maintenance logs:", err);
    }
  };

  const fetchVehicles = async () => {
    try {
      let token = localStorage.getItem("transitops_token");
      if (!token) return;
      const res = await fetch("http://localhost:3000/api/vehicles", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch vehicles for dropdown", err);
    }
  };

  useEffect(() => {
    Promise.all([fetchLogs(), fetchVehicles()]).finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      const token = localStorage.getItem("transitops_token");
      const res = await fetch("http://localhost:3000/api/maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          vehicleId: parseInt(formData.vehicleId),
          description: formData.description,
          cost: parseFloat(formData.cost),
          date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString()
        })
      });

      const data = await res.json();
      if (res.ok) {
        setShowForm(false);
        setFormData({ vehicleId: "", description: "", cost: "", date: "" });
        await fetchLogs();
      } else {
        setFormError(data.error || "Failed to create log");
      }
    } catch (err) {
      setFormError("Network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const search = (searchTerm || "").toLowerCase();
    return (log.description || "").toLowerCase().includes(search);
  });

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="min-h-full">
      <motion.div variants={itemVariants} className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Maintenance Logs</h1>
          <p className="text-sm text-slate-600 mt-1 font-medium">Track vehicle repair costs and service history.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input 
              type="text" 
              placeholder="Search descriptions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 w-64 placeholder:text-slate-500 backdrop-blur-md shadow-sm transition-all"
            />
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600/90 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-indigo-200 backdrop-blur-md transition-colors flex items-center gap-2">
            {showForm ? <><MdClose className="text-lg" /> Cancel</> : <><MdAdd className="text-lg" /> Log Service</>}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: "hidden" }}
            className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Log New Maintenance</h2>
              
              {formError && (
                <div className="mb-6 bg-rose-100/80 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm font-semibold shadow-sm">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase">Select Vehicle</label>
                  <select 
                    required name="vehicleId" value={formData.vehicleId} onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  >
                    <option value="">-- All Vehicles --</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.registrationNumber} ({v.make} {v.model})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase">Cost (₹)</label>
                  <input 
                    required type="number" step="0.01" name="cost" value={formData.cost} onChange={handleChange} placeholder="e.g. 150.00"
                    className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                <div className="space-y-1.5 lg:col-span-2">
                  <label className="text-xs font-bold text-slate-600 uppercase">Description</label>
                  <input 
                    required type="text" name="description" value={formData.description} onChange={handleChange} placeholder="e.g. Oil change and brake pad replacement"
                    className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/50">
                <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-md transition-all disabled:opacity-70">
                  {submitting ? "Saving..." : "Save Maintenance Log"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="p-8 text-center text-slate-500 font-medium">Loading maintenance logs...</div>
      ) : (
        <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/30 border-b border-white/40">
                <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Log ID</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle ID</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {filteredLogs.map(log => (
                <motion.tr whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }} key={log.id} className="transition-colors cursor-pointer">
                  <td className="py-3 px-6 flex items-center gap-2 font-bold text-slate-600 text-sm">
                    <MdBuild className="text-indigo-500" />
                    #{log.id}
                  </td>
                  <td className="py-3 px-6 font-semibold text-slate-700 text-sm">{new Date(log.date).toLocaleDateString()}</td>
                  <td className="py-3 px-6 font-medium text-indigo-600 text-sm">Vehicle #{log.vehicleId}</td>
                  <td className="py-3 px-6 font-medium text-slate-800 text-sm">{log.description}</td>
                  <td className="py-3 px-6 font-extrabold text-rose-600 text-sm">₹{log.cost.toLocaleString()}</td>
                </motion.tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500 font-medium">No maintenance logs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Maintenance;