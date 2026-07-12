import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MdDirectionsCar, MdSearch, MdAdd } from "react-icons/md";
import { Link, useSearchParams } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const userRole = localStorage.getItem("transitops_role");
  const fileInputRef = useRef(null);
  const [selectedVehicleForDoc, setSelectedVehicleForDoc] = useState(null);

  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  const handleDocUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      alert(`Successfully uploaded ${e.target.files[0].name} to vehicle ${selectedVehicleForDoc}!`);
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        let token = localStorage.getItem("transitops_token");
        if (!token) return; // Should be handled by layout/auth layer ideally

        const res = await fetch("http://localhost:3000/api/vehicles", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        setVehicles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch vehicles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(v => {
    const search = (searchTerm || "").toLowerCase();
    return (v.registrationNumber || "").toLowerCase().includes(search) ||
           (v.make || "").toLowerCase().includes(search) ||
           (v.model || "").toLowerCase().includes(search);
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'On Trip': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'In Shop': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Retired': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="min-h-full">
      <motion.div variants={itemVariants} className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-slate-800 dark:text-white tracking-tight">Vehicle Directory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage and monitor all vehicles in your fleet.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchParams(e.target.value ? { q: e.target.value } : {}, { replace: true });
              }}
              className="pl-9 pr-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-white/60 dark:border-slate-600/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-64 placeholder:text-slate-400 dark:placeholder:text-slate-500 backdrop-blur-md shadow-sm transition-all dark:text-slate-200"
            />
          </div>
          {userRole === "Fleet Manager" && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/add-vehicle" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-colors flex items-center gap-2">
                <MdAdd className="text-lg" />
                Add Vehicle
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>

      {loading ? (
        <div className="p-8 flex flex-col items-center justify-center gap-3">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 rounded-full" />
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Loading vehicles...</p>
        </div>
      ) : (
        <motion.div variants={itemVariants} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/30 dark:bg-slate-700/30 border-b border-white/40 dark:border-slate-700/40">
                <th className="py-3 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vehicle</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reg. Number</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Capacity (kg)</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Acquisition Cost</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Docs</th>
                {userRole === "Fleet Manager" && <th className="py-3 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40 dark:divide-slate-700/40">
              {filteredVehicles.map((vehicle) => (
                <motion.tr
                  key={vehicle.id}
                  onClick={() => alert(`Vehicle Profile for ${vehicle.registrationNumber} is currently simulated for the demo. Future feature coming soon!`)}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  className="transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-6 flex items-center gap-3">
                    <motion.div whileHover={{ rotate: 10 }} className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 p-2 rounded-xl shadow-sm">
                      <MdDirectionsCar className="text-xl" />
                    </motion.div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white text-sm">{vehicle.make} {vehicle.model}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">ID: #{vehicle.id}</p>
                    </div>
                  </td>
                  <td className="py-3 px-6 font-semibold text-slate-700 dark:text-slate-300 text-sm">{vehicle.registrationNumber}</td>
                  <td className="py-3 px-6 font-medium text-slate-600 dark:text-slate-400 text-sm">{Math.round(vehicle.capacityWeight)}</td>
                  <td className="py-3 px-6 font-medium text-slate-600 dark:text-slate-400 text-sm">₹{Math.round(vehicle.acquisitionCost).toLocaleString()}</td>
                  <td className="py-3 px-6">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border shadow-sm ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedVehicleForDoc(vehicle.registrationNumber); fileInputRef.current.click(); }}
                      className="text-[11px] font-bold text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-2 py-1 rounded-lg transition-colors"
                    >
                      Upload Docs
                    </button>
                  </td>
                  {userRole === "Fleet Manager" && (
                    <td className="py-3 px-6 text-right">
                      <button className="text-indigo-500 hover:text-indigo-700 text-xs font-bold mr-3 transition-colors" onClick={(e) => { e.stopPropagation(); alert('Edit coming soon!'); }}>Edit</button>
                      <button className="text-rose-500 hover:text-rose-700 text-xs font-bold transition-colors" onClick={(e) => { e.stopPropagation(); alert('Delete coming soon!'); }}>Delete</button>
                    </td>
                  )}
                </motion.tr>
              ))}
              {filteredVehicles.length === 0 && (
                <tr>
                  <td colSpan={userRole === "Fleet Manager" ? "7" : "6"} className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">No vehicles found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <input type="file" ref={fileInputRef} onChange={handleDocUpload} className="hidden" accept=".pdf,.jpg,.png" />
        </motion.div>
      )}
    </motion.div>
  );
}

export default Vehicles;