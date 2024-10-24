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

const fetchOrder = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.get("Order/get-all-orders", {
    headers: {
      Authorization: `${token}`,
    },
  });
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

const getUserOrderByStatus = (status) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.get(`Order/user/get-orders-by-status/${status}`, {
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

  return axios.put(
    `Order/update-order-status/${orderId}`,
    { status: newStatus },
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
};

const getAssignedOrders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.get("/Order/staff/get-assigned-orders", {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const assignStaff = (orderId, staffId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.put(
    `Order/order/assign-staff/${orderId}`,
    { staffId: staffId },
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

const updateIsDelivered = async (orderId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return await axios.put(
    `Order/is-delivered/${orderId}`,
    { isDelivered: true },
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
};

const cancelOrder = async (orderId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return await axios.put(`Order/cancel-order/${orderId}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

export {
  createOrder,
  fetchOrder,
  getOrderById,
  getOrderByUser,
  getOrderByStatus,
  getUserOrderByStatus,
  updateOrderStatus,
  getAssignedOrders,
  assignStaff,
  updateIsDelivered,
  cancelOrder,
};
