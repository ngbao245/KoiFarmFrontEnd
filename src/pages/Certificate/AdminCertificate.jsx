import React, { useState, useEffect } from "react";
import AdminHeader from "../../layouts/header/AdminHeader";
import { toast } from "react-toastify";
import FishSpinner from "../../components/FishSpinner";
import "./AdminCertificate.css";
import {
  fetchAllCertificate,
  deleteCertificate,
  updateCertificate,
  updateCertificateImage
} from "../../services/CertificateService";
import ModalCertificateCreate from "../../components/ModalCertificateCreate";
import ModalCertificateUpdate from "../../components/ModalCertificateUpdate";
import { fetchAllProducts } from "../../services/ProductService"; // Bạn cần tạo service này
import ModalProductCertificate from "../../components/ModalProductCertificate";

const AdminCertificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);

  useEffect(() => {
    fetchCertificates();
    fetchProductList();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetchAllCertificate();
      if (response?.data) {
        const formattedCertificates = response.data.map(cert => ({
          ...cert,
          productCertificates: cert.productCertificates || []
        }));
        setCertificates(formattedCertificates);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
      toast.error("Không thể tải danh sách chứng chỉ.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductList = async () => {
    try {
      const response = await fetchAllProducts();
      if (response?.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Không thể tải danh sách sản phẩm.");
    }
  };

  const handleSubmitCertificateUpdate = async (updatedData) => {
    try {
      setIsUploading(true);
      
      // Handle image update if there's a new image
      if (updatedData.image) {
        const formData = new FormData();
        formData.append('image', updatedData.image);
        await updateCertificateImage(selectedCertificate.certificateId, formData);
      }

      // Handle other data update
      const certificateData = {
        certificateName: updatedData.certificateName,
      };

      const response = await updateCertificate(
        selectedCertificate.certificateId, 
        certificateData
      );

      if (response?.data) {
        setCertificates(prevCerts =>
          prevCerts.map(cert =>
            cert.certificateId === selectedCertificate.certificateId
              ? { ...cert, ...response.data }
              : cert
          )
        );
        toast.success("Cập nhật chứng chỉ thành công!");
        setShowUpdateModal(false);
      }
    } catch (error) {
      console.error("Error updating certificate:", error);
      toast.error("Không thể cập nhật chứng chỉ.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateCertificateList = (newCertificate) => {
    setCertificates((prevCertificates) =>
      Array.isArray(prevCertificates) 
        ? [newCertificate, ...prevCertificates] 
        : [newCertificate]
    );
    setIsUploading(false);
  };

  const handleDeleteCertificate = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chứng chỉ này không?")) return;
    
    try {
      setIsUploading(true);
      const response = await deleteCertificate(id);
      
      if (response?.data) {
        setCertificates(prevCerts => 
          prevCerts.filter(cert => cert.certificateId !== id)
        );
        toast.success("Xóa chứng chỉ thành công!");
      }
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast.error("Không thể xóa chứng chỉ này.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <FishSpinner />;

  return (
    <>
      <AdminHeader />

      <div className="container">
        {isUploading && <FishSpinner />}
        <div className="my-3 add-new d-sm-flex">
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
              <th>Mã chứng chỉ</th>
              <th>Tên chứng chỉ</th>
              <th>Hình ảnh</th>
              <th>Sản phẩm liên quan</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5">Đang tải chứng chỉ...</td>
              </tr>
            ) : certificates.length ? (
              certificates.map((cert) => (
                <tr key={cert.certificateId}>
                  <td>{cert.certificateId}</td>
                  <td>{cert.certificateName}</td>
                  <td>
                    {cert.imageUrl ? (
                      <img
                        src={cert.imageUrl}
                        alt={cert.certificateName}
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
                    {cert.productCertificates.length || "Chưa có sản phẩm"}
                  </td>
                  <td>
                    <button
                      title="Chỉnh sửa chứng chỉ"
                      className="btn btn-warning"
                      onClick={() => {
                        setSelectedCertificate(cert);
                        setShowUpdateModal(true);
                      }}
                      disabled={isUploading}
                    >
                      <i className="fa-solid fa-wrench"></i>
                    </button>
                    <button
                      title="Quản lý sản phẩm"
                      className="btn btn-info ms-2"
                      onClick={() => {
                        // Đảm bảo cert có đúng cấu trúc dữ liệu
                        const certificateForModal = {
                          certificateId: cert.certificateId,
                          certificateName: cert.certificateName,
                          productCertificates: cert.productCertificates || []
                        };
                        setSelectedCertificate(certificateForModal);
                        setShowProductModal(true);
                      }}
                      disabled={isUploading}
                    >
                      <i className="fa-solid fa-list"></i>
                    </button>
                    <button
                      title="Xoá chứng chỉ"
                      className="btn btn-danger ms-2"
                      onClick={() => handleDeleteCertificate(cert.certificateId)}
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
                  <td colSpan="5">Không tìm thấy chứng chỉ nào</td>
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

        {/* You'll need to create these components */}
        <ModalCertificateCreate
          isOpen={showModalCreate}
          onClose={() => setShowModalCreate(false)}
          handleUpdate={handleUpdateCertificateList}
          setIsUploading={setIsUploading}
        />

        <ModalCertificateUpdate
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onSubmit={handleSubmitCertificateUpdate}
          certificateData={selectedCertificate}
          setIsUploading={setIsUploading}
          products={products} // Truyền products vào đây
        />

        <ModalProductCertificate
          isOpen={showProductModal}
          onClose={(shouldRefresh) => {
            setShowProductModal(false);
            if (shouldRefresh) {
              fetchCertificates();
            }
          }}
          certificateData={selectedCertificate}
          setIsUploading={setIsUploading}
        />
      </div>
    </>
  );
};

export default AdminCertificate;
