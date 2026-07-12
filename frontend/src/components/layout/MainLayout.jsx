import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function MainLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("transitops_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);


  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-100 via-sky-50 to-teal-100 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;