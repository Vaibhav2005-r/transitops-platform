import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdInfo, MdWarning, MdCheckCircle } from "react-icons/md";

const notificationsList = [
  {
    id: 1,
    type: "warning",
    title: "Maintenance Overdue",
    message: "Vehicle VAN-4125 is past its scheduled maintenance by 3 days.",
    time: "2 hours ago"
  },
  {
    id: 2,
    type: "info",
    title: "New Driver Added",
    message: "Amit Singh has been successfully registered to the platform.",
    time: "5 hours ago"
  },
  {
    id: 3,
    type: "success",
    title: "Trip Completed",
    message: "Trip #142 from Warehouse A to Retailer B was completed.",
    time: "1 day ago"
  },
  {
    id: 4,
    type: "warning",
    title: "Fuel Efficiency Drop",
    message: "Fleet average fuel efficiency dropped by 2% this week.",
    time: "2 days ago"
  }
];

function NotificationsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const getIcon = (type) => {
    switch(type) {
      case "warning": return <div className="bg-amber-100 text-amber-600 p-2 rounded-full"><MdWarning className="text-lg" /></div>;
      case "success": return <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full"><MdCheckCircle className="text-lg" /></div>;
      default: return <div className="bg-blue-100 text-blue-600 p-2 rounded-full"><MdInfo className="text-lg" /></div>;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px]" 
          onClick={onClose} 
        />
        <motion.div 
          initial={{ opacity: 0, x: 20, scale: 0.95 }} 
          animate={{ opacity: 1, x: 0, scale: 1 }} 
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          className="relative w-full max-w-sm bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          <div className="p-4 border-b border-slate-200/50 flex justify-between items-center bg-white/50 sticky top-0">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              Notifications
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">4 New</span>
            </h2>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-700">
              <MdClose className="text-lg" />
            </button>
          </div>
          
          <div className="overflow-y-auto p-2">
            {notificationsList.map((notif) => (
              <div key={notif.id} className="flex gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                <div className="flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  {getIcon(notif.type)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{notif.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.message}</p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-2 uppercase tracking-wide">{notif.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-200/50 bg-slate-50/50">
            <button className="w-full py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">
              Mark all as read
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default NotificationsModal;
