import { Routes, Route } from "react-router-dom";
import Home from "@/client/pages/Home";
import NotFound from "@/client/NotFound";
import LoginPage from "@/client/pages/Login";
import RegisterPage from "@/client/pages/Register";
import ClientLayout from "@/client/components/layout/ClientLayout";
import CartPage from "@/client/pages/Cart";
import CheckoutPage from "@/client/pages/Checkout";
import OrderConfirmPage from "@/client/pages/Checkout/OrderConfirmPage";

const ClientRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />{" "}
        <Route path="/checkout" element={<CheckoutPage />} />{" "}
        <Route path="/order-confirm" element={<OrderConfirmPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default ClientRouter;
