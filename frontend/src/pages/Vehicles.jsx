import { FaPlus, FaSearch } from "react-icons/fa";

const vehicles = [
  {
    id: "VH-001",
    number: "MH 02 AB 1234",
    type: "Truck",
    capacity: "12 Tons",
    status: "Available",
  },
  {
    id: "VH-002",
    number: "MH 04 CD 5678",
    type: "Mini Truck",
    capacity: "5 Tons",
    status: "On Trip",
  },
  {
    id: "VH-003",
    number: "MH 12 EF 9012",
    type: "Truck",
    capacity: "15 Tons",
    status: "Maintenance",
  },
];

function Vehicles() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Vehicle Management
          </h1>

          <p className="text-slate-500 mt-1">
            Manage your fleet vehicles and operational status.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-lg font-medium transition">
          <FaPlus />
          Add Vehicle
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-5 border-b border-slate-200">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search vehicles..."
              className="w-full border border-slate-300 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 text-sm">
              <tr>
                <th className="px-6 py-4">Vehicle ID</th>
                <th className="px-6 py-4">Registration Number</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Capacity</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {vehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {vehicle.id}
                  </td>

                  <td className="px-6 py-4">{vehicle.number}</td>
                  <td className="px-6 py-4">{vehicle.type}</td>
                  <td className="px-6 py-4">{vehicle.capacity}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        vehicle.status === "Available"
                          ? "bg-emerald-100 text-emerald-700"
                          : vehicle.status === "On Trip"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Vehicles;