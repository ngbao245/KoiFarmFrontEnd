import axios from "./Customize-Axios";

const signin = (email, password) => {
  return axios.post("Auth/signin", { email, password });
};

const signup = (data) => {
  return axios.post("Auth/signup", data);
};

const fetchAllUser = () => {
  return axios.get("User/get-all-users");
};

const postCreateStaff = (data) => {
  return axios.post("/User/create-user-staff", data);
};

export { fetchAllUser, signin, signup, postCreateStaff };
