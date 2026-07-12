import { MdChevronLeft, MdDirectionsCar, MdSearch, MdMic, MdDarkMode, MdLightMode } from "react-icons/md";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const breadcrumbMap = {
  "/": "Dashboard",
  "/vehicles": "Vehicle Directory",
  "/add-vehicle": "Add Vehicle",
  "/drivers": "Owners Directory",
  "/add-driver": "Add Driver",
  "/trips": "Trip Management",
  "/maintenance": "Maintenance Logs",
  "/expenses": "Fuel & Expenses",
  "/reports": "Fleet Analytics",
  "/settings": "Settings",
};

function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const pageName = breadcrumbMap[location.pathname] || "Page";

  const handleSearch = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/vehicles?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="h-[72px] bg-white/40 dark:bg-slate-800/60 backdrop-blur-xl border-b border-white/40 dark:border-slate-700/50 flex justify-between items-center px-4 shrink-0 shadow-sm z-10 relative transition-colors duration-300">
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-teal-500 text-white rounded p-1 hover:bg-teal-600 transition-colors"
          onClick={() => window.history.back()}
        >
          <MdChevronLeft className="text-xl" />
        </motion.button>

        <AnimatePresence mode="wait">
          <motion.div
            key={pageName}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 text-slate-800 dark:text-slate-100 text-lg"
          >
            <MdDirectionsCar className="text-teal-500 text-xl" />
            <span className="font-semibold">MotoSync</span>
            <span className="text-slate-400 dark:text-slate-500 font-light mx-1">›</span>
            <span className="text-slate-600 dark:text-slate-300">{pageName}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdSearch className="text-slate-400 text-lg" />
          </div>
          <input
            type="text"
            placeholder="Search vehicles (press enter)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="pl-9 pr-4 py-1.5 bg-white/50 dark:bg-slate-700/50 border border-white/60 dark:border-slate-600/50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 w-64 placeholder:text-slate-400 dark:placeholder:text-slate-500 backdrop-blur-md shadow-sm transition-all dark:text-slate-200"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-teal-500/90 text-white rounded-md p-1.5 hover:bg-teal-500 transition-colors shadow-sm backdrop-blur-md"
        >
          <MdMic className="text-lg" />
        </motion.button>

        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="relative w-9 h-9 flex items-center justify-center rounded-full bg-white/50 dark:bg-slate-700/70 border border-white/60 dark:border-slate-600/50 shadow-sm backdrop-blur-md transition-colors hover:bg-indigo-50 dark:hover:bg-slate-600"
          aria-label="Toggle dark mode"
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.span
                key="light"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MdLightMode className="text-yellow-400 text-xl" />
              </motion.span>
            ) : (
              <motion.span
                key="dark"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MdDarkMode className="text-indigo-600 text-xl" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </header>
  );
}

export default Navbar;