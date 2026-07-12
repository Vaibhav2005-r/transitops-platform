import { useState, useEffect } from "react";
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

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/reports/dashboard")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 flex items-center justify-center text-slate-500">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="p-8 text-red-500">Failed to load dashboard data. Is the backend running?</div>;
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
  ];

  return (
    <div className="bg-white min-h-full">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Good Morning, Ravi!</h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's the health overview of your fleet at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select className="border border-slate-200 rounded-md py-1 px-3 text-xs font-semibold text-slate-600 bg-white">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
          </select>
        </div>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <p className="text-xs font-semibold text-slate-500 w-20 leading-tight">
                {kpi.title}
              </p>
              <div className="p-1">
                {kpi.icon}
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mt-3">{kpi.value}</h2>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* DONUT CHART */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-800 text-sm">Fleet Status by Category</h3>
            <span className="text-[10px] font-semibold text-blue-500 cursor-pointer">View More</span>
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <span className="text-[10px] font-semibold text-slate-600">Diesel</span>
              <span className="text-xl font-bold text-slate-800 leading-tight">
                {data.fleetStatusByCategory.length > 0 
                  ? Math.round((data.fleetStatusByCategory[0].value / (data.fleetStatusByCategory.reduce((a,b)=>a+b.value,0)||1)) * 100) 
                  : 0}%
              </span>
            </div>
          </div>
          <div className="flex justify-center gap-4 text-[10px] font-bold mt-2">
            {data.fleetStatusByCategory.map((cat, i) => (
              <div key={i} className="flex items-center gap-1.5 text-slate-500">
                <span className="w-3 h-1 rounded" style={{ backgroundColor: cat.fill }}></span>
                <span>{cat.name} ({Math.round((cat.value / (data.fleetStatusByCategory.reduce((a,b)=>a+b.value,0)||1)) * 100)}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* STACKED BAR CHART */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-800 text-sm">Fuel vs Maintenance</h3>
            <span className="text-[10px] font-semibold text-blue-500 cursor-pointer">View More</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.fuelVsMaintenance} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="Maintenance" stackId="a" fill="#14b8a6" barSize={24} />
                <Bar dataKey="Fuel" stackId="a" fill="#fb7185" barSize={24} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-[10px] font-bold mt-3 text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-teal-500"></div>
              <span>Maintenance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-rose-400"></div>
              <span>Fuel Costs</span>
            </div>
          </div>
        </div>

        {/* TOP DRIVERS */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Top Drivers</h3>
            <span className="text-[10px] font-semibold text-blue-500 cursor-pointer">View More</span>
          </div>
          <div className="space-y-3.5">
            {data.topDrivers.map((driver, index) => (
              <div key={driver.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(driver.name)}&background=random`} 
                    alt={driver.name} 
                    className="w-8 h-8 rounded-full" 
                  />
                  <div>
                    <p className="text-[13px] font-bold text-slate-800 leading-tight">{driver.name}</p>
                    <a href="#" className="text-[10px] font-semibold text-blue-500 hover:underline">Visit Profile</a>
                  </div>
                </div>
                <span className="font-bold text-slate-800 text-sm">{driver.safetyScore}</span>
              </div>
            ))}
            {data.topDrivers.length === 0 && (
              <p className="text-sm text-slate-500">No driver data available.</p>
            )}
          </div>
        </div>
      </div>

      {/* MAP */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm">Live Map</h3>
          <span className="text-[10px] font-semibold text-blue-500 cursor-pointer">Detail View</span>
        </div>
        <div className="h-56 bg-slate-100 relative">
           <img 
            src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg" 
            alt="Map placeholder" 
            className="w-full h-full object-cover opacity-80"
          />
          {/* Mock Yellow Taxi Icons */}
          <div className="absolute top-[20%] left-[30%] bg-yellow-400 p-1.5 rounded-sm shadow-md rotate-12">
            <MdDirectionsCar className="text-slate-800 text-xs" />
          </div>
          <div className="absolute top-[60%] left-[65%] bg-yellow-400 p-1.5 rounded-sm shadow-md -rotate-12">
            <MdDirectionsCar className="text-slate-800 text-xs" />
          </div>
          <div className="absolute bottom-[20%] right-[30%] bg-yellow-400 p-1.5 rounded-sm shadow-md rotate-45">
            <MdDirectionsCar className="text-slate-800 text-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;