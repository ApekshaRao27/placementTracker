import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDrives from "./pages/AdminDrives";
import DriveDetails from "./pages/DriveDetails";
import CreateDrive from "./pages/CreateDrive";
import StudentDashboard from "./pages/StudentDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/drives" element={<AdminDrives />} />
        <Route path="/admin/drives/:id" element={<DriveDetails />} />
        <Route path="/admin/create-drive" element={<CreateDrive />} />
        <Route path="/student" element={<StudentDashboard />} />
        {/* Redirect /admin to /admin/drives */}
        <Route path="/admin" element={<Navigate to="/admin/drives" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
