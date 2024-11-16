import React, { useState, useEffect } from "react";
import { getCart, updateCartItem } from "../../services/CartService";
import { getProdItemById } from "../../services/ProductItemService";
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

  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const response = await getCart();
      const { items } = response.data;
      setCart(response.data);

      // Group items by batchId
      const groupedItems = items.reduce((acc, item) => {
        if (item.batchId) {
          if (!acc[item.batchId]) acc[item.batchId] = [];
          acc[item.batchId].push(item);
        } else {
          acc[item.productItemId] = [item]; // Treat items without batchId as unique
        }
        return acc;
      }, {});

      const updatedItems = await Promise.all(
        Object.entries(groupedItems).map(async ([key, group]) => {
          if (group[0].batchId) {
            // If the group is a batch
            const batchResponse = await fetchBatchById(group[0].batchId);
            return {
              batchId: group[0].batchId,
              batchImage : batchResponse.data.imageUrl,
              batchName: batchResponse.data.name,
              batchPrice: batchResponse.data.price,
              batchDescription: batchResponse.data.description,
              batchItems: group,
            };
          } else {
            // If the group is an individual item
            const productResponse = await getProdItemById(group[0].productItemId);
            return {
              ...group[0],
              imageUrl: productResponse.data.imageUrl,
              isIndividual: productResponse.data.quantity === 1,
            };
          }
        })
      );

      setCartItems(updatedItems);
    } catch (error) {
      toast.error(error.message);
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

  const confirmRemoveItem = async () => {
    if (!itemToRemove) return;

    try {
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
    } catch (error) {
      toast.error(error);
    } finally {
      setIsConfirmModalOpen(false);
      setItemToRemove(null);
    }
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
                      <th>Sản phẩm</th>
                      <th>Giá tiền</th>
                      <th>Số lượng</th>
                      <th>Tạm tính</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => {
                      if (item.batchId) {
                        // Render batch entry
                        return (
                          <tr key={item.batchId}>
                            <td>
                              <img
                                src={item.batchImage}
                                alt={item.name}
                                className="product-image"
                              />
                            </td>
                            <td style={{ fontWeight: "bold" }}>
                              {item.batchName}
                            </td>
                            <td className="price">{item.batchPrice.toLocaleString()} VND</td>
                            <td>{item.batchItems.reduce((sum, i) => sum + i.quantity, 0)} sản phẩm</td>
                            <td className="price">{item.batchPrice.toLocaleString()} VND</td>
                          </tr>
                        );
                      } else {
                        // Render individual item
                        return (
                          <tr key={item.productItemId}>
                            <td>
                              <img
                                src={item.imageUrl}
                                alt={item.productName}
                                className="product-image"
                              />
                            </td>
                            <td style={{ fontWeight: "bold" }}>{item.productName}</td>
                            <td className="price">{item.price.toLocaleString()} VND</td>
                            <td>
                              <div className="quantity-control">
                                <button
                                  className="quantity-btn"
                                  onClick={() =>
                                    handleQuantityChange(cart.cartId, item, item.quantity - 1)
                                  }
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      cart.cartId,
                                      item,
                                      parseInt(e.target.value)
                                    )
                                  }
                                  className="quantity-input"
                                  readOnly
                                />
                                <button
                                  className="quantity-btn"
                                  onClick={() =>
                                    handleQuantityChange(cart.cartId, item, item.quantity + 1)
                                  }
                                  disabled={item.isIndividual}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="price">
                              {(item.price * item.quantity).toLocaleString()} VND
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
