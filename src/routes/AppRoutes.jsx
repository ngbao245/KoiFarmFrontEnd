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
import AdminProduct from "../pages/Product/AdminProduct";
import ProductItem from "../pages/ProductItem/ProductItem";
import ProductItemDetail from "../pages/ProductItem/ProductItemDetail";
import Cloudinary from "../Cloudinary";
import Cart from "../pages/Cart/Cart";
import Payment from "../pages/Payment/Payment";
import Order from "../pages/Order/Order";
import PaymentFailed from "../pages/Payment/PaymentFailed";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<Info />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-product" element={<AdminProduct />} />

        <Route path="/product" element={<Product />} />

        <Route path="/koi/:productName" element={<ProductItem />} />
        <Route path="/koi/:productName/:id" element={<ProductItemDetail />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="order" element={<Order />} />

        <Route path="/test" element={<Cloudinary />} />

        <Route path="payment-success" element={<Payment />} />
        <Route path="payment-failed" element={<PaymentFailed />} />

        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
