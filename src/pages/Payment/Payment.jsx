import React from "react";
import { Header } from "../../layouts/header/header";
import { Footer } from "../../layouts/footer/footer";
import successGif from "../../../public/icons/success.gif";
import successWebm from "../../../public/icons/success.gif";
import successMp4 from "../../../public/icons/success.gif";
const Payment = () => {
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
      <Footer />
    </>
  );
};

export default Payment;
