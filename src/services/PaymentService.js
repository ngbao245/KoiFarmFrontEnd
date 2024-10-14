import axios from "./Customize-Axios";

const fetchAllPayment = () => {
  return axios.get("Payment/get-all-payments");
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

export { fetchAllPayment, callBackPayment, createPayment, fetchUserPayment };
