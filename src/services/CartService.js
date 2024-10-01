import axios from "./Customize-Axios";

const addToCart = () => {
  return axios.post("Cart/add-to-cart");
};

const updateCartItem = (cartId, prodItemId) => {
  return axios.put(`Cart/update-cart-item/${cartId}/${prodItemId}`);
};

const removeFromCart = (cartId) => {
  return axios.delete(`Cart/remove-from-cart/${cartId}`);
};

export { addToCart, updateCartItem, removeFromCart };
