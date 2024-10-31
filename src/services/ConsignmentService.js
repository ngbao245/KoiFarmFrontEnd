import axios from "./Customize-Axios";

const createConsignment = (data) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.post("Consignment/create", data, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const updateConsignmentItemStatus = (id, status) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.put(
    `Consignment/update-item-status/${id}`,
    { status },
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

const fetchAllConsignments = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.get("Consignment/all-consignments", {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
};

const getConsignmentsByItemId = (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.get(`Consignment/item/${id}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const getConsignmentsForUser = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.get(`/Consignment/user-consignments`, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const checkoutConsignment = (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.post(
    `Consignment/checkout/${id}`,
    {},
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
};

const deleteConsignmentItem = (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.delete(
    `Consignment/remove-item/${id}`,
    {},
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
};

export { 
    createConsignment,
    updateConsignmentItemStatus,
    fetchAllConsignments,
    getConsignmentsByItemId,
    getConsignmentsForUser,
    checkoutConsignment,
    deleteConsignmentItem
};
