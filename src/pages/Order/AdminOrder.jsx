import React, { useState, useEffect } from "react";
import AdminHeader from "../../layouts/header/AdminHeader";
import { fetchOrder, assignStaff } from "../../services/OrderService";
import { fetchAllStaff, getUserById } from "../../services/UserService";
import StaffDropdown from "../../components/StaffDropdown";
import { toast } from "react-toastify";
import "./AdminOrder.css";

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const orderResponse = await fetchOrder();
      const staffResponse = await fetchAllStaff();

      const ordersData = orderResponse?.data || [];
      const staffData = staffResponse?.data?.entities || [];

      const detailedOrders = await Promise.all(
        ordersData.map(async (order) => {
          const userResponse = await getUserById(order.userId);
          return {
            ...order,
            userName: userResponse?.data?.name || "Unknown",
            assignedStaffName:
              staffData.find((s) => s.id === order.staffId)?.name ||
              "Not assigned",
          };
        })
      );

      setOrders(detailedOrders);
      setStaffMembers(staffData);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Load data khi component mount
  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignStaff = async (orderId, staffId) => {
    try {
      await assignStaff(orderId, staffId);
      toast.success("Staff assigned successfully!");

      // Cập nhật lại thông tin đơn hàng sau khi gán staff
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

  const filteredOrders = orders.filter((order) =>
    order.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status) => {
    return status.toLowerCase() === "completed" ? "completed" : "not-completed";
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <AdminHeader />
      <div className="container">
        <div className="my-3">
          <b>List Orders:</b>
          <div className="col-12 col-sm-4 my-3">
            <input
              className="form-control"
              placeholder="Search orders by user name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="table table-striped text-center">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User Name</th>
              <th>Address</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Assigned Staff</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.userName}</td>
                  <td>{order.address}</td>
                  <td>{new Date(order.createdTime).toLocaleDateString()}</td>
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
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminOrder;
