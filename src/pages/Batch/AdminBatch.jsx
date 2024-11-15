import React, { useState, useEffect } from "react";
import AdminHeader from "../../layouts/header/AdminHeader";
import { toast } from "react-toastify";
import FishSpinner from "../../components/FishSpinner";
import "./AdminBatch.css";
import {
  fetchAllBatchs,
  deleteBatch,
  updateBatch,
} from "../../services/BatchService";
import ModalBatchCreate from "../../components/ModalBatchCreate";
import ModalBatchUpdate from "../../components/ModalBatchUpdate";
import ModalBatchItems from "../../components/ModalBatchItems";
import ConfirmationModal from "../../components/ConfirmationModal";

const AdminBatch = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await fetchAllBatchs();
      if (response?.data) {
        setBatches(response.data);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
      toast.error("Không thể tải danh sách lô hàng.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBatchList = (newBatch) => {
    fetchBatches();
    setIsUploading(false);
  };

  const handleDeleteBatch = async (batch) => {
    setBatchToDelete(batch);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteBatch = async () => {
    try {
      setIsUploading(true);
      const response = await deleteBatch(batchToDelete.id);
      if (response?.data) {
        setBatches((prevBatches) =>
          prevBatches.filter((batch) => batch.id !== batchToDelete.id)
        );
        toast.success("Xóa lô hàng thành công!");
      }
    } catch (error) {
      console.error("Error deleting batch:", error);
      toast.error("Không thể xóa lô hàng này.");
    } finally {
      setIsUploading(false);
      setIsConfirmModalOpen(false);
      setBatchToDelete(null);
    }
  };

  const handleSubmitBatchUpdate = async (updatedData) => {
    try {
      setIsUploading(true);
      const response = await updateBatch(selectedBatch.id, updatedData);

      if (response?.data) {
        setBatches((prevBatches) =>
          prevBatches.map((batch) =>
            batch.id === selectedBatch.id
              ? { ...batch, ...response.data }
              : batch
          )
        );
        toast.success("Cập nhật lô hàng thành công!");
        setShowUpdateModal(false);
      }
    } catch (error) {
      console.error("Error updating batch:", error);
      toast.error("Không thể cập nhật lô hàng.");
    } finally {
      setIsUploading(false);
    }
  };

  const toggleExpandedRow = (batchId) => {
    setExpandedRows((prev) =>
      prev.includes(batchId)
        ? prev.filter((id) => id !== batchId)
        : [...prev, batchId]
    );
  };

  const renderExpandedRow = (batch) => {
    if (!batch.items || batch.items.length === 0) {
      return null;
    }

    return (
      <tr>
        <td colSpan="6">
          <div className="batch-expanded-content">
            <div className="batch-items-list">
              {batch.items.map((item) => (
                <div key={item.batchItemId} className="batch-item">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="batch-item-image"
                  />
                  <div className="batch-item-details">
                    <p>
                      <strong>Tên:</strong> {item.name}
                    </p>
                    <p>
                      <strong>Giới tính:</strong> {item.sex}
                    </p>
                    <p>
                      <strong>Tuổi:</strong> {item.age} năm
                    </p>
                    <p>
                      <strong>Kích thước:</strong> {item.size}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </td>
      </tr>
    );
  };

  if (isLoading) return <FishSpinner />;

  return (
    <>
      <AdminHeader />

      <div className="container">
        {isUploading && <FishSpinner />}
        <div className="my-3 batch-add-new">
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
        <table className="table table-striped text-center batch-table">
          <thead>
            <tr>
              <th></th>
              <th>Mã lô</th>
              <th>Tên lô</th>
              <th>Số lượng sản phẩm</th>
              <th>Hình ảnh</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {batches.length ? (
              batches.map((batch) => (
                <React.Fragment key={batch.id}>
                  <tr>
                    <td>
                      {batch.items && batch.items.length > 0 && (
                        <button
                          title="Xem chi tiết"
                          className="btn btn-sm mr-2"
                          onClick={() => toggleExpandedRow(batch.id)}
                        >
                          <i className="fas fa-info-circle"></i>
                        </button>
                      )}
                    </td>
                    <td>{batch.id}</td>
                    <td>{batch.name}</td>
                    <td>{batch.items?.length || 0}</td>
                    <td>
                      <img
                        src={batch.imageUrl}
                        alt={batch.name}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </td>
                    <td>
                      <button
                        title="Chỉnh sửa lô hàng"
                        className="btn btn-warning"
                        onClick={() => {
                          setSelectedBatch(batch);
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
                          setSelectedBatch(batch);
                          setShowItemsModal(true);
                        }}
                        disabled={isUploading}
                      >
                        <i className="fa-solid fa-list"></i>
                      </button>
                      <button
                        title={
                          batch.items && batch.items.length > 0
                            ? "Không thể xóa lô hàng có sản phẩm"
                            : "Xoá lô hàng"
                        }
                        className="btn btn-danger ms-2"
                        onClick={() => handleDeleteBatch(batch)}
                        disabled={
                          isUploading || (batch.items && batch.items.length > 0)
                        }
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                  {expandedRows.includes(batch.id) && renderExpandedRow(batch)}
                </React.Fragment>
              ))
            ) : (
              <>
                <tr>
                  <td colSpan="6">Không tìm thấy lô hàng nào</td>
                </tr>
                <tr>
                  <td colSpan="6">
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

        <ModalBatchCreate
          isOpen={showModalCreate}
          onClose={() => setShowModalCreate(false)}
          handleUpdate={handleUpdateBatchList}
          setIsUploading={setIsUploading}
        />

        <ModalBatchUpdate
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onSubmit={handleSubmitBatchUpdate}
          batchData={selectedBatch}
          setIsUploading={setIsUploading}
        />

        <ModalBatchItems
          isOpen={showItemsModal}
          onClose={(shouldRefresh) => {
            setShowItemsModal(false);
            if (shouldRefresh) {
              fetchBatches();
            }
          }}
          batchData={selectedBatch}
          setIsUploading={setIsUploading}
        />

        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => {
            setIsConfirmModalOpen(false);
            setBatchToDelete(null);
          }}
          onConfirm={confirmDeleteBatch}
          message={`Bạn có chắc chắn muốn xóa lô hàng "${batchToDelete?.name}" không?`}
        />
      </div>
    </>
  );
};

export default AdminBatch;
