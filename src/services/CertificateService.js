import axios from "./Customize-Axios";

const fetchAllCertificate = () => {
  return axios.get("Certificate/all-certificate");
};

const getCertificateById = (id) => {
  return axios.get(`Certificate/certificate/${id}`);
};

const getCertificateByProductItem = (productItemId) => {
  return axios.get(`Certificate/get-certificates-by-productItem/${productItemId}`);
};

const createCertificate = (data) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.post("Certificate/create-certificate", data, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const updateCertificate = (id, data) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.put(`Certificate/update-certificate/${id}`, data,{
    headers: {
      Authorization: `${token}`,
    },
  });
};

const updateCertificateImage = (id, data) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.put(`Certificate/update-certificate-image/${id}`, data,{
    headers: {
      Authorization: `${token}`,
    },
  });
};

const deleteCertificate = (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.delete(`Certificate/delete-certificate/${id}`,{
    headers: {
      Authorization: `${token}`,
    },
  });
};

const addProductCertificate = (data) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.post("Certificate/add-product-certificate", data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    }
  });
};

const updateProductCertificate = (id, data) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.put(`Certificate/update-product-certificate/${id}`, data,{
    headers: {
      Authorization: `${token}`,
    },
  });
};

const deleteProductCertificate = (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.delete(`Certificate/remove-product-certificate/${id}`,{
    headers: {
      Authorization: `${token}`,
    },
  });
};

export {
  fetchAllCertificate,
  getCertificateById,
  createCertificate,
  updateCertificate,
  updateCertificateImage,
  deleteCertificate,
  addProductCertificate,
  updateProductCertificate,
  deleteProductCertificate,
  getCertificateByProductItem,
};
