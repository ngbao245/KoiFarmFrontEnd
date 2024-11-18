import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/UserService';
import { toast } from 'react-toastify';
import './ResetPassword.css';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract token and email from query parameters
  const query = new URLSearchParams(location.search);
  const token = query.get('token');
  const email = query.get('email');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Ensure you are passing the parameters in the correct order
      const response = await resetPassword(email, token, newPassword);
      setMessage(response.data || 'Password updated successfully!');
      setError('');
      toast.success("Updated new password")
      navigate("/login")
    } catch (error) {
      // Handle errors appropriately
      setError(error.response?.data?.message || 'Error resetting password.');
      setMessage('');
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-content">
        <div className="reset-password-form">
          <div className="reset-password-title">
            <h2>Reset Password</h2>
            <p>Nhập mật khẩu mới của bạn để tiếp tục</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="reset-password-input">
              <label>Mật khẩu mới</label>
              <input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="reset-password-input">
              <label>Xác nhận mật khẩu</label>
              <input
                type="password"
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="reset-password-button">
              Đặt lại mật khẩu
            </button>
          </form>
          {message && <p className="message success">{message}</p>}
          {error && <p className="message error">{error}</p>}
        </div>
      </div>
    </div>

  );
};

export default ResetPassword;
