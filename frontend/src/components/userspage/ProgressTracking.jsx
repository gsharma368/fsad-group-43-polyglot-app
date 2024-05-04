import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


function MyProgressPage() {
    const [coursesInfo, setMasterCoursesInfo] = useState([]);
    const [unenrollResponse, setUnEnrollResponse] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        fetchCoursesInfo();
    }, []);

    const fetchCoursesInfo = async () => {
        try {

            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await UserService.getMyProgress(token);
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
        <div className="master-course-container">
          <h2>Your Progress Reports</h2>
          <div class="progress-card-grid">
            {coursesInfo.map(courseProgress => (
            /* <p key={course.id}>
                    {course.id}
                    {course.title}
                    {course.description}
                    {course.content}
                    </p>  */
                    <div class="progress-card-style">
                        <img src={`https://source.unsplash.com/random/300x140?course-${courseProgress.id}`} class="image-style"></img>
                        <div class="progress-card-content">
                            <h5><b>{courseProgress.course.title}</b></h5>
                            <p><i>{courseProgress.course.description}</i></p>
                            <p><i>Total Questions in Course: {courseProgress.totalQuestionsInTheCourse}</i></p>
                            <p><i>Attempted Questions in Course: {courseProgress.attemptedQuestions}</i></p>
                            <p><i>Unattempted Questions in Course: {courseProgress.unAttemptedQuestions}</i></p>
                            <p><i>Correct Answers: {courseProgress.correctAnswers}</i></p>
                            <p><i>Wrong Answers: {courseProgress.wrongAnswers}</i></p>
                            <p><i>Total Marks in the Course: {courseProgress.totalMarks}</i></p>
                        </div>
                    </div>
                ))}
          </div>
        </div>
        
      );
}

export default MyProgressPage;
