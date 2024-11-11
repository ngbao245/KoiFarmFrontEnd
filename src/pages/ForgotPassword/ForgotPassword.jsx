import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../../services/UserService';
import { toast } from 'react-toastify';
import './ForgotPassword.css';
import '../../styles/animation.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Vui lòng nhập email!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await requestPasswordReset(email);
      toast.success(response.data || 'Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra email của bạn.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.title || 'Lỗi khi gửi yêu cầu khôi phục mật khẩu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePressEnter = (event) => {
    if (event && event.key === "Enter" && email) {
      handleSubmit(event);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="back-arrow">
        <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
      </div>
      <main className="forgot-password-content animated user-select-none">
        <div className="forgot-password-form">
          <div className="forgot-password-title">
            <h2>Quên Mật Khẩu</h2>
            <p>Nhập email của bạn để khôi phục mật khẩu</p>
          </div>

          <div className="forgot-password-input">
            <div>
              <label>Email</label>
              <input
                type="email"
                placeholder="Vui lòng nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(event) => handlePressEnter(event)}
                required
              />
            </div>

            <div className="link-button-wrapper">
              <div className="link-section">
                <p>
                  <span>Đã có tài khoản?</span>
                  <a
                    className="primary cursor-pointer"
                    onClick={() => navigate('/login')}
                  >
                    Đăng Nhập
                  </a>
                </p>
              </div>
              <button
                type="button"
                className={`${email ? "" : "empty"} forgot-password-button`}
                disabled={!email}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  "Gửi Yêu Cầu"
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
