import axios from "./Customize-Axios";

const fetchAllPayment = () => {
  return axios.get("Payment/get-all-payments");
};

const callBackPayment = () => {
  return axios.get("Payment/payment-callback");
};

const createPayment = ({ orderDescription, orderType, name, orderId }) => {
  const token = localStorage.getItem("token"); // Retrieve token if required
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.post(
    "Payment/create-payment-url", // Payment API endpoint
    {
      orderDescription, // Pass order details
      orderType, // For example: 'billpayment'
      name, // Customer name
      orderId, // ID of the order created
    },
    {
      headers: {
        Authorization: `${token}`, // Include Authorization token
      },
    }
  );
};

export { fetchAllPayment, callBackPayment, createPayment };
