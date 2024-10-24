import React, { useState, useEffect } from "react";
import AdminHeader from "../../layouts/header/AdminHeader";
import { fetchOrder, assignStaff } from "../../services/OrderService";
import { fetchAllStaff, getUserById } from "../../services/UserService";
import { getNameOfProdItem } from "../../services/ProductItemService";
import StaffDropdown from "../../components/StaffDropdown";
import { toast } from "react-toastify";
import FishSpinner from "../../components/FishSpinner";
import "./AdminOrder.css";

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("Pending");

  console.log(orders);

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
            userName: userResponse?.data?.name || "Unknown",
            assignedStaffName:
              staffData.find((s) => s.id === order.staffId)?.name ||
              "Not assigned",
            products: productDetails.join(", "),
          };
        })
      );

      setOrders(detailedOrders);
      setStaffMembers(staffData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    console.log(orders);
  }, []);

  const filterOrdersByStatus = (status) => {
    return orders
      .filter((order) => order.status.toLowerCase() === status.toLowerCase())
      .filter(
        (order) =>
          order.orderId.toString().includes(searchTerm.toLowerCase()) ||
          order.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  const handleAssignStaff = async (orderId, staffId) => {
    try {
      await assignStaff(orderId, staffId);
      toast.success("Staff assigned successfully!");

      const updatedOrders = orders.map((order) =>
        order.orderId === orderId
          ? {
              ...order,
              staffId,
              assignedStaffName:
                staffMembers.find((s) => s.id === staffId)?.name ||
                "Not assigned",
            }
          : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      toast.error("Failed to assign staff");
    }
  };

  // const filteredOrders = orders.filter(
  //   (order) =>
  //     order.orderId.toString().includes(searchTerm.toLowerCase()) ||
  //     order.userName.toLowerCase().includes(searchTerm.toLowerCase())
  // );

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

        {/* Updated Tabs for filtering orders */}
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
              <th>Mã Đơn Hàng</th>
              <th>Tên Khách Hàng</th>
              <th>Địa Chỉ</th>
              <th>Ngày Tạo Đơn</th>
              <th>Sản Phẩm</th>
              <th>Tổng Tiền</th>
              <th>Trạng Thái</th>
              <th>Chỉ Định Giao Hàng</th>
            </tr>
          </thead>
          <tbody>
            {filterOrdersByStatus(activeTab).length > 0 ? (
              filterOrdersByStatus(activeTab).map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.userName}</td>
                  <td>{order.address}</td>
                  <td>{new Date(order.createdTime).toLocaleDateString()}</td>
                  <td>{order.products}</td>
                  <td>{order.total.toLocaleString("vi-VN")} VND</td>
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
                    <StaffDropdown
                      staffMembers={staffMembers}
                      currentStaffId={order.staffId}
                      onAssign={(staffId) =>
                        handleAssignStaff(order.orderId, staffId)
                      }
                      disabled={order.status.toLowerCase() !== "pending"}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <>
                <tr>
                  <td colSpan="8">Không tìm thấy đơn hàng nào</td>
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
    </>
  );
};

export default AdminOrder;
