import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import UserService from '../service/UserService';
import { Link } from 'react-router-dom';




function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState({});

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    const fetchProfileInfo = async () => {
        try {

            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await UserService.getYourProfile(token);
            setProfileInfo(response.ourUsers);
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };

    return (
        <div className="profile-page-container">
            <div className="profile-card">
                <div className="icon-container">
                    <FaUser size={50} />
                </div>
                <h2>Profile Information</h2>
                <ul className="profile-info-list">
                    <li><strong>Name:</strong> {profileInfo.name}</li>
                    <li><strong>Email:</strong> {profileInfo.email}</li>
                    <li><strong>City:</strong> {profileInfo.city}</li>
                </ul>
                <button className="profile-update-button"><Link to={`/update-user/${profileInfo.id}`}>Update This Profile</Link></button>
            </div>
        </div>
    );
}

export default ProfilePage;
