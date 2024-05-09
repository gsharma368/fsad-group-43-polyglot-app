import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import { useNavigate } from "react-router-dom";
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function MyProgressPage() {
    const [coursesInfo, setCoursesInfo] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCoursesInfo();
    }, []);

    const fetchCoursesInfo = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await UserService.getMyProgress(token);
            setCoursesInfo(response);
        } catch (error) {
            console.error('Error fetching course information:', error);
        }
    };

    const unenrollFromCourse = async (courseId) => {
        if (window.confirm('Are you sure you want to unenroll from this course?')) {
            const token = localStorage.getItem('token');
            try {
                const response = await UserService.unenrollFromThisCourse(courseId, token);
                window.alert(response.message);
                fetchCoursesInfo();  // Refresh the courses info
            } catch (error) {
                console.error('Error unenrolling from course:', error);
            }
        }
    };

    const continueCourse = (courseId) => {
        localStorage.setItem('currentContinueLearningCourse', courseId);
        navigate('/ContinueCourse');
    };

    return (
        <div className="master-course-container">
            <h2 className="progress-reports-title">Your Progress Reports</h2>
            <div className="progress-card-grid">
                {coursesInfo.map((courseProgress, index) => (
                    <div className="progress-card-style" key={index}>
                        <img src={`https://source.unsplash.com/random/300x140?course-${courseProgress.id}`} className="image-style" alt="Course Thumbnail"></img>
                        <div className="progress-card-content">
                            <h5><b>{courseProgress.course.title}</b></h5>
                            <p><i>{courseProgress.course.description}</i></p>
                            <Pie data={{
                                labels: ['Total Questions', 'Attempted Questions', 'Unattempted Questions', 'Correct Answers', 'Wrong Answers'],
                                datasets: [{
                                    data: [
                                        courseProgress.totalQuestionsInTheCourse,
                                        courseProgress.attemptedQuestions,
                                        courseProgress.unAttemptedQuestions,
                                        courseProgress.correctAnswers,
                                        courseProgress.wrongAnswers
                                    ],
                                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#F7464A'],
                                    hoverOffset: 4
                                }]
                            }}
                                options={{
                                    tooltips: {
                                        callbacks: {
                                            label: function (tooltipItem, data) {
                                                var label = data.labels[tooltipItem.index];
                                                var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                                return label + ': ' + value;
                                            }
                                        }
                                    }
                                }}
                            />
                            <div>
                                <button className="continue-course-button" onClick={() => continueCourse(courseProgress.id)}>Continue Course</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyProgressPage;
