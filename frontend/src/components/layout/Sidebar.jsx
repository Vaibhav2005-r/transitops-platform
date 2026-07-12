import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdLogout, MdDashboard, MdDirectionsCar, MdPeople, MdBuild, MdAddBox, MdAttachMoney, MdMap } from "react-icons/md";
import { FaChartBar, FaCog, FaQuestionCircle, FaBell, FaTruck } from "react-icons/fa";
import HelpModal from "../ui/HelpModal";
import NotificationsModal from "../ui/NotificationsModal";

const menuItems = [
  { name: "My Dashboard", icon: <MdDashboard />, path: "/" },
  { name: "Add Vehicle", icon: <MdAddBox />, path: "/add-vehicle" },
  { name: "Vehicle Directory", icon: <MdDirectionsCar />, path: "/vehicles" },
  { name: "Owners Directory", icon: <MdPeople />, path: "/drivers" },
  { name: "Trip Management", icon: <FaTruck />, path: "/trips" },
  { name: "Maintenance Logs", icon: <MdBuild />, path: "/maintenance" },
  { name: "Fuel & Expenses", icon: <MdAttachMoney />, path: "/expenses" },
  { name: "Fleet Analytics", icon: <FaChartBar />, path: "/reports" },
];

const sidebarVariants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 28 } },
};

function Sidebar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("transitops_user") || "User";
  const userRole = localStorage.getItem("transitops_role") || "Staff";
  const userInitials = userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: "warning", title: "Maintenance Due", message: "Vehicle #MH-01-AB-1234 is due for oil change.", time: "10 mins ago" },
    { id: 2, type: "info", title: "Trip Completed", message: "Trip #TRP-892 completed successfully.", time: "1 hour ago" },
    { id: 3, type: "success", title: "Payment Received", message: "Payment of ₹15,000 received for Invoice #INV-102.", time: "2 hours ago" },
    { id: 4, type: "warning", title: "Low Fuel Alert", message: "Vehicle #MH-04-XY-9876 reported low fuel.", time: "3 hours ago" }
  ]);

  const handleLogout = () => {
    localStorage.removeItem("transitops_token");
    localStorage.removeItem("transitops_role");
    localStorage.removeItem("transitops_user");
    navigate("/login");
  };

  return (
    <aside className="w-[260px] min-h-screen bg-white/60 dark:bg-slate-900/80 backdrop-blur-xl border-r border-white/40 dark:border-slate-700/50 flex flex-col shadow-xl z-20 relative transition-colors duration-300">
      {/* Logo Area */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-5 flex items-center gap-2"
      >
        <div className="bg-indigo-600 rounded-lg p-1.5 shadow-lg shadow-indigo-500/30">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L2 12l10 10 10-10L12 2zm0 4.5l5.5 5.5-5.5 5.5-5.5-5.5L12 6.5z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">ManageOn</h1>
      </motion.div>

      {/* MotoSync Banner */}
      <div className="px-5 mb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="border border-white/50 dark:border-slate-700/60 rounded-xl p-3 flex justify-between items-center bg-gradient-to-r from-indigo-50/80 to-teal-50/80 dark:from-indigo-900/30 dark:to-teal-900/20 shadow-sm backdrop-blur-md"
        >
          <div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 bg-teal-500 rounded-md flex items-center justify-center shadow-sm">
                <MdDirectionsCar className="text-white text-xs" />
              </div>
              <span className="font-bold text-slate-800 dark:text-white text-sm">MotoSync</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Powering Progress. Seamlessly.</p>
          </div>
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </motion.div>
      </div>

      {/* Main Menu */}
      <div className="flex-1 px-3 overflow-y-auto">
        <p className="px-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Menu</p>
        <motion.nav
          variants={sidebarVariants}
          initial="hidden"
          animate="show"
          className="space-y-0.5"
        >
          {menuItems.map((item) => (
            <motion.div key={item.name} variants={itemVariants}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium relative overflow-hidden ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                      : "text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-indigo-600 rounded-xl -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}
                    <span className={`text-lg transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : ""}`}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </motion.nav>
      </div>

      {/* Bottom Menu */}
      <div className="px-3 pb-4">
        <nav className="space-y-0.5 mb-3">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60"
              }`
            }
          >
            <FaCog className="text-base" />
            <span>Settings</span>
          </NavLink>
          <motion.button
            onClick={() => setIsHelpOpen(true)}
            whileHover={{ x: 2 }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-colors"
          >
            <FaQuestionCircle className="text-base" />
            <span>Help and Support</span>
          </motion.button>
          <motion.button
            onClick={() => setIsNotifOpen(true)}
            whileHover={{ x: 2 }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FaBell className="text-base" />
              <span>Notifications</span>
            </div>
            {notifications.length > 0 && (
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm shadow-rose-500/30"
              >
                {notifications.length}
              </motion.span>
            )}
          </motion.button>
        </nav>

        {/* User Profile + Logout */}
        <div className="pt-3 border-t border-white/50 dark:border-slate-700/50">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/40 dark:hover:bg-slate-700/50 transition-colors mb-2 cursor-pointer">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-indigo-500/30 flex-shrink-0"
            >
              {userInitials}
            </motion.div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{userName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userRole}</p>
            </div>
          </div>

          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.01, x: 2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 border border-transparent hover:border-rose-100 dark:hover:border-rose-800/40 transition-all"
          >
            <MdLogout className="text-lg" />
            <span>Sign Out</span>
          </motion.button>
        </div>
      </div>
      
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <NotificationsModal 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
        notifications={notifications} 
        onClear={() => setNotifications([])} 
      />
    </aside>
  );
}

export default Sidebar;