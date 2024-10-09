import React, { useEffect } from "react";
import { Header } from "../../layouts/header/header";
import { Footer } from "../../layouts/footer/footer";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentFailed.css"; // Style cho PaymentFailed
import CrossFail from "../../components/CrossFail";

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);

  const orderId = searchParams.get("orderId");
  const paymentId = searchParams.get("paymentId");
  const status = searchParams.get("status");

  const handleGoBack = () => {
    navigate("/product");
  };

  useEffect(() => {
    if (!orderId) {
      navigate("/*");
    }
  }, [orderId, paymentId]);

  return (
    <>
      <Header />
      <div className="payment-container">
        <main className="payment-content">
          <div className="payment-status-card">
            <CrossFail />

            <h1 className="payment-status-failure">
              Thanh toán không thành công
            </h1>
            <div className="payment-details">
              <p>
                <strong>Order ID:</strong> {orderId}
              </p>
              <p>
                <strong>Payment ID:</strong> {paymentId}
              </p>
            </div>
            <p className="error-message">
              Chúng tôi rất tiếc, nhưng khoản thanh toán của bạn đã không thành
              công. Vui lòng thử lại sau.
            </p>
            <div className="action-buttons">
              <button className="btn btn-primary" onClick={handleGoBack}>
                Tiếp tục mua sắm
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/")}
              >
                Quay lại trang chủ
              </button>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default PaymentFailed;
