import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdAttachMoney, MdLocalGasStation, MdAdd, MdClose } from "react-icons/md";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicleId: "",
    type: "Fuel",
    description: "",
    cost: "",
    liters: "",
    date: ""
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchExpenses = async () => {
    try {
      let token = localStorage.getItem("transitops_token");
      if (!token) return;
      const res = await fetch("http://localhost:3000/api/m3/expenses", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
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
    Promise.all([fetchExpenses(), fetchVehicles()]).finally(() => setLoading(false));
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
      
      let url = "http://localhost:3000/api/m3/expenses";
      let bodyData = {
        vehicleId: parseInt(formData.vehicleId),
        description: formData.description || "Fuel",
        cost: parseFloat(formData.cost),
        type: formData.type,
        date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString()
      };

      if (formData.type === "Fuel") {
        url = "http://localhost:3000/api/m3/fuel";
        bodyData = {
          vehicleId: parseInt(formData.vehicleId),
          liters: parseFloat(formData.liters),
          cost: parseFloat(formData.cost),
          date: bodyData.date
        };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      });

      if (res.ok) {
        setShowForm(false);
        setFormData({ vehicleId: "", type: "Fuel", description: "", cost: "", liters: "", date: "" });
        await fetchExpenses();
        if (formData.type === "Fuel") {
          alert("Fuel Logged Successfully! Note: Fuel logs are tracked separately for reporting.");
        }
      } else {
        const data = await res.json();
        setFormError(data.error || "Failed to create log");
      }
    } catch (err) {
      setFormError("Network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="min-h-full">
      <motion.div variants={itemVariants} className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Fuel & Expenses</h1>
          <p className="text-sm text-slate-600 mt-1 font-medium">Log fuel consumption, tolls, and other operational costs.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600/90 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-indigo-200 backdrop-blur-md transition-colors flex items-center gap-2">
          {showForm ? <><MdClose className="text-lg" /> Cancel</> : <><MdAdd className="text-lg" /> Log Expense</>}
        </button>
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
              <h2 className="text-lg font-bold text-slate-800 mb-6">Record New Expense</h2>
              
              {formError && (
                <div className="mb-6 bg-rose-100/80 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm font-semibold shadow-sm">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase">Expense Type</label>
                  <select 
                    required name="type" value={formData.type} onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  >
                    <option value="Fuel">Fuel</option>
                    <option value="Toll">Toll</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase">Select Vehicle</label>
                  <select 
                    required name="vehicleId" value={formData.vehicleId} onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  >
                    <option value="">-- Select --</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.registrationNumber}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase">Total Cost ($)</label>
                  <input 
                    required type="number" step="0.01" name="cost" value={formData.cost} onChange={handleChange} placeholder="0.00"
                    className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                {formData.type === "Fuel" ? (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase">Liters</label>
                    <input 
                      required type="number" step="0.1" name="liters" value={formData.liters} onChange={handleChange} placeholder="e.g. 50"
                      className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase">Description</label>
                    <input 
                      required type="text" name="description" value={formData.description} onChange={handleChange} placeholder="e.g. Bridge Toll"
                      className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/50">
                <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-md transition-all disabled:opacity-70">
                  {submitting ? "Saving..." : "Save Record"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="p-8 text-center text-slate-500 font-medium">Loading expenses...</div>
      ) : (
        <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/30 border-b border-white/40">
                <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle ID</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {expenses.map(exp => (
                <motion.tr whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }} key={exp.id} className="transition-colors cursor-pointer">
                  <td className="py-3 px-6 flex items-center gap-2 font-bold text-slate-600 text-sm">
                    {exp.type === 'Fuel' ? <MdLocalGasStation className="text-teal-500" /> : <MdAttachMoney className="text-indigo-500" />}
                    {exp.type}
                  </td>
                  <td className="py-3 px-6 font-semibold text-slate-700 text-sm">{new Date(exp.date).toLocaleDateString()}</td>
                  <td className="py-3 px-6 font-medium text-indigo-600 text-sm">Vehicle #{exp.vehicleId}</td>
                  <td className="py-3 px-6 font-medium text-slate-800 text-sm">{exp.description}</td>
                  <td className="py-3 px-6 font-extrabold text-rose-600 text-sm">${exp.cost.toLocaleString()}</td>
                </motion.tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500 font-medium">No expenses recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Expenses;
