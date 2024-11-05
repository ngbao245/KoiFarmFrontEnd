import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signin, signup } from "../../services/UserService";
import { UserContext } from "../../contexts/UserContext";
import "./Register.css";
import "../../styles/animation.css";

const Register = () => {
  const { loginContext } = useContext(UserContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    Email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [isShowPassword, setIsShowPassword] = useState(true);

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedFormData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = ["password", "confirmPassword"].includes(key)
        ? formData[key]
        : formData[key].trim();
      return acc;
    }, {});

    if (
      !(
        trimmedFormData.lastName &&
        trimmedFormData.firstName &&
        trimmedFormData.Email &&
        trimmedFormData.address &&
        trimmedFormData.password &&
        trimmedFormData.confirmPassword
      )
    ) {
      toast.error("All fields are required!");
      return;
    }
    if (trimmedFormData.password !== trimmedFormData.confirmPassword) {
      toast.error("Password not match!");
      return;
    }

    let res = await signup({
      name: trimmedFormData.firstName + trimmedFormData.lastName,
      password: trimmedFormData.password,
      email: trimmedFormData.Email,
      phone: trimmedFormData.phone,
      address: trimmedFormData.address,
    });
    if (res && res.data && res.statusCode === 201) {
      let res = await signin(trimmedFormData.Email, trimmedFormData.password);
      if (res && res.data.token) {
        loginContext(trimmedFormData.Email, res.data.token);
        navigate("/");
        toast.success("Signin successful!");
      }
    } else toast.error(res.data);
  };

  const handleKeyPress = (e, currentInputs) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const emptyField = currentInputs.find((field) => !formData[field].trim());

      if (emptyField) {
        document.querySelector(`input[name="${emptyField}"]`).focus();
        return;
      }

      if (step < 3) {
        handleNext();
      } else if (
        formData.lastName &&
        formData.firstName &&
        formData.Email &&
        formData.address &&
        formData.password &&
        formData.confirmPassword
      ) {
        handleSubmit(e);
      }
    }
  };

  return (
    <div className="register-container">
      <div className="back-arrow">
        <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
      </div>
      <main className="register-content animated user-select-none">
        <div className="register-form">
          <div className="register-title">
            <h2>Register</h2>
            <p>Hãy điền thông tin cần thiết để tạo tài khoản.</p>
          </div>

          <div className="register-input">
            {step === 1 && (
              <form
                onKeyPress={(e) => handleKeyPress(e, ["lastName", "firstName"])}
              >
                <div>
                  <label>Họ</label>
                  <input
                    autoFocus={true}
                    type="text"
                    name="lastName"
                    placeholder="Vui lòng nhập họ"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Tên</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Vui lòng nhập tên"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="link-button-wrapper">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="register-button"
                  >
                    Trở về
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="register-button"
                    disabled={!formData.lastName || !formData.firstName}
                  >
                    Tiếp theo
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form
                onKeyPress={(e) =>
                  handleKeyPress(e, ["Email", "phone", "address"])
                }
              >
                <div>
                  <label>Email</label>
                  <input
                    autoFocus={true}
                    type="text"
                    name="Email"
                    placeholder="Vui lòng nhập email"
                    value={formData.Email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Vui lòng nhập số điện thoại"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Vui lòng nhập địa chỉ"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="link-button-wrapper">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="register-button"
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="register-button"
                    disabled={
                      !formData.Email || !formData.phone || !formData.address
                    }
                  >
                    Tiếp theo
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form
                onSubmit={handleSubmit}
                onKeyPress={(e) =>
                  handleKeyPress(e, ["password", "confirmPassword"])
                }
              >
                <div className="password-input-container">
                  <label>Mật khẩu</label>
                  <input
                    autoFocus={true}
                    type={isShowPassword ? "password" : "text"}
                    name="password"
                    placeholder="Vui lòng nhập mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <i
                    className={
                      isShowPassword
                        ? "fa-solid fa-eye-slash"
                        : "fa-solid fa-eye"
                    }
                    onClick={() => setIsShowPassword(!isShowPassword)}
                  ></i>
                </div>
                <div>
                  <label>Nhập lại mật khẩu</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Vui lòng nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="link-button-wrapper">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="register-button"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    className="register-button"
                    disabled={
                      !(
                        formData.lastName &&
                        formData.firstName &&
                        formData.Email &&
                        formData.address &&
                        formData.password &&
                        formData.confirmPassword
                      )
                    }
                  >
                    Tạo tài khoản
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
