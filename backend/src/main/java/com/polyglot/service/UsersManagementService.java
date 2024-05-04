package com.polyglot.service;

import com.polyglot.dto.CourseReqRes;
import com.polyglot.dto.ProgessReqRes;
import com.polyglot.dto.QuesAnsReqRes;
import com.polyglot.dto.ReqRes;
import com.polyglot.entity.AttemptedQuestion;
import com.polyglot.entity.Course;
import com.polyglot.entity.OurUsers;
import com.polyglot.entity.QuestionAnswer;
import com.polyglot.repository.AttemptedQuestionRepo;
import com.polyglot.repository.CourseRepo;
import com.polyglot.repository.QuestionAnswerRepo;
import com.polyglot.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class UsersManagementService {

    @Autowired
    private UsersRepo usersRepo;
    @Autowired
    private CourseRepo courseRepo;
    @Autowired
    private QuestionAnswerRepo questionAnswerRepo;
    @Autowired
    private AttemptedQuestionRepo attemptedQuestionRepo;

    @Autowired
    private JWTUtilsHelper jwtUtilsHelper;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;


    public ReqRes register(ReqRes registrationRequest){
        ReqRes resp = new ReqRes();

        try {
            OurUsers ourUser = new OurUsers();
            ourUser.setEmail(registrationRequest.getEmail());
            ourUser.setCity(registrationRequest.getCity());
            ourUser.setRole(registrationRequest.getRole());
            ourUser.setName(registrationRequest.getName());
            ourUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            OurUsers ourUsersResult = usersRepo.save(ourUser);
            if (ourUsersResult.getId()>0) {
                resp.setOurUsers((ourUsersResult));
                resp.setMessage("User Saved Successfully");
                resp.setStatusCode(200);
            }

        }catch (Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }


    public ReqRes login(ReqRes loginRequest){
        ReqRes response = new ReqRes();
        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),
                            loginRequest.getPassword()));
            var user = usersRepo.findByEmail(loginRequest.getEmail()).orElseThrow();
            var jwt = jwtUtilsHelper.generateJWTToken(user);
            var refreshToken = jwtUtilsHelper.generateJWTRefreshToken(new HashMap<>(), user);
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRole(user.getRole());
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hrs");
            response.setMessage("Successfully Logged In");

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }





    public ReqRes refreshToken(ReqRes refreshTokenReqiest){
        ReqRes response = new ReqRes();
        try{
            String ourEmail = jwtUtilsHelper.extractUsername(refreshTokenReqiest.getToken());
            OurUsers users = usersRepo.findByEmail(ourEmail).orElseThrow();
            if (jwtUtilsHelper.isTokenValid(refreshTokenReqiest.getToken(), users)) {
                var jwt = jwtUtilsHelper.generateJWTToken(users);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenReqiest.getToken());
                response.setExpirationTime("24Hr");
                response.setMessage("Successfully Refreshed Token");
            }
            response.setStatusCode(200);
            return response;

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
            return response;
        }
    }


    public ReqRes getAllUsers() {
        ReqRes reqRes = new ReqRes();

        try {
            List<OurUsers> result = usersRepo.findAll();
            if (!result.isEmpty()) {
                reqRes.setOurUsersList(result);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("No users found");
            }
            return reqRes;
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
            return reqRes;
        }
    }

    public List<Course> getAllCourses() {
        List<Course> result = courseRepo.findAll();
        return result;
    }

    public Course getCourseById(Integer courseId) {
        Optional<Course> courseOptional = courseRepo.findById(courseId);
        return courseOptional.get();
    }

    public ReqRes getUsersById(Integer id) {
        ReqRes reqRes = new ReqRes();
        try {
            OurUsers usersById = usersRepo.findById(id).orElseThrow(() -> new RuntimeException("User Not found"));
            reqRes.setOurUsers(usersById);
            reqRes.setStatusCode(200);
            reqRes.setMessage("Users with id '" + id + "' found successfully");
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
        }
        return reqRes;
    }


    public ReqRes deleteUser(Integer userId) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                usersRepo.deleteById(userId);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User deleted successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for deletion");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while deleting user: " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes updateUser(Integer userId, OurUsers updatedUser) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                OurUsers existingUser = userOptional.get();
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setName(updatedUser.getName());
                existingUser.setCity(updatedUser.getCity());
                existingUser.setRole(updatedUser.getRole());

                // Check if password is present in the request
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    // Encode the password and update it
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }

                OurUsers savedUser = usersRepo.save(existingUser);
                reqRes.setOurUsers(savedUser);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User updated successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while updating user: " + e.getMessage());
        }
        return reqRes;
    }


    public ReqRes getMyInfo(String email){
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findByEmail(email);
            if (userOptional.isPresent()) {
                reqRes.setOurUsers(userOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return reqRes;

    }

    public CourseReqRes addMasterCourse(CourseReqRes courseReqRes) {
        CourseReqRes resp = new CourseReqRes();

        try {
            Course addCourse = new Course();
            addCourse.setTitle(courseReqRes.getTitle());
            addCourse.setContent(courseReqRes.getContent());
            addCourse.setDescription(courseReqRes.getDescription());
            Course courseResult = courseRepo.save(addCourse);
            if (courseResult.getId()>0) {
                resp.setCourse((courseResult));
                resp.setMessage("Course Saved Successfully");
                resp.setStatusCode(200);
            }

        }catch (Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public ReqRes enrollUserInCourse(String email, Integer courseId) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findByEmail(email);
            if (userOptional.isPresent()) {
                reqRes.setOurUsers(userOptional.get());
                if(userOptional.get().getCourses().contains(courseId)){
                    reqRes.setStatusCode(400);
                        reqRes.setMessage("User already enrolled in this course. Please explore the course content on My Courses Tab");
                } else {
                    List<Integer> courseIds = new ArrayList<>(userOptional.get().getCourses());
                    courseIds.add(courseId);
                    userOptional.get().setCourses(courseIds);
                    OurUsers savedUser = usersRepo.save(userOptional.get());
                    reqRes.setOurUsers(savedUser);
                    reqRes.setStatusCode(200);
                    reqRes.setMessage("You have successfully enrolled in this course");
                }
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes unenrollUserInCourse(String email, Integer courseId) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findByEmail(email);
            if (userOptional.isPresent()) {
                reqRes.setOurUsers(userOptional.get());
                if(!userOptional.get().getCourses().contains(courseId)){
                    reqRes.setStatusCode(400);
                    reqRes.setMessage("User already not enrolled in this course");
                } else {
                    List<Integer> courseIds = new ArrayList<>(userOptional.get().getCourses());
                    courseIds.remove(courseId);
                    userOptional.get().setCourses(courseIds);
                    OurUsers savedUser = usersRepo.save(userOptional.get());
                    reqRes.setOurUsers(savedUser);
                    reqRes.setStatusCode(200);
                    reqRes.setMessage("You have successfully unenrolled from this course");
                }
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes unenrollUserFromAllCourses(String email) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findByEmail(email);
            if (userOptional.isPresent()) {
                reqRes.setOurUsers(userOptional.get());
                if(userOptional.get().getCourses().isEmpty()){
                    reqRes.setStatusCode(400);
                    reqRes.setMessage("User already not enrolled in ANY course");
                } else {
                    List<Integer> courseIds = new ArrayList<>();
                    userOptional.get().setCourses(courseIds);
                    OurUsers savedUser = usersRepo.save(userOptional.get());
                    reqRes.setOurUsers(savedUser);
                    reqRes.setStatusCode(200);
                    reqRes.setMessage("You have successfully unenrolled from ALL courses");
                }
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return reqRes;
    }

    public List<Course> getMyCourses(String email) {
        ReqRes reqRes = new ReqRes();
        List<Course> courses = new ArrayList<>();
        try {
            Optional<OurUsers> userOptional = usersRepo.findByEmail(email);
            if (userOptional.isPresent()) {
                reqRes.setOurUsers(userOptional.get());
                if(userOptional.get().getCourses().isEmpty()){
                    reqRes.setStatusCode(400);
                    reqRes.setMessage("User is enrolled in zero course.");
                } else {
                    List<Integer> courseIds = new ArrayList<>(userOptional.get().getCourses());
                    for(Integer courseId : courseIds){
                        Optional<Course> enrolledCourse = courseRepo.findById(courseId);
                        if(enrolledCourse.isPresent()){
                            courses.add(enrolledCourse.get());
                        }
                    }
                    reqRes.setStatusCode(200);
                    reqRes.setMessage("You have successfully enrolled in this course");
                }
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return courses;
    }

    public List<ProgessReqRes> getMyProgress(String email) {
        List<ProgessReqRes> result = new ArrayList<>();
        ReqRes reqRes = new ReqRes();
        List<Course> courses = new ArrayList<>();
        try {
            Optional<OurUsers> userOptional = usersRepo.findByEmail(email);
            if (userOptional.isPresent()) {
                reqRes.setOurUsers(userOptional.get());
                if(userOptional.get().getCourses().isEmpty()){
                    reqRes.setStatusCode(400);
                    reqRes.setMessage("User is enrolled in zero course.");
                } else {
                    List<Integer> courseIds = new ArrayList<>(userOptional.get().getCourses());
                    for(Integer courseId : courseIds){
                        Optional<Course> enrolledCourse = courseRepo.findById(courseId);
                        if(enrolledCourse.isPresent()){
                            courses.add(enrolledCourse.get());
                        }
                    }
                    reqRes.setStatusCode(200);
                    reqRes.setMessage("You have successfully enrolled in this course");
                }
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        for(Course course : courses){
            List<QuestionAnswer> unAttemptedQuestionForCourse= getUnAttemptedQuestionForCourse(course.getId(), email);
            List<AttemptedQuestion> attemptedQuestionForCourse = getAttemptedQuestionForCourse(course.getId(), email);

            ProgessReqRes progress = new ProgessReqRes();
            progress.setCourse(course);
            progress.setUnAttemptedQuestions(unAttemptedQuestionForCourse.size());
            progress.setAttemptedQuestions(attemptedQuestionForCourse.size());
            Integer correctAnswers = 0, wrongAnswers = 0;
            for(AttemptedQuestion attemptedQuestion : attemptedQuestionForCourse){
                if(attemptedQuestion.getMarks() == 1){
                    correctAnswers++;
                } else if (attemptedQuestion.getMarks() == -1) {
                    wrongAnswers++;
                }
            }
            progress.setCorrectAnswers(correctAnswers);
            progress.setWrongAnswers(wrongAnswers);
            progress.setTotalMarks(correctAnswers-wrongAnswers);
            if(course.getQuestionAnswers().size() == (attemptedQuestionForCourse.size() +unAttemptedQuestionForCourse.size())){
                progress.setTotalQuestionsInTheCourse(course.getQuestionAnswers().size());
            }

            result.add(progress);
        }
        return result;
    }


    public QuesAnsReqRes addQuestionToTheCourse(QuesAnsReqRes quesAnsReqRes) {
        QuesAnsReqRes resp = new QuesAnsReqRes();

        try {
            QuestionAnswer addQuestionAnswer = new QuestionAnswer();
            addQuestionAnswer.setQuestion(quesAnsReqRes.getQuestion());
            addQuestionAnswer.setAnswer(quesAnsReqRes.getAnswer());
            addQuestionAnswer.setCourseId(quesAnsReqRes.getCourseId());
            addQuestionAnswer.setQuestionType(quesAnsReqRes.getQuestionType());
            QuestionAnswer addedQuestionAnswer = questionAnswerRepo.save(addQuestionAnswer);

            // Added the question to the course
            Optional<Course> courseOptional = courseRepo.findById(quesAnsReqRes.getCourseId());
            List<Integer> questionAnswerIds = new ArrayList<>(courseOptional.get().getQuestionAnswers());
            questionAnswerIds.add(addedQuestionAnswer.getId());

            courseOptional.get().setQuestionAnswers(questionAnswerIds);
            Course savedCourse = courseRepo.save(courseOptional.get());

            if (addedQuestionAnswer.getId()>0) {
                resp.setQuestion(addedQuestionAnswer.getQuestion());
                resp.setAnswer(addedQuestionAnswer.getAnswer());
                resp.setCourseId(addedQuestionAnswer.getCourseId());
                resp.setQuestionType(addedQuestionAnswer.getQuestionType());
                resp.setMessage("Question Added Successfully to the Course Content");
                resp.setStatusCode(200);
            }

        }catch (Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }


    public QuesAnsReqRes editQuestionOfTheCourse(Integer questionId, QuesAnsReqRes quesAnsReqRes) {
        QuesAnsReqRes resp = new QuesAnsReqRes();

        try {
            QuestionAnswer addQuestionAnswer = new QuestionAnswer();
            addQuestionAnswer.setQuestion(quesAnsReqRes.getQuestion());
            addQuestionAnswer.setAnswer(quesAnsReqRes.getAnswer());
            addQuestionAnswer.setCourseId(quesAnsReqRes.getCourseId());
            addQuestionAnswer.setQuestionType(quesAnsReqRes.getQuestionType());
            QuestionAnswer addedQuestionAnswer = questionAnswerRepo.save(addQuestionAnswer);

            // Added the question to the course
            Optional<Course> courseOptional = courseRepo.findById(quesAnsReqRes.getCourseId());
            List<Integer> questionAnswerIds = new ArrayList<>(courseOptional.get().getQuestionAnswers());
            questionAnswerIds.add(addedQuestionAnswer.getId());

            courseOptional.get().setQuestionAnswers(questionAnswerIds);
            Course savedCourse = courseRepo.save(courseOptional.get());

            if (addedQuestionAnswer.getId()>0) {
                resp.setQuestion(addedQuestionAnswer.getQuestion());
                resp.setAnswer(addedQuestionAnswer.getAnswer());
                resp.setCourseId(addedQuestionAnswer.getCourseId());
                resp.setQuestionType(addedQuestionAnswer.getQuestionType());
                resp.setMessage("Question Added Successfully to the Course Content");
                resp.setStatusCode(200);
            }

        }catch (Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;

    }


    public List<QuestionAnswer> getQuestionsOfTheCourseId(Integer courseId) {
            Optional<Course> courseOptional = courseRepo.findById(courseId);
            List<Integer> questionsOfCourse = courseOptional.get().getQuestionAnswers();
            List<QuestionAnswer> questionAnswers = new ArrayList<>();
            for(Integer questionId : questionsOfCourse){
                Optional questionAnswerOptional = questionAnswerRepo.findById(questionId);
                if(questionAnswerOptional.isPresent()){
                    questionAnswers.add((QuestionAnswer) questionAnswerOptional.get());
                }
            }
            return questionAnswers;
    }

    public QuesAnsReqRes attemptQuestion(QuesAnsReqRes quesAnsReqRes, String email) {
        QuesAnsReqRes resp = new QuesAnsReqRes();

        try {
            AttemptedQuestion attemptedQuestion = new AttemptedQuestion();
            Optional questionAnswerOptional = questionAnswerRepo.findById(quesAnsReqRes.getQuestionId());

            attemptedQuestion.setResponse(quesAnsReqRes.getResponse());
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
            LocalDateTime now = LocalDateTime.now();
            attemptedQuestion.setAttemptDateTime(dtf.format(now));
            if(questionAnswerOptional.isPresent()){
                QuestionAnswer questionAnswer = (QuestionAnswer) questionAnswerOptional.get();
                attemptedQuestion.setQuestionAnswer(questionAnswer);
                if(questionAnswer.getAnswer().equals(quesAnsReqRes.getResponse())){
                    attemptedQuestion.setMarks(1);
                } else {
                    attemptedQuestion.setMarks(-1);
                }
            }
            Optional<OurUsers> userOptional = usersRepo.findByEmail(email);
            attemptedQuestion.setUserId(userOptional.get().getId());
            resp.setUserId(attemptedQuestion.getUserId());
            List<AttemptedQuestion> allAttemptedQuestions = attemptedQuestionRepo.findAll();

            for(AttemptedQuestion existingAttemptedQuestion : allAttemptedQuestions){
                if(existingAttemptedQuestion.getQuestionAnswer().getId() == attemptedQuestion.getQuestionAnswer().getId() && existingAttemptedQuestion.getUserId() == userOptional.get().getId()){
                    resp = new QuesAnsReqRes();
                    resp.setMessage("Question Already Attempted");
                    resp.setStatusCode(400);
                    return resp;
                }
            }


            AttemptedQuestion addedAttemptedQuestion = attemptedQuestionRepo.save(attemptedQuestion);

            // Added the attempted question to the user
            List<Integer> attemptedQuestionIds = new ArrayList<>(userOptional.get().getAttemptedQuestions());
            attemptedQuestionIds.add(addedAttemptedQuestion.getId());

            userOptional.get().setAttemptedQuestions(attemptedQuestionIds);
            OurUsers savedUser = usersRepo.save(userOptional.get());

            if (attemptedQuestion.getId()>0) {
                resp.setQuestion(attemptedQuestion.getQuestionAnswer().getQuestion());
                resp.setAnswer(attemptedQuestion.getQuestionAnswer().getAnswer());
                resp.setCourseId(attemptedQuestion.getQuestionAnswer().getCourseId());
                resp.setQuestionType(attemptedQuestion.getQuestionAnswer().getQuestionType());
                resp.setQuestionId(addedAttemptedQuestion.getQuestionAnswer().getId());
                resp.setResponse(addedAttemptedQuestion.getResponse());
                resp.setAttemptDateTime(addedAttemptedQuestion.getAttemptDateTime());
                resp.setMarks(addedAttemptedQuestion.getMarks());
                resp.setMessage("Question with Id " +resp.getQuestionId() + " Successfully attempted by the user with userId " + resp.getUserId());
                resp.setStatusCode(200);
            }

        }catch (Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public List<AttemptedQuestion> getAttemptedQuestionForCourse(Integer courseId, String email) {
        List<AttemptedQuestion> attemptedQuestionsForCourse = new ArrayList<>();
        Optional<OurUsers> userOptional = usersRepo.findByEmail(email);

        List<AttemptedQuestion> allAttemptedQuestions = attemptedQuestionRepo.findAll();
        for(AttemptedQuestion attemptedQuestion : allAttemptedQuestions){
            if(attemptedQuestion.getQuestionAnswer().getCourseId() == courseId && attemptedQuestion.getUserId() == userOptional.get().getId()){
                attemptedQuestionsForCourse.add(attemptedQuestion);
            }
        }
        return attemptedQuestionsForCourse;
    }

    public List<QuestionAnswer> getUnAttemptedQuestionForCourse(Integer courseId, String email) {

        Optional<Course> courseOptional = courseRepo.findById(courseId);
        List<Integer> questionsOfCourse = courseOptional.get().getQuestionAnswers();
        List<QuestionAnswer> masterQuestionAnswersForTheCourse = new ArrayList<>();
        List<QuestionAnswer> unattemptedQuestionAnswersForTheCourse = new ArrayList<>();
        for(Integer questionId : questionsOfCourse){
            Optional questionAnswerOptional = questionAnswerRepo.findById(questionId);
            if(questionAnswerOptional.isPresent()){
                masterQuestionAnswersForTheCourse.add((QuestionAnswer) questionAnswerOptional.get());
            }
        }

        List<QuestionAnswer> attemptedQuestionsForCourse = new ArrayList<>();
        Optional<OurUsers> userOptional = usersRepo.findByEmail(email);

        List<AttemptedQuestion> allAttemptedQuestions = attemptedQuestionRepo.findAll();
        for(AttemptedQuestion attemptedQuestion : allAttemptedQuestions){
            if(attemptedQuestion.getQuestionAnswer().getCourseId() == courseId && attemptedQuestion.getUserId() == userOptional.get().getId()){
                attemptedQuestionsForCourse.add(attemptedQuestion.getQuestionAnswer());
            }
        }
        attemptedQuestionsForCourse.stream()
                .filter(p1 -> masterQuestionAnswersForTheCourse.stream().anyMatch(p2 -> p1.getId().equals(p2.getId())))
                .forEach(masterQuestionAnswersForTheCourse::remove);
        return masterQuestionAnswersForTheCourse;

    }


}
