const fs = require('fs');
const files = [
  'frontend/src/pages/AddVehicle.jsx', 
  'frontend/src/pages/Dashboard.jsx', 
  'frontend/src/pages/Expenses.jsx', 
  'frontend/src/pages/Maintenance.jsx', 
  'frontend/src/pages/Settings.jsx', 
  'frontend/src/pages/Vehicles.jsx'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/\$(?!\{)/g, '₹').replace(/USD/g, 'INR');
  fs.writeFileSync(f, content, 'utf8');
});
