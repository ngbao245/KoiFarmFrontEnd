import axios from "./Customize-Axios";

const fetchAllBlogs = () => {
  return axios.get("Blog/get-all-blogs");
};

const createBlog = () => {
  return axios.post("Blog/create-blog");
};

const updateBlog = (id) => {
  return axios.put(`Blog/update-blog/${id}`);
};

const deleteBlog = (id) => {
  return axios.delete(`Blog/delete-blog/${id}`);
};

export { fetchAllBlogs, createBlog, updateBlog, deleteBlog };
