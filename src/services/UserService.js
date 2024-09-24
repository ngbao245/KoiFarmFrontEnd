import axios from "./Customize-Axios";

const fetchAllUser = () => {
  return axios.get("User/get-all-users");
};

const signin = () => {
  return axios.post("Auth/signin");
};

export { fetchAllUser, signin };
