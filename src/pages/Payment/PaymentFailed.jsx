import React from 'react';
import { useLocation } from 'react-router-dom';

const PaymentFailed = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const orderId = searchParams.get('orderId');
  const status = searchParams.get('status');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Payment Failed</h1>
      <p>Order ID: {orderId}</p>
      <p>Status: {status}</p>
    </div>
  );
};

export default PaymentFailed;
