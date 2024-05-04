import React from 'react';
import { Link } from 'react-router-dom';
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
        <nav styles='margin-bottom: 10px'>
            <ul>
                {!isAuthenticated && <li><Link to="/">PolyGlot - Language Learning Application</Link></li>}
                {isAuthenticated && <li><Link to="/profile">Profile</Link></li>}
                {isAuthenticated && <li><Link to="/masterCourses">Explore Courses</Link></li>}
                {isAuthenticated && <li><Link to="/myCourses">My Courses</Link></li>}
                {isAuthenticated && <li><Link to="/progress">Progress Tracking</Link></li>}
                {isAuthenticated && <li><Link to="/" onClick={handleLogout}>Logout</Link></li>}
            </ul>
        </nav>
    );
}

export default Navbar;
