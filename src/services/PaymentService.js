import axios from "./Customize-Axios";

const fetchAllPayment = () => {
  return axios.get("Payment/get-all-payments");
};

const callBackPayment = () => {
  return axios.get("Payment/payment-callback");
};

const createPayment = () => {
  return axios.post("Payment/create-payment-url");
};

export { fetchAllPayment, callBackPayment, createPayment };
