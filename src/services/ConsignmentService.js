import axios from "./Customize-Axios";

const createConsignment = (data) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found! Please log in again.");
    }
    return axios.post(
      "Consignment/create", data,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
  };


export {
    createConsignment,
};