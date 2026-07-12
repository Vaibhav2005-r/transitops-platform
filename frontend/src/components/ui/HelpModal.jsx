import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdEmail, MdQuestionAnswer, MdLibraryBooks } from "react-icons/md";

function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

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
          className="relative w-full max-w-lg bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200/50 flex justify-between items-center bg-white/50">
            <h2 className="text-xl font-bold text-slate-800">Help & Support</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-700">
              <MdClose className="text-xl" />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <p className="text-slate-600 text-sm mb-6">Need assistance? Here are a few ways to get help with TransitOps.</p>
            
            <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 transition-colors text-left group">
              <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg group-hover:scale-105 transition-transform">
                <MdLibraryBooks className="text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-indigo-900 text-sm">Documentation</h3>
                <p className="text-xs text-indigo-700/70 mt-0.5">Read guides and tutorials</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-teal-100 bg-teal-50/50 hover:bg-teal-50 transition-colors text-left group">
              <div className="bg-teal-100 text-teal-600 p-3 rounded-lg group-hover:scale-105 transition-transform">
                <MdQuestionAnswer className="text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-teal-900 text-sm">FAQs</h3>
                <p className="text-xs text-teal-700/70 mt-0.5">Find answers to common questions</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-50 transition-colors text-left group">
              <div className="bg-rose-100 text-rose-600 p-3 rounded-lg group-hover:scale-105 transition-transform">
                <MdEmail className="text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-rose-900 text-sm">Contact Support</h3>
                <p className="text-xs text-rose-700/70 mt-0.5">Email our support team directly</p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default HelpModal;
