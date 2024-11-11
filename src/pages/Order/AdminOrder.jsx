import React, { useState, useEffect } from "react";
import AdminHeader from "../../layouts/header/AdminHeader";
import {
  fetchOrder,
  assignStaff,
  cancelOrder,
} from "../../services/OrderService";
import { fetchAllStaff, getUserById } from "../../services/UserService";
import { getNameOfProdItem } from "../../services/ProductItemService";
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

  const fetchData = async () => {
    try {
      const orderResponse = await fetchOrder();
      const staffResponse = await fetchAllStaff();

      const ordersData = orderResponse?.data || [];
      const staffData = staffResponse?.data?.entities || [];

      const detailedOrders = await Promise.all(
        ordersData.map(async (order) => {
          const userResponse = await getUserById(order.userId);

          const productDetails = await Promise.all(
            order.items.map(async (item) => {
              const { name } = await getNameOfProdItem(item.productItemId);
              return `${name} x${item.quantity}`;
            })
          );

          return {
            ...order,
            userName: userResponse?.data?.name || "Không xác định",
            assignedStaffName:
              staffData.find((s) => s.id === order.staffId)?.name ||
              "Chưa phân công",
            products: productDetails.join(", "),
          };
        })
      );

      const sortedOrders = detailedOrders.sort((a, b) => 
        new Date(b.createdTime) - new Date(a.createdTime)
      );

      setOrders(sortedOrders);
      setStaffMembers(staffData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        <div className="expanded-row-content">
          <p>
            <strong>Địa chỉ:</strong> {order.address}
          </p>
          <p>
            <strong>Sản phẩm:</strong> {order.products}
          </p>
          <p>
            <strong>Tổng cộng:</strong> {order.total.toLocaleString("vi-VN")}{" "}
            VND
          </p>
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
