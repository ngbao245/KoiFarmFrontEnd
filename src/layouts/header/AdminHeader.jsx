import React, { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { getUserInfo } from "../../services/UserService";
import "./adminHeader.css";

const AdminHeader = () => {
  const { logout, user } = useContext(UserContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logout Success");
  };

  useEffect(() => {
    if (!user || !user.auth) {
      navigate("/*");
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user && user.auth) {
        try {
          const response = await getUserInfo();
          setUserDetails(response.data);
        } catch (error) {
          console.error("Error fetching user details:", error);
          toast.error("Failed to fetch user details");
        }
      }
    };

    fetchUserDetails();
  }, [user]);

  return (
    <>
      <div className="admin-header-container">
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <NavLink
              className={({ isActive }) =>
                `navbar-brand ${isActive ? "fw-bold" : ""}`
              }
              to={userDetails && userDetails.roleId === "1" ? "/admin-dashboard" : "#"}
              onClick={(e) => {
                if (userDetails && userDetails.roleId !== "1") {
                  e.preventDefault();
                }
              }}
              style={userDetails && userDetails.roleId !== "1" ? { pointerEvents: 'none', opacity: 0.5 } : {}}
            >
              <i
                className="fa-solid fa-user-tie"
                style={{ marginRight: "10px" }}
              ></i>
              <span>Admin Dashboard</span>
            </NavLink>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse id="basic-navbar-nav">
              {((user && user.auth) || window.location.pathname === "/") && (
                <>
                  <Nav className="me-auto">
                    {userDetails && userDetails.roleId === "1" && (
                      <NavLink
                        className="nav-link"
                        to="/admin"
                        disabled={!user || !user.auth}
                      >
                        Quán Lý Nhân Viên
                      </NavLink>
                    )}
                    <NavLink
                      className="nav-link"
                      to="/admin-product"
                      disabled={!user || !user.auth}
                    >
                      Quản Lý Sản Phẩm
                    </NavLink>
                    <NavLink
                      className="nav-link"
                      to="/admin-blog"
                      disabled={!user || !user.auth}
                    >
                      Quản Lý Bài Đăng
                    </NavLink>
                    {userDetails && userDetails.roleId === "1" && (
                      <NavLink
                        className="nav-link"
                        to="/admin-order"
                        disabled={!user || !user.auth}
                      >
                        Quản Lý Đơn Đặt Hàng
                      </NavLink>
                    )}
                    {userDetails && userDetails.roleId === "2" && (
                      <NavLink
                        className="nav-link"
                        to="/staff-orders"
                        disabled={!user || !user.auth}
                      >
                        Quản Lý Đơn Đặt Hàng Của Nhân Viên
                      </NavLink>
                    )}
                  </Nav>
                  <Nav>
                    {user && user.email && (
                      <span className="nav-link">
                        <i className="fa-regular fa-user"></i> :{" "}
                        <span className="fw-bold"> {user.email}</span>
                      </span>
                    )}
                    <div ref={dropdownRef}>
                      <NavDropdown
                        title="Cài Đặt"
                        id="basic-nav-dropdown"
                        show={showUserDropdown}
                        onClick={() => setShowUserDropdown((prev) => !prev)}
                        disabled={!user || !user.auth}
                      >
                        {user && user.auth === true ? (
                          <NavDropdown.Item onClick={handleLogout}>
                            Đăng Xuất
                          </NavDropdown.Item>
                        ) : (
                          <NavLink className="dropdown-item" to="/login">
                            Đăng Nhập
                          </NavLink>
                        )}
                      </NavDropdown>
                    </div>
                  </Nav>
                </>
              )}
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </>
  );
};

export default AdminHeader;
