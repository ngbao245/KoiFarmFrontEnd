import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

const ModalCertificateUpdate = ({
  isOpen,
  onClose,
  onSubmit,
  certificateData,
  setIsUploading,
}) => {
  const [certificateName, setCertificateName] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (certificateData) {
      setCertificateName(certificateData.certificateName);
      setPreviewImage(certificateData.imageUrl);
    }
  }, [certificateData]);

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
      setIsLoading(true);
      setIsUploading(true);
      await onSubmit({
        certificateName,
        image,
      });
      handleClose();
    } catch (error) {
      console.error("Error updating certificate:", error);
    } finally {
      setIsLoading(false);
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
    <Modal
      show={isOpen}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Cập Nhật Chứng Chỉ</Modal.Title>
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
            <div>
              <img src={previewImage} alt="Preview" className="mb-3 w-100" />
            </div>
          )}
          <div className="mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              Cập Nhật
            </button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={handleClose}
              disabled={isLoading}
            >
              Hủy
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCertificateUpdate;
