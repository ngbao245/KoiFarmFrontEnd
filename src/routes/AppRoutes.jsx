import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Product from "../pages/Product/Product";
import Admin from "../pages/Admin/Admin";
import NotFoundRoute from "./NotFoundRoute";
import Info from "../pages/Info/Info";
import News from "../pages/News/News";
import Contact from "../pages/Contact/Contact";
import AdminProduct from "../pages/ProductItem/AdminProduct";
import ProductItem from "../pages/ProductItem/ProductItem";
import ProductItemDetail from "../pages/ProductItem/ProductItemDetail";
import Cloudinary from "../Cloudinary";
import Cart from "../pages/Cart/Cart";
import Payment from "../pages/Payment/Payment";
import Order from "../pages/Order/Order";
import PaymentFailed from "../pages/Payment/PaymentFailed";
import AdminBlog from "../pages/Blog/AdminBlog.jsx";
import UserDetail from "../pages/User/UserDetail.jsx";
import UserPayment from "../pages/User/UserPayment.jsx";
import StaffOrders from "../pages/Order/StaffOrders.jsx";
import AdminOrder from "../pages/Order/AdminOrder.jsx";
import ProductItemSearch from "../pages/ProductItemSearch/ProductItemSearch";
import NewsDetail from "../pages/News/NewsDetail.jsx";
import AdminDashboard from "../pages/Admin/AdminDashboard.jsx";
import UserConsignment from "../pages/Consignment/UserConsignment.jsx";
import Consignment from "../pages/Consignment/Consignment.jsx";
import AdminCertificate from "../pages/Certificate/AdminCertificate.jsx";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword.jsx";
import ResetPassword from "../pages/ForgotPassword/ResetPassword.jsx";
import ProductComparison from "../pages/ProductItemComparison/ProductComparison.jsx";
import AdminConsignment from "../pages/Consignment/AdminConsignment.jsx";
import AdminPromotion from "../pages/Promotion/AdminPromotion.jsx";
import AdminBatch from "../pages/Batch/AdminBatch.jsx";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<Info />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/:id/detail" element={<UserDetail />} />
        <Route path="/:id/payments" element={<UserPayment />} />

        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-product" element={<AdminProduct />} />
        <Route path="/admin-blog" element={<AdminBlog />} />
        <Route path="/admin-certificate" element={<AdminCertificate />} />
        <Route path="/admin-consignment" element={<AdminConsignment />} />
        <Route path="/admin-order" element={<AdminOrder />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-batch" element={<AdminBatch />} />

        <Route path="/product" element={<Product />} />

        <Route path="/koi/:productName" element={<ProductItem />} />
        <Route path="/koi/:productName/:id" element={<ProductItemDetail />} />
        <Route path="/product-item-search" element={<ProductItemSearch />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="order" element={<Order />} />

        <Route path="/staff-orders" element={<StaffOrders />} />

        <Route path="/test" element={<Cloudinary />} />

        <Route path="payment-success" element={<Payment />} />
        <Route path="payment-failed" element={<PaymentFailed />} />

        <Route path="/consignment" element={<Consignment />} />
        <Route path="/user-consignment" element={<UserConsignment />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/productItem-comparison" element={<ProductComparison />} />

        <Route path="/admin-promotion" element={<AdminPromotion />} />

        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
