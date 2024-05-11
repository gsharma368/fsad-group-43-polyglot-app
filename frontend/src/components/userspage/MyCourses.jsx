import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import UserService from '../service/UserService';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function MyCoursesPage() {
  const [coursesInfo, setMasterCoursesInfo] = useState([]);
  const [unenrollResponse, setUnEnrollResponse] = useState({});
  const navigate = useNavigate();
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [unenrollModalIsOpen, setUnenrollModalIsOpen] = useState(false);
  const [continueModalIsOpen, setContinueModalIsOpen] = useState(false);

  useEffect(() => {
    fetchCoursesInfo();
  }, []);

  const fetchCoursesInfo = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      const response = await UserService.getMyCourses(token);
      setMasterCoursesInfo(response);
    } catch (error) {
      console.error('Error fetching master course information:', error);
    }
  };

  const unenrollFromThisCourseButton = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await UserService.unenrollFromThisCourseButton(courseId, token);
      setUnEnrollResponse(response)
      window.alert(response.message)
      fetchCoursesInfo();
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const setCurrentContinueLearningCourse = async (courseId) => {
    setCurrentCourseId(courseId);
    setContinueModalIsOpen(true);
  };

  const handleYes = () => {
    localStorage.setItem('currentContinueLearningCourse', currentCourseId);
    navigate('/ContinueCourse');
    setContinueModalIsOpen(false);
  };

  const handleNo = () => {
    setContinueModalIsOpen(false);
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
    <div className="course-container">
      <h2 className="course-heading">My Enrolled Courses Page</h2>
      <div className="course-grid">
        {coursesInfo.map(course => (
          <div className="course-card" key={course.id}>
            <img src={`https://source.unsplash.com/random/300x140?course-${course.id}`} className="course-image"></img>
            <div className="course-content">
              <h5><b>{course.title}</b></h5>
              <p><i>{course.description}</i></p>
            </div>
            <div className="course-actions">
              <button className="btn-continue" onClick={() => setCurrentContinueLearningCourse(course.id)}>Keep Improving - Continue Course</button>
              <button className='btn-unenroll' onClick={() => {
                setCurrentCourseId(course.id);
                setUnenrollModalIsOpen(true);
              }}>Un-Enroll</button>
            </div>
          </div>
        ))}
      </div>
     <Modal
  isOpen={continueModalIsOpen}
  onRequestClose={() => setContinueModalIsOpen(false)}
  contentLabel="Confirmation Modal"
  style={customStyles}
>
  <h2>Confirmation</h2>
  <p style={{ fontSize: '18px' }}>Are you sure you want to attempt questions of this Course?</p>
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
    }} onClick={handleNo}>Cancel</button>
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
    }} onClick={handleYes}>OK</button>
  </div>
</Modal>
<Modal
  isOpen={unenrollModalIsOpen}
  onRequestClose={() => setUnenrollModalIsOpen(false)}
  contentLabel="Confirmation Modal"
  style={customStyles}
>
  <h2>Confirmation</h2>
  <p style={{ fontSize: '18px' }}>Are you sure you want to Un-Enroll from this course?</p>
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
    }} onClick={() => setUnenrollModalIsOpen(false)}>Cancel</button>
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
    }} onClick={() => {
      unenrollFromThisCourseButton(currentCourseId);
      setUnenrollModalIsOpen(false);
    }}>OK</button>
  </div>
</Modal>
    </div>
  );
}

export default MyCoursesPage;