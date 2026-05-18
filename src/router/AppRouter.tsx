import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientRouter from "./ClientRouter";
import AdminRouter from "./AdminRouter";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<ClientRouter />} />
        <Route path="/admin/*" element={<AdminRouter />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
