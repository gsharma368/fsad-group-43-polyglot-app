import React from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaChartLine, FaUser, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const isAuthenticated = UserService.isAuthenticated();
    const isAdmin = UserService.isAdmin();
    const navigate = useNavigate();



    const handleLogout = () => {
        const confirmDelete = window.confirm('Are you sure you want to logout this user?');
        if (confirmDelete) {
            UserService.logout();
        }

        navigate("/login")
    };


    return (
        <nav className="navbar">
            <div className="navbar-icon">
                <img src={process.env.PUBLIC_URL + '/favicon.ico'} alt="Logo" className="logo" />
            </div>


            <ul className="navbar-list">
                {!isAuthenticated && <li className="navbar-item spaced"><Link to="/"><FaBook /> PolyGlot - Language Learning Application</Link></li>}
                {isAuthenticated && <li className="navbar-item spaced"><Link to="/masterCourses"><FaSearch /> Explore Courses</Link></li>}
                {isAuthenticated && <li className="navbar-item spaced"><Link to="/myCourses"><FaBook /> My Courses</Link></li>}
                {isAuthenticated && <li className="navbar-item spaced"><Link to="/progress"><FaChartLine /> Progress Tracking</Link></li>}
            </ul>
            {isAuthenticated &&
                <ul className="navbar-list">
                    <li className="navbar-item spaced"><Link to="/profile"><FaUser /> Profile</Link></li>
                    <li className="navbar-item spaced"><Link to="/" onClick={handleLogout}><FaSignOutAlt /> Logout</Link></li>
                </ul>
            }

        </nav>
    );
}

export default Navbar;
