import axios from "./Customize-Axios";

const createOrder = (cartId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.post(
    "Order/create",
    { cartId },
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
};

const fetchOrderByUser = () => {
  return axios.get("Order/get-all-orders");
};

const getOrderById = (orderId) => {
  return axios.get(`Order/${orderId}`);
};

const getOrderByUser = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.get("Order/user", {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const getOrderByStatus = (status) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.get(`Order/get-by-status/${status}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const updateOrderStatus = (orderId, newStatus) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.put(`Order/update-order-status/${orderId}`,
    { status: newStatus}, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const getAssignedOrders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.get("/Order/staff/get-assigned-orders",{
    headers:{
      Authorization: `${token}`
    }
  });
};


export {
  createOrder,
  fetchOrderByUser,
  getOrderById,
  getOrderByUser,
  getOrderByStatus,
  updateOrderStatus,
  getAssignedOrders,
};
