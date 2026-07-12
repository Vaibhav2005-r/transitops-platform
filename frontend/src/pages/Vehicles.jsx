import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MdDirectionsCar, MdSearch, MdAdd } from "react-icons/md";
import { Link } from "react-router-dom";

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
          <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Vehicle Directory</h1>
          <p className="text-sm text-slate-600 mt-1 font-medium">Manage and monitor all vehicles in your fleet.</p>
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
              className="pl-9 pr-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 w-64 placeholder:text-slate-500 backdrop-blur-md shadow-sm transition-all"
            />
          </div>
          {userRole === "Fleet Manager" && (
            <Link to="/add-vehicle" className="bg-indigo-600/90 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-indigo-200 backdrop-blur-md transition-colors flex items-center gap-2">
              <MdAdd className="text-lg" />
              Add Vehicle
            </Link>
          )}
        </div>
      </motion.div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 font-medium">Loading vehicles...</div>
      ) : (
        <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/30 border-b border-white/40">
                <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Reg. Number</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity (kg)</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Acquisition Cost</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Docs</th>
                {userRole === "Fleet Manager" && <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {filteredVehicles.map(vehicle => (
                <motion.tr onClick={() => alert(`Vehicle Profile for ${vehicle.registrationNumber} is currently simulated for the demo. Future feature coming soon!`)} whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }} key={vehicle.id} className="transition-colors cursor-pointer">
                  <td className="py-3 px-6 flex items-center gap-3">
                    <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg shadow-sm">
                      <MdDirectionsCar className="text-xl" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{vehicle.make} {vehicle.model}</p>
                      <p className="text-xs text-slate-500">ID: #{vehicle.id}</p>
                    </div>
                  </td>
                  <td className="py-3 px-6 font-semibold text-slate-700 text-sm">{vehicle.registrationNumber}</td>
                  <td className="py-3 px-6 font-medium text-slate-600 text-sm">{vehicle.capacityWeight}</td>
                  <td className="py-3 px-6 font-medium text-slate-600 text-sm">₹{vehicle.acquisitionCost.toLocaleString()}</td>
                  <td className="py-3 px-6">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded border shadow-sm ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setSelectedVehicleForDoc(vehicle.registrationNumber);
                        fileInputRef.current.click();
                      }}
                      className="text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
                    >
                      Upload Docs
                    </button>
                  </td>
                  {userRole === "Fleet Manager" && (
                    <td className="py-3 px-6 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 text-xs font-bold mr-3" onClick={(e) => { e.stopPropagation(); alert('Edit coming soon!'); }}>Edit</button>
                      <button className="text-rose-600 hover:text-rose-800 text-xs font-bold" onClick={(e) => { e.stopPropagation(); alert('Delete coming soon!'); }}>Delete</button>
                    </td>
                  )}
                </motion.tr>
              ))}
              {filteredVehicles.length === 0 && (
                <tr>
                  <td colSpan={userRole === "Fleet Manager" ? "7" : "6"} className="py-8 text-center text-slate-500 font-medium">No vehicles found.</td>
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