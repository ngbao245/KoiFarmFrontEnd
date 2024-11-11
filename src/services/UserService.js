import axios from "./Customize-Axios";

const signin = (email, password) => {
  return axios.post("Auth/signin", { email, password });
};

const signup = (data) => {
  return axios.post("Auth/signup", data);
};

const deleteAccount = (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.delete(`User/delete-user/${id}`,{
    headers: {
      Authorization: `${token}`,
    },
  });
};

const fetchAllStaff = () => {
  return axios.get("User/get-users-by-role/2");
};

const postCreateStaff = (data) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.post("/User/create-user-staff", data,{
    headers: {
      Authorization: `${token}`,
    },
  });
};

const deleteStaff = (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.delete(`/User/delete-user/${id}`,{
    headers: {
      Authorization: `${token}`
    },
  });
};

const getUserById = (userId) => {
  return axios.get(`/User/get-user/${userId}`);
};

const updateUserInfo = (data) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  if (!data.password) {
    throw new Error("Password is required for updating user information.");
  }

  return axios.put(`User/update-my-user`, data, {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
};

const getUserInfo = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.get(`/User/get-my-user`,{
    headers:{
      Authorization: `${token}`
    }
  });
};

const googleSignin = (data) => {
  return axios.post("/Auth/google-signin", data,{
    headers: {
      'Content-Type': 'application/json',
  },
  });
};

const requestPasswordReset = (email) => {
  return axios.post("User/request-password-reset", {email},{
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

const resetPassword = (email, token, newPassword) => {
  return axios.post("User/reset-password", {
    email,
    token,
    newPassword,
  },{
    headers: {
      'Content-Type': 'application/json'
    }
  });
};



export {
  signin,
  signup,
  deleteAccount,
  fetchAllStaff,
  postCreateStaff,
  deleteStaff,
  getUserById,
  updateUserInfo,
  getUserInfo,
  googleSignin,
  requestPasswordReset,
  resetPassword,
};
