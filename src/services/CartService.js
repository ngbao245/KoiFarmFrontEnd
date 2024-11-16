import axios from "./Customize-Axios";

const addToCart = (quantity, productItemId, token) => {
  return axios.post(
    "Cart/add-to-cart",
    { quantity, productItemId },
    {
      headers: { Authorization: token },
    }
  );
};

const addBatchToCart = (batchId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.post(
    "Cart/add-batch-to-cart",
    { batchId },
    {
      headers: { Authorization: token },
    }
  );
};

const getCart = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.get("Cart/get-cart", {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const updateCartItem = (cartId, prodItemId, quantity) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.put(
    `Cart/update-cart-item/${cartId}/${prodItemId}`,
    JSON.stringify(quantity),
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

const removeFromCart = (cartId) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.delete(`Cart/remove-from-cart/${cartId}`,{
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
};

const removeBatchFromCart = (batchId) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.delete(`Cart/remove-batch-from-cart/${batchId}`,{
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
};

export { addToCart, updateCartItem, removeFromCart, getCart, addBatchToCart, removeBatchFromCart };
