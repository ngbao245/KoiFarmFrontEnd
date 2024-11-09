import React, { useState, useEffect } from 'react';
import { getConsignmentsForUser, deleteConsignmentItem, checkoutConsignment, updateConsignmentItemStatus } from '../../services/ConsignmentService';
import { createPayment, callBackPayment } from '../../services/PaymentService';
import { useNavigate, useLocation } from "react-router-dom";
import FishSpinner from "../../components/FishSpinner";
import { toast } from "react-toastify";
import "./UserConsignment.css";
import ConfirmationModal from "../../components/ConfirmationModal";
import { createPaymentForCOD } from "../../services/PaymentService";

const UserConsignment = () => {
    const [consignments, setConsignments] = useState([]);
    const [activeTab, setActiveTab] = useState('Pending');
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('bank');
    const navigate = useNavigate();
    const location = useLocation();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [itemToCancel, setItemToCancel] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState({});

    useEffect(() => {
        fetchConsignments();
        // Kiểm tra callback từ VNPay
        const urlParams = new URLSearchParams(location.search);
        const vnp_ResponseCode = urlParams.get('vnp_ResponseCode');

        if (vnp_ResponseCode === '00') {
            handlePaymentCallback();
        } else if (vnp_ResponseCode) {
            toast.error("Thanh toán thất bại. Vui lòng thử lại.");
        }
    }, [location]);

    const fetchConsignments = async () => {
        try {
            const response = await getConsignmentsForUser();
            setConsignments(Array.isArray(response?.data) ? response.data : []);
        } catch (error) {
            console.error("Fetch consignments error:", error);
            toast.error("Không thể tải danh sách ký gửi");
            setConsignments([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentCallback = async () => {
        try {
            const response = await callBackPayment();
            if (response.data) {
                // Lấy orderId từ response nếu có
                const orderId = response.data.orderId;

                // Cập nhật trạng thái item thành CheckedOut
                if (orderId) {
                    await updateConsignmentItemStatus(orderId, "CheckedOut");
                    // Refresh danh sách sau khi thanh toán và cập nhật trạng thái thành công
                    await fetchConsignments();
                    toast.success("Thanh toán thành công!");
                    navigate('/'); // Redirect về trang chủ sau khi thanh toán thành công
                }
            }
        } catch (error) {
            console.error("Payment callback error:", error);
            toast.error("Có lỗi xảy ra khi xác nhận thanh toán");
        }
    };

    const handlePayment = async (consignment, item) => {
        try {
            setIsProcessing(true);

            // Bước 1: Checkout consignment
            const checkoutResponse = await checkoutConsignment(item.itemId);

            if (!checkoutResponse?.data || checkoutResponse.statusCode !== 201) {
                throw new Error(checkoutResponse.messageError || "Checkout failed");
            }

            const orderId = checkoutResponse.data.orderId;

            if (paymentMethods[item.itemId] === 'cod') {
                // COD payment flow
                try {
                    const codResponse = await createPaymentForCOD({ orderId });
                    if (codResponse?.data) {
                        await updateConsignmentItemStatus(item.itemId, "CheckedOut");
                        await fetchConsignments();
                        toast.success("Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.");
                        navigate('/');
                    } else {
                        throw new Error("COD payment creation failed.");
                    }
                } catch (error) {
                    console.error("Error creating COD payment:", error);
                    toast.error("Không thể tạo thanh toán khi nhận hàng. Vui lòng thử lại sau.");
                }
            } else {
                // Bước 2: Tạo payment request
                const paymentData = {
                    orderDescription: paymentMethods[item.itemId] === 'bank'
                        ? `Thanh toán ký gửi: ${item.name}`
                        : `Thanh toán ký gửi COD: ${item.name}`,
                    orderType: "consignment",
                    name: item.name,
                    orderId: orderId
                };

                const paymentResponse = await createPayment(paymentData);

                await updateConsignmentItemStatus(item.itemId, "CheckedOut");
                await fetchConsignments();

                if (paymentMethods[item.itemId] === 'bank') {
                    if (paymentResponse?.data) {
                        window.location.href = paymentResponse.data;
                    } else {
                        throw new Error("No payment URL received");
                    }
                } else {
                    toast.success("Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.");
                    navigate('/');
                }
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error(error.message || "Không thể xử lý thanh toán. Vui lòng thử lại sau.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancelItem = (itemId) => {
        setItemToCancel(itemId);
        setIsConfirmModalOpen(true);
    };

    const confirmCancelItem = async () => {
        if (!itemToCancel) return;

        try {
            const response = await updateConsignmentItemStatus(itemToCancel, "Cancelled");

            if (response.data) {
                setConsignments(prevConsignments =>
                    prevConsignments.map(consignment => ({
                        ...consignment,
                        items: consignment.items.map(item =>
                            item.itemId === itemToCancel
                                ? { ...item, status: "Cancelled" }
                                : item
                        )
                    }))
                );
                toast.success("Huỷ ký gửi thành công!");
            }
        } catch (error) {
            console.error("Error cancelling consignment:", error);
            toast.error("Huỷ ký gửi thất bại");
        } finally {
            setIsConfirmModalOpen(false);
            setItemToCancel(null);
        }
    };

    const getConsignmentCount = (status) => {
        if (!Array.isArray(consignments)) return 0;

        return consignments.reduce((count, consignment) => {
            const itemCount = consignment.items.filter(item => {
                switch (status) {
                    case 'Pending':
                        return item.status === 'Pending';
                    case 'Approved':
                        return item.status === 'Approved' && !item.checkedout;
                    case 'Checkedout':
                        return item.status === 'CheckedOut' || item.checkedout === true;
                    case 'Cancelled':
                        return item.status === 'Cancelled';
                    default:
                        return false;
                }
            }).length;
            return count + itemCount;
        }, 0);
    };

    const filterConsignmentsByStatus = (status) => {
        if (!Array.isArray(consignments)) return [];

        return consignments
            .map(consignment => ({
                ...consignment,
                items: consignment.items.filter(item => {
                    switch (status) {
                        case 'Pending':
                            return item.status === 'Pending';
                        case 'Approved':
                            return item.status === 'Approved' && !item.checkedout;
                        case 'Checkedout':
                            return item.status === 'CheckedOut' || item.checkedout === true;
                        case 'Cancelled':
                            return item.status === 'Cancelled';
                        default:
                            return false;
                    }
                })
            }))
            .filter(consignment => consignment.items.length > 0);
    };

    if (loading) return <FishSpinner />;

    return (
        <div className="uc-container">
            <div className="back-arrow">
                <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
            </div>

            <main className="uc-content animated user-select-none">
                <div className="uc-header">
                    <h1 className="uc-title">Quản lý cá ký gửi</h1>
                </div>

                <div className="uc-tabs">
                    <button
                        className={`uc-tab-button ${activeTab === 'Pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Pending')}
                    >
                        <i className="fas fa-clock me-2"></i>
                        Chờ duyệt
                        <span className="uc-count">{getConsignmentCount('Pending')}</span>
                    </button>
                    <button
                        className={`uc-tab-button ${activeTab === 'Approved' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Approved')}
                    >
                        <i className="fas fa-check-circle me-2"></i>
                        Đã duyệt
                        <span className="uc-count">{getConsignmentCount('Approved')}</span>
                    </button>
                    <button
                        className={`uc-tab-button ${activeTab === 'Checkedout' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Checkedout')}
                    >
                        <i className="fas fa-shopping-cart me-2"></i>
                        Đã thanh toán
                        <span className="uc-count">{getConsignmentCount('Checkedout')}</span>
                    </button>
                    <button
                        className={`uc-tab-button ${activeTab === 'Cancelled' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Cancelled')}
                    >
                        <i className="fas fa-ban me-2"></i>
                        Đã hủy
                        <span className="uc-count">{getConsignmentCount('Cancelled')}</span>
                    </button>
                </div>

                <div className="uc-table-container">
                    <table className="uc-table">
                        <thead>
                            <tr>
                                <th>Hình ảnh</th>
                                <th>Mã ký gửi</th>
                                <th>Tên cá</th>
                                <th>Loại</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterConsignmentsByStatus(activeTab).map((consignment) => (
                                consignment.items.map(item => (
                                    <tr key={`${consignment.consignmentId}-${item.itemId}`}>
                                        <td>
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="uc-fish-image"
                                            />
                                        </td>
                                        <td>{consignment.consignmentId}</td>
                                        <td>{item.name}</td>
                                        <td>{item.category}</td>
                                        <td>
                                            <span className={`uc-status ${item.status.toLowerCase()}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>
                                            {activeTab === 'Pending' && (
                                                <button
                                                    className="uc-btn uc-btn-cancel"
                                                    onClick={() => handleCancelItem(item.itemId)}
                                                >
                                                    <i className="fas fa-ban me-2"></i>
                                                    Huỷ
                                                </button>
                                            )}
                                            {activeTab === 'Approved' && (
                                                <div>
                                                    <div className="payment-methods mb-2">
                                                        <label className="me-3">
                                                            <input
                                                                type="radio"
                                                                name={`paymentMethod-${item.itemId}`}
                                                                value="bank"
                                                                checked={paymentMethods[item.itemId] === 'bank'}
                                                                onChange={(e) => setPaymentMethods({
                                                                    ...paymentMethods,
                                                                    [item.itemId]: e.target.value
                                                                })}
                                                            /> Thanh toán qua VNPay
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                name={`paymentMethod-${item.itemId}`}
                                                                value="cod"
                                                                checked={paymentMethods[item.itemId] === 'cod'}
                                                                onChange={(e) => setPaymentMethods({
                                                                    ...paymentMethods,
                                                                    [item.itemId]: e.target.value
                                                                })}
                                                            /> Thanh toán khi nhận hàng
                                                        </label>
                                                    </div>
                                                    <button
                                                        className="uc-btn uc-btn-payment"
                                                        onClick={() => handlePayment(consignment, item)}
                                                        disabled={isProcessing || !paymentMethods[item.itemId]}
                                                    >
                                                        {isProcessing ? (
                                                            <>
                                                                <i className="fas fa-spinner fa-spin me-2"></i>
                                                                Đang xử lý...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-credit-card me-2"></i>
                                                                Thanh toán
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ))}
                            {!filterConsignmentsByStatus(activeTab).length && (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        <div className="uc-empty-state">
                                            <i className="fas fa-fish"></i>
                                            <p>Không có cá ký gửi nào trong trạng thái này</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmCancelItem}
                message="Bạn có chắc chắn muốn huỷ ký gửi này?"
            />
        </div>
    );
};

export default UserConsignment;
