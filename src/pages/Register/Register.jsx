import React, { useContext, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { signin, signup } from "../../services/UserService";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

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
  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

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
    if (formData.password === formData.confirmPassword) {
    } else {
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
    console.log(res);
    if (res && res.data && res.statusCode === 201) {
      let res = await signin(formData.Email.trim(), formData.password.trim());
      if (res && res.data.token) {
        loginContext(formData.Email, res.data.token);
        navigate("/");
        toast.success("Signin successful!");
      }
    } else toast.error(res.data);
  };

  return (
    <div
      style={{
        backgroundImage: "url(/public/assets/background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "lightblue",
      }}
    >
      <Container
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "30px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          width: "850px",
          height: "394px",
          display: "flex",
          alignItems: "center", // Ensures vertical centering
        }}
      >
        <Row style={{ width: "100%" }}>
          <Col
            md={3}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              paddingLeft: "20px",
            }}
          >
            <h2 style={{ margin: 0 }}>Register</h2>
            <p style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
              Hãy điền thông tin cần thiết để tạo tài khoản.
            </p>
          </Col>
          <Col md={9}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                height: "100%",
              }}
            >
              {step === 1 && (
                <Form style={{ width: "100%" }}>
                  <Form.Group className="mb-3">
                    <Form.Label
                      style={{
                        paddingLeft: 170,
                      }}
                    >
                      Họ
                    </Form.Label>
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Form.Control
                        type="text"
                        name="lastName"
                        placeholder="Vui lòng nhập họ của bạn"
                        value={formData.lastName}
                        onChange={handleChange}
                        style={{
                          padding: "16px 20px",
                          borderRadius: "8px",
                          fontSize: "16px",
                          height: "50px",
                          width: "70%", // Shorter text field
                        }}
                      />
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label
                      style={{
                        paddingLeft: 170,
                      }}
                    >
                      Tên
                    </Form.Label>
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Form.Control
                        type="text"
                        name="firstName"
                        placeholder="Vui lòng nhập tên của bạn"
                        value={formData.firstName}
                        onChange={handleChange}
                        style={{
                          padding: "16px 20px",
                          borderRadius: "8px",
                          fontSize: "16px",
                          height: "50px",
                          width: "70%", // Shorter text field
                        }}
                      />
                    </div>
                  </Form.Group>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "20px",
                    }}
                  >
                    <Button
                      onClick={handleNext}
                      style={{
                        backgroundColor: "#6d6d6d",
                        borderColor: "#6d6d6d",
                        padding: "12px 30px",
                        fontSize: "16px",
                      }}
                    >
                      Tiếp theo
                    </Button>
                  </div>
                </Form>
              )}

              {step === 2 && (
                <Form style={{ width: "100%" }}>
                  <Form.Group className="mb-3">
                    <Form.Label
                      style={{
                        paddingLeft: 170,
                      }}
                    >
                      Số điện thoại/ Email
                    </Form.Label>
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Form.Control
                        type="text"
                        name="Email"
                        placeholder="Vui lòng nhập số điện thoại hoặc email"
                        value={formData.Email}
                        onChange={handleChange}
                        style={{
                          padding: "16px 20px",
                          borderRadius: "8px",
                          fontSize: "16px",
                          height: "50px",
                          width: "70%", // Shorter text field
                        }}
                      />
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label
                      style={{
                        paddingLeft: 170,
                      }}
                    >
                      Địa chỉ
                    </Form.Label>
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Form.Control
                        type="text"
                        name="address"
                        placeholder="Vui lòng nhập địa chỉ"
                        value={formData.address}
                        onChange={handleChange}
                        style={{
                          padding: "16px 20px",
                          borderRadius: "8px",
                          fontSize: "16px",
                          height: "50px",
                          width: "70%", // Shorter text field
                        }}
                      />
                    </div>
                  </Form.Group>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "20px",
                    }}
                  >
                    <Button
                      onClick={handlePrev}
                      style={{
                        backgroundColor: "#6d6d6d",
                        borderColor: "#6d6d6d",
                        padding: "12px 30px",
                        fontSize: "16px",
                        marginRight: "10px",
                      }}
                    >
                      Quay lại
                    </Button>
                    <Button
                      onClick={handleNext}
                      style={{
                        backgroundColor: "#6d6d6d",
                        borderColor: "#6d6d6d",
                        padding: "12px 30px",
                        fontSize: "16px",
                      }}
                    >
                      Tiếp theo
                    </Button>
                  </div>
                </Form>
              )}

              {step === 3 && (
                <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label
                      style={{
                        paddingLeft: 170,
                      }}
                    >
                      Mật khẩu
                    </Form.Label>
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Vui lòng nhập mật khẩu"
                        value={formData.password}
                        onChange={handleChange}
                        style={{
                          padding: "16px 20px",
                          borderRadius: "8px",
                          fontSize: "16px",
                          height: "50px",
                          width: "70%", // Shorter text field
                        }}
                      />
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label
                      style={{
                        paddingLeft: 170,
                      }}
                    >
                      Nhập lại mật khẩu
                    </Form.Label>
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Vui lòng nhập lại mật khẩu"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={{
                          padding: "16px 20px",
                          borderRadius: "8px",
                          fontSize: "16px",
                          height: "50px",
                          width: "70%",
                        }}
                      />
                    </div>
                  </Form.Group>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "20px",
                    }}
                  >
                    <Button
                      onClick={handlePrev}
                      style={{
                        backgroundColor: "#6d6d6d",
                        borderColor: "#6d6d6d",
                        padding: "12px 30px",
                        fontSize: "16px",
                        marginRight: "10px",
                      }}
                    >
                      Quay lại
                    </Button>
                    <Button
                      type="submit"
                      style={{
                        backgroundColor: "#6d6d6d",
                        borderColor: "#6d6d6d",
                        padding: "12px 30px",
                        fontSize: "16px",
                      }}
                    >
                      Tạo tài khoản
                    </Button>
                  </div>
                </Form>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
