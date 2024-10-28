import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { createCertificate } from "../services/CertificateService";

const ModalCertificateCreate = ({ isOpen, onClose, handleUpdate, setIsUploading }) => {
  const [certificateName, setCertificateName] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!certificateName.trim()) {
      toast.error("Vui lòng nhập tên chứng chỉ!");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("certificateName", certificateName);
      if (image) {
        formData.append("image", image);
      }

      const response = await createCertificate(formData);
      if (response?.data) {
        handleUpdate(response.data);
        toast.success("Tạo chứng chỉ thành công!");
        handleClose();
      }
    } catch (error) {
      console.error("Error creating certificate:", error);
      toast.error("Không thể tạo chứng chỉ.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setCertificateName("");
    setImage(null);
    setPreviewImage(null);
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Tạo Chứng Chỉ Mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tên chứng chỉ</label>
            <input
              type="text"
              className="form-control"
              value={certificateName}
              onChange={(e) => setCertificateName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Hình ảnh</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          {previewImage && (
            <div className="mb-3">
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  maxWidth: "200px",
                  maxHeight: "200px",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
          <div className="mt-3">
            <button type="submit" className="btn btn-primary">
              Tạo Chứng Chỉ
            </button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={handleClose}
            >
              Hủy
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCertificateCreate;
