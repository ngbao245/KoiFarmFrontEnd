import React, { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import "./adminHeader.css";

const AdminHeader = () => {
  const { logout, user } = useContext(UserContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Create a ref for the dropdown
  const [showUserDropdown, setShowUserDropdown] = useState(false); // State for dropdown visibility

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

  return (
    <>
      <div className="admin-header-container">
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <NavLink className="navbar-brand" to="#">
              <i
                className="fa-solid fa-user-tie"
                style={{ marginRight: "10px" }}
              ></i>
              <span> Admin Dashboard</span>
            </NavLink>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse id="basic-navbar-nav">
              {((user && user.auth) || window.location.pathname === "/") && (
                <>
                  <Nav className="me-auto">
                    <NavLink
                      className="nav-link"
                      to="/admin"
                      disabled={!user || !user.auth}
                    >
                      Staff Management
                    </NavLink>
                    <NavLink
                      className="nav-link"
                      to="/admin-product"
                      disabled={!user || !user.auth}
                    >
                      Product Item
                    </NavLink>
                  </Nav>
                  <Nav>
                    {user && user.email && (
                      <span className="nav-link">
                        Welcome: <span className="fw-bold"> {user.email}</span>
                      </span>
                    )}
                    <div ref={dropdownRef}>
                      <NavDropdown
                        title="Settings"
                        id="basic-nav-dropdown"
                        show={showUserDropdown}
                        onClick={() => setShowUserDropdown((prev) => !prev)}
                        disabled={!user || !user.auth}
                      >
                        {user && user.auth === true ? (
                          <NavDropdown.Item onClick={handleLogout}>
                            Logout
                          </NavDropdown.Item>
                        ) : (
                          <NavLink className="dropdown-item" to="/login">
                            Login
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
