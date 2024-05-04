import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import { Link } from 'react-router-dom';



function ContinueCoursePage() {
    const [coursesInfo, setMasterCoursesInfo] = useState([]);
    const [attemptedQuestionsofTheCourseByTheUserInfo, setAttemptedQuestionsofTheCourseByTheUserInfo] = useState([]);
    const [courseId, setCourseId] = useState(localStorage.getItem('currentContinueLearningCourse'));
    const [coursesDetails, setCoursesDetails] = useState({});
    useEffect(() => {
        fetchCoursesDetails();
    }, []);

    const fetchCoursesDetails = async () => {
        try {

            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await UserService.getMyCoursesById(courseId, token);
            setCoursesDetails(response);
        } catch (error) {
            console.error('Error fetching master course information:', error);
        }
    };

    useEffect(() => {
        fetchContinueCourseInfoForTheLoggedInUser();
    }, []);

    const fetchContinueCourseInfoForTheLoggedInUser = async () => {
        try {

            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await UserService.getUnattemptedQuestionsForThisCourse(courseId ,token);
            setMasterCoursesInfo(response);
        } catch (error) {
            console.error('Error fetching master course information:', error);
        }
    };

    useEffect(() => {
        fetchAttemptedQuestionsofTheCourseByTheUserInfo();
    }, []);

    const fetchAttemptedQuestionsofTheCourseByTheUserInfo = async () => {
        try {

            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await UserService.getAttemptedQuestionsForThisCourse(courseId ,token);
            setAttemptedQuestionsofTheCourseByTheUserInfo(response);
        } catch (error) {
            console.error('Error fetching master course information:', error);
        }
    };


    const handleSubmitAttemptQuestion = async (e, questionIdSent) => {
        e.preventDefault();

        try {
            // Prompt for confirmation before deleting the user
            //const confirmUnEnroll = window.confirm('Are you sure you want to attempt this Question?');
            window.alert("Record the response "+ responseAttemptedQuestion.userResponse + " for this question.");
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await UserService.attemptThisQuestion(questionIdSent, responseAttemptedQuestion.userResponse, token);
            window.alert(response.message)
            // After attemptint, fetch the updated list of users
            fetchContinueCourseInfoForTheLoggedInUser();
            fetchAttemptedQuestionsofTheCourseByTheUserInfo();
          } catch (error) {
            console.error('Error enrolling in course:', error);
          }
    }
    
    const [responseAttemptedQuestion, setResponseOfTheAttemptedQuestion] = useState({})

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
 //       setResponseOfTheAttemptedQuestion({ ...setResponseOfTheAttemptedQuestion, ['questionId']: e.target.key });
        setResponseOfTheAttemptedQuestion({ ...setResponseOfTheAttemptedQuestion, [name]: value });
    };
    if(localStorage.getItem('currentContinueLearningCourse') === 'null'){
        return (<h2>You aren't enrolled in any course.</h2>);
    }else{
        return (
            <div className="master-course-container">
              <h2>Unattempted Questions in this Course {coursesDetails.title}</h2>
              <div class="question-grid">
                {coursesInfo.map(questionDetail => (
                    <div class="card-style">
                        <form onSubmit={(e) => handleSubmitAttemptQuestion(e, questionDetail.id)}>
                            <div className="form-outline mb-4">
                                <label class="question-label">Question: {questionDetail.question}</label>
                                <input type="Response" key={questionDetail.id} name="userResponse"  onChange={handleInputChange} class="form-control" placeholder="Enter your answer"/>
                            </div>
                            <div class="pull-right">
                                 <button class="answer-submit-button" type="submit">Attempt Question</button>
                            </div>
                        </form>
                    </div>
                        /*<p key={questionDetail.id}>
                                {questionDetail.id}
                                {questionDetail.question}
                                {questionDetail.answer}
                                </p>  */
                        /*        <div class="question-style">
                                    <img src={`https://source.unsplash.com/random/300x140?course-${course.id}`} class="image-style"></img>
                                    <div class="question-content">
                                        <h5><b>{course.title}</b></h5>
                                        <p><i>{course.description}</i></p>
                                    </div>
                                    <div class="question-bottom">
                                        <button class="btn-primary" >Keep Improving</button>
                                        <button className='delete-button' onClick={() => unenrollFromThisCourseButton(course.id)}>Un-Enroll</button>
                                    </div>
                                </div> */
                ))}
              </div>
    
              <h2>Questions that you have attempted</h2>
              <div class="question-grid">
                {attemptedQuestionsofTheCourseByTheUserInfo.map(questionDetail => (
                
                   /* <form onSubmit={(e) => handleSubmitAttemptQuestion(e, questionDetail.id)}>
                    <div className="form-outline mb-4">
                        <label>Question: {questionDetail.questionAnswer.question}</label>
                        <input type="Response" key={questionDetail.id} name="userResponse"  onChange={handleInputChange} />
                    </div>
                    <button type="submit">Register</button>
                    </form> */
                    <div class="card-attempted-style">
                    
                        <div class="card-attempted-content">
                            <h5><b>Question: {questionDetail.questionAnswer.question}</b></h5>
                            <p><i>Your Response: {questionDetail.response}</i></p>
                        </div>
                        <div class="card-attempted-bottom">
                            <p><i>Correct Answer: {questionDetail.questionAnswer.answer}</i></p>
                            <p><i>Marks: {questionDetail.marks}</i></p>
                            <p><i>Attempted Date Time: {questionDetail.attemptDateTime}</i></p>
                        </div>
                </div>
                ))}
              </div>
    
            </div>
            
          );
    }
    
}

export default ContinueCoursePage;
