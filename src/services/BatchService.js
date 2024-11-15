import axios from "./Customize-Axios";

const fetchAllBatchs = () => {
  return axios.get("Batch/get-all-batches");
};

const fetchBatchById = (id) => {
  return axios.get(`Batch/get-batch/${id}`);
};

const createBatch = (data) => {
  return axios.post("Batch/create-batch", data);
};

const updateBatch = (id, data) => {
  return axios.put(`Batch/update-batch/${id}`, data);
};

const deleteBatch = (id) => {
  return axios.delete(`Batch/delete-batch/${id}`);
};

const addItemToBatch = (id, data) => {
  return axios.post(`Batch/add-item-to-batch/${id}`, data);
};

const removeItemFromBatch = (batchId, productItemId) => {
  return axios.delete(`Batch/remove-item-from-batch/${batchId}/${productItemId}`);
};

export {
  fetchAllBatchs,
  fetchBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
  addItemToBatch,
  removeItemFromBatch,
};
