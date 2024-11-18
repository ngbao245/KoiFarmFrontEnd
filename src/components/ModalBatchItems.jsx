import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { addItemToBatch, removeItemFromBatch } from "../services/BatchService";
import { fetchAllProdItem } from "../services/ProductItemService";
import ConfirmationModal from "./ConfirmationModal";
import FishSpinner from "./FishSpinner";
import "./ModalBatch.css";

const ModalBatchItems = ({ isOpen, onClose, batchData, setIsUploading }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  useEffect(() => {
    if (isOpen && batchData?.id) {
      fetchProducts();
    }
  }, [isOpen, batchData?.id]);

  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await fetchAllProdItem(1, 1000, "");
      if (response?.data?.entities) {
        setAllProducts(response.data.entities);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Không thể tải danh sách sản phẩm.");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      toast.error("Vui lòng chọn sản phẩm!");
      return;
    }

    try {
      setIsUploading(true);
      await addItemToBatch(batchData.id, { productItemId: selectedProductId });
      toast.success("Thêm sản phẩm vào lô hàng thành công!");
      setSelectedProductId("");
      onClose(true);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Không thể thêm sản phẩm vào lô hàng.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveProduct = async (item) => {
    setItemToRemove(item);
    setIsConfirmModalOpen(true);
  };

  const confirmRemoveProduct = async () => {
    try {
      setIsUploading(true);
      await removeItemFromBatch(batchData.id, itemToRemove.batchItemId);
      toast.success("Xóa sản phẩm khỏi lô hàng thành công!");
      onClose(true);
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error("Không thể xóa sản phẩm khỏi lô hàng.");
    } finally {
      setIsUploading(false);
      setIsConfirmModalOpen(false);
      setItemToRemove(null);
    }
  };

  return (
    <>
      <Modal show={isOpen} onHide={() => onClose(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Quản lý Sản phẩm - {batchData?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoadingProducts ? (
            <FishSpinner />
          ) : (
            <>
              <form onSubmit={handleAddProduct}>
                <div className="mb-3">
                  <label className="form-label">Thêm sản phẩm</label>
                  <select
                    className="form-control"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                  >
                    <option value="">Chọn sản phẩm</option>
                    {allProducts.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!selectedProductId}
                >
                  Thêm Sản phẩm
                </button>
              </form>

              <div className="mt-4">
                <h5>Sản phẩm trong lô ({batchData?.items?.length || 0})</h5>
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên sản phẩm</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchData?.items?.length > 0 ? (
                      batchData.items.map((item) => (
                        <tr key={item.batchItemId}>
                          <td>{item.batchItemId}</td>
                          <td>{item.name}</td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleRemoveProduct(item)}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          Chưa có sản phẩm nào trong lô
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setItemToRemove(null);
        }}
        onConfirm={confirmRemoveProduct}
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${itemToRemove?.name}" khỏi lô hàng?`}
      />
    </>
  );
};

export default ModalBatchItems;
