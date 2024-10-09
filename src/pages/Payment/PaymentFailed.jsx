import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const orderId = searchParams.get('orderId');
  const status = searchParams.get('status');

  const handleGoBack = () => {
    navigate('/product');
  };

  return (
    <div className="payment-failed-container">
      <div className="payment-failed-content">
        <h1 className="payment-failed-title">Thanh toán không thành công</h1>
        <div className="payment-failed-icon">❌</div>
        <p className="payment-failed-message">Chúng tôi rất tiếc nhưng khoản thanh toán của bạn không thể được xử lý.</p>
        <div className="payment-failed-details">
          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Status:</strong> {status}</p>
        </div>
        <button className="go-back-button" onClick={handleGoBack}>
        Tiếp tục mua sắm
        </button>
      </div>
    </div>
  );
};

export default PaymentFailed;
