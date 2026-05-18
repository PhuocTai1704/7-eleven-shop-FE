import { Routes, Route } from "react-router-dom";
import Home from "@/client/pages/Home";
import NotFound from "@/client/NotFound";

const ClientRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ClientRouter;
