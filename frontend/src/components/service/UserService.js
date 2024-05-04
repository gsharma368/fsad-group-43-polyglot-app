import axios from "axios";

class UserService{
    static BASE_URL = "http://localhost:1010"

    static async login(email, password){
        try{
            const response = await axios.post(`${UserService.BASE_URL}/auth/login`, {email, password})
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async register(userData, token){
        try{
            const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getAllUsers(token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-all-users`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }


    static async getYourProfile(token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/adminuser/get-profile`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getUserById(userId, token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-users/${userId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async deleteUser(userId, token){
        try{
            const response = await axios.delete(`${UserService.BASE_URL}/admin/delete/${userId}`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }


    static async updateUser(userId, userData, token){
        try{
            const response = await axios.put(`${UserService.BASE_URL}/admin/update/${userId}`, userData,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async updateProfile(userData, token){
        try{
            const response = await axios.put(`${UserService.BASE_URL}/user/update/`, userData,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getAllCourses(token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/get-all-courses`,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getMyCourses(token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/get-my-courses`,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getMyProgress(token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/get-my-progress`,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
    
    static async getMyCoursesById(courseId, token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/get-course/${courseId}`,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    
    static async enrollInCourse(courseId, token){
        try{
            const response = await axios.post(`${UserService.BASE_URL}/course/${courseId}/enroll`, courseId,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async unenrollFromThisCourseButton(courseId, token){
        try{
            const response = await axios.put(`${UserService.BASE_URL}/course/${courseId}/unenroll`, courseId,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }


    static async getMasterQuestionsForThisCourse(courseId, token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/course/${courseId}/get-questions`,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }
    
    static async getUnattemptedQuestionsForThisCourse(courseId, token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/get-unattempted-question-for-course/${courseId}`,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }


    static async getAttemptedQuestionsForThisCourse(courseId, token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/get-attempted-question-for-course/${courseId}`,
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async attemptThisQuestion(questionId, response, token){
        
        try{
            const response1 = await axios.post(`${UserService.BASE_URL}/attempt-question`, {questionId, response},
            {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response1.data;
        }catch(err){
            throw err;
        }
    }

    /**AUTHENTICATION CHECKER */
    static logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.setItem('currentContinueLearningCourse', null)
        localStorage.removeItem('currentContinueLearningCourse')
    }

    static isAuthenticated(){
        const token = localStorage.getItem('token')
        return !!token
    }

    static currentContinueLearningCourse(){
        const currentContinueLearningCourse = localStorage.getItem('currentContinueLearningCourse')
        return currentContinueLearningCourse
    }

    static isAdmin(){
        const role = localStorage.getItem('role')
        return role === 'ADMIN'
    }

    static isUser(){
        const role = localStorage.getItem('role')
        return role === 'USER'
    }

    static adminOnly(){
        return this.isAuthenticated() && this.isAdmin();
    }

}

export default UserService;