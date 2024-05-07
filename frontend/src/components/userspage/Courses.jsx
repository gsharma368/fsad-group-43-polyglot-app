import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import { Link } from 'react-router-dom';



function MasterCoursesPage() {
  const [coursesInfo, setMasterCoursesInfo] = useState([]);
  const [enrollResponse, setEnrollResponse] = useState({});

  useEffect(() => {
    fetchCoursesInfo();
  }, []);

  const fetchCoursesInfo = async () => {
    try {

      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      const response = await UserService.getAllCourses(token);
      setMasterCoursesInfo(response);
    } catch (error) {
      console.error('Error fetching master course information:', error);
    }
  };

  const enrollInCourseButton = async (courseId) => {
    try {
      // Prompt for confirmation before deleting the user
      const confirmEnroll = window.confirm('Are you sure you want to Enroll in this course?');

      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      if (confirmEnroll) {
        const response = await UserService.enrollInCourse(courseId, token);
        setEnrollResponse(response)
        window.alert(response.message + ". Please attempt the questions in My Courses Tab.")
        // After deleting the user, fetch the updated list of users
        //fetchUsers();
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  return (
    <div className="master-course-container">
      <h1>Explore All Courses</h1>
      <div class="card-grid">
        {coursesInfo.map(course => (
          /* <p key={course.id}>
                  {course.id}
                  {course.title}
                  {course.description}
                  {course.content}
                  </p>  */
          <div class="card-style">
            <img src={`https://source.unsplash.com/random/300x140?course-${course.id}`} class="image-style"></img>
            <div class="card-content">
              <h5><b>{course.title}</b></h5>
              <p><i>{course.description}</i></p>
            </div>
            <div class="card-bottom">
              <button class="continue-course-button" onClick={() => enrollInCourseButton(course.id)}>ENROLL NOW!</button>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}

export default MasterCoursesPage;
