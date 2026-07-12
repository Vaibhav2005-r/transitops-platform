import { NavLink } from "react-router-dom";

import {
  FaTachometerAlt,
  FaTruck,
  FaUserTie,
  FaRoute,
  FaTools,
  FaChartBar,
} from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", icon: <FaTachometerAlt />, path: "/" },
  { name: "Vehicles", icon: <FaTruck />, path: "/vehicles" },
  { name: "Drivers", icon: <FaUserTie />, path: "/drivers" },
  { name: "Trips", icon: <FaRoute />, path: "/trips" },
  { name: "Maintenance", icon: <FaTools />, path: "/maintenance" },
  { name: "Reports", icon: <FaChartBar />, path: "/reports" },
];

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white shadow-xl">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-3xl font-bold text-emerald-400">
          🚚 TransitOps
        </h1>
      </div>

      <nav className="mt-6 px-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-4 mb-1 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-emerald-500 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;