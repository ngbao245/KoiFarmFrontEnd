import React, { useState, useEffect } from "react";
import AdminHeader from "../../layouts/header/AdminHeader";
import ModalBlogCreate from "../../components/ModalBlogCreate";
import ModalBlogUpdate from "../../components/ModalBlogUpdate";
import { toast } from "react-toastify";
import {
  fetchAllBlogs,
  deleteBlog,
  updateBlog,
} from "../../services/BlogService";
import { getUserById } from "../../services/UserService";
import FishSpinner from "../../components/FishSpinner";
import "./AdminBlog.css";

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetchAllBlogs();
      if (response?.data) {
        setBlogs(response.data);
        await fetchUserNames(response.data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Error fetching blogs.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserNames = async (blogs) => {
    const uniqueUserIds = [...new Set(blogs.map((blog) => blog.userId))];
    const names = await Promise.all(
      uniqueUserIds.map(async (userId) => {
        try {
          const response = await getUserById(userId);
          return { [userId]: response?.data?.name || "Unknown User" };
        } catch {
          return { [userId]: "Unknown User" };
        }
      })
    );
    setUserNames(Object.assign({}, ...names));
  };

  const handleUpdateBlogList = (newBlog) => {
    setBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
    setIsUploading(false);
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const response = await deleteBlog(id);
      if (response.statusCode === 200) {
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
        toast.success("Blog deleted successfully!");
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Error deleting blog.");
    }
  };

  const handleSubmitBlogUpdate = async (updatedBlogData) => {
    try {
      await updateBlog(selectedBlog.id, updatedBlogData);
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === selectedBlog.id ? { ...blog, ...updatedBlogData } : blog
        )
      );
      toast.success("Blog updated successfully!");
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Error updating blog.");
    }
    setShowUpdateModal(false);
  };

  return (
    <>
      <AdminHeader />
      <div className="container">
        {isUploading && <FishSpinner />}
        <div className="my-3 add-new d-sm-flex">
          <b>Manage Blogs</b>
          <button
            className="btn btn-primary ms-auto"
            onClick={() => setShowModalCreate(true)}
            disabled={isUploading}
          >
            <i className="fa-solid fa-circle-plus px-1"></i> Add new blog
          </button>
        </div>

        <div className="customize-table">
          <table className="table table-striped text-center">
            <thead>
              <tr>
                <th>Title</th>
                <th>Content</th>
                <th>Thumbnail</th>
                <th>Actor</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5">Loading blogs...</td>
                </tr>
              ) : blogs.length ? (
                blogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>{blog.title}</td>
                    <td>{blog.description}</td>
                    <td>
                      {blog.imageUrl ? (
                        <img
                          src={blog.imageUrl}
                          alt={blog.title}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>{userNames[blog.userId] || "Unknown User"}</td>
                    <td>
                      <button
                        className="btn btn-warning"
                        onClick={() => {
                          setSelectedBlog(blog);
                          setShowUpdateModal(true);
                        }}
                        disabled={isUploading}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger ms-2"
                        onClick={() => handleDeleteBlog(blog.id)}
                        disabled={isUploading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No blogs available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ModalBlogCreate
          isOpen={showModalCreate}
          onClose={() => setShowModalCreate(false)}
          handleUpdate={handleUpdateBlogList}
          setIsUploading={setIsUploading}
        />

        <ModalBlogUpdate
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onSubmit={handleSubmitBlogUpdate}
          blogData={selectedBlog}
          setIsUploading={setIsUploading}
        />
      </div>
    </>
  );
};

export default AdminBlog;
