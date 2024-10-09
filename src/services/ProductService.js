import axios from "./Customize-Axios";

const fetchAllProducts = () => {
  return axios.get("Product/get-all-products");
};

const getProductById = (id) => {
  return axios.get(`Product/get-product/${id}`);
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

export { fetchAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
