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
import "./AdminOrder.css";
import { fetchBatchById } from "../../services/BatchService";
import { getProdItemById } from "../../services/ProductItemService";


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
  const [batchDetails, setBatchDetails] = useState({});
  const [expandedBatches, setExpandedBatches] = useState([]);

  useEffect(() => {
    if (!user.auth) return;
    fetchData();
    fetchPayments();
  }, [user]);

  const fetchData = async () => {
    try {
      const { data: assignedOrders = [] } = await getAssignedOrders();
      
      const detailedOrders = await Promise.all(
        assignedOrders.map(async (order) => {
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
            userName: userResponse?.data?.name || "Không xác định",
            productDetails: filteredProductDetails
          };
        })
      );

      const sortedOrders = detailedOrders.sort(
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

  const toggleBatchExpand = (batchId) => {
    setExpandedBatches(prev => 
      prev.includes(batchId) 
        ? prev.filter(id => id !== batchId)
        : [...prev, batchId]
    );
  };

  const renderExpandedRow = (order) => (
    <tr>
      <td colSpan="8">
        <div className="ao-expanded-content">
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
