import { NavLink } from "react-router-dom";
import {
  FaChartBar,
  FaCog,
  FaQuestionCircle,
  FaBell,
} from "react-icons/fa";
import { 
  MdDashboard, 
  MdDirectionsCar, 
  MdPeople,
  MdBuild,
  MdAddBox
} from "react-icons/md";

const menuItems = [
  { name: "My Dashboard", icon: <MdDashboard />, path: "/" },
  { name: "Add Vehicle", icon: <MdAddBox />, path: "/add-vehicle" },
  { name: "Vehicle Directory", icon: <MdDirectionsCar />, path: "/vehicles" },
  { name: "Owners Directory", icon: <MdPeople />, path: "/drivers" },
  { name: "Fleet Analytics", icon: <FaChartBar />, path: "/reports" },
  { name: "Maintenance Logs", icon: <MdBuild />, path: "/maintenance" },
];

function Sidebar() {
  return (
    <aside className="w-[260px] min-h-screen bg-white border-r border-slate-200 flex flex-col">
      {/* Logo Area */}
      <div className="p-5 flex items-center gap-2">
        <div className="text-blue-900">
          {/* Mock logo shape */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 12l10 10 10-10L12 2zm0 4.5l5.5 5.5-5.5 5.5-5.5-5.5L12 6.5z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">ManageOn</h1>
      </div>

      {/* MotoSync Banner */}
      <div className="px-5 mb-4">
        <div className="border border-slate-200 rounded-lg p-3 flex justify-between items-center bg-slate-50">
          <div>
            <div className="flex items-center gap-1">
              <MdDirectionsCar className="text-teal-500" />
              <span className="font-semibold text-slate-800 text-sm">MotoSync</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Powering Progress. Seamlessly.</p>
          </div>
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
        </div>
      </div>

      {/* Main Menu */}
      <div className="flex-1 px-3">
        <p className="px-4 text-xs font-semibold text-slate-400 uppercase mb-2">Menu</p>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Menu */}
      <div className="px-3 pb-4">
        <nav className="space-y-1 mb-4">
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <FaCog className="text-blue-500" />
            <span>Settings</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <FaQuestionCircle className="text-blue-500" />
            <span>Help and Support</span>
          </a>
          <a href="#" className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <FaBell className="text-blue-500" />
              <span>Notifications</span>
            </div>
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">8</span>
          </a>
        </nav>
        
        {/* User Profile */}
        <div className="px-4 pt-4 border-t border-slate-200 flex items-center gap-3 cursor-pointer">
          <img src="https://ui-avatars.com/api/?name=Ravinthranath+A&background=random" alt="Avatar" className="w-8 h-8 rounded-full" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-800 truncate">Ravinthranath A</p>
            <p className="text-xs text-slate-500 truncate">ravinthranath@gmail.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;