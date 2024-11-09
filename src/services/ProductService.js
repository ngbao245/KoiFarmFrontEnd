import axios from "./Customize-Axios";

const fetchAllProducts = () => {
  return axios.get("Product/get-all-products");
};

const getProductById = (id) => {
  return axios.get(`Product/get-product/${id}`);
};

const createProduct = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.post("Product/create-product",{
    headers:{
      Authorization: `${token}`
    }
  });
};

const updateProduct = (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.put(`Product/update-product/${id}`,{
    headers:{
      Authorization: `${token}`
    }
  });
};

const deleteProduct = (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.delete(`Product/delete-product/${id}`,{
    headers:{
      Authorization: `${token}`
    }
  });
};

export { fetchAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
