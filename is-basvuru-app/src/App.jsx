import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom"; // Navigate eklendi
import JobApplicationForm from "./components/Users/JobApplicationForm";
import AdminLayout from "./components/Layouts/AdminLayout/AdminLayout";
import UserLayout from "./components/Layouts/UserLayout/UserLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Admin/Login/Login";
import AdminPanel from "./components/Admin/Panel/AdminPanel";
import Logs from "./components/Admin/Logs/ApplicationLogs";
import UserLogs from "./components/Admin/Logs/UserLogs";
import AdminUsers from "./components/Admin/UserManagement/AdminUsers";
import Definitions from "./components/Admin/UserManagement/Definitions";
import CompanyOrganization from "./components/Admin/UserManagement/CompanyOrganization";
import FormDefinitions from "./components/Admin/UserManagement/FormDefinitions";
import IpLog from "./components/Admin/UserManagement/SuperAdminActions/IpLog";
import ManageApplications from "./components/Admin/UserManagement/SuperAdminActions/ManageApplications";

function App() {
  return (
    <>
      <Routes>
        {/* User (Aday Başvuru Formu) */}
        <Route path="/" element={<UserLayout />}>
          <Route path="/" element={<JobApplicationForm />}></Route>
        </Route>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Admin (Korumalı Alan) */}
        <Route element={<ProtectedRoute allowedRoles={[1, 2, 3, 4, 5, 6]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            {/* /admin'e girince direkt panele at */}
            <Route index element={<Navigate to="panel" replace />} />
            <Route path="panel" element={<AdminPanel />} />
            <Route path="logs" element={<Logs />} />
            <Route path="user-logs" element={<UserLogs />} />

            <Route path="users" element={<AdminUsers />} />
            <Route path="definitions" element={<Definitions />} />
            <Route path="organization" element={<CompanyOrganization />} />
            <Route path="form-definitions" element={<FormDefinitions />} />
            <Route element={<ProtectedRoute allowedRoles={[1]} />}>
              <Route path="approval-logs" element={<IpLog />} />
              <Route path="applications" element={<ManageApplications />} />
            </Route>
          </Route>
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
