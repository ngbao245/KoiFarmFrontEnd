import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import {
  getAssignedOrders,
  updateOrderStatus,
} from "../../services/OrderService";
import { getNameOfProdItem } from "../../services/ProductItemService";
import { getUserById } from "../../services/UserService";
import AdminHeader from "../../layouts/header/AdminHeader";
import { toast } from "react-toastify";
import FishSpinner from "../../components/FishSpinner";
import "./StaffOrders.css";
import { fetchAllPayment, createPaymentForCOD } from "../../services/PaymentService";


const StaffOrders = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [productNames, setProductNames] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Pending");
  const [expandedRows, setExpandedRows] = useState([]);

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (!user.auth) return;
    fetchData();
    fetchPayments();
  }, [user]);

  const fetchData = async () => {
    try {
      const { data: assignedOrders = [] } = await getAssignedOrders();
      const productNameMap = await fetchProductNames(assignedOrders);
      setProductNames(productNameMap);

      const ordersWithUserNames = await Promise.all(
        assignedOrders.map(async (order) => {
          const userResponse = await getUserById(order.userId);
          return {
            ...order,
            userName: userResponse?.data?.name || "Không xác định",
          };
        })
      );

      const sortedOrders = ordersWithUserNames.sort(
        (a, b) => new Date(b.createdTime) - new Date(a.createdTime)
      );

      setOrders(sortedOrders);
    } catch (err) {
      setError("Không có đơn hàng nào được chỉ định.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const { data: allPayments } = await fetchAllPayment();
      setPayments(Array.isArray(allPayments) ? allPayments : []);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Không thể tải danh sách thanh toán.");
      setPayments([]);
    }
  };

  const fetchProductNames = async (orders) => {
    const promises = orders.flatMap((order) =>
      order.items.map(async (item) => {
        try {
          const { name = "Không xác định" } = await getNameOfProdItem(
            item.productItemId
          );
          return { [item.productItemId]: name };
        } catch {
          return { [item.productItemId]: "Không xác định" };
        }
      })
    );

    const results = await Promise.all(promises);
    return Object.assign({}, ...results);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (newStatus === "Completed") {
        const orderPayments = Array.isArray(payments) 
          ? payments.filter((p) => p.orderId === orderId)
          : [];
        
        if (orderPayments.length === 0) {
          try {
            const response = await createPaymentForCOD({ orderId: orderId });
            if (response && response.data) {
              toast.success("Đã hoàn thành đơn hàng và tạo thanh toán!");
              return;
            } else {
              console.warn("Payment creation response is empty or invalid");
              toast.warn("Không thể xác nhận thanh toán. Vui lòng kiểm tra lại.");
            }
          } catch (paymentError) {
            console.error("Error creating payment:", paymentError);
            toast.error("Lỗi khi tạo thanh toán. Vui lòng thử lại sau.");
          }
        } else {
          console.info("Đơn hàng hoàn tất và thanh toán đã tồn tại.");
        }
      }
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Cập nhật trạng thái đơn hàng thất bại");
    } finally {
      setIsUpdating(false);
    }
  };

  const filterOrdersByStatus = (status) => {
    return orders
      .filter((order) => 
        order.status === status && 
        order.consignmentId === null
      )
      .filter(
        (order) =>
          order.orderId.toString().includes(searchTerm.toLowerCase()) ||
          order.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
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

  const toggleExpandedRow = (orderId) => {
    setExpandedRows((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const renderExpandedRow = (order) => (
    <tr>
      <td colSpan="8">
        <div className="expanded-row-content">
          <p>
            <strong>Địa chỉ:</strong> {order.address}
          </p>
          <p>
            <strong>Sản phẩm:</strong>{" "}
            {order.items
              .map(
                (item) =>
                  `${productNames[item.productItemId] || "Không xác định"} x${item.quantity
                  }`
              )
              .join(", ")}
          </p>
          <p>
            <strong>Tổng cộng:</strong> {order.total.toLocaleString("vi-VN")}{" "}
            VND
          </p>
        </div>
      </td>
    </tr>
  );

  if (!user?.auth)
    return (
      <div className="staff-orders">Vui lòng đăng nhập để xem đơn hàng.</div>
    );
  if (loading) return <FishSpinner />;
  if (error)
    return (
      <>
        <AdminHeader />
        <div className="staff-orders error-message">{error}</div>
      </>
    );

  return (
    <>
      <AdminHeader />

      <div className="container">
        <div className="my-3 add-new d-sm-flex">
          <span>
            <b>Đơn hàng được giao:</b>
          </span>
        </div>

        <div className="col-12 col-sm-4 my-3">
          <input
            className="form-control"
            placeholder="Tìm kiếm theo mã đơn hàng hoặc tên người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="order-tabs">
          <button
            className={`order-tab-button ${activeTab === "Pending" ? "active" : ""
              }`}
            onClick={() => setActiveTab("Pending")}
          >
            Đang xử lý
          </button>
          <button
            className={`order-tab-button ${activeTab === "Delivering" ? "active" : ""
              }`}
            onClick={() => setActiveTab("Delivering")}
          >
            Đang giao hàng
          </button>
          <button
            className={`order-tab-button ${activeTab === "Completed" ? "active" : ""
              }`}
            onClick={() => setActiveTab("Completed")}
          >
            Đã hoàn thành
          </button>
          <button
            className={`order-tab-button ${activeTab === "Cancelled" ? "active" : ""
              }`}
            onClick={() => setActiveTab("Cancelled")}
          >
            Đã hủy
          </button>
        </div>
      </div>

      <div className="container-fluid">
        <div className="table-responsive">
          <table className="table table-striped text-center">
            <thead>
              <tr>
                <th></th>
                <th>Mã đơn hàng</th>
                <th>Khách hàng</th>
                <th>Ngày đặt hàng</th>
                <th>Trạng thái</th>
                {activeTab !== "Cancelled" && <th>Xác nhận</th>}
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
                      <td>
                        {new Date(order.createdTime).toLocaleDateString(
                          "vi-VN", {
                              year: 'numeric',
                              month: 'numeric',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            }
                        )}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${getStatusBadgeClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        {order.status !== "Cancelled" && (
                          <>
                            <button
                              className="btn btn-primary"
                              onClick={() =>
                                handleStatusChange(order.orderId, "Delivering")
                              }
                              disabled={
                                isUpdating || order.status !== "Pending"
                              }
                              title="Xác nhận đơn hàng bắt đầu vận chuyển"
                            >
                              <i className="fa-solid fa-truck"></i>
                            </button>
                            <button
                              className="btn btn-success ms-2"
                              onClick={() =>
                                handleStatusChange(order.orderId, "Completed")
                              }
                              disabled={
                                isUpdating || order.status !== "Delivering"
                              }
                              title="Xác nhận đơn hàng đã đến tay khách hàng"
                            >
                              <i className="fa-solid fa-clipboard-check"></i>
                            </button>
                          </>
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
                    <td colSpan="8">Không tìm thấy đơn hàng chỉ định nào</td>
                  </tr>
                  <tr>
                    <td colSpan="8">
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
      </div>
    </>
  );
};

export default StaffOrders;
