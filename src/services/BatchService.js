import axios from "./Customize-Axios";

const fetchAllBatchs = () => {
  return axios.get("Batch/get-all-batches");
};

const fetchBatchById = (id) => {
  return axios.get(`Batch/get-batch/${id}`);
};

const createBatch = (data) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.post("Batch/create-batch", data, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const updateBatch = (id, data) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.put(`Batch/update-batch/${id}`, data, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const deleteBatch = (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.delete(`Batch/delete-batch/${id}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const addItemToBatch = (id, data) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.post(`Batch/add-item-to-batch/${id}`, data, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const removeItemFromBatch = (batchId, productItemId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.delete(`Batch/remove-item-from-batch/${batchId}/${productItemId}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
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
