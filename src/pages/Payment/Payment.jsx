import React from "react";
import { Header } from "../../layouts/header/header";
import { Footer } from "../../layouts/footer/footer";
import successGif from "../../../public/icons/success.gif";
import successWebm from "../../../public/icons/success.gif";
import successMp4 from "../../../public/icons/success.gif";
import { useLocation } from 'react-router-dom';


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
        <main className="payment-content animated user-select-none">
          <img src={successGif} />
          <img src={successWebm} />
          <img src={successMp4} />
        </main>
      </div>

      <div style={{ padding: '20px' }}>
      <h1>Payment {status === 'success' ? 'Successful' : 'Failed'}</h1>
      <p>Order ID: {orderId}</p>
      <p>Payment ID: {paymentId}</p>
    </div>
      <Footer />
    </>
  );
};

export default Payment;
