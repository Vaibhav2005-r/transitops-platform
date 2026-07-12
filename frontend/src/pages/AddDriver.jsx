import { useState } from "react";
import { motion } from "framer-motion";
import { MdPerson, MdArrowBack } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function AddDriver() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    licenseExpiryDate: "",
    safetyScore: "100"
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
      const res = await fetch("http://localhost:3000/api/drivers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          safetyScore: parseInt(formData.safetyScore) || 100
        })
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/drivers");
      } else {
        setError(data.error || "Failed to add driver");
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
        <Link to="/drivers" className="p-2 bg-white/50 backdrop-blur-sm rounded-lg hover:bg-white/80 transition-colors shadow-sm text-slate-600">
          <MdArrowBack className="text-xl" />
        </Link>
        <div>
          <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Add New Driver</h1>
          <p className="text-sm text-slate-600 mt-1 font-medium">Register a new driver into the fleet database.</p>
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
            <label className="text-xs font-bold text-slate-600 uppercase">Full Name</label>
            <input 
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text" 
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder:text-slate-400 backdrop-blur-md shadow-sm transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase">License Number</label>
            <input 
              required
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              type="text" 
              placeholder="e.g. D123456789"
              className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder:text-slate-400 backdrop-blur-md shadow-sm transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase">License Expiry Date</label>
            <input 
              required
              name="licenseExpiryDate"
              value={formData.licenseExpiryDate}
              onChange={handleChange}
              type="date" 
              className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder:text-slate-400 backdrop-blur-md shadow-sm transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase">Initial Safety Score</label>
            <input 
              required
              name="safetyScore"
              value={formData.safetyScore}
              onChange={handleChange}
              type="number" 
              min="0"
              max="100"
              placeholder="100"
              className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder:text-slate-400 backdrop-blur-md shadow-sm transition-all"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-200/50 mt-8">
          <Link to="/drivers" className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-md shadow-indigo-200 transition-all disabled:opacity-70"
          >
            {loading ? "Adding..." : (
              <>
                <MdPerson className="text-lg" />
                Add Driver
              </>
            )}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

export default AddDriver;
