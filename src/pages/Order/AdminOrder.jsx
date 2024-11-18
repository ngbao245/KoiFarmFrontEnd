import React, { useState, useEffect } from "react";
import AdminHeader from "../../layouts/header/AdminHeader";
import {
  fetchOrder,
  assignStaff,
  cancelOrder,
} from "../../services/OrderService";
import { fetchAllStaff, getUserById } from "../../services/UserService";
import { getNameOfProdItem, getProdItemById } from "../../services/ProductItemService";
import { fetchBatchById } from "../../services/BatchService";
import StaffDropdown from "../../components/StaffDropdown";
import ConfirmationModal from "../../components/ConfirmationModal";
import { toast } from "react-toastify";
import FishSpinner from "../../components/FishSpinner";
import "./AdminOrder.css";
import { fetchAllPayment, processRefund } from "../../services/PaymentService";

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("Pending");

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const [expandedRows, setExpandedRows] = useState([]);
  const [batchDetails, setBatchDetails] = useState({});

  const [expandedBatches, setExpandedBatches] = useState([]);

  const fetchData = async () => {
    try {
      const orderResponse = await fetchOrder();
      const staffResponse = await fetchAllStaff();

      const ordersData = orderResponse?.data || [];
      const staffData = staffResponse?.data?.entities || [];

      const detailedOrders = await Promise.all(
        ordersData.map(async (order) => {
          const userResponse = await getUserById(order.userId);
          const processedBatchIds = new Set();
          
          const batchGroups = {};
          order.items.forEach(item => {
            if (item.batchId) {
              if (!batchGroups[item.batchId]) {
                batchGroups[item.batchId] = [];
              }
              batchGroups[item.batchId].push(item);
            }
          });

          const productDetails = await Promise.all([
            ...Object.entries(batchGroups).map(async ([batchId, items]) => {
              const batchResponse = await fetchBatchById(batchId);
              if (batchResponse?.data) {
                setBatchDetails(prev => ({
                  ...prev,
                  [batchId]: batchResponse.data
                }));

                const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

                return {
                  type: 'batch',
                  name: batchResponse.data.name,
                  batchId: batchId,
                  quantity: totalQuantity,
                  price: batchResponse.data.price
                };
              }
              return null;
            }),

            ...await Promise.all(
              order.items
                .filter(item => !item.batchId)
                .map(async (item) => {
                  const productResponse = await getProdItemById(item.productItemId);
                  return {
                    type: 'single',
                    name: productResponse?.data?.name,
                    imageUrl: productResponse?.data?.imageUrl,
                    quantity: item.quantity,
                    price: productResponse?.data?.price,
                    sex: productResponse?.data?.sex,
                    age: productResponse?.data?.age,
                    size: productResponse?.data?.size
                  };
                })
            )
          ]);

          const filteredProductDetails = productDetails.filter(item => item !== null);

          return {
            ...order,
            userName: userResponse?.data?.name || "Không xác đnh",
            userEmail: userResponse?.data?.email || "Không có",
            userPhone: userResponse?.data?.phone || "Không có",
            assignedStaffName:
              staffData.find((s) => s.id === order.staffId)?.name ||
              "Chưa phân công",
            productDetails: filteredProductDetails
          };
        })
      );

      const sortedOrders = detailedOrders.sort((a, b) => 
        new Date(b.createdTime) - new Date(a.createdTime)
      );

      setOrders(sortedOrders);
      setStaffMembers(staffData);
    } catch (error) {
      console.error('Error in fetchData:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log('Current batchDetails:', batchDetails);
  }, [batchDetails]);

  const filterOrdersByStatus = (status) => {
    return orders
      .filter((order) => 
        order.status.toLowerCase() === status.toLowerCase() && 
        order.consignmentId === null
      )
      .filter(
        (order) =>
          order.orderId.toString().includes(searchTerm.toLowerCase()) ||
          order.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  const handleAssignStaff = async (orderId, staffId) => {
    try {
      await assignStaff(orderId, staffId);
      toast.success("Phân công nhân viên thành công!");

      const updatedOrders = orders.map((order) =>
        order.orderId === orderId
          ? {
              ...order,
              staffId,
              assignedStaffName:
                staffMembers.find((s) => s.id === staffId)?.name ||
                "Chưa phân công",
            }
          : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      toast.error("Phân công nhân viên thất bại");
    }
  };

  const handleCancelOrder = (order) => {
    setOrderToCancel(order);
    setIsConfirmModalOpen(true);
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      const response = await cancelOrder(orderToCancel.orderId);
      if (response.statusCode === 200) {
        const updatedOrders = orders.map((order) =>
          order.orderId === orderToCancel.orderId
            ? { ...order, status: "Cancelled" }
            : order
        );
        setOrders(updatedOrders);
        toast.success(
          "Đã hủy đơn hàng thành công. Số lượng sản phẩm đã được cập nhật lại."
        );

        const paymentResponse = await fetchAllPayment();
        if (paymentResponse?.statusCode === 200 && paymentResponse?.data) {
          const payments = paymentResponse.data;
          const payment = payments.find(
            (p) => p.orderId === orderToCancel.orderId
          );

          if (payment?.id) {
            await processRefund(payment.id);
            toast.success("Refund has been processed successfully.");
          }
        } else {
          // toast.error("Failed to fetch payments for processing the refund.");
        }
      } else {
        toast.error("Không thể hủy đơn hàng. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi hủy đơn hàng.");
    } finally {
      setIsConfirmModalOpen(false);
      setOrderToCancel(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "completed";
      case "delivering":
        return "delivering";
      case "cancelled":
        return "cancelled";
      default:
        return "not-completed";
    }
  };

  const renderExpandedRow = (order) => (
    <tr>
      <td colSpan="8">
        <div className="ao-expanded-content">
          {/* Thông tin cơ bản */}
          <div className="ao-basic-info">
            <div className="ao-info-row">
              <div className="ao-info-item">
                <span className="ao-info-label">Mã đơn hàng:</span>
                <span className="ao-info-value">{order.orderId}</span>
              </div>
              <div className="ao-info-item">
                <span className="ao-info-label">Ngày đặt:</span>
                <span className="ao-info-value">
                  {new Date(order.createdTime).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="ao-info-item">
                <span className="ao-info-label">Khách hàng:</span>
                <span className="ao-info-value">{order.userName}</span>
              </div>
              <div className="ao-info-item">
                <span className="ao-info-label">Địa chỉ:</span>
                <span className="ao-info-value">{order.address}</span>
              </div>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="ao-products-section">
            <div className="ao-section-title">Chi tiết sản phẩm</div>
            
            {order.productDetails.map((item, index) => (
              <div key={index} className="ao-product-item">
                {item.type === 'batch' ? (
                  <>
                    <div className="ao-product-header">
                      <div className="ao-product-type">Lô hàng</div>
                      <div className="ao-product-name">{item.name}</div>
                      <div className="ao-product-quantity">
                        Số lượng: {item.quantity}
                      </div>
                      <div className="ao-product-price">
                        {item.price?.toLocaleString("vi-VN")} VND
                      </div>
                      <button 
                        className={`ao-expand-button ${expandedBatches.includes(item.batchId) ? 'expanded' : ''}`}
                        onClick={() => toggleBatchExpand(item.batchId)}
                      >
                        <i className="fas fa-chevron-down"></i>
                      </button>
                    </div>
                    
                    {expandedBatches.includes(item.batchId) && batchDetails[item.batchId]?.items && (
                      <div className="ao-batch-items">
                        {batchDetails[item.batchId].items.map((batchItem, idx) => (
                          <div key={`${item.batchId}-${idx}`} className="ao-batch-subitem">
                            <img 
                              src={batchItem.imageUrl || '/default-product.png'} 
                              alt={batchItem.name}
                              className="ao-item-image"
                            />
                            <div className="ao-item-details">
                              <div className="ao-item-name">{batchItem.name}</div>
                              <div className="ao-item-specs">
                                <span>Giới tính: {batchItem.sex}</span>
                                <span>Tuổi: {batchItem.age}</span>
                                <span>Size: {batchItem.size}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="ao-single-item">
                    <div className="ao-single-header">
                      <div className="ao-single-badge">Sản phẩm đơn lẻ</div>
                    </div>
                    
                    <div className="ao-single-content">
                      <img 
                        src={item.imageUrl || '/default-product.png'} 
                        alt={item.name}
                        className="ao-item-image"
                        onError={(e) => {
                          e.target.src = '/default-product.png';
                          e.target.onerror = null;
                        }}
                      />
                      
                      <div className="ao-item-info">
                        <div className="ao-item-name">{item.name}</div>
                        <div className="ao-item-specs">
                          <div className="ao-item-spec">
                            <span className="ao-spec-label">Giới tính:</span>
                            <span className="ao-spec-value">{item.sex}</span>
                          </div>
                          <div className="ao-item-spec">
                            <span className="ao-spec-label">Tuổi:</span>
                            <span className="ao-spec-value">{item.age}</span>
                          </div>
                          <div className="ao-item-spec">
                            <span className="ao-spec-label">Size:</span>
                            <span className="ao-spec-value">{item.size}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ao-item-purchase">
                        <span className="ao-purchase-quantity">Số lượng: {item.quantity}</span>
                        <span className="ao-purchase-price">
                          {item.price?.toLocaleString("vi-VN")} VND
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tổng cộng */}
          <div className="ao-order-total">
            <span className="ao-total-label">Tổng tiền:</span>
            <span className="ao-total-value">
              {order.total.toLocaleString("vi-VN")} VND
            </span>
          </div>
        </div>
      </td>
    </tr>
  );

  const toggleExpandedRow = (orderId) => {
    setExpandedRows((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleBatchExpand = (batchId) => {
    setExpandedBatches(prev => 
      prev.includes(batchId) 
        ? prev.filter(id => id !== batchId)
        : [...prev, batchId]
    );
  };

  if (loading) return <FishSpinner />;

  return (
    <>
      <AdminHeader />
      <div className="container">
        <div className="my-3">
          <b>Danh sách đơn đặt hàng:</b>
          <div className="col-12 col-sm-4 my-3">
            <input
              className="form-control"
              placeholder="Tìm kiếm theo mã đơn hàng hoặc tên người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="order-tabs">
          <button
            className={`order-tab-button ${
              activeTab === "Pending" ? "active" : ""
            }`}
            onClick={() => setActiveTab("Pending")}
          >
            Đang xử lý
          </button>
          <button
            className={`order-tab-button ${
              activeTab === "Delivering" ? "active" : ""
            }`}
            onClick={() => setActiveTab("Delivering")}
          >
            Đang giao hàng
          </button>
          <button
            className={`order-tab-button ${
              activeTab === "Completed" ? "active" : ""
            }`}
            onClick={() => setActiveTab("Completed")}
          >
            Đã hoàn thành
          </button>
          <button
            className={`order-tab-button ${
              activeTab === "Cancelled" ? "active" : ""
            }`}
            onClick={() => setActiveTab("Cancelled")}
          >
            Đã hủy
          </button>
        </div>
      </div>

      <div className="container-fluid">
        <table className="table table-striped text-center">
          <thead>
            <tr>
              <th></th>
              <th>Mã đơn hàng</th>
              <th>Khách hàng</th>
              <th>Ngày đặt hàng</th>
              <th>Trạng thái</th>
              <th>Nhân viên chỉ định</th>
              {activeTab === "Pending" && <th>Huỷ đơn hàng</th>}
            </tr>
          </thead>
          <tbody>
            {filterOrdersByStatus(activeTab).length > 0 ? (
              filterOrdersByStatus(activeTab).map((order) => (
                <React.Fragment key={order.orderId}>
                  <tr>
                    <td>
                      <button
                        title="Xem chi tiết"
                        className="btn btn-sm mr-2"
                        onClick={() => toggleExpandedRow(order.orderId)}
                      >
                        <i className="fas fa-info-circle"></i>
                      </button>
                    </td>
                    <td>{order.orderId}</td>
                    <td>{order.userName}</td>
                    <td>{new Date(order.createdTime).toLocaleDateString(
                      "vi-VN", {
                              year: 'numeric',
                              month: 'numeric',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            }
                    )}</td>
                    <td>
                      <span
                        className={`admin-order-status-badge ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <StaffDropdown
                        staffMembers={staffMembers}
                        currentStaffId={order.staffId}
                        onAssign={(staffId) =>
                          handleAssignStaff(order.orderId, staffId)
                        }
                        disabled={order.status.toLowerCase() !== "pending"}
                      />
                    </td>
                    <td>
                      {order.status.toLowerCase() === "pending" && (
                        <button
                          title="Huỷ đơn hàng"
                          className="btn btn-danger ms-2"
                          onClick={() => handleCancelOrder(order)}
                        >
                          <i className="fa-solid fa-ban"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                  {expandedRows.includes(order.orderId) &&
                    renderExpandedRow(order)}
                </React.Fragment>
              ))
            ) : (
              <>
                <tr>
                  <td colSpan="9">Không tìm thấy đơn hàng nào</td>
                </tr>
                <tr>
                  <td colSpan="9">
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
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmCancelOrder}
        message={`Bạn có chắc chắn muốn hủy đơn hàng #${orderToCancel?.orderId}?`}
      />
    </>
  );
};

export default AdminOrder;
