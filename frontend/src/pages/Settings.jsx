import { useState } from "react";
import { motion } from "framer-motion";
import { MdSave, MdCheckCircle } from "react-icons/md";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Settings() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    currency: "USD",
    distanceUnit: "km"
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "darkMode") {
      if (checked) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }, 800);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="min-h-full max-w-4xl mx-auto">
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Platform Settings</h1>
        <p className="text-sm text-slate-600 mt-1 font-medium">Configure your TransitOps experience and preferences.</p>
      </motion.div>

      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-2 bg-emerald-100/80 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm font-semibold shadow-sm"
        >
          <MdCheckCircle className="text-lg" />
          Settings successfully saved!
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
        <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8">
          
          {/* General Preferences */}
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">General Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase">Currency</label>
                <select name="currency" value={settings.currency} onChange={handleChange} className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase">Distance Unit</label>
                <select name="distanceUnit" value={settings.distanceUnit} onChange={handleChange} className="w-full px-4 py-2 bg-white/50 border border-white/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                  <option value="km">Kilometers (km)</option>
                  <option value="mi">Miles (mi)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">Notifications & Alerts</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="notifications" checked={settings.notifications} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700">Enable Push Notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="emailAlerts" checked={settings.emailAlerts} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700">Receive Daily Fleet Summary via Email</span>
              </label>
            </div>
          </section>

          {/* Appearance */}
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">Appearance</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="darkMode" checked={settings.darkMode} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
              <span className="text-sm font-medium text-slate-700">Dark Mode</span>
            </label>
          </section>

          <div className="flex justify-end pt-4 border-t border-slate-200/50">
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-md transition-all disabled:opacity-70">
              <MdSave className="text-lg" />
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default Settings;
