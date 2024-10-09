import React from "react";
import { Header } from "../../layouts/header/header";
import { Footer } from "../../layouts/footer/footer";
import successGif from "../../../public/icons/success.gif";
import { useLocation, Link } from 'react-router-dom';
import "./Payment.css"; // We'll create this file for styling

const Payment = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');
  const status = searchParams.get('status');
  
  return (
    <>
      <Header />
      <div className="payment-container">
        <main className="payment-content">
          <div className="payment-status-card">
            <img src={successGif} alt="Payment Success" className="success-icon" />
            <h1 className={`payment-status ${status === 'success' ? 'success' : 'failed'}`}>
              Payment {status === 'success' ? 'Successful' : 'Successful'}
            </h1>
            <div className="payment-details">
              <p><strong>Order ID:</strong> {orderId}</p>
              <p><strong>Payment ID:</strong> {paymentId}</p>
            </div>
            <p className="thank-you-message">
              Thank you for your purchase! We've sent a confirmation email with your order details.
            </p>
            <div className="action-buttons">
              <Link to="/product" className="btn btn-primary">Tiếp tục mua sắm</Link>
              <Link to="/" className="btn btn-secondary">Quay lại trang chủ</Link>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Payment;
