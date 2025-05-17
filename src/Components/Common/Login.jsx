import React, { useState, useRef, useContext } from 'react'
import { newContext } from '../../Context/Context.jsx'
import './Error_msg.css'
import logo from '../../Assets/Logo/Job_Hunters_White_Small.png'
import axios from 'axios'
import toast from 'react-hot-toast'
// Call it to create a toast notification from anywhere, even outside React. Make sure you add the <Toaster/> component to your app first. 
// We've used <Toaster/> in our App.jsx
import { Link, useNavigate } from 'react-router-dom';
import Role from './Role.jsx'
import baseURL from '../../config.js'  

const Login = () => {
    axios.defaults.withCredentials = true;  // It allows axios to send cookies with the request, and also allows axios to receive cookies from the server,
    //  and store them in the browser under cookies. in Application tab of inspect element.

    // const { ID, setID } = useContext(newContext);       // this is used to set the id which is returned after userlogin, so that we can user that it in role component after nagigating to it, for forther setting of the role for that user/ID
    let [login, setLogin] = useState(true);
    let signup_btn = useRef();
    let signin_btn = useRef();
    const fn = useRef();
    const ln = useRef();
    const em = useRef();
    const pass = useRef();
    const ph = useRef();
    const role = useRef();

    let border = "border border-gray-500 rounded-md outline-none px-2 py-1 h-6 text-sm";
    let error_box = "Error max-h-[12px] float-right"
    const navigate = useNavigate();

    function changeCurrent(btn) {
        if (btn == "signin") {
            signin_btn.current.style.backgroundColor = "#3a4b9a"
            signin_btn.current.style.opacity = "1"

            signup_btn.current.style.backgroundColor = "gray"
            signup_btn.current.style.opacity = "0.4"

            setLogin(true);
        }
        else if (btn == "signup") {
            signup_btn.current.style.backgroundColor = "#3a4b9aed"
            signup_btn.current.style.opacity = "1"

            signin_btn.current.style.backgroundColor = "gray"
            signin_btn.current.style.opacity = "0.4"

            setLogin(false);
        }
        else { }
    }

    function patternTest(pattern, input, element) {
        if (!pattern.test(input)) {
            if (input == "") {
                element.nextElementSibling.nextElementSibling.innerText = "";
                return false;
            }
            else {
                element.nextElementSibling.nextElementSibling.classList.remove("NoError")
                element.nextElementSibling.nextElementSibling.innerText = "Invalid input";
                element.nextElementSibling.nextElementSibling.style.visibility = "visible";
                return false;
            }
        }
        else {
            element.nextElementSibling.nextElementSibling.classList.add("NoError")
            element.nextElementSibling.nextElementSibling.innerText = "OK";
            element.nextElementSibling.nextElementSibling.style.visibility = "visible";
            return true;
        }
    }

    const Check = (e, type) => {

        const fname_pattern = /^[a-zA-Z]+[a-zA-Z0-9]*$/;
        const lname_pattern = /^[a-zA-Z]+[a-zA-Z0-9]*$/;
        const email_pattern = /^[a-zA-Z]+[a-zA-Z0-9]*[@]{1}[a-zA-Z]+[.]{1}[a-zA-Z]+$/;
        const password_pattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/gm;
        const phone_pattern = /^[6-9]{1}[0-9]{9}$/;

        if (type == "signup") {
            // const fn_valid = patternTest(fname_pattern, e.target.children[2].value, e.target.children[2]);     //fname
            // const ln_valid = patternTest(lname_pattern, e.target.children[8].value, e.target.children[8]);     //lname
            // const em_valid = patternTest(email_pattern, e.target.children[14].value, e.target.children[14]);       //email
            // const pass_valid = patternTest(password_pattern, e.target.children[20].value, e.target.children[20]);     //password
            // const ph_valid = patternTest(phone_pattern, e.target.children[26].value, e.target.children[26]);      //phone
            const fn_valid = patternTest(fname_pattern, fn.current.value, fn.current);     //fname
            const ln_valid = patternTest(lname_pattern, ln.current.value, ln.current);     //lname
            const em_valid = patternTest(email_pattern, em.current.value, em.current);       //email
            const pass_valid = patternTest(password_pattern, pass.current.value, pass.current);     //password
            const ph_valid = patternTest(phone_pattern, ph.current.value, ph.current);      //phone

            return (fn_valid && ln_valid && em_valid && pass_valid && ph_valid);
        }
        else if (type == "login") {
            const em_valid = patternTest(email_pattern, e.target.children[2].value, e.target.children[2]);       //email
            const pass_valid = patternTest(password_pattern, e.target.children[8].value, e.target.children[8]);     //password

            return (em_valid && pass_valid);
        }
        else { }

    }

    const loginSubmit = async (e) => {

        e.preventDefault();

        const result = Check(e, "login");

        if (result) {
            console.log("Logging in...")
            const form_Data = new FormData(e.target);
            const data = Object.fromEntries(form_Data);
            console.log("data from form is: ", data);

            try {
                console.log("Base URL is : ", baseURL), " and full url is : ", `${baseURL}/login`;
                const response = await axios.post(`${baseURL}/login`, data);

                // console.log(response.headers.get('authorization'));  // This is how we get headers from the response in fetch API.
                const token = response.headers['authorization'].split('Bearer ')[1] // This is how we get headers from the response in axios.This is the authorization JWT token which we will store in the local storage.

                const authToken = localStorage.setItem('authToken', token);  // This is how we store the JWT token in the local storage.
                const userID = localStorage.setItem('JHUid', response.data.userID);  // This is how we store the userID in the local storage.

                if (response.status == "201") {
                    // setID(response.data.userID);    //Getting id from the response so that we can send that id to the role-selection component to set the role for that id.
                    // Commented above line because we are now storing the ID in the cookies, so that we can access it even after refreshing the page.
                    // The problem with context is that, it will lose the data after refreshing the page, so we need to store the data in cookies.

                    console.log("Logged in successfully");
                    toast.success(response.data.message);
                    // IF role exists, then navigate to user-dashboard, else navigate to role-selection
                    // if (!(response.data.role)) {
                    //     navigate('/role-selection', { replace: true });
                    // }
                    // else if (response.data.role == "employee") {
                    //     navigate('/user-dashboard', { replace: true });
                    // }
                    // else if (response.data.role == "admin") {
                    //     navigate('/admin-dashboard', { replace: true });
                    // }
                    // else { }

                    if (response.data.role == "employee") {
                        navigate('/user-home', { replace: true });
                    }
                    else if (response.data.role == "employer") {
                        navigate('/employer-dashboard', { replace: true });
                    }
                    else if (response.data.role == "admin") {
                        navigate('/admin-dashboard', { replace: true });
                    }
                    else {
                    }
                }
            }

            catch (error) {
                console.log("Error submitting form : ", error.message);
                toast.error("Error Submitting Form !");

                if (error.response) {
                    console.log("Error Response from backend: ", error.response.data.message);
                    toast.error(error.response.data.message);
                }
            }


        }
        else {
            console.log("Cannot Sign Up. Incorrect inputs");
        }
    }

    const signupSubmit = async (e) => {

        e.preventDefault();

        const result = Check(e, "signup");

        if (result) {
            console.log("Signing up...")
            const form_Data = new FormData(e.target);
            const data = Object.fromEntries(form_Data);
            // console.log("data from form is: ", data);
            // console.log(data)

            try {
                console.log("Base URL is : ", baseURL), " and full url is : ", `${baseURL}/signup`;

                const response = await axios.post(`${baseURL}/signup`, data);

                if (response.status == "201") {
                    console.log("Form submitted successfully");
                    toast.success(response.data.message);  // Creates a notification with an animated checkmark. It can be themed with the
                    // toast('Just toast() will show text like a normal message');

                    // toast.custom(<div>Hello World</div>); // Creates a custom notification with JSX without default styles.

                    // toast.loading('Waiting...');  // This will create a loading notification. Most likely, you want to update it afterwards. 
                    // For a friendly alternative, check out toast.promise(), which takes care of that automatically.

                    // const myPromise = fetchData();

                    /* toast.promise(myPromise, {
                           loading: 'Loading',
                           success: 'Got the data',
                           error: 'Error when fetching',
                       });
                    */

                    // Check toast function here :    https://react-hot-toast.com/docs/toast    
                    e.target.reset();
                    navigate('/', { replace: true });

                }
            }

            catch (error) {
                console.log("Error submitting form : ", error.message);
                toast.error("Error Submitting Form !");

                if (error.response) {     // This will contain the response from the server when the server sends a response with a non-2xx status code (like 400, 500 etc status code).
                    // In simple terms if backend sends status code 200 type of response, then it will be received in response variable while making post reques to backend
                    // But if response is other than success responses, (or maybe if catch block sends response), then in frontend they will be accessible in error.response
                    console.log("Error Response from backend: ", error.response.data.message);
                    toast.error(error.response.data.message);   // Creates a notification with an animated error icon. 
                    // navigate('/', { replace: true });
                }
            }
        }
        else {
            console.log("Cannot Sign up ! Invalid or Empty Fields...");
            toast.error("Cannot Sign up ! Invalid or Empty Fields...");
        }
    }



    return (
        <div className='flex justify-center items-center h-screen bg-gradient-to-br from-indigo-800 to-purple-800
 overflow-auto'>
            <div className='bg-white px-4 py-1.5 rounded-lg w-[28%] min-h-[40vh] flex flex-col justify-between border shadow-lg shadow-slate-900 ' >
                <div className='h-9.5 flex justify-center'>
                    <img src={logo} alt="Job Hunters Logo" className='h-full w-[78px]' />
                </div>


                {login ?

                    <form onSubmit={loginSubmit}>

                        <label htmlFor="email" className='text-sm'>Email </label> <br />
                        <input className={`${border} w-full`} type="email" name="email" placeholder='Email' /><br />
                        <span className={`${error_box}`}>Invalid input</span> <br />

                        <label htmlFor="fname" className='text-sm'>Password </label> <br />
                        <input className={`${border} w-full `} type="password" name="password" placeholder='Password' /> <br />
                        <span className={`${error_box}`}>Invalid input</span> <br />

                        <input style={{ backgroundColor: "#3a4b9a", color: "white" }} className={`rounded-md w-full py-1 cursor-pointer`} type="submit" value="Log In" />

                    </form>

                    :

                    <form onSubmit={signupSubmit}>

                        <div className='flex justify-between items-center gap-1'>
                            <div>
                                <label htmlFor="fname" className='text-sm'>First name </label><br />
                                <input className={`${border} w-full`} type="text" name="fname" placeholder='First Name' ref={fn} /><br />
                                <span className={`${error_box}`}>Invalid input</span><br />
                            </div>

                            <div>
                                <label htmlFor="lname" className='text-sm'>Last name </label><br />
                                <input className={`${border} w-full`} type="text" name="lname" placeholder='Last Name' ref={ln} /> <br />
                                <span className={`${error_box}`}>Invalid input</span> <br />
                            </div>
                        </div>

                        <label htmlFor="email" className='text-sm'>Email </label><br />
                        <input className={`${border} w-full`} type="email" name="email" placeholder='Email' ref={em} />  <br />
                        <span className={`${error_box}`}>Invalid input</span> <br />

                        <label htmlFor="password" className='text-sm'>Password </label> <br />
                        <input className={`${border} w-full`} type="password" name="password" placeholder='Password' ref={pass} /> <br />
                        <span className={`${error_box}`}>Invalid input</span> <br />

                        <label htmlFor="phone" className='text-sm'>Phone </label> <br />
                        <input className={`${border} w-full`} type="tel" name="phone" placeholder='Phone' ref={ph} /> <br />
                        <span className={`${error_box}`}>Invalid input</span> <br />

                        <label htmlFor="role" className='text-sm'>Select Role </label> <br />
                        <select name="role" id="" defaultValue="employee" className={`${border} w-full`} ref={role}>
                            <option value="employee">Employee</option>
                            <option value="employer">Employer</option>
                        </select> <br /><br />

                        <input style={{ backgroundColor: "#3a4b9a", color: "white" }} className={`rounded-md w-full py-1 cursor-pointer`} type="submit" value="Submit" />
                    </form>

                }

                <div className='my-1'><Link to='/forgot-password' className='text-blue-700 float-right'>Forgot Password?</Link></div>

                <div className='flex justify-between mt-3' style={{ backgroundColor: "whitesmoke" }}>
                    <button ref={signin_btn} style={{ backgroundColor: "#3a4b9a" }} className={`rounded-tl-md rounded-bl-md w-[50%] py-1 text-white`} onClick={() => { changeCurrent("signin") }}>Sign In</button>
                    <button ref={signup_btn} style={{ backgroundColor: "gray" }} className={`rounded-tr-md rounded-br-md w-[50%]  py-1 text-white opacity-40`} onClick={() => { changeCurrent("signup") }}>Sign Up</button>
                </div>


            </div>

            {/* <Role></Role> */}
        </div>
    )
}

export default Login
