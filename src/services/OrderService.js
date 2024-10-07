import axios from "./Customize-Axios";

const createOrder = (cartId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  
  // Correct structure: Pass the data (if any) as the second argument and headers as the third
  return axios.post(
    "Order/create", // API endpoint
    { cartId },
    {
      headers: {
        Authorization: `${token}` // Include the token with 'Bearer' scheme
      }
    }
  );
};

const getOrderById = (orderId) => {
  return axios.get(`Order/${orderId}`);
};

const getOrderByUser = () => {
  return axios.get("Order/user");
};

export { createOrder, getOrderById, getOrderByUser };
