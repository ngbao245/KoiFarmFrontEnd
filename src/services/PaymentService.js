import axios from "./Customize-Axios";

const fetchAllPayment = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.get("Payment/get-all-payments",{
    headers:{
      Authorization: `${token}`
    }
  });
};

const fetchUserPayment = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.get("Payment/get-user-payments",{
    headers:{
      Authorization: `${token}`
    }
  });
};

const callBackPayment = () => {
  return axios.get("Payment/payment-callback");
};

const createPayment = ({ orderDescription, orderType, name, orderId }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.post(
    "Payment/create-payment-url",
    {
      orderDescription,
      orderType,
      name,
      orderId,
    },
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
};

const createPaymentForCOD = ( { orderId } ) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.post("Payment/create-payment",{
    orderId,
  },{
    headers: {
      Authorization: `${token}`,
    },
  });
};

const processRefund = ( paymentId ) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.post("Payment/process-refund",
    { transactionNo : paymentId, },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    }
  );
};

export { fetchAllPayment, callBackPayment, 
  createPayment, fetchUserPayment, 
  createPaymentForCOD,
  processRefund };
