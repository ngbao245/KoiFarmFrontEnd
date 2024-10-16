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

export { getReviewsByItem, createReview };