import axios from "./Customize-Axios";

const createOrder = () => {
  return axios.post("Order/create");
};

export { createOrder };
