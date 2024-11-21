import React, { useState, useEffect } from "react";
import { getCart, updateCartItem, removeBatchFromCart } from "../../services/CartService";
import { getProdItemById, getProdItemByBatch } from "../../services/ProductItemService";
import { Header } from "../../layouts/header/header";
import { Footer } from "../../layouts/footer/footer";
import "./Cart.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/ConfirmationModal";
import FishSpinner from "../../components/FishSpinner";
import { getUserInfo } from "../../services/UserService";
import { fetchBatchById } from "../../services/BatchService";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [expandedBatches, setExpandedBatches] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const response = await getCart();
      
      if (response.statusCode === 404) {
        setCart(null);
        setCartItems([]);
        return;
      }

      const { items } = response.data;
      setCart(response.data);

      // Only process items if they exist
      if (!items || items.length === 0) {
        setCartItems([]);
        return;
      }

      const groupedItems = items.reduce((acc, item) => {
        if (item.batchId) {
          if (!acc[item.batchId]) acc[item.batchId] = [];
          acc[item.batchId].push(item);
        } else {
          acc[item.productItemId] = [item];
        }
        return acc;
      }, {});

      const updatedItems = await Promise.all(
        Object.entries(groupedItems).map(async ([key, group]) => {
          if (group[0].batchId) {
            // Nếu là batch
            const batchResponse = await fetchBatchById(group[0].batchId);
            const batchItemsResponse = await getProdItemByBatch(group[0].batchId);
            
            // Lấy thông tin chi tiết cho từng product item trong batch
            const batchItemsWithDetails = batchItemsResponse.data.map(item => ({
              productItemId: item.id,
              name: item.name,
              imageUrl: item.imageUrl,
              sex: item.sex,
              age: item.age,
              size: item.size,
              quantity: 1
            }));

            return {
              batchId: group[0].batchId,
              batchImage: batchResponse.data.imageUrl,
              batchName: batchResponse.data.name,
              batchPrice: batchResponse.data.price,
              batchDescription: batchResponse.data.description,
              batchItems: batchItemsWithDetails,
            };
          } else {
            // Nếu là sản phẩm đơn lẻ
            const productResponse = await getProdItemById(group[0].productItemId);
            return {
              ...group[0],
              productName: productResponse.data.name,
              imageUrl: productResponse.data.imageUrl,
              price: productResponse.data.price,
              isIndividual: true,
            };
          }
        })
      );

      setCartItems(updatedItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error("Có lỗi xảy ra khi tải giỏ hàng");
      setCartItems([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = async (cartId, item, newQuantity) => {
    if (item.isIndividual && newQuantity > item.quantity) {
      return;
    }

    if (newQuantity === 0) {
      setItemToRemove({ cartId, item });
      setIsConfirmModalOpen(true);
      return;
    }

    try {
      const response = await updateCartItem(
        cartId,
        item.productItemId,
        newQuantity
      );
      if (response.statusCode == 200) {
        setCartItems((prevItems) =>
          prevItems.map((i) =>
            i.productItemId === item.productItemId
              ? { ...i, quantity: newQuantity }
              : i
          )
        );
      } else {
        toast.error(response.data.messageError);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        if (item.batchId) {
          // Use the batch price for items in a batch
          return total + item.batchPrice;
        } else {
          // Use individual item price for standalone items
          return total + item.price * item.quantity;
        }
      }, 0)
      .toLocaleString();
  };

  const handleCheckout = async () => {
    try {
      const userResponse = await getUserInfo();
      const userData = userResponse.data;

      if (!userData.address?.trim() || !userData.phone?.trim()) {
        navigate(`/${userData.id}/detail?fromCart=true`);
        return;
      }

      navigate("/order");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Không thể lấy thông tin người dùng. Vui lòng thử lại.");
      navigate("/login");
    }
  };

  const handleContinue = () => {
    navigate("/product");
  };

  const removeBatch = async (batchId) => {
    try {
      const response = await removeBatchFromCart(batchId); // Use your service function
      if (response.statusCode === 200) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.batchId !== batchId)
        );
        toast.success("Batch removed from the cart!");
      } else {
        toast.error(response.data.messageError || "Error removing batch.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove batch from the cart.");
    }
  };

  const confirmRemoveItem = async () => {
    if (!itemToRemove) return;

    try {
      if (itemToRemove.batchId) {
        await removeBatch(itemToRemove.batchId);
      } else if (itemToRemove.item) {
        const response = await updateCartItem(
          itemToRemove.cartId,
          itemToRemove.item.productItemId,
          0
        );
        if (response.statusCode == 200) {
          setCartItems((prevItems) =>
            prevItems.filter(
              (i) => i.productItemId !== itemToRemove.item.productItemId
            )
          );
          // toast.success(
          //   `Item ${itemToRemove.item.productName} removed from cart`
          // );
        } else {
          toast.error(response.data.messageError);
        }
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setIsConfirmModalOpen(false);
      setItemToRemove(null);
    }
  };

  const toggleBatchExpand = (batchId) => {
    setExpandedBatches(prev => 
      prev.includes(batchId) 
        ? prev.filter(id => id !== batchId)
        : [...prev, batchId]
    );
  };

  if (isLoading) return <FishSpinner />;

  return (
    <>
      <Header />
      <div className="cart-container">
        <main className="cart-content animated user-select-none">
          <h1 className="cart-title">Giỏ hàng của bạn</h1>
          <div className="cart-grid">
            {cartItems.length === 0 ? (
              <>
                <div className="container-fluid text-center empty-cart-container animated">
                  <i
                    className="fa-solid fa-cart-shopping"
                    style={{
                      fontSize: "50px",
                      opacity: 0.2,
                      marginBottom: "15px",
                    }}
                  ></i>
                  <p className="empty-cart-text">"Hỏng" có gì trong giỏ hết</p>
                  <p className="empty-cart-text">
                    Lướt KoiShop, lựa cá ngay đi!
                  </p>
                  <button className="shop-now-btn" onClick={handleContinue}>
                    Mua ngay
                  </button>
                </div>
              </>
            ) : (
              <>
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th></th>
                      <th>Sản phẩm</th>
                      <th>Giá tiền</th>
                      <th>Số lượng</th>
                      <th>Tạm tính</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => {
                      if (item.batchId) {
                        return (
                          <React.Fragment key={item.batchId}>
                            <tr 
                              className="batch-row"
                              onClick={() => toggleBatchExpand(item.batchId)}
                            >
                              <td></td>
                              <td>
                                <img
                                  src={item.batchImage}
                                  alt={item.name}
                                  className="cart-product-image"
                                />
                              </td>
                              <td style={{ fontWeight: "bold" }}>
                                {item.batchName}
                              </td>
                              <td className="price">{item.batchPrice.toLocaleString()} VND</td>
                              <td>{item.batchItems.reduce((sum, i) => sum + i.quantity, 0)} sản phẩm</td>
                              <td className="price">{item.batchPrice.toLocaleString()} VND</td>
                              <td>
                                <button
                                  className="remove-batch-btn"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Ngăn sự kiện click lan ra tr cha
                                    setItemToRemove({ batchId: item.batchId, name: item.batchName });
                                    setIsConfirmModalOpen(true);
                                  }}
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                            {expandedBatches.includes(item.batchId) && (
                              <tr>
                                <td colSpan="7">
                                  <div className="batch-items">
                                    {item.batchItems.map((batchItem, idx) => (
                                      <div key={`${item.batchId}-${idx}`} className="batch-subitem">
                                        <div className=""></div>
                                        <img 
                                          src={batchItem.imageUrl || '/default-product.png'} 
                                          alt={batchItem.name}
                                          className="cart-product-image"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/default-product-image.png";
                                          }}
                                        />
                                        <div className="batch-item-details">
                                          <div className="batch-item-name">{batchItem.name}</div>
                                          <div className="batch-item-specs">
                                            <span>Giới tính: {batchItem.sex}</span>
                                            <span>Tuổi: {batchItem.age}</span>
                                            <span>Size: {batchItem.size}</span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      } else {
                        return (
                          <tr key={item.productItemId}>
                            <td></td>
                            <td>
                              <img
                                src={item.imageUrl}
                                alt={item.productName}
                                className="cart-product-image"
                              />
                            </td>
                            <td style={{ fontWeight: "bold" }}>{item.productName}</td>
                            <td className="price">{item.price.toLocaleString()} VND</td>
                            <td>
                              <div className="quantity-display">
                                1 sản phẩm
                              </div>
                            </td>
                            <td className="price">
                              {item.price.toLocaleString()} VND
                            </td>
                            <td>
                              <button
                                className="remove-batch-btn"
                                onClick={() => {
                                  setItemToRemove({ cartId: cart.cartId, item });
                                  setIsConfirmModalOpen(true);
                                }}
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>

                <div className="order-summary">
                  <h2>Tóm tắt đơn hàng</h2>
                  <p>
                    Phí ship: <span>Miễn phí</span>
                  </p>
                  <p>
                    VAT: <span>Không áp dụng</span>
                  </p>
                  <h3>Tổng: {calculateTotal()} VND</h3>
                  <div className="order-actions">
                    <button className="continue-btn" onClick={handleContinue}>
                      Tiếp tục mua sắm
                    </button>
                    <button className="checkout-btn" onClick={handleCheckout}>
                      Đến trang thanh toán
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmRemoveItem}
        message="Bạn chắc chắn muốn bỏ sản phẩm này?"
      />
      <Footer />
    </>
  );
};

export default Cart;
