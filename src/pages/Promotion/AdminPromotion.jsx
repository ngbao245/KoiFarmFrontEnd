import React, { useState, useEffect } from "react";
import AdminHeader from "../../layouts/header/AdminHeader";
import ModalPromotionCreate from "../../components/ModalPromotionCreate";
import ModalPromotionUpdate from "../../components/ModalPromotionUpdate";
import { toast } from "react-toastify";
import {
    fetchAllPromotion,
    deletePromotion,
    updatePromotion,
  } from "../../services/PromotionService";
import FishSpinner from "../../components/FishSpinner";
// import "./AdminBlog.css";

// Thêm hàm helper để format giá trị
const formatAmount = (amount, type) => {
  if (type === "Direct") {
    return `${amount.toLocaleString('vi-VN')} VNĐ`;
  } else if (type === "Percentage") {
    return `${amount}%`;
  }
  return amount;
};

const AdminPromotion = () => {
  const [blogs, setBlogs] = useState([]);
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
      const response = await fetchAllPromotion();
      if (response?.data) {
        setBlogs(response.data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      // toast.error("Error fetching blogs.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleUpdateBlogList = (newBlog) => {
    setBlogs((prevBlogs) =>
      Array.isArray(prevBlogs) ? [newBlog, ...prevBlogs] : [newBlog]
    );
    setIsUploading(false);
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa mã khuyến mãi này không?"))
      return;
    try {
      const response = await deletePromotion(id);
      if (response.statusCode === 200) {
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
        toast.success("Xóa mã khuyến mãi thành công!");
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error);
      toast.error("Xóa không thành công");
    }
  };

  const handleSubmitBlogUpdate = async (updatedBlogData) => {
    try {
      const response = await updatePromotion(selectedBlog.id, updatedBlogData);
      if (response && response.data) {
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog.id === selectedBlog.id ? { ...blog, ...updatedBlogData } : blog
          )
        );
        toast.success("Cập nhật mã khuyến mãi thành công!");
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật mã khuyến mãi không thành công!");
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
          {/* <b>Quản lý Mã khuyến mãi</b> */}
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
              <th>Mã khuyến mãi</th>
              <th>Giá trị giảm giá</th>
              <th>Loại mã</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5">Đang tải mã khuyến mãi...</td>
              </tr>
            ) : blogs.length ? (
              blogs.map((blog) => (
                <tr key={blog.id}>
                  <td>{blog.code}</td>
                  <td>{formatAmount(blog.amount, blog.type)}</td>
                  <td>{blog.type === "Direct" ? "Trực Tiếp" : "Phần Trăm"}</td>
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

        <ModalPromotionCreate
          isOpen={showModalCreate}
          onClose={() => setShowModalCreate(false)}
          handleUpdate={handleUpdateBlogList}
          setIsUploading={setIsUploading}
        />

        <ModalPromotionUpdate
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

export default AdminPromotion;
