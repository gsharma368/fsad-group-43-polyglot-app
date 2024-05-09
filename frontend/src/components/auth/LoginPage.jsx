import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../service/UserService";
import classNames from 'classnames';


function LoginPage(){
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const navigate = useNavigate();
const [mode, setMode] = useState('login');

const changeMode = () => { 
    if(mode === 'login'){
        setMode('register');
    }else{
        setMode('login');
    }
}

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const userData = await UserService.login(email, password)
        console.log(userData)
        if (userData.token) {
            localStorage.setItem('token', userData.token)
            localStorage.setItem('role', userData.role)
            localStorage.setItem('currentContinueLearningCourse', null)
            navigate('/masterCourses')
        }else{
            alert(userData.message + ". Please use correct credentials.")
        }
        
    } catch (error) {
        console.log(error)
        setError(error.message)
        setTimeout(()=>{
            setError('');
        }, 5000);
    }
}

// Registration Code
const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN',
    city: ''
});

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

const handleSubmitRegister = async (e) => {
    e.preventDefault();
    try {
        // Call the register method from UserService

        const token = localStorage.getItem('token');
        await UserService.register(formData, token);

        // Clear the form fields after successful registration
        setFormData({
            name: '',
            email: '',
            password: '',
            role: '',
            city: ''
        });
        alert('User registered successfully. Please try loggin in again.');
        changeMode();
        navigate('/login');

    } catch (error) {
        console.error('Error registering user:', error);
        alert('An error occurred while registering user');
    }
};

/*    return(
        <div className="auth-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email: </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Password: </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    )
    */
   
        return (
            <div class="shadow p-3 w-50 mt-25 mx-auto mb-5 bg-white rounded">  
                <div className="row justify-content-center">
                    <div className="col-4">
                    <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                        <li className="nav-item" role="presentation">
                        <button className={classNames("nav-link", mode === "login" ? "active" : "")} id="tab-login"
                            onClick={changeMode}>Login</button>
                        </li>
                        <li className="nav-item" role="presentation">
                        <button className={classNames("nav-link", mode === "register" ? "active" : "")} id="tab-register"
                            onClick={changeMode}>Register</button>
                        </li>
                    </ul>

                    <div className="tab-content">
                        <div className={classNames("tab-pane", "fade", mode === "login" ? "show active" : "")} id="pills-login" >
                        <form onSubmit={handleSubmit}>
                            <div className="form-outline mb-4">
                                <label>Email: </label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="form-outline mb-4">
                                <label>Password: </label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <button type="submit">Login</button>
                        </form>
                        </div>
                        <div className={classNames("tab-pane", "fade", mode === "register" ? "show active" : "")} id="pills-register" >
                        <form onSubmit={handleSubmitRegister}>
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="name">Name:</label>
                                <input type="text" name="name" id="name" className="form-control" value={formData.name} onChange={handleInputChange} placeholder="Enter your name" required />
                            </div>
                            <div className="form-outline mb-4">
                                <label>Email:</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email" required />
                            </div>
                            <div className="form-outline mb-4">
                                <label>Password:</label>
                                <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Create a password" required />
                            </div>
                            
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="city">City:</label>
                                <input type="text" name="city" className="form-control" value={formData.city} onChange={handleInputChange} placeholder="Enter your city" required />
                            </div>
                            <button type="submit">Register</button>
                        </form>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        );
}

export default LoginPage;