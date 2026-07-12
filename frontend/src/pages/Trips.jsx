import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdLocalShipping, MdAdd, MdClose, MdCheckCircle, MdCancel, MdPlayArrow } from "react-icons/md";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Trips() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicleId: "",
    driverId: "",
    source: "",
    destination: "",
    cargoWeight: "",
    distance: ""
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem("transitops_token");
      const res = await fetch("http://localhost:3000/api/trips", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const token = localStorage.getItem("transitops_token");
      
      const vRes = await fetch("http://localhost:3000/api/vehicles?status=Available", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const vData = await vRes.json();
      
      const dRes = await fetch("http://localhost:3000/api/drivers?status=Available", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const dData = await dRes.json();
      
      setVehicles(Array.isArray(vData) ? vData : []);
      // Filter out expired drivers in the frontend just in case
      const validDrivers = Array.isArray(dData) ? dData.filter(d => new Date(d.licenseExpiryDate) >= new Date()) : [];
      setDrivers(validDrivers);
    } catch (err) {
      console.error("Failed to fetch dropdowns", err);
    }
  };

  useEffect(() => {
    Promise.all([fetchTrips(), fetchDropdownData()]).finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      const token = localStorage.getItem("transitops_token");
      const res = await fetch("http://localhost:3000/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          vehicleId: parseInt(formData.vehicleId),
          driverId: parseInt(formData.driverId),
          source: formData.source,
          destination: formData.destination,
          cargoWeight: parseFloat(formData.cargoWeight),
          distance: parseFloat(formData.distance)
        })
      });

      const data = await res.json();
      if (res.ok) {
        setShowForm(false);
        setFormData({ vehicleId: "", driverId: "", source: "", destination: "", cargoWeight: "", distance: "" });
        await fetchTrips();
        await fetchDropdownData();
      } else {
        setFormError(data.error || "Failed to create trip");
      }
    } catch (err) {
      setFormError("Network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (tripId, newStatus) => {
    try {
      const token = localStorage.getItem("transitops_token");
      const res = await fetch(`http://localhost:3000/api/trips/${tripId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        await fetchTrips();
        await fetchDropdownData(); // Vehicles/Drivers might be available again
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Network error occurred.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Dispatched': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="min-h-full">
      <motion.div variants={itemVariants} className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Trip Management</h1>
          <p className="text-sm text-slate-600 mt-1 font-medium">Create and track active assignments.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-indigo-600/90 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-indigo-200 backdrop-blur-md transition-colors flex items-center gap-2"
        >
          {showForm ? <><MdClose className="text-lg" /> Cancel</> : <><MdAdd className="text-lg" /> New Trip</>}
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
            <form onSubmit={handleCreate} className="p-6 md:p-8">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Draft a New Trip</h2>
              
              {formError && (
                <div className="mb-6 bg-rose-100/80 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm font-semibold shadow-sm">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase">Select Vehicle</label>
                  <select 
                    required name="vehicleId" value={formData.vehicleId} onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  >
                    <option value="">-- Available Vehicles --</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.registrationNumber} ({v.capacityWeight}kg max)</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase">Select Driver</label>
                  <select 
                    required name="driverId" value={formData.driverId} onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  >
                    <option value="">-- Available Drivers --</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>{d.name} (License: {d.licenseNumber})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase">Cargo Weight (kg)</label>
                  <input 
                    required type="number" name="cargoWeight" value={formData.cargoWeight} onChange={handleChange} placeholder="e.g. 450"
                    className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase">Source Location</label>
                  <input 
                    required type="text" name="source" value={formData.source} onChange={handleChange} placeholder="e.g. Warehouse A"
                    className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase">Destination</label>
                  <input 
                    required type="text" name="destination" value={formData.destination} onChange={handleChange} placeholder="e.g. Store 42"
                    className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase">Planned Est. Distance (km)</label>
                  <input 
                    required type="number" name="distance" value={formData.distance} onChange={handleChange} placeholder="e.g. 120"
                    className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/50">
                <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-md transition-all disabled:opacity-70">
                  {submitting ? "Creating..." : "Save Draft Trip"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 font-medium">Loading trips...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Route</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle & Driver</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {trips.map(trip => (
                  <tr key={trip.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4 text-sm font-semibold text-slate-700">#{trip.id}</td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-slate-800">{trip.source} <span className="text-slate-400 font-normal mx-1">→</span> {trip.destination}</div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">{trip.cargoWeight}kg • {trip.distance}km</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <MdLocalShipping className="text-indigo-400 text-base" />
                        {trip.vehicle?.registrationNumber || 'Unknown'}
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5 pl-6">Driver: {trip.driver?.name || 'Unknown'}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border shadow-sm ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {trip.status === 'Draft' && (
                        <button onClick={() => handleStatusChange(trip.id, 'Dispatched')} className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-lg transition-colors ml-2" title="Dispatch Trip">
                          <MdPlayArrow className="text-lg" />
                        </button>
                      )}
                      {trip.status === 'Dispatched' && (
                        <>
                          <button onClick={() => handleStatusChange(trip.id, 'Completed')} className="text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 p-1.5 rounded-lg transition-colors ml-2" title="Mark Completed">
                            <MdCheckCircle className="text-lg" />
                          </button>
                          <button onClick={() => handleStatusChange(trip.id, 'Cancelled')} className="text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 p-1.5 rounded-lg transition-colors ml-2" title="Cancel Trip">
                            <MdCancel className="text-lg" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {trips.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">No trips found. Create a draft trip above!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default Trips;