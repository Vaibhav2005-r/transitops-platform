import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

function Sidebar() {
  return (
    <aside className="w-[260px] min-h-screen bg-white/60 backdrop-blur-xl border-r border-white/40 flex flex-col shadow-xl z-20 relative">
      {/* Logo Area */}
      <div className="p-5 flex items-center gap-2">
        <div className="text-indigo-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 12l10 10 10-10L12 2zm0 4.5l5.5 5.5-5.5 5.5-5.5-5.5L12 6.5z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">ManageOn</h1>
      </div>

      {/* MotoSync Banner */}
      <div className="px-5 mb-4">
        <div className="border border-white/50 rounded-lg p-3 flex justify-between items-center bg-white/40 shadow-sm backdrop-blur-md">
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
        <motion.nav 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-1"
        >
          {menuItems.map((item) => (
            <motion.div key={item.name} variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium border border-transparent ${
                    isActive
                      ? "bg-white/80 text-indigo-600 shadow-sm border-white/60"
                      : "text-slate-600 hover:bg-white/50 hover:text-slate-900"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </motion.div>
          ))}
        </motion.nav>
      </div>

      {/* Bottom Menu */}
      <div className="px-3 pb-4">
        <nav className="space-y-1 mb-4">
          <motion.button onClick={() => alert("Settings configuration coming soon in V2!")} whileHover={{ scale: 1.02 }} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-white/50 transition-colors">
            <FaCog className="text-indigo-500" />
            <span>Settings</span>
          </motion.button>
          <motion.button onClick={() => alert("Help center is currently under maintenance.")} whileHover={{ scale: 1.02 }} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-white/50 transition-colors">
            <FaQuestionCircle className="text-indigo-500" />
            <span>Help and Support</span>
          </motion.button>
          <motion.button onClick={() => alert("You have 8 unread notifications!")} whileHover={{ scale: 1.02 }} className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-white/50 transition-colors">
            <div className="flex items-center gap-3">
              <FaBell className="text-indigo-500" />
              <span>Notifications</span>
            </div>
            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">8</span>
          </motion.button>
        </nav>
        
        {/* User Profile */}
        <div className="px-4 pt-4 border-t border-white/50 flex items-center gap-3 cursor-pointer hover:bg-white/30 rounded-lg p-2 transition-colors">
          <img src="https://ui-avatars.com/api/?name=Ravinthranath+A&background=random" alt="Avatar" className="w-8 h-8 rounded-full shadow-sm" />
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