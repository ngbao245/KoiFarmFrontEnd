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

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !(
        formData.lastName &&
        formData.firstName &&
        formData.Email &&
        formData.address &&
        formData.password &&
        formData.confirmPassword
      )
    ) {
      toast.error("All fields are required!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password not match!");
      return;
    }

    let res = await signup({
      name: formData.firstName + formData.lastName,
      password: formData.password,
      email: formData.Email,
      phone: "",
      address: formData.address,
    });
    if (res && res.data && res.statusCode === 201) {
      let res = await signin(formData.Email.trim(), formData.password.trim());
      if (res && res.data.token) {
        loginContext(formData.Email, res.data.token);
        navigate("/");
        toast.success("Signin successful!");
      }
    } else toast.error(res.data);
  };

  const handleKeyPress = (e, currentInputs) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // Find first empty field
      const emptyField = currentInputs.find((field) => !formData[field].trim());

      if (emptyField) {
        // Focus the first empty input
        document.querySelector(`input[name="${emptyField}"]`).focus();
        return;
      }

      // If all fields in current step are filled
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
                  >
                    Tiếp theo
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onKeyPress={(e) => handleKeyPress(e, ["Email", "address"])}>
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
                <div>
                  <label>Mật khẩu</label>
                  <input
                    autoFocus={true}
                    type="password"
                    name="password"
                    placeholder="Vui lòng nhập mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                  />
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
