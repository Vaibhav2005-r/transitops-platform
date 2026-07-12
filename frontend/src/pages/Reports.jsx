import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MdTrendingUp, MdLocalShipping, MdBuild, MdPeople } from "react-icons/md";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Reports() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        let token = localStorage.getItem("transitops_token");
        if (!token) return;

        const res = await fetch("http://localhost:3000/api/reports/kpis", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setKpis(data);
      } catch (err) {
        console.error("Failed to fetch KPIs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchKpis();
  }, []);

  if (loading) {
    return <div className="p-8 flex items-center justify-center text-slate-500">Loading fleet analysis...</div>;
  }

  if (!kpis) {
    return <div className="p-8 text-red-500">Failed to load analytics data.</div>;
  }

  const statCards = [
    { title: "Fleet Utilization", value: `${kpis.fleetUtilization || 0}%`, icon: <MdTrendingUp className="text-teal-500" />, color: "border-teal-200 bg-teal-50" },
    { title: "Active Trips", value: kpis.activeTrips || 0, icon: <MdLocalShipping className="text-blue-500" />, color: "border-blue-200 bg-blue-50" },
    { title: "Pending Trips", value: kpis.pendingTrips || 0, icon: <MdLocalShipping className="text-amber-500" />, color: "border-amber-200 bg-amber-50" },
    { title: "Drivers On Duty", value: kpis.driversOnDuty || 0, icon: <MdPeople className="text-indigo-500" />, color: "border-indigo-200 bg-indigo-50" },
    { title: "Available Vehicles", value: kpis.availableVehicles || 0, icon: <MdLocalShipping className="text-emerald-500" />, color: "border-emerald-200 bg-emerald-50" },
    { title: "Vehicles In Shop", value: kpis.vehiclesInMaintenance || 0, icon: <MdBuild className="text-rose-500" />, color: "border-rose-200 bg-rose-50" },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="min-h-full">
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Fleet Analysis</h1>
        <p className="text-sm text-slate-600 mt-1 font-medium">Deep dive into fleet performance and operational KPIs.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            key={idx} 
            className={`bg-white/60 backdrop-blur-xl border ${stat.color} rounded-2xl p-6 shadow-xl shadow-slate-200/50 flex flex-col justify-between`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-bold text-slate-700">{stat.title}</h3>
              <div className="p-1.5 bg-white rounded-full shadow-sm">
                {stat.icon}
              </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-800">{stat.value}</p>
          </motion.div>
        ))}
      </div>
      
      <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-slate-200/50 p-8 text-center text-slate-500 font-medium">
        Detailed Vehicle Analytics Component placeholder. <br/>
        Select a vehicle from the directory to view its ROI and efficiency reports.
      </motion.div>
    </motion.div>
  );
}

export default Reports;