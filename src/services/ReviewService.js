import axios from "./Customize-Axios";

const getReviewsByItem = async (productItemId) => {
  return await axios.get(`Review/get-reviews-by-product-item/${productItemId}`);
};

const createReview = async (reviewData) => {
  const token = localStorage.getItem('token');
  return await axios.post(`Review/create-review`, reviewData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteReview = (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.delete(`Review/delete-review/${id}`,{
    headers: {
      Authorization: `${token}`
    },
  });
};

const updateReview = (id, data) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.put(`Review/update-review/${id}`, data, {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
};

export { getReviewsByItem, createReview, deleteReview, updateReview };