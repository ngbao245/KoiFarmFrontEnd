import axios from "./Customize-Axios";

const sendEmail = (data) => {
  return axios.post("Email", { data });
};

export { sendEmail };
