import React, { useEffect } from "react";
import { Header } from "../../layouts/header/header";
import { Footer } from "../../layouts/footer/footer";
import { useLocation, Link, useNavigate } from "react-router-dom";
import TickSuccess from "../../components/TickSuccess";
import "./Payment.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);

  const orderId = searchParams.get("orderId");
  const paymentId = searchParams.get("paymentId");
  const status = searchParams.get("status");

  useEffect(() => {
    if (!orderId || !paymentId) {
      navigate("/*");
    }
  }, [orderId, paymentId]);

  return (
    <>
      <Header />
      <div className="payment-container">
        <main className="payment-content animated user-select-none">
          <div className="payment-status-card">
            <TickSuccess />

            <h1 className="payment-status-success">
              Payment {status === "success" ? "Successful" : "Successful"}
            </h1>
            <div className="payment-details">
              <p>
                <strong>Order ID:</strong> {orderId}
              </p>
              <p>
                <strong>Payment ID:</strong> {paymentId}
              </p>
            </div>
            <p className="thank-you-message">
              Cảm ơn quý khách đã tin tưởng Koi Shop. Hẹn gặp lại quý khách lần
              sau.
            </p>
            <div className="action-buttons">
              <Link to="/product" className="btn btn-primary">
                Tiếp tục mua sắm
              </Link>
              <Link to="/" className="btn btn-secondary">
                Quay lại trang chủ
              </Link>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Payment;
