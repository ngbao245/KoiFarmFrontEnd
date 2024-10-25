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
      // toast.error("Error fetching blogs.");
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
    setBlogs((prevBlogs) =>
      Array.isArray(prevBlogs) ? [newBlog, ...prevBlogs] : [newBlog]
    );
    setIsUploading(false);
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?"))
      return;
    try {
      const response = await deleteBlog(id);
      if (response.statusCode === 200) {
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
        toast.success("Xóa bài viết thành công!");
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error);
      toast.error("Bạn không phải là tác giả của bài viêt.");
    }
  };

  const handleSubmitBlogUpdate = async (updatedBlogData) => {
    try {
      const response = await updateBlog(selectedBlog.id, updatedBlogData);
      if (response && response.data) {
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog.id === selectedBlog.id ? { ...blog, ...updatedBlogData } : blog
          )
        );
        toast.success("Cập nhật bài viết thành công!");
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error);
      toast.error("Bạn không phải là tác giả của bài viêt.");
    }
    setShowUpdateModal(false);
  };

  if (isLoading) return <FishSpinner />;

  return (
    <>
      <AdminHeader />

      <div className="container">
        {isUploading && <FishSpinner />}
        <div className="my-3 add-new d-sm-flex">
          <b>Quản lý Bài viết</b>
          <button
            className="btn btn-primary ms-auto"
            onClick={() => setShowModalCreate(true)}
            disabled={isUploading}
          >
            <i className="fa-solid fa-circle-plus px-1"></i> Thêm Mới
          </button>
        </div>
      </div>

      <div className="container-fluid">
        <table className="table table-striped text-center">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Nội dung</th>
              <th>Hình ảnh</th>
              <th>Tác giả</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5">Đang tải bài viết...</td>
              </tr>
            ) : blogs.length ? (
              blogs.map((blog) => (
                <tr key={blog.id}>
                  <td>{blog.title}</td>
                  <td>{blog.description.substring(0, 50)}...</td>
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
                      "Không có hình ảnh"
                    )}
                  </td>
                  <td>
                    {userNames[blog.userId] || "Người dùng không xác định"}
                  </td>
                  <td>
                    <button
                      title="Chỉnh sửa bài viết"
                      className="btn btn-warning"
                      onClick={() => {
                        setSelectedBlog(blog);
                        setShowUpdateModal(true);
                      }}
                      disabled={isUploading}
                    >
                      <i className="fa-solid fa-wrench"></i>
                    </button>
                    <button
                      title="Xoá bài viết"
                      className="btn btn-danger ms-2"
                      onClick={() => handleDeleteBlog(blog.id)}
                      disabled={isUploading}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <>
                <tr>
                  <td colSpan={"5"}>Không tìm thấy bài viết nào</td>
                </tr>
                <tr>
                  <td colSpan="5">
                    <i
                      className="fa-regular fa-folder-open"
                      style={{ fontSize: "30px", opacity: 0.2 }}
                    ></i>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>

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
