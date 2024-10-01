import axios from "./Customize-Axios";

const fetchAllProducts = () => {
  return axios.get("Product/get-all-products");
};

const createProduct = () => {
  return axios.post("Product/create-product");
};

const updateProduct = (id) => {
  return axios.put(`Product/update-product/${id}`);
};

const deleteProduct = (id) => {
  return axios.delete(`Product/delete-product/${id}`);
};

export { fetchAllProducts, createProduct, updateProduct, deleteProduct };
