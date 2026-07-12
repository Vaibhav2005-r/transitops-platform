import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import AddVehicle from "./pages/AddVehicle";
import Drivers from "./pages/Drivers";
import AddDriver from "./pages/AddDriver";
import Trips from "./pages/Trips";
import Maintenance from "./pages/Maintenance";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Expenses from "./pages/Expenses";
import DriverProfile from "./pages/DriverProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/add-vehicle" element={<AddVehicle />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/driver/:id" element={<DriverProfile />} />
          <Route path="/add-driver" element={<AddDriver />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;