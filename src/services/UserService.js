import axios from "./Customize-Axios";

const fetchAllUser = () => {
  return axios.get("User/get-all-users");
};

const signin = (email, password) => {
  return axios.post("Auth/signin", { email, password });
};

export { fetchAllUser, signin };
