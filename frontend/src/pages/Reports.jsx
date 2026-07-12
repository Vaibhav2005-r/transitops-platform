import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MdTrendingUp, MdLocalShipping, MdBuild, MdPeople, MdDownload } from "react-icons/md";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

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

  const exportToCSV = () => {
    if (!kpis) return;
    
    // Create CSV content from KPIs
    const csvRows = [];
    csvRows.push("Metric,Value");
    csvRows.push(`Fleet Utilization (%),${kpis.fleetUtilization || 0}`);
    csvRows.push(`Active Trips,${kpis.activeTrips || 0}`);
    csvRows.push(`Pending Trips,${kpis.pendingTrips || 0}`);
    csvRows.push(`Drivers On Duty,${kpis.driversOnDuty || 0}`);
    csvRows.push(`Available Vehicles,${kpis.availableVehicles || 0}`);
    csvRows.push(`Vehicles In Maintenance,${kpis.vehiclesInMaintenance || 0}`);
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `transitops_fleet_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-3 h-full">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 rounded-full" />
        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Loading fleet analysis...</p>
      </div>
    );
  }

  if (!kpis) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-3 h-full">
        <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center">
          <MdTrendingUp className="text-xl" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Failed to load analytics data.</p>
      </div>
    );
  }

  const statCards = [
    { title: "Fleet Utilization", value: `${Math.round(kpis.fleetUtilization || 0)}%`, icon: <MdTrendingUp className="text-teal-500" />, color: "border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20" },
    { title: "Active Trips", value: Math.round(kpis.activeTrips || 0), icon: <MdLocalShipping className="text-blue-500" />, color: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20" },
    { title: "Pending Trips", value: Math.round(kpis.pendingTrips || 0), icon: <MdLocalShipping className="text-amber-500" />, color: "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20" },
    { title: "Drivers On Duty", value: Math.round(kpis.driversOnDuty || 0), icon: <MdPeople className="text-indigo-500" />, color: "border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20" },
    { title: "Available Vehicles", value: Math.round(kpis.availableVehicles || 0), icon: <MdLocalShipping className="text-emerald-500" />, color: "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20" },
    { title: "Vehicles In Shop", value: Math.round(kpis.vehiclesInMaintenance || 0), icon: <MdBuild className="text-rose-500" />, color: "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20" },
  ];

  // Data for Recharts
  const chartData = [
    { name: "Available", count: kpis.availableVehicles || 0, color: "#10b981" }, // emerald-500
    { name: "On Trip", count: kpis.activeTrips || 0, color: "#3b82f6" }, // blue-500
    { name: "In Shop", count: kpis.vehiclesInMaintenance || 0, color: "#f43f5e" } // rose-500
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="min-h-full">
      <motion.div variants={itemVariants} className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-slate-800 dark:text-white tracking-tight">Fleet Analysis</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">Deep dive into fleet performance and operational KPIs.</p>
        </div>
        <div className="flex gap-2">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => window.print()} className="bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm backdrop-blur-md transition-colors flex items-center gap-2">
            Export PDF
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={exportToCSV}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-colors flex items-center gap-2"
          >
            <MdDownload className="text-lg" />
            Export CSV
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -4 }}
            key={idx} 
            className={`bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border ${stat.color} rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col justify-between transition-all`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">{stat.title}</h3>
              <div className="p-1.5 bg-white dark:bg-slate-800/80 rounded-full shadow-sm">
                {stat.icon}
              </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-800 dark:text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Current Vehicle Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600/90 dark:to-purple-800/90 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none p-8 text-white flex flex-col justify-center items-center text-center">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }} 
            transition={{ repeat: Infinity, duration: 3 }}
            className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm"
          >
            <MdTrendingUp className="text-4xl" />
          </motion.div>
          <h3 className="text-2xl font-bold mb-2">Operational Excellence</h3>
          <p className="text-indigo-100 dark:text-indigo-200 font-medium max-w-sm">
            Your fleet utilization is currently at {Math.round(kpis.fleetUtilization)}%. Keep dispatching available vehicles to maximize your return on investment.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Reports;