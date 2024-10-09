import axios from "./Customize-Axios";

const uploadImageCloudinary = (image) => {
  return axios.post(
    `https://api.cloudinary.com/v1_1/koi-farm-shop/image/upload`, image
  );
};

export { uploadImageCloudinary };
