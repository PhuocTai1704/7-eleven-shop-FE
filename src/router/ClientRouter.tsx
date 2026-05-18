import { Routes, Route } from "react-router-dom";
import Home from "@/client/pages/Home";

const ClientRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default ClientRouter;
