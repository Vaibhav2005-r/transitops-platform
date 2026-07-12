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
          <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Fleet Analysis</h1>
          <p className="text-sm text-slate-600 mt-1 font-medium">Deep dive into fleet performance and operational KPIs.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="bg-white/50 border border-slate-300 hover:bg-white text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm backdrop-blur-md transition-colors flex items-center gap-2">
            Export PDF
          </button>
          <button 
            onClick={exportToCSV}
            className="bg-indigo-600/90 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-indigo-200 backdrop-blur-md transition-colors flex items-center gap-2"
          >
            <MdDownload className="text-lg" />
            Export CSV
          </button>
        </div>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-slate-200/50 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Current Vehicle Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
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

        <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl shadow-indigo-200 p-8 text-white flex flex-col justify-center items-center text-center">
          <div className="bg-white/20 p-4 rounded-full mb-4">
            <MdTrendingUp className="text-4xl" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Operational Excellence</h3>
          <p className="text-indigo-100 font-medium max-w-sm">
            Your fleet utilization is currently at {kpis.fleetUtilization}%. Keep dispatching available vehicles to maximize your return on investment.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Reports;