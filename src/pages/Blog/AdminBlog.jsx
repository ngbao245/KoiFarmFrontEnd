import React, { useState, useEffect } from 'react';
import AdminHeader from "../../layouts/header/AdminHeader";
import ModalBlogCreate from '../../components/ModalBlogCreate';
import ModalBlogUpdate from '../../components/ModalBlogUpdate';
import { CSVLink } from "react-csv";
import { toast } from 'react-toastify';
import { fetchAllBlogs, deleteBlog, updateBlog } from '../../services/BlogService';
import { getUserById } from "../../services/UserService";

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]); // List of blogs
  const [showModalCreateBlog, setShowModalCreateBlog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [userNames, setUserNames] = useState({});

  const handleOpenModal = () => setShowModalCreateBlog(true);
  const handleCloseModal = () => setShowModalCreateBlog(false);

  const fetchUserNames = async (blogs) => {
    const userIds = blogs.map((blog) => blog.userId);
    const uniqueUserIds = [...new Set(userIds)];

    const names = {};
    for (const userId of uniqueUserIds) {
      try {
        const response = await getUserById(userId);
        if (response && response.data) {
          names[userId] = response.data.name;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        names[userId] = "Unknown User";
      }
    }

    setUserNames(names);
  };

  const fetchBlogs = async () => {
    try {
      const response = await fetchAllBlogs();
      if (response && response.data) {
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

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleUpdateBlogList = (newBlog) => {
    setBlogs((prevBlogs) => {
      if (Array.isArray(prevBlogs)) {
        return [newBlog, ...prevBlogs];
      } else {
        return [newBlog];
      }
    });
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const response = await deleteBlog(id);
        if (response.statusCode === 200) {
          toast.success("Blog deleted successfully!");
          setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
        } else {
          toast.error("Error deleting blog.");
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        toast.error("Error deleting blog.");
      }
    }
  };

  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setShowUpdateModal(true);
  };

  const handleSubmitBlogUpdate = async (updatedBlogData) => {
    try {
      const response = await updateBlog(selectedBlog.id, updatedBlogData);
      if (response) {
        toast.success("Blog updated successfully!");
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog.id === selectedBlog.id ? { ...blog, ...updatedBlogData } : blog
          )
        );
      } else {
        toast.error("Error updating blog.");
      }
    } catch (error) {
      toast.error("Error updating blog.");
    }
    setShowUpdateModal(false);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  return (
    <>
      <AdminHeader />
      <div className="container">
        <div className="my-3 add-new d-sm-flex">
          <span>
            <b>Manage Blogs</b>
          </span>
          <div className="group-btns mt-sm-0 mt-2">
            <button
              className="btn btn-primary"
              onClick={handleOpenModal}
            >
              <i className="fa-solid fa-circle-plus px-1"></i>
              <span className="px-1">Add new blog</span>
            </button>
          </div>
        </div>

        <div className="customize-table">
          <table className="table table-striped text-center">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Image</th>
                <th>User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4">Loading blogs...</td>
                </tr>
              ) : blogs.length > 0 ? (
                blogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>{blog.title}</td>
                    <td>{blog.description}</td>
                    <td>
                      {blog.imageUrl ? (
                        <img
                          src={blog.imageUrl}
                          alt={blog.title}
                          style={{ width: "80px", height: "80px", objectFit: "cover" }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>{userNames[blog.userId] || blog.userId}</td>
                    <td>
                      <button 
                      className="btn btn-warning"
                      onClick={() => handleEditBlog(blog)}
                      >
                        Edit
                      </button>
                      <button className="btn btn-danger" 
                      style={{ marginLeft: "10px" }}
                      onClick={() => handleDeleteBlog(blog.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No blogs available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ModalBlogCreate
          isOpen={showModalCreateBlog}
          onClose={handleCloseModal}
          handleUpdate={handleUpdateBlogList}
        />
        <ModalBlogUpdate
          isOpen={showUpdateModal}
          onClose={handleCloseUpdateModal}
          onSubmit={handleSubmitBlogUpdate}
          blogData={selectedBlog} 
        />
      </div>
    </>
  );
};

export default AdminBlog;
