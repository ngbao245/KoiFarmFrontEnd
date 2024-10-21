import axios from "./Customize-Axios";

const fetchAllBlogs = () => {
  return axios.get("Blog/get-all-blogs");
};

const fetchBlogById = (id) => {
  return axios.get(`Blog/get-blog/${id}`);
};

const createBlog = (blogData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.post("Blog/create-blog", blogData, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const updateBlog = (id, data) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.put(`Blog/update-blog/${id}`, data, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const deleteBlog = (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.delete(`Blog/delete-blog/${id}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

export { fetchAllBlogs, fetchBlogById, createBlog, updateBlog, deleteBlog };
