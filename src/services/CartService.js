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

const updateCartItem = (cartId, prodItemId) => {
  return axios.put(`Cart/update-cart-item/${cartId}/${prodItemId}`);
};

const removeFromCart = (cartId) => {
  return axios.delete(`Cart/remove-from-cart/${cartId}`);
};

export { addToCart, updateCartItem, removeFromCart, getCart };
