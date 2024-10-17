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
import "./StaffOrders.css";
import FishSpinner from "../../components/FishSpinner";

const StaffOrders = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [productNames, setProductNames] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user.auth) return;
    fetchData();
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
            userName: userResponse?.data?.name || "Unknown User",
          };
        })
      );

      setOrders(ordersWithUserNames);
    } catch (err) {
      setError("Không có đơn hàng nào được chỉ định.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductNames = async (orders) => {
    const promises = orders.flatMap((order) =>
      order.items.map(async (item) => {
        try {
          const { name = "Unknown" } = await getNameOfProdItem(
            item.productItemId
          );
          return { [item.productItemId]: name };
        } catch {
          return { [item.productItemId]: "Unknown" };
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
      toast.success("Order status updated successfully!");
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderId.toString().includes(searchTerm.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "completed";
      case "delivering":
        return "delivering";
      default:
        return "not-completed";
    }
  };

  if (!user?.auth)
    return <div className="staff-orders">Please log in to view orders.</div>;
  if (loading)
    return (
      <div className="staff-orders">
        <FishSpinner />
      </div>
    );
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

        <div className="customize-table">
          <table className="table table-striped text-center">
            <thead>
              <tr>
                <th>Mã Đơn Hàng</th>
                <th>Tên Khách Hàng</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
                <th>Sản Phẩm</th>
                <th>Địa Chỉ</th>
                <th>Ngày mua</th>
                <th>Xác Nhận Đơn Hàng</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{order.userName}</td>
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
                      {order.items.map((item, index) => (
                        <div key={`${item.productItemId}-${index}`}>
                          {productNames[item.productItemId] || "Unknown"} x
                          {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td>{order.address}</td>
                    <td>
                      {new Date(order.createdTime).toLocaleDateString("vi-VN")}
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          handleStatusChange(order.orderId, "Delivering")
                        }
                        disabled={isUpdating || order.status !== "Pending"}
                      >
                        Bắt đầu giao hàng
                      </button>
                      <button
                        className="btn btn-success ms-2"
                        onClick={() =>
                          handleStatusChange(order.orderId, "Completed")
                        }
                        disabled={isUpdating || order.status !== "Delivering"}
                      >
                        Hoàn thành đơn hàng
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No assigned orders available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default StaffOrders;
