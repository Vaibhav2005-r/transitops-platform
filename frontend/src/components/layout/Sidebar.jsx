import {
  FaTachometerAlt,
  FaTruck,
  FaUserTie,
  FaRoute,
  FaTools,
  FaChartBar,
} from "react-icons/fa";

const menuItems = [
  {
    name: "Dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    name: "Vehicles",
    icon: <FaTruck />,
  },
  {
    name: "Drivers",
    icon: <FaUserTie />,
  },
  {
    name: "Trips",
    icon: <FaRoute />,
  },
  {
    name: "Maintenance",
    icon: <FaTools />,
  },
  {
    name: "Reports",
    icon: <FaChartBar />,
  },
];

function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-900 text-white shadow-xl">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-3xl font-bold text-emerald-400">
          🚚 TransitOps
        </h1>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-slate-800 transition-all duration-200"
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;