import React from 'react'
import { useRef } from 'react'
import './Error_msg.css'
import logo from '../../Assets/Logo/Job_Hunters_White_Small.png'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
import baseURL from '../../config.js'  

const ForgotPassword = () => {
    let border = "border border-gray-500 rounded-md outline-none px-2 py-1";
    let error_box = "Error min-h-[1rem] float-right";
    let otp_box = "w-8 h-9 border border-black rounded-sm  text-center";
    let emailBOx = useRef();
    let otpBox = useRef();
    let passwordBox = useRef();
    let passwordInput = useRef();
    const navigate = useNavigate();

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

    const Check = (e) => {

        const email_pattern = /^[a-zA-Z]+[a-zA-Z0-9]*[@]{1}[a-zA-Z]+[.]{1}[a-zA-Z]+$/;

        const em_valid = patternTest(email_pattern, e.target.children[0].children[2].value, e.target.children[0].children[2]);

        return (em_valid);

    }

    const changePassword = async (e) => {

        e.preventDefault();

        const btn_pressed = e.nativeEvent.submitter.value;

        if (btn_pressed == "Send OTP") {
            const result = Check(e);

            if (result) {
                console.log("Sending OTP...")
                const form_Data = new FormData(e.target);
                const data = Object.fromEntries(form_Data);

                try {
                    const response = await axios.get(`${baseURL}/forgot-password/${data.email}`);

                    if (response.status == "201") {
                        otpBox.current.classList.remove('pointer-events-none', 'hidden', 'opacity-50')
                        emailBOx.current.classList.add('pointer-events-none', 'opacity-50') // Making it unaccessible if email entered is correct so 
                        // that user does not change the email while otp or password box is made available to be filled.
                        console.log("OTP send successfully");
                        toast.success(response.data.message);
                    }
                    else if (response.status == "404") {
                        console.log("User not found");
                        toast.error(response.data.message);
                    }
                }

                catch (error) {
                    console.log("Error sending OTP : ", error.message);
                    toast.error("Error sending OTP !");

                    if (error.response) {
                        console.log("Error Response from backend: ", error.response.data.message);
                        toast.error(error.response.data.message);
                    }
                }
            }
            else {
                console.log("Cannot Send OTP ! Invalid or Empty Fields...");
                toast.error("Cannot Send OTP ! Invalid or Empty Fields...");
            }
        }

        else if (btn_pressed == "Confirm") {
            const form_Data = new FormData(e.target);
            const data = Object.fromEntries(form_Data);
            const otp_inputs = "" + data.digit1 + data.digit2 + data.digit3 + data.digit4;

            try {
                const response = await axios.get(`${baseURL}/forgot-password-otp-verify/${otp_inputs}/${data.email}`);

                if (response.status == "201") {
                    passwordBox.current.classList.remove('pointer-events-none', 'hidden', 'opacity-50')
                    otpBox.current.classList.add('pointer-events-none', 'opacity-50') // Making it unaccessible if otp entered is correct so 
                    // that user does not change the email while otp or password box is made available to be filled
                    console.log("OTP verified successfully");
                    toast.success(response.data.message);
                }

                else if (response.status == "404") {
                    console.log("OTP Verificaion failed !");
                    toast.error(response.data.message);
                }

            }

            catch (error) {
                console.log("Incorrect OTP entered : ", error.message);
                toast.error("Incorrect OTP entered !");

                if (error.response) {
                    console.log("Error Response from backend: ", error.response.data.message);
                    toast.error(error.response.data.message);
                }
            }

        }

        else if (btn_pressed == "Submit") {
            const form_Data = new FormData(e.target);
            const data = Object.fromEntries(form_Data);

            if (data.password) {      // run the condition only if password is not empty
                try {
                    const response = await axios.post(`${baseURL}/changePassword/`, data);

                    if (response.status == "201") {
                        // passwordBox.current.classList.add('pointer-events-none', 'opacity-50')  // Not required actually as the user will get redirected immediately
                        console.log("Password changed successfully");
                        toast.success(response.data.message);
                        navigate('/password-changed', { replace: true });
                    }

                    else if (response.status == "400") {
                        console.log("Email is required !");
                        toast.error(response.data.message);
                    }

                    else if (response.status == "404") {
                        console.log("User not found !");
                        toast.error(response.data.message);
                    }
                    else { }

                }

                catch (error) {
                    console.log("Password not changed : ", error.message);
                    toast.error("Password not chnaged !");

                    if (error.response) {
                        console.log("Error Response from backend: ", error.response.data.message);
                        toast.error(error.response.data.message);
                    }
                }
            }

            else {
                toast.error("Password cannot be empty ! ")
            }

        }

    }

    const CheckNAN = (e) => {
        const target = e.target;
        const val = target.value;

        if (isNaN(val))          // if value which we input is not a number, then put empty string in the input field.
        {
            target.value = "";
            return;
        }

        if (val != "")           // if the input field is not empty (also if it is a number(as we have checked for it earlier), then focus on next input field. )
        {
            const next = target.nextElementSibling;
            if (next) {
                next.focus();
            }
        }

    }

    const checkKey = (e) => {
        const target = e.target;
        const key = e.key.toLowerCase();

        if (key == "backspace" || key == "delete") {        // if delete or backspace key is pressed, then empty that input and focus to previous input.
            target.value = "";
            const prev = target.previousElementSibling;
            if (prev) {
                console.log(prev)
                prev.focus();
            }
            return;
        }
    }
    const showPassword = () => {
        passwordInput.current.type = 'text'; // Change input type to text
    }

    // Function to hide the password
    const hidePassword = () => {
        passwordInput.current.type = 'password'; // Change input type to password
    }



    return (
        <div className='flex justify-center items-center h-screen bg-gradient-to-br from-indigo-800 to-purple-800
    overflow-auto'>
            <div className='bg-white px-4 py-1.5 rounded-lg w-[28%] min-h-[30vh] flex flex-col justify-between border shadow-lg shadow-slate-900 ' >
                <div className='h-9.5 flex justify-center'>
                    <img src={logo} alt="Job Hunters Logo" className='h-full w-[78px]' />
                </div>

                <form onSubmit={changePassword} >

                    <div ref={emailBOx}>
                        <label htmlFor="email" className='text-sm'>Email </label><br />
                        <input ref={emailBOx} className={`${border} w-full`} type="email" name="email" placeholder='Email' /> <br />
                        <span className={`${error_box}`}>Invalid input</span> <br />
                        <input style={{ backgroundColor: "#3a4b9a", color: "white" }} className={`rounded-md w-full py-1 cursor-pointer`} type="submit" value="Send OTP" />
                    </div>


                    <div ref={otpBox} className='pointer-events-none opacity-50 hidden'>
                        <div className='flex w-full justify-center gap-1.5 mt-6'>
                            <input type="text" name="digit1" maxLength="1" className={`${otp_box}`} onInput={CheckNAN} onKeyUp={checkKey} />
                            <input type="text" name="digit2" maxLength="1" className={`${otp_box}`} onInput={CheckNAN} onKeyUp={checkKey} />
                            <input type="text" name="digit3" maxLength="1" className={`${otp_box}`} onInput={CheckNAN} onKeyUp={checkKey} />
                            <input type="text" name="digit4" maxLength="1" className={`${otp_box}`} onInput={CheckNAN} onKeyUp={checkKey} />
                        </div>

                        <div className='flex justify-center mt-2'>
                            <input style={{ backgroundColor: "#3a4b9a", color: "white" }} className={`rounded-md w-full py-1 cursor-pointer`} type="submit" value="Confirm" />
                        </div>
                    </div>


                    <div ref={passwordBox} className='pointer-events-none opacity-50 mt-6 hidden'>
                        <label htmlFor="fname" className='text-sm'>New Password </label> <br />
                        <div className={`flex gap-1 ${border} w-full `}>
                            <input ref={passwordInput} className='w-full outline-none' type="password" pattern="^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$" name="password" placeholder='New Password' title="Password must be 8-16 characters long, include at least one uppercase and one lowercase letter, one number and one special character." /> <br />

                            <button type="button" onMouseDown={showPassword} onMouseUp={hidePassword} onMouseLeave={hidePassword}><i className="fa-solid fa-eye text-base"></i> </button>
                        </div>
                        <input style={{ backgroundColor: "#3a4b9a", color: "white" }} className={`rounded-md w-full py-1 cursor-pointer mt-2`} type="submit" value="Submit" />

                    </div>

                </form>

            </div>
        </div>
    )
}

export default ForgotPassword
