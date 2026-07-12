import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MdDirectionsCar,
  MdCheckCircle,
  MdBuild,
  MdLocalGasStation,
  MdPerson,
} from "react-icons/md";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userName = localStorage.getItem("transitops_user") || "there";
  const greetingName = userName.split(" ")[0];
  const [timeFilter, setTimeFilter] = useState("7");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        setLoading(true);
        const token = localStorage.getItem("transitops_token");
        if (!token) {
          window.location.href = '/login';
          return;
        }
        const res = await fetch(`http://localhost:3000/api/reports/dashboard?filter=${timeFilter}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.status === 401) {
          localStorage.removeItem("transitops_token");
          window.location.href = '/login';
          return;
        }
        
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error || "Server returned an error.");
        }
      } catch (err) {
        setError("Could not reach the backend. Please ensure it is running on port 3000.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [timeFilter]);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-3 text-slate-500 min-h-full">
        <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <p className="font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-full flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-slate-200/50 p-8 text-center">
          <div className="bg-rose-100 text-rose-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-100">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Dashboard Unavailable</h2>
          <p className="text-slate-500 text-sm mb-6">{error || "Failed to load dashboard data."}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-semibold text-sm shadow-md shadow-indigo-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: "Total Vehicles",
      value: data.totalVehicles,
      icon: <MdDirectionsCar className="text-pink-500 text-xl" />,
    },
    {
      title: "Active Today",
      value: data.activeVehicles,
      icon: <MdCheckCircle className="text-green-500 text-xl" />,
    },
    {
      title: "Under Maintenance",
      value: data.underMaintenance,
      icon: <MdBuild className="text-red-500 text-xl" />,
    },
    {
      title: "Avg. Fuel Efficiency",
      value: `${data.avgFuelEfficiency} km/l`,
      icon: <MdLocalGasStation className="text-yellow-500 text-xl" />,
    },
    {
      title: "Total Drivers",
      value: data.totalDrivers,
      icon: <MdPerson className="text-blue-500 text-xl" />,
    },
    {
      title: "Total Trips",
      value: (data.totalTrips || 0).toLocaleString(),
      icon: <MdCheckCircle className="text-indigo-500 text-xl" />,
    },
  ];

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="min-h-full"
    >
      {/* HEADER */}
      <motion.div variants={itemVariants} className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Good morning, {greetingName}!</h1>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Here's the health overview of your fleet at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="border border-white/50 rounded-md py-1 px-3 text-xs font-semibold text-slate-600 bg-white/40 backdrop-blur-sm shadow-sm hover:bg-white/60 transition-colors outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </motion.div>

      {/* KPI ROW */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {kpis.map((kpi, index) => (
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -4 }}
            key={index} 
            className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl p-4 shadow-xl shadow-slate-200/50 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <p className="text-xs font-semibold text-slate-600 w-20 leading-tight">
                {kpi.title}
              </p>
              <div className="p-1 bg-white/50 rounded-full shadow-sm backdrop-blur-sm">
                {kpi.icon}
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-3 drop-shadow-sm">{kpi.value}</h2>
          </motion.div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* DONUT CHART */}
        <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-xl shadow-slate-200/50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-800 text-sm drop-shadow-sm">Fleet Status by Category</h3>
            <span className="text-[10px] font-semibold text-indigo-600 cursor-pointer hover:underline">View More</span>
          </div>
          <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.fleetStatusByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                >
                  {data.fleetStatusByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <span className="text-[10px] font-semibold text-slate-600">Total</span>
              <span className="text-xl font-bold text-slate-800 leading-tight">
                {data.fleetStatusByCategory.reduce((a, b) => a + b.value, 0)}
              </span>
            </div>
          </div>
          <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold mt-2">
            {data.fleetStatusByCategory.map((cat, i) => (
              <div key={i} className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-1 rounded" style={{ backgroundColor: cat.fill }}></span>
                <span>{cat.name} ({Math.round((cat.value / (data.fleetStatusByCategory.reduce((a,b)=>a+b.value,0)||1)) * 100)}%)</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* STACKED BAR CHART */}
        <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-xl shadow-slate-200/50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-800 text-sm drop-shadow-sm">Fuel vs Maintenance</h3>
            <span className="text-[10px] font-semibold text-indigo-600 cursor-pointer hover:underline">View More</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.fuelVsMaintenance} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.4)' }} contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="Maintenance" stackId="a" fill="#14b8a6" barSize={24} />
                <Bar dataKey="Fuel" stackId="a" fill="#818cf8" barSize={24} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-[10px] font-bold mt-3 text-slate-600">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-teal-500 shadow-sm"></div>
              <span>Maintenance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-sm"></div>
              <span>Fuel Costs</span>
            </div>
          </div>
        </motion.div>

        {/* TOP DRIVERS */}
        <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-xl shadow-slate-200/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 text-sm drop-shadow-sm">Top Drivers</h3>
            <span className="text-[10px] font-semibold text-indigo-600 cursor-pointer hover:underline">View More</span>
          </div>
          <div className="space-y-3.5">
            {data.topDrivers.map((driver) => (
              <motion.div whileHover={{ x: 4 }} key={driver.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/40 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(driver.name)}&background=random`} 
                    alt={driver.name} 
                    className="w-8 h-8 rounded-full shadow-sm" 
                  />
                  <div>
                    <p className="text-[13px] font-bold text-slate-800 leading-tight">{driver.name}</p>
                    <Link to={`/driver/${driver.id}`} className="text-[10px] font-semibold text-indigo-500 hover:underline">Visit Profile</Link>
                  </div>
                </div>
                <span className="font-extrabold text-slate-800 text-sm bg-white/60 px-2 py-1 rounded shadow-sm">{driver.safetyScore}</span>
              </motion.div>
            ))}
            {data.topDrivers.length === 0 && (
              <p className="text-sm text-slate-500">No driver data available.</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* MAP */}
      <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-white/40 bg-white/30 backdrop-blur-md">
          <h3 className="font-bold text-slate-800 text-sm drop-shadow-sm">Live Map</h3>
          <span className="text-[10px] font-semibold text-indigo-600 cursor-pointer hover:underline">Detail View</span>
        </div>
        <div className="h-72 bg-slate-100 relative">
          <MapContainer 
            center={[19.0760, 72.8777]} 
            zoom={10} 
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