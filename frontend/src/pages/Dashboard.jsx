import {
  FaTruck,
  FaUserTie,
  FaRoute,
  FaTools,
  FaArrowUp,
  FaExclamationTriangle,
  FaClock,
  FaWrench,
} from "react-icons/fa";

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
  Legend,
} from "recharts";

const stats = [
  {
    title: "Total Vehicles",
    value: "124",
    detail: "+8 this month",
    icon: <FaTruck />,
  },
  {
    title: "Available Drivers",
    value: "42",
    detail: "6 currently on trip",
    icon: <FaUserTie />,
  },
  {
    title: "Active Trips",
    value: "18",
    detail: "3 deliveries delayed",
    icon: <FaRoute />,
  },
  {
    title: "Maintenance Due",
    value: "12",
    detail: "4 critical issues",
    icon: <FaTools />,
  },
];

const fleetData = [
  { day: "Mon", utilization: 68 },
  { day: "Tue", utilization: 76 },
  { day: "Wed", utilization: 72 },
  { day: "Thu", utilization: 88 },
  { day: "Fri", utilization: 79 },
  { day: "Sat", utilization: 74 },
  { day: "Sun", utilization: 63 },
];

const tripData = [
  { name: "Completed", value: 56 },
  { name: "Active", value: 28 },
  { name: "Delayed", value: 10 },
  { name: "Cancelled", value: 6 },
];

const tripColors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

const recentTrips = [
  {
    id: "TR-8821",
    vehicle: "MH-04-AB-1245",
    driver: "Rahul Sharma",
    destination: "Pune",
    status: "Active",
  },
  {
    id: "TR-8819",
    vehicle: "MH-02-CD-4581",
    driver: "Aman Verma",
    destination: "Nashik",
    status: "Delayed",
  },
  {
    id: "TR-8818",
    vehicle: "MH-12-EF-9023",
    driver: "Priya Singh",
    destination: "Mumbai",
    status: "Completed",
  },
  {
    id: "TR-8815",
    vehicle: "MH-01-GH-7632",
    driver: "Arjun Patel",
    destination: "Surat",
    status: "Active",
  },
];

const maintenanceAlerts = [
  {
    vehicle: "MH-04-AB-1245",
    issue: "Engine service overdue",
    priority: "Critical",
    time: "2 hours ago",
  },
  {
    vehicle: "MH-12-EF-9023",
    issue: "Brake inspection required",
    priority: "High",
    time: "5 hours ago",
  },
  {
    vehicle: "MH-02-CD-4581",
    issue: "Oil change scheduled",
    priority: "Medium",
    time: "Yesterday",
  },
];

function Dashboard() {
  const getTripStatusStyle = (status) => {
    if (status === "Active") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (status === "Delayed") {
      return "bg-amber-100 text-amber-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  const getPriorityStyle = (priority) => {
    if (priority === "Critical") {
      return "bg-red-100 text-red-700";
    }

    if (priority === "High") {
      return "bg-orange-100 text-orange-700";
    }

    return "bg-amber-100 text-amber-700";
  };

  return (
    <div>
      {/* HEADER */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Real-time overview of your fleet performance
        </p>
      </div>

      {/* KPI CARDS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {stat.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                  {stat.value}
                </h2>

                <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                  {stat.title === "Total Vehicles" && (
                    <FaArrowUp className="text-emerald-500" />
                  )}

                  {stat.title === "Maintenance Due" && (
                    <FaExclamationTriangle className="text-red-500" />
                  )}

                  {stat.detail}
                </p>
              </div>

              <div className="rounded-lg bg-emerald-50 p-3 text-xl text-emerald-600">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-800">
                Fleet Utilization
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Vehicle utilization over the last 7 days
              </p>
            </div>

            <span className="text-xs font-medium text-emerald-600">
              Weekly
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fleetData}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey="utilization"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-800">
            Trip Status
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Distribution of current trips
          </p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tripData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {tripData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={tripColors[index]}
                    />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT TRIPS + MAINTENANCE */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* RECENT TRIPS */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <div>
              <h2 className="font-bold text-slate-800">
                Recent Trips
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest fleet transportation activity
              </p>
            </div>

            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">Trip ID</th>
                  <th className="px-5 py-4">Vehicle</th>
                  <th className="px-5 py-4">Driver</th>
                  <th className="px-5 py-4">Destination</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentTrips.map((trip) => (
                  <tr
                    key={trip.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                      {trip.id}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {trip.vehicle}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {trip.driver}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {trip.destination}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getTripStatusStyle(
                          trip.status
                        )}`}
                      >
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MAINTENANCE ALERTS */}

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="font-bold text-slate-800">
              Maintenance Alerts
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Vehicles requiring attention
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {maintenanceAlerts.map((alert) => (
              <div key={alert.vehicle} className="p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-red-50 p-2 text-red-500">
                    <FaWrench />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-700">
                        {alert.vehicle}
                      </p>

                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${getPriorityStyle(
                          alert.priority
                        )}`}
                      >
                        {alert.priority}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      {alert.issue}
                    </p>

                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                      <FaClock />
                      {alert.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 p-4 text-center">
            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              View Maintenance Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;