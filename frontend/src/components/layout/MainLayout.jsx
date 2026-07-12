import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function MainLayout() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      let token = localStorage.getItem("transitops_token");
      if (!token) {
        try {
          // Attempt to register test user (ignores error if already exists)
          await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: "manager_test@transitops.com",
              password: "securepassword",
              name: "Test Manager",
              role: "Fleet Manager"
            })
          });
          
          // Login to get token
          const loginRes = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: "manager_test@transitops.com",
              password: "securepassword"
            })
          });
          
          const loginData = await loginRes.json();
          if (loginData.token) {
            localStorage.setItem("transitops_token", loginData.token);
          }
        } catch (e) {
          console.error("Auth init failed", e);
        }
      }
      setAuthReady(true);
    };
    initAuth();
  }, []);

  if (!authReady) {
    return <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium">Initializing Secure Session...</div>;
  }

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