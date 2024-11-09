import axios from "./Customize-Axios";

const fetchAllProdItem = (pageIndex, pageSize, searchQuery) => {
  return axios.get(`ProductItem/get-all-product-items`, {
    params: {
      pageIndex: pageIndex,
      pageSize: pageSize,
      searchQuery: searchQuery
    }
  });
};

const getAllProdItem = () => {
  return axios.get(`ProductItem/get-all-product-items?pageSize=${1000000000}`);
};

const getProdItemById = (id) => {
  return axios.get(`ProductItem/get-product-item/${id}`);
};

const getNameOfProdItem = async (id) => {
  const response = await axios.get(`ProductItem/get-product-item/${id}`);
  return response.data;
};

const getProdItemByProdId = (prodId) => {
  return axios.get(`ProductItem/get-product-item-by-product/${prodId}`);
};

const createProdItem = (data) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.post("ProductItem/create-product-item", data,{
    headers:{
      Authorization: `${token}`
    }
  });
};

const updateProdItem = (id, data) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.put(`ProductItem/update-product-item/${id}`, data,{
    headers:{
      Authorization: `${token}`
    }
  });
};

const deleteProdItem = (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.delete(`ProductItem/delete-product-item/${id}`,{
    headers:{
      Authorization: `${token}`
    }
  });
};

const updateProdItemType = (id, data) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.put(`ProductItem/update-product-item-type/${id}`,
    { type: data },{
      headers:{
        Authorization: `${token}`
      }
    }
  );
};

export {
  fetchAllProdItem,
  getAllProdItem,
  getProdItemById,
  getProdItemByProdId,
  createProdItem,
  updateProdItem,
  deleteProdItem,
  getNameOfProdItem,
  updateProdItemType,
};
