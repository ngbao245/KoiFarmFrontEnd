import axios from "./Customize-Axios";
const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;
const api_key = import.meta.env.VITE_API_KEY;
// const folder = import.meta.env.VITE_FOLDER;

const uploadImageCloudinary = (profileImage, folder) => {
  const image = new FormData();
  image.append("file", profileImage);
  image.append("cloud_name", "koi-farm-shop");
  image.append("upload_preset", upload_preset);
  image.append("api_key", api_key);
  image.append("folder", folder);

  return axios.post(
    `https://api.cloudinary.com/v1_1/koi-farm-shop/image/upload`,
    image
  );
};

export { uploadImageCloudinary };
