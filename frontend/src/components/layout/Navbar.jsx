import { MdChevronLeft, MdDirectionsCar, MdSearch, MdMic } from "react-icons/md";

function Navbar() {
  return (
    <header className="h-[72px] bg-white/40 backdrop-blur-xl border-b border-white/40 flex justify-between items-center px-4 shrink-0 shadow-sm z-10 relative">
      <div className="flex items-center gap-4">
        <button className="bg-teal-500 text-white rounded p-1 hover:bg-teal-600">
          <MdChevronLeft className="text-xl" />
        </button>
        <div className="flex items-center gap-2 text-slate-800 text-lg">
          <MdDirectionsCar className="text-teal-500 text-xl" />
          <span className="font-semibold">MotoSync</span>
          <span className="text-slate-400 font-light mx-1">›</span>
          <span className="text-slate-600">Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdSearch className="text-slate-400 text-lg" />
          </div>
          <input 
            type="text" 
            placeholder="Search vehicles or drivers..." 
            className="pl-9 pr-4 py-1.5 bg-white/50 border border-white/60 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 w-64 placeholder:text-slate-500 backdrop-blur-md shadow-sm transition-all"
          />
        </div>
        <button className="bg-teal-500/90 text-white rounded-md p-1.5 hover:bg-teal-500 transition-colors shadow-sm backdrop-blur-md">
          <MdMic className="text-lg" />
        </button>
      </div>
    </header>
  );
}

export default Navbar;