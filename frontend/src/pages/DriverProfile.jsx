import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MdArrowBack, MdStar, MdCheckCircle, MdLocalShipping, MdHistory } from "react-icons/md";

function DriverProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const token = localStorage.getItem("transitops_token");
        const res = await fetch(`http://localhost:3000/api/drivers/${id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setDriver(data);
        } else {
          console.error("Failed to load driver");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDriver();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;
  if (!driver) return <div className="p-8 text-center text-rose-500">Driver not found.</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto min-h-full">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold mb-6 transition-colors">
        <MdArrowBack /> Back to Directory
      </button>

      <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-sky-400"></div>
        <div className="px-8 pb-8 flex flex-col md:flex-row gap-6 items-start -mt-12 relative">
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(driver.name)}&background=random&size=128`}
            alt={driver.name}
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg bg-white"
          />
          <div className="flex-1 pt-12 md:pt-14">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{driver.name}</h1>
                <p className="text-slate-500 font-medium">License: {driver.licenseNumber}</p>
              </div>
              <div className="flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-bold shadow-sm">
                <MdStar className="text-xl" />
                {driver.safetyScore} Score
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
                <p className="font-bold text-indigo-600">{driver.status}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase">License Expiry</p>
                <p className="font-bold text-slate-700">{new Date(driver.licenseExpiryDate).toLocaleDateString()}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase">Total Trips</p>
                <p className="font-bold text-slate-700">{driver.trips?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <MdHistory className="text-indigo-500" /> Trip History
      </h2>
      
      <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/30 border-b border-white/40">
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Trip ID</th>
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Cargo</th>
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/40">
            {driver.trips && driver.trips.length > 0 ? driver.trips.map(trip => (
              <tr key={trip.id}>
                <td className="py-3 px-6 font-bold text-slate-600 text-sm">#{trip.id}</td>
                <td className="py-3 px-6 font-medium text-slate-700 text-sm">{new Date(trip.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-6 font-medium text-slate-700 text-sm">{trip.cargoWeight} kg</td>
                <td className="py-3 px-6">
                  <span className="px-2 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-600">
                    {trip.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-slate-500 font-medium">No trips recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default DriverProfile;
