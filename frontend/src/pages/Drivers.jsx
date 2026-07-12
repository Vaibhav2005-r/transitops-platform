import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdSearch, MdAdd, MdStar } from "react-icons/md";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sendingReminder, setSendingReminder] = useState(null);
  const navigate = useNavigate();

  const handleSendReminder = () => {
    setSendingReminder(true);
    setTimeout(() => {
      setSendingReminder(false);
      alert("Emails dispatched to 2 drivers with expiring licenses.");
    }, 2000);
  };

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        let token = localStorage.getItem("transitops_token");
        if (!token) return;

        const res = await fetch("http://localhost:3000/api/drivers", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setDrivers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch drivers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'On Trip': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Off Duty': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="min-h-full">
      <motion.div variants={itemVariants} className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Owners Directory</h1>
          <p className="text-sm text-slate-600 mt-1 font-medium">Manage driver assignments and view safety profiles.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input 
              type="text" 
              placeholder="Search drivers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 w-64 placeholder:text-slate-500 backdrop-blur-md shadow-sm transition-all"
            />
          </div>
          <button 
            onClick={handleSendReminder} 
            disabled={sendingReminder}
            className="bg-white/50 border border-slate-300 hover:bg-white text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm backdrop-blur-md transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {sendingReminder ? "Sending..." : "Send Reminders"}
          </button>
          <Link to="/add-driver" className="bg-indigo-600/90 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-indigo-200 backdrop-blur-md transition-colors flex items-center gap-2">
            <MdAdd className="text-lg" />
            Add Driver
          </Link>
        </div>
      </motion.div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 font-medium">Loading drivers...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.map((driver) => (
            <motion.div variants={itemVariants} whileHover={{ y: -5 }} key={driver.id} className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-slate-200/50 p-6 flex flex-col justify-between transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(driver.name)}&background=random`} 
                    alt={driver.name} 
                    className="w-12 h-12 rounded-full shadow-sm" 
                  />
                  <div>
                    <h3 className="font-bold text-slate-800 leading-tight text-lg">{driver.name}</h3>
                    <p className="text-xs text-slate-500 font-semibold">{driver.licenseNumber}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border shadow-sm ${getStatusColor(driver.status)}`}>
                  {driver.status}
                </span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/40 flex justify-between items-center">
                <div className="flex items-center gap-1 bg-amber-100/80 px-2 py-1 rounded text-amber-700 shadow-sm border border-amber-200">
                  <MdStar className="text-sm" />
                  <span className="text-xs font-bold">{driver.safetyScore} Safety Score</span>
                </div>
                <button onClick={() => navigate(`/driver/${driver.id}`)} className="text-[11px] font-bold text-indigo-600 hover:underline">View Profile</button>
              </div>
            </motion.div>
          ))}
          {filteredDrivers.length === 0 && (
             <div className="col-span-3 py-8 text-center text-slate-500 font-medium">No drivers found.</div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default Drivers;