import MainLayout from "../components/layout/MainLayout";

function Dashboard() {
  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome to TransitOps 🚚
        </p>
      </div>
    </MainLayout>
  );
}

export default Dashboard;