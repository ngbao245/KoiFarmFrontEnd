import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import { signin } from "../../services/UserService";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    console.log("Button clicked");
    // event.preventDefault();
    if (!(email && password)) {
      toast.error("Email and Password are required!");
      return;
    }

    setIsLoading(true);
    try {
      let res = await signin(email.trim(), password.trim());
      if (res && res.token) {
        console.log("ahihi");
        // loginContext(email, res.token);
        navigate("/");
        toast.success("Login successful!");
      }
    } catch (error) {
      toast.error("Login failed!");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePressEnter = (event) => {
    if (event && event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-title">
          <h2>Đăng nhập</h2>
          <p>Chào mừng bạn quay trở lại!</p>
        </div>

        <div className="form">
          <div>
            <label>Email/ SĐT</label>
            <input
              type="text"
              placeholder="Vui lòng nhập email hoặc SĐT của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(event) => handlePressEnter(event)}
            />
          </div>
          <div>
            <label>Mật Khẩu</label>
            <input
              type={isShowPassword === true ? "password" : "text"}
              placeholder="Vui lòng nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(event) => handlePressEnter(event)}
            />
            <i
              className={
                isShowPassword === true
                  ? "fa-solid fa-eye"
                  : "fa-solid fa-eye-slash"
              }
              onClick={() => setIsShowPassword(!isShowPassword)}
            ></i>
          </div>

          <div className="link-button-wrapper">
            <div className="link-section">
              <p>
                Chưa có tài khoản? <a href="#">Đăng Ký Ngay</a>
              </p>
              <p>
                <a href="#">Quên mật khẩu</a>
              </p>
            </div>
            <button
              type="button"
              className={email && password ? "" : "empty"}
              disabled={!(email && password)}
              onClick={() => handleLogin()}
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
