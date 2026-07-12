import { useState } from "react";
import { motion } from "framer-motion";
import { MdDirectionsCar, MdArrowBack } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function AddVehicle() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    registrationNumber: "",
    make: "",
    model: "",
    capacityWeight: "",
    acquisitionCost: "",
    status: "Available"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("transitops_token");
      const res = await fetch("http://localhost:3000/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          capacityWeight: parseFloat(formData.capacityWeight) || 0,
          acquisitionCost: parseFloat(formData.acquisitionCost) || 0
        })
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/vehicles");
      } else {
        setError(data.error || "Failed to add vehicle");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="min-h-full max-w-3xl mx-auto">
      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
        <Link to="/vehicles" className="p-2 bg-white/50 backdrop-blur-sm rounded-lg hover:bg-white/80 transition-colors shadow-sm text-slate-600">
          <MdArrowBack className="text-xl" />
        </Link>
        <div>
          <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Add New Vehicle</h1>
          <p className="text-sm text-slate-600 mt-1 font-medium">Register a new vehicle into the fleet database.</p>
        </div>
      </motion.div>

      <motion.form variants={itemVariants} onSubmit={handleSubmit} className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-8">
        
        {error && (
          <div className="mb-6 bg-rose-100/80 backdrop-blur-sm border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm font-semibold shadow-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase">Registration Number</label>
            <input 
              required
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              type="text" 
              placeholder="e.g. MH-12-AB-1234"
              className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder:text-slate-400 backdrop-blur-md shadow-sm transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase">Make</label>
            <input 
              required
              name="make"
              value={formData.make}
              onChange={handleChange}
              type="text" 
              placeholder="e.g. Ford"
              className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder:text-slate-400 backdrop-blur-md shadow-sm transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase">Model</label>
            <input 
              required
              name="model"
              value={formData.model}
              onChange={handleChange}
              type="text" 
              placeholder="e.g. Transit Connect"
              className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder:text-slate-400 backdrop-blur-md shadow-sm transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase">Capacity Weight (kg)</label>
            <input 
              required
              name="capacityWeight"
              value={formData.capacityWeight}
              onChange={handleChange}
              type="number" 
              placeholder="e.g. 1500"
              className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder:text-slate-400 backdrop-blur-md shadow-sm transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase">Acquisition Cost ($)</label>
            <input 
              required
              name="acquisitionCost"
              value={formData.acquisitionCost}
              onChange={handleChange}
              type="number" 
              placeholder="e.g. 35000"
              className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder:text-slate-400 backdrop-blur-md shadow-sm transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase">Initial Status</label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-md shadow-sm transition-all font-semibold text-slate-700"
            >
              <option value="Available">Available</option>
              <option value="In Shop">In Shop</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/40">
          <button 
            disabled={loading}
            type="submit" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-indigo-200/50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? "Registering..." : (
              <>
                <MdDirectionsCar className="text-lg" />
                Register Vehicle
              </>
            )}
          </button>
        </div>

      </motion.form>
    </motion.div>
  );
}

export default AddVehicle;
