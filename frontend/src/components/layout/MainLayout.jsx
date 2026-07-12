import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import CopilotChat from "../CopilotChat";

function MainLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("transitops_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);


  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-100 via-sky-50 to-teal-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-white font-sans overflow-hidden transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <CopilotChat />
    </div>
  );
}

export default MainLayout;