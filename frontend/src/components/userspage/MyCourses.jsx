import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


function MyCoursesPage() {
  const [coursesInfo, setMasterCoursesInfo] = useState([]);
  const [unenrollResponse, setUnEnrollResponse] = useState({});
  const navigate = useNavigate();
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
      // Prompt for confirmation before deleting the user
      const confirmUnEnroll = window.confirm('Are you sure you want to Un-Enroll from this course?');

      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      if (confirmUnEnroll) {
        const response = await UserService.unenrollFromThisCourseButton(courseId, token);
        setUnEnrollResponse(response)
        window.alert(response.message)
        // After deleting the user, fetch the updated list of users
        fetchCoursesInfo();
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const setCurrentContinueLearningCourse = async (courseId) => {
    try {
      // Prompt for confirmation before deleting the user
      const confirmUnEnroll = window.confirm('Are you sure you want to attempt questions of this Course');
      localStorage.setItem('currentContinueLearningCourse', courseId);
      navigate('/ContinueCourse');

    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  return (
    <div className="course-container">
      <h2 className="course-heading">My Enrolled Courses Page</h2>
      <div className="course-grid">
        {coursesInfo.map(course => (
          <div className="course-card">
            <img src={`https://source.unsplash.com/random/300x140?course-${course.id}`} className="course-image"></img>
            <div className="course-content">
              <h5><b>{course.title}</b></h5>
              <p><i>{course.description}</i></p>
            </div>
            <div className="course-actions">
              <button className="btn-continue" onClick={() => setCurrentContinueLearningCourse(course.id)}>Keep Improving - Continue Course</button>
              <button className='btn-unenroll' onClick={() => unenrollFromThisCourseButton(course.id)}>Un-Enroll</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default MyCoursesPage;
