import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdEmail, MdQuestionAnswer, MdLibraryBooks, MdArrowBack, MdOutlineArticle } from "react-icons/md";

function HelpModal({ isOpen, onClose }) {
  const [view, setView] = useState("menu");

  if (!isOpen) {
    if (view !== "menu") setTimeout(() => setView("menu"), 300);
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
          onClick={onClose} 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          <div className="p-4 border-b border-slate-200/50 flex justify-between items-center bg-white/50 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              {view !== "menu" && (
                <button onClick={() => setView("menu")} className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                  <MdArrowBack className="text-lg" />
                </button>
              )}
              <h2 className="text-lg font-bold text-slate-800">
                {view === "menu" ? "Help & Support" : 
                 view === "docs" ? "Documentation" : 
                 view === "faqs" ? "FAQs" : "Contact Support"}
              </h2>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-700">
              <MdClose className="text-lg" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto min-h-[300px]">
            <AnimatePresence mode="wait">
              {view === "menu" && (
                <motion.div 
                  key="menu"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <p className="text-slate-600 text-sm mb-6">Need assistance? Here are a few ways to get help with ManageOn.</p>
                  
                  <button onClick={() => setView("docs")} className="w-full flex items-center gap-4 p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 transition-colors text-left group">
                    <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg group-hover:scale-105 transition-transform">
                      <MdLibraryBooks className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-indigo-900 text-sm">Documentation</h3>
                      <p className="text-xs text-indigo-700/70 mt-0.5">Read guides and tutorials</p>
                    </div>
                  </button>

                  <button onClick={() => setView("faqs")} className="w-full flex items-center gap-4 p-4 rounded-xl border border-teal-100 bg-teal-50/50 hover:bg-teal-50 transition-colors text-left group">
                    <div className="bg-teal-100 text-teal-600 p-3 rounded-lg group-hover:scale-105 transition-transform">
                      <MdQuestionAnswer className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-teal-900 text-sm">FAQs</h3>
                      <p className="text-xs text-teal-700/70 mt-0.5">Find answers to common questions</p>
                    </div>
                  </button>

                  <button onClick={() => setView("contact")} className="w-full flex items-center gap-4 p-4 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-50 transition-colors text-left group">
                    <div className="bg-rose-100 text-rose-600 p-3 rounded-lg group-hover:scale-105 transition-transform">
                      <MdEmail className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-rose-900 text-sm">Contact Support</h3>
                      <p className="text-xs text-rose-700/70 mt-0.5">Email our support team directly</p>
                    </div>
                  </button>
                </motion.div>
              )}

              {view === "docs" && (
                <motion.div key="docs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                  <div className="p-3 border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer flex gap-3 items-start">
                    <MdOutlineArticle className="text-indigo-500 mt-1" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-700">Getting Started with ManageOn</h4>
                      <p className="text-xs text-slate-500 mt-1">Learn how to onboard your first driver and vehicle.</p>
                    </div>
                  </div>
                  <div className="p-3 border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer flex gap-3 items-start">
                    <MdOutlineArticle className="text-indigo-500 mt-1" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-700">Understanding Fleet Analytics</h4>
                      <p className="text-xs text-slate-500 mt-1">A deep dive into KPI calculations and dashboard filters.</p>
                    </div>
                  </div>
                  <div className="p-3 border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer flex gap-3 items-start">
                    <MdOutlineArticle className="text-indigo-500 mt-1" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-700">Maintenance Workflows</h4>
                      <p className="text-xs text-slate-500 mt-1">How to log and track vehicle servicing costs.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {view === "faqs" && (
                <motion.div key="faqs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">How do I update the currency to INR?</h4>
                    <p className="text-xs text-slate-600 mt-1">Currency settings can be globally adjusted in the Settings menu.</p>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Why isn't my dashboard updating?</h4>
                    <p className="text-xs text-slate-600 mt-1">Make sure you have selected a date range that contains trip or log data. If you recently added trips, refresh the page.</p>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Can I export reports to Excel?</h4>
                    <p className="text-xs text-slate-600 mt-1">Yes, go to the Analytics tab and click the "Export CSV" button in the top right corner.</p>
                  </div>
                </motion.div>
              )}

              {view === "contact" && (
                <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <p className="text-sm text-slate-600 mb-4">Send us a message and we'll get back to you within 24 hours.</p>
                  <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); setView("menu"); }}>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Subject</label>
                      <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm mt-1 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400" placeholder="E.g. Issue with dashboard" required />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Message</label>
                      <textarea className="w-full p-2 border border-slate-200 rounded-lg text-sm mt-1 h-24 resize-none focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400" placeholder="Describe your issue..." required></textarea>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors">
                      Send Message
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default HelpModal;
