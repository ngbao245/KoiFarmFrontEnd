import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signin } from "../../services/UserService";
import { UserContext } from "../../contexts/UserContext";
import "./Login.css";
import "../../styles/animation.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "../../components/GoogleLogin";

const Login = () => {
  const navigate = useNavigate();

  const { loginContext } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!(email && password)) {
      toast.error("Email and Password are required!");
      return;
    }

    setIsLoading(true);
    try {
      let res = await signin(email.trim(), password.trim());
      if (res && res.data.token) {
        const { roleId } = res.data.user;

        loginContext(email, res.data.token);
        if (roleId === "0") {
          navigate("/");
        } else if (roleId === "1") {
          navigate("/admin-dashboard");
        } else if (roleId === "2") {
          navigate("/admin-product");
        }
        toast.success("Login successful!");
      } else {
        throw new Error("Login failed!");
      }
    } catch (error) {
      toast.error("Login failed!");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePressEnter = (event) => {
    if (event && event.key === "Enter" && email && password) {
      handleLogin();
    }
  };

  return (
    <GoogleOAuthProvider clientId="684900073655-mu5vsdorjg8j82vkcf9uiuu7conm57fh.apps.googleusercontent.com">
      <div className="login-container">
        <div className="back-arrow">
          <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
        </div>
        <main className="login-content animated user-select-none">
          <div className="login-form">
            <div className="login-title">
              <h2>Đăng nhập</h2>
              <p>Chào mừng bạn quay trở lại!</p>
            </div>

            <div className="login-input">
              <div>
                <label>Email</label>
                <input
                  type="text"
                  placeholder="Vui lòng nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(event) => handlePressEnter(event)}
                />
              </div>
              <div className="password-input-container">
              <label>Mật khẩu</label>
                <input
                  type={isShowPassword ? "password" : "text"}
                  placeholder="Vui lòng nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handlePressEnter}
                />
                <i
                  className={isShowPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}
                  onClick={() => setIsShowPassword(!isShowPassword)}
                ></i>
              </div>

              <div className="link-button-wrapper">
                <div className="link-section">
                  <p>
                    <span>Chưa có tài khoản?</span>
                    <a
                      className="primary cursor-pointer"
                      onClick={() => {
                        navigate("/register");
                      }}
                    >
                      Đăng Ký Ngay
                    </a>
                  </p>
                  <p>
                    <a
                      className="cursor-pointer"
                      onClick={() => navigate("/forgot-password")}
                    >
                      Quên mật khẩu
                    </a>
                  </p>
                </div>
                <button
                  type="button"
                  className={`${email && password ? "" : "empty"} login-button`}
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
              <GoogleLoginButton />
            </div>
          </div>
        </main>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
