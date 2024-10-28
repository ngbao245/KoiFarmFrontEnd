import axios from "./Customize-Axios";

const fetchAllCertificate = () => {
  return axios.get("Certificate/all-certificate");
};

const getCertificateById = (id) => {
  return axios.get(`Certificate/certificate/${id}`);
};

const createCertificate = (data) => {
  return axios.post("Certificate/create-certificate", data);
};

const updateCertificate = (id, data) => {
  return axios.put(`Certificate/update-certificate/${id}`, data);
};

const updateCertificateImage = (id, data) => {
  return axios.put(`Certificate/update-certificate-image/${id}`, data);
};

const deleteCertificate = (id) => {
  return axios.delete(`Certificate/delete-certificate/${id}`);
};

const addProductCertificate = (data) => {
  return axios.post("Certificate/add-product-certificate", data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

const updateProductCertificate = (id, data) => {
  return axios.put(`Certificate/update-product-certificate/${id}`, data);
};

const deleteProductCertificate = (id) => {
  return axios.delete(`Certificate/remove-product-certificate/${id}`);
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
};
