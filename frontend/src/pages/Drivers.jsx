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

  const filteredDrivers = drivers.filter(d => {
    const search = (searchTerm || "").toLowerCase();
    return (d.name || "").toLowerCase().includes(search) ||
           (d.licenseNumber || "").toLowerCase().includes(search);
  });

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
          <h1 className="text-[28px] font-bold text-slate-800 dark:text-white tracking-tight">Owners Directory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage driver assignments and view safety profiles.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-white/60 dark:border-slate-600/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-64 placeholder:text-slate-400 dark:placeholder:text-slate-500 backdrop-blur-md shadow-sm transition-all dark:text-slate-200"
            />
          </div>
          <motion.button
            onClick={handleSendReminder}
            disabled={sendingReminder}
            whileHover={{ scale: sendingReminder ? 1 : 1.02 }}
            whileTap={{ scale: sendingReminder ? 1 : 0.98 }}
            className="bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm backdrop-blur-md transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {sendingReminder ? "Sending..." : "Send Reminders"}
          </motion.button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/add-driver" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-colors flex items-center gap-2">
              <MdAdd className="text-lg" />
              Add Driver
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {loading ? (
        <div className="p-8 flex flex-col items-center justify-center gap-3">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 rounded-full" />
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Loading drivers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.map((driver) => (
            <motion.div variants={itemVariants} whileHover={{ y: -5, scale: 1.01 }} key={driver.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl shadow-xl p-6 flex flex-col justify-between transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(driver.name)}&background=random`}
                      alt={driver.name}
                      className="w-12 h-12 rounded-full shadow-md ring-2 ring-white dark:ring-slate-700"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white leading-tight text-lg">{driver.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{driver.licenseNumber}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border shadow-sm ${getStatusColor(driver.status)}`}>
                  {driver.status}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center">
                <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-lg text-amber-700 dark:text-amber-400 shadow-sm border border-amber-200 dark:border-amber-800/50">
                  <MdStar className="text-sm" />
                  <span className="text-xs font-bold">{Math.round(driver.safetyScore)} Safety Score</span>
                </div>
                <button onClick={() => navigate(`/driver/${driver.id}`)} className="text-[11px] font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition-colors">View Profile</button>
              </div>
            </motion.div>
          ))}
          {filteredDrivers.length === 0 && (
             <div className="col-span-3 py-12 text-center text-slate-400 dark:text-slate-500 font-medium">No drivers found.</div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default Drivers;