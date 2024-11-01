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
  return axios.post("ProductItem/create-product-item", data);
};

const updateProdItem = (id) => {
  return axios.put(`ProductItem/update-product-item/${id}`);
};

const deleteProdItem = (id) => {
  return axios.delete(`ProductItem/delete-product-item/${id}`);
};

const updateProdItemType = (id, data) => {
  return axios.put(`ProductItem/update-product-item-type/${id}`,
    { type: data }
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
