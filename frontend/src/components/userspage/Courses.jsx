import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // This line is needed for accessibility reasons

function MasterCoursesPage() {
  const [coursesInfo, setMasterCoursesInfo] = useState([]);
  const [enrollResponse, setEnrollResponse] = useState({});
  const [enrollModalIsOpen, setEnrollModalIsOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    fetchCoursesInfo();
  }, []);

  const fetchCoursesInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await UserService.getAllCourses(token);
      setMasterCoursesInfo(response);
    } catch (error) {
      console.error('Error fetching master course information:', error);
    }
  };

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await UserService.enrollInCourse(selectedCourseId, token);
      setEnrollResponse(response)
      window.alert(response.message + ". Please attempt the questions in My Courses Tab.")
      setEnrollModalIsOpen(false);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const openEnrollModal = (courseId) => {
    setSelectedCourseId(courseId);
    setEnrollModalIsOpen(true);
  };
  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '500px', // Adjust as needed
      height: '300px', // Adjust as needed
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      boxSizing: 'border-box',
      border: 'none',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '10px',
    },
  };
  return (
    <div className="master-course-container">
      <h1>Explore All Courses</h1>
      <div class="card-grid">
        {coursesInfo.map(course => (
          <div class="card-style">
            <img src={`https://source.unsplash.com/random/300x140?course-${course.id}`} class="image-style"></img>
            <div class="card-content">
              <h5><b>{course.title}</b></h5>
              <p><i>{course.description}</i></p>
            </div>
            <div class="card-bottom">
              <button class="continue-course-button" onClick={() => openEnrollModal(course.id)}>ENROLL NOW!</button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={enrollModalIsOpen}
        onRequestClose={() => setEnrollModalIsOpen(false)}
        contentLabel="Confirmation Modal"
        style={customStyles}
      >
        <h2>Confirmation</h2>
        <p style={{ fontSize: '18px' }}>Are you sure you want to enroll in this course?</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <button style={{
            backgroundColor: '#d0d0d0',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            borderRadius: '5px',
            marginRight: '10px',
            transition: 'all 0.3s ease',
            ':hover': {
              backgroundColor: '#b0b0b0',
            },
          }} onClick={() => setEnrollModalIsOpen(false)}>Cancel</button>
          <button style={{
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            borderRadius: '5px',
            transition: 'all 0.3s ease',
            ':hover': {
              backgroundColor: '#0056b3',
            },
          }} onClick={handleEnroll}>OK</button>
        </div>
      </Modal>
    </div>
  );
}

export default MasterCoursesPage;