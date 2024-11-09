import axios from "./Customize-Axios";

const fetchPromotionByCode = (code) => {
  return axios.get(`Promotion/get-promotion-by-code/${code}`);
};

const fetchAllPromotion = () => {
  return axios.get("Promotion/get-all-promotion");
};

const createPromotion = (promotionData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.post("Promotion/create-promotion", promotionData, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const deletePromotion = (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.delete(`Promotion/delete-promotion/${id}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const updatePromotion = (id, data) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.put(`Promotion/update-promotion/${id}`, data, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

export {
    fetchPromotionByCode,
    fetchAllPromotion,
    createPromotion,
    deletePromotion,
    updatePromotion
};