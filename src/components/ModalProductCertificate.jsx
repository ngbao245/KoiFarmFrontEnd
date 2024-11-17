import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  addProductCertificate,
  deleteProductCertificate,
  getCertificateById,
} from "../services/CertificateService";
import { fetchAllProdItem, getNameOfProdItem } from "../services/ProductItemService";
import FishSpinner from "./FishSpinner";

const ModalProductCertificate = ({
  isOpen,
  onClose,
  certificateData,
  setIsUploading,
}) => {
  const [allProducts, setAllProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [certificateDetails, setCertificateDetails] = useState(null);

  useEffect(() => {
    if (isOpen && certificateData?.certificateId) {
      fetchCertificateDetails();
      fetchAllProducts();
    }
  }, [isOpen, certificateData?.certificateId]);

  const fetchCertificateDetails = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await getCertificateById(certificateData.certificateId);
      if (response?.statusCode === 200 && response?.data) {
        const productCertificates = await Promise.all(
          response.data.productCertificates.map(async (pc) => {
            const productName = await getNameOfProdItem(pc.productItemId);
            return {
              ...pc,
              productName: productName?.name,
            };
          })
        );
        setCertificateDetails({
          ...response.data,
          productCertificates,
        });
      }
    } catch (error) {
      console.error("Error fetching certificate details:", error);
      toast.error("Không thể tải thông tin chứng chỉ");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await fetchAllProdItem(1, 1000, "");
      if (response?.data?.entities) {
        setAllProducts(response.data.entities);
      }
    } catch (error) {
      console.error("Error fetching all products:", error);
      toast.error("Không thể tải danh sách sản phẩm.");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!productId) {
      toast.error("Vui lòng chọn sản phẩm!");
      return;
    }

    try {
      setIsUploading(true);
      const data = {
        certificateId: certificateData.certificateId,
        productItemId: productId.toString(),
      };

      const response = await addProductCertificate(data);
      if (response?.data) {
        toast.success("Thêm sản phẩm vào chứng chỉ thành công!");
        setProductId("");
        fetchCertificateDetails();
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(
        error.response?.data?.message ||
          "Không thể thêm sản phẩm vào chứng chỉ."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveProduct = async (id) => {
    if (
      !window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi chứng chỉ?")
    ) {
      return;
    }

    try {
      setIsUploading(true);
      await deleteProductCertificate(id);
      toast.success("Xóa sản phẩm khỏi chứng chỉ thành công!");
      fetchCertificateDetails();
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error("Không thể xóa sản phẩm khỏi chứng chỉ.");
    } finally {
      setIsUploading(false);
    }
  };

  const getAvailableProducts = () => {
    if (!allProducts || !certificateDetails?.productCertificates) {
      return [];
    }

    const addedProductIds = new Set(
      certificateDetails.productCertificates.map((pc) => pc.productItemId)
    );

    return allProducts.filter((product) => !addedProductIds.has(product.id));
  };

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Quản lý Sản phẩm - {certificateDetails?.certificateName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoadingProducts && <FishSpinner />}

        <form onSubmit={handleAddProduct}>
          <div className="mb-3">
            <label className="form-label">Thêm sản phẩm</label>
            <select
              className="form-control"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">Chọn sản phẩm</option>
              {getAvailableProducts().map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!productId || isLoadingProducts}
          >
            Thêm Sản phẩm
          </button>
        </form>

        <div className="mt-4">
          <h5>
            Sản phẩm đã thêm (
            {certificateDetails?.productCertificates?.length || 0})
          </h5>
          <div className="product-list">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên sản phẩm</th>
                  <th>Nhà cung cấp</th>
                  <th>Ngày phát hành</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {certificateDetails?.productCertificates?.length > 0 ? (
                  certificateDetails.productCertificates.map((pc) => (
                    <tr key={pc.id}>
                      <td>{pc.id}</td>
                      <td>{pc.productName || "N/A"}</td>
                      <td>{pc.provider}</td>
                      <td>
                        {new Date(pc.publishDate).toLocaleString("vi-VN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveProduct(pc.id)}
                          disabled={isLoadingProducts}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Chưa có sản phẩm nào được thêm
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalProductCertificate;
