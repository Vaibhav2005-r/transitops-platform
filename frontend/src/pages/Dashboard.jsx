import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  MdDirectionsCar, MdCheckCircle, MdBuild, MdLocalGasStation, MdPerson, MdTrendingUp,
} from "react-icons/md";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid,
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

const carIconHtml = renderToStaticMarkup(<MdDirectionsCar style={{ fontSize: '16px', color: '#1e293b' }} />);
const carIcon = L.divIcon({
  html: `<div style="background-color: #facc15; padding: 4px; border-radius: 4px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center; width: 24px; height: 24px;">${carIconHtml}</div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// --- Animated Count-Up Number ---
function AnimatedNumber({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 35, stiffness: 150 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) motionValue.set(Number(value) || 0);
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return spring.on("change", (v) => setDisplay(Math.round(v)));
  }, [spring]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 26 } },
};

const kpiConfig = [
  { key: "totalVehicles",     title: "Total Vehicles",    icon: <MdDirectionsCar />,   gradient: "from-blue-500 to-indigo-600",   shadow: "shadow-blue-500/20"   },
  { key: "activeVehicles",    title: "Active Today",      icon: <MdCheckCircle />,     gradient: "from-emerald-400 to-teal-600",  shadow: "shadow-teal-500/20"   },
  { key: "underMaintenance",  title: "In Maintenance",    icon: <MdBuild />,           gradient: "from-rose-400 to-red-600",      shadow: "shadow-rose-500/20"   },
  { key: "avgFuelEfficiency", title: "Avg Fuel Eff.",     icon: <MdLocalGasStation />, gradient: "from-amber-400 to-orange-500",  shadow: "shadow-amber-500/20", suffix: " km/l" },
  { key: "totalDrivers",      title: "Total Drivers",     icon: <MdPerson />,          gradient: "from-violet-500 to-purple-600", shadow: "shadow-violet-500/20" },
  { key: "totalTrips",        title: "Total Trips",       icon: <MdTrendingUp />,      gradient: "from-pink-500 to-rose-600",     shadow: "shadow-pink-500/20"   },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-white/60 dark:border-slate-600/60 rounded-xl px-3 py-2 shadow-xl text-xs">
        {label && <p className="font-bold text-slate-600 dark:text-slate-300 mb-1">{label}</p>}
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">
            {p.name}: {typeof p.value === "number" ? `₹${Math.round(p.value).toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState("7");
  const userName = localStorage.getItem("transitops_user") || "there";
  const greetingName = userName.split(" ")[0];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("transitops_token");
        if (!token) { window.location.href = "/login"; return; }
        const res = await fetch(`http://localhost:3000/api/reports/dashboard?filter=${timeFilter}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) { localStorage.removeItem("transitops_token"); window.location.href = "/login"; return; }
        const json = await res.json();
        if (json.success) setData(json.data);
        else setError(json.error || "Server returned an error.");
      } catch {
        setError("Could not reach the backend. Please ensure it is running on port 3000.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [timeFilter]);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-4 min-h-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 rounded-full"
        />
        <p className="font-semibold text-slate-500 dark:text-slate-400">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-full flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-rose-100 dark:bg-rose-900/30 text-rose-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Dashboard Unavailable</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{error || "Failed to load dashboard data."}</p>
          <button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-semibold text-sm shadow-md transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="min-h-full space-y-6">

      {/* HEADER */}
      <motion.div variants={itemVariants} className="flex justify-between items-start">
        <div>
          <h1 className="text-[28px] font-bold text-slate-800 dark:text-white tracking-tight">
            {greeting}, <span className="text-indigo-600 dark:text-indigo-400">{greetingName}!</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Here's your fleet health overview at a glance.
          </p>
        </div>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="border border-white/50 dark:border-slate-600/50 rounded-xl py-1.5 px-3 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm shadow-sm hover:bg-white/70 dark:hover:bg-slate-700 transition-colors outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="month">This Month</option>
        </select>
      </motion.div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiConfig.map((kpi) => {
          const rawVal = data[kpi.key];
          const displayVal = Math.round(Number(rawVal) || 0);
          return (
            <motion.div
              key={kpi.key}
              variants={itemVariants}
              whileHover={{ scale: 1.04, y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl p-4 shadow-xl flex flex-col justify-between cursor-default"
            >
              <div className="flex justify-between items-start mb-3">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-tight w-16">{kpi.title}</p>
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className={`w-8 h-8 rounded-xl bg-gradient-to-br ${kpi.gradient} ${kpi.shadow} shadow-lg flex items-center justify-center text-white text-base`}
                >
                  {kpi.icon}
                </motion.div>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tabular-nums">
                <AnimatedNumber value={displayVal} />
                {kpi.suffix && <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 ml-0.5">{kpi.suffix}</span>}
              </h2>
            </motion.div>
          );
        })}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* DONUT CHART */}
        <motion.div variants={itemVariants} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Fleet Status</h3>
            <span className="text-[10px] font-semibold text-indigo-500 cursor-pointer hover:underline">View More</span>
          </div>
          <div className="h-52 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.fleetStatusByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%" cy="50%"
                  innerRadius={52} outerRadius={78}
                  paddingAngle={3}
                  animationBegin={200}
                  animationDuration={800}
                >
                  {data.fleetStatusByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">Total</span>
              <span className="text-2xl font-black text-slate-800 dark:text-white leading-tight">
                {data.fleetStatusByCategory.reduce((a, b) => a + b.value, 0)}
              </span>
            </div>
          </div>
          <div className="flex justify-center flex-wrap gap-x-4 gap-y-1.5 mt-2">
            {data.fleetStatusByCategory.map((cat, i) => {
              const total = data.fleetStatusByCategory.reduce((a, b) => a + b.value, 0) || 1;
              return (
                <div key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.fill }} />
                  <span>{cat.name} ({Math.round((cat.value / total) * 100)}%)</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* AREA CHART */}
        <motion.div variants={itemVariants} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Fuel vs Maintenance</h3>
            <span className="text-[10px] font-semibold text-indigo-500 cursor-pointer hover:underline">View More</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.fuelVsMaintenance} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="maintGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: 600 }} tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Maintenance" stroke="#14b8a6" strokeWidth={2} fill="url(#maintGrad)" animationDuration={900} />
                <Area type="monotone" dataKey="Fuel" stroke="#818cf8" strokeWidth={2} fill="url(#fuelGrad)" animationDuration={900} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-[10px] font-bold mt-2 text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded bg-teal-500" /><span>Maintenance</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded bg-indigo-400" /><span>Fuel Costs</span></div>
          </div>
        </motion.div>

        {/* TOP DRIVERS */}
        <motion.div variants={itemVariants} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Top Drivers</h3>
            <span className="text-[10px] font-semibold text-indigo-500 cursor-pointer hover:underline">View More</span>
          </div>
          <div className="space-y-3">
            {data.topDrivers.map((driver, idx) => (
              <motion.div
                key={driver.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08, type: "spring", stiffness: 280, damping: 26 }}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(driver.name)}&background=random&bold=true`}
                      alt={driver.name}
                      className="w-9 h-9 rounded-full shadow-sm ring-2 ring-white dark:ring-slate-700"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-800" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-800 dark:text-white leading-tight">{driver.name}</p>
                    <Link to={`/driver/${driver.id}`} className="text-[10px] font-semibold text-indigo-500 hover:underline">
                      View Profile
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-lg text-xs font-bold">
                    {Math.round(driver.safetyScore)}
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5">score</span>
                </div>
              </motion.div>
            ))}
            {data.topDrivers.length === 0 && (
              <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">No driver data available.</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* LIVE MAP */}
      <motion.div
        variants={itemVariants}
        className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b border-white/40 dark:border-slate-700/40">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-2 h-2 rounded-full bg-emerald-400"
            />
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Live Map</h3>
          </div>
          <span className="text-[10px] font-semibold text-indigo-500 cursor-pointer hover:underline">Detail View</span>
        </div>
        <div className="h-72 bg-slate-100 dark:bg-slate-900 relative">
          <MapContainer 
            center={[21.1458, 79.0882]} 
            zoom={4.5} 
            style={{ height: '100%', width: '100%', zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {data.liveVehicles && data.liveVehicles.map(vehicle => (
              <Marker key={vehicle.id} position={[vehicle.lat, vehicle.lng]} icon={carIcon}>
                <Popup className="font-semibold text-sm">
                  {vehicle.make} {vehicle.model} ({vehicle.registrationNumber})<br/>
                  <span className={
                    vehicle.status === 'Available' ? 'text-teal-600' :
                    vehicle.status === 'On Trip' ? 'text-blue-600' :
                    'text-rose-600'
                  }>Status: {vehicle.status}</span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </motion.div>

    </motion.div>
  );
}

export default Dashboard;