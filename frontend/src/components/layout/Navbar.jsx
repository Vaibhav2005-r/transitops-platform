function Navbar() {
  return (
    <header className="h-16 bg-white border-b flex justify-between items-center px-8">
      <h2 className="text-2xl font-semibold">
        Dashboard
      </h2>

      <div className="flex items-center gap-6">
        <button className="text-2xl">
          🔔
        </button>

        <div className="font-medium">
          Admin
        </div>
      </div>
    </header>
  );
}

export default Navbar;