import React from "react";
import { Link } from "react-router-dom";
import UserService from "../service/UserService";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";

import logo from "../images/logo.png";

function Navbar() {
  const isAuthenticated = UserService.isAuthenticated();
  const isAdmin = UserService.isAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to logout this user?"
    );
    if (confirmDelete) {
      UserService.logout();
    }

    navigate("/login");
  };

  return (
    <nav
      style={{
        marginBottom: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image src={logo} rounded style={{ width: 48 }} />
      <ul style={{ marginBottom: 0 }}>
        {!isAuthenticated && (
          <li>
            <Link to="/">PolyGlot - Language Learning Application</Link>
          </li>
        )}
        {isAuthenticated && (
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        )}
        {isAuthenticated && (
          <li>
            <Link to="/masterCourses">Explore Courses</Link>
          </li>
        )}
        {isAuthenticated && (
          <li>
            <Link to="/myCourses">My Courses</Link>
          </li>
        )}
        {isAuthenticated && (
          <li>
            <Link to="/progress">Progress Tracking</Link>
          </li>
        )}
        {isAuthenticated && (
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
