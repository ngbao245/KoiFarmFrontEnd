import axios from "./Customize-Axios";

const signin = (email, password) => {
  return axios.post("Auth/signin", { email, password });
};

const signup = (data) => {
  return axios.post("Auth/signup", data);
};

const fetchAllStaff = () => {
  return axios.get("User/get-users-by-role/2");
};

const postCreateStaff = (data) => {
  return axios.post("/User/create-user-staff", data);
};

const deleteStaff = (id) => {
  return axios.delete(`/User/delete-user/${id}`);
};

export { fetchAllStaff, signin, signup, postCreateStaff, deleteStaff };
