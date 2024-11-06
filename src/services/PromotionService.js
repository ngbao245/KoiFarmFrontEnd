import axios from "./Customize-Axios";

const fetchPromotionByCode = (code) => {
  return axios.get(`Promotion/get-promotion-by-code/${code}`);
};

export {
    fetchPromotionByCode,
};