import { Routes, Route } from "react-router-dom";
import Dashboard from "@/admin/pages/Dashboard";

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
};

export default AdminRouter;
