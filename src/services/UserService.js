import axios from "./Customize-Axios";

const signin = (email, password) => {
  return axios.post("Auth/signin", { email, password });
};

const signup = (data) => {
  return axios.post("Auth/signup", data);
};

const fetchAllStaff = () => {
  return axios.get(`User/users-by-2`);
};

const postCreateStaff = (data) => {
  return axios.post("/User/create-user-staff", data);
};

export { fetchAllStaff, signin, signup, postCreateStaff };
