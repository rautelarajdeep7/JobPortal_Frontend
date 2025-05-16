import React, { useState, useRef, useContext } from 'react'
import { newContext } from '../../Context/Context'
import { useNavigate } from 'react-router-dom'
import logo from '../../Assets/Logo/Job_Hunters_White_Small.png'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie';
import axios from 'axios'
import { baseURL } from '../../Config/Config'
const Role = () => {

    axios.defaults.withCredentials = true;  // It allows axios to send cookies with the request, and also allows axios to receive cookies from the server,
    //  and store them in the browser under cookies. in Application tab of inspect element.

    const employee = useRef();
    const employer = useRef();
    const [role, setRole] = useState();
    const [inputRole, setInputRole] = useState();
    const navigate = useNavigate();
    // const { ID } = useContext(newContext);
    let border = "border border-gray-500 rounded-md outline-none px-2 py-1";
    // const UID = Cookies.get('JHUid'); // Commenting because now we will be getting user ID from local storage.
    const UID = localStorage.getItem("JHUid");


    function changeCurrent(btn) {
        if (btn == "employee") {
            employee.current.style.backgroundColor = "#3a4b9a"
            employee.current.style.opacity = "1"

            employer.current.style.backgroundColor = "gray"
            employer.current.style.opacity = "0.4"

            setRole(() => btn);
        }
        else if (btn == "employer") {
            employer.current.style.backgroundColor = "#3a4b9aed"
            employer.current.style.opacity = "1"

            employee.current.style.backgroundColor = "gray"
            employee.current.style.opacity = "0.4"

            setRole(() => btn);
        }
        else { }

    }

    const fixInputRole = (e) => {
        const role_val = (e.target.value).toLowerCase();
        setInputRole(() => role_val);
        console.log(inputRole);
    }

    const setRoleSubmit = async (e) => {
        e.preventDefault();

        // const form_Data = new FormData(e.target);
        // const data = Object.fromEntries(form_Data);

        if (!(inputRole == role)) {
            toast.error("Selected button and input mismatch");
        }
        else {
            try {
                const response = await axios.get(`${baseURL}/roleSetup/${role}/${UID}`, {
                    headers: {
                        "authorization": `Bearer ${localStorage.getItem("authToken")}`  // Sending the authToekn in the headers to authenticate the user in backend before accessing the protected route.
                    }
                });

                if (response.status == "201") {
                    console.log("Role added successfully !");
                    toast.success("Role added successfully !");
                    navigate('/user-dashboard', { replace: true });
                }

                else { }
            }
            catch (error) {
                console.log("Error adding role : ", error.message);
                toast.error("Error adding role !");

                if (error.response) {
                    console.log("Error Response from backend: ", error.response.data.message);
                    toast.error(error.response.data.message);

                    if (error.response.status == "401") {
                        navigate('/', { replace: true });
                    }
                }
            }
        }


    }


    return (
        <div className='flex justify-center items-center h-screen bg-gradient-to-br from-indigo-800 to-purple-800
 overflow-auto'>

            <div className='flex flex-col justify-center items-center gap-8 w-80 h-80 bg-white p-4 rounded-md'>
                <div className='h-9.5 flex justify-center'>
                    <img src={logo} alt="Job Hunters Logo" className='h-full w-[78px]' />
                </div>

                <div className='flex-col justify-between mt-3 w-[100%]' style={{ backgroundColor: "whitesmoke" }}> {/* "#3a4b9a" */}
                    <button ref={employee} style={{ backgroundColor: "gray" }} className={`rounded-tl-full rounded-bl-full w-[50%] py-2 text-white opacity-40`} onClick={() => { changeCurrent("employee") }}>Employee</button>
                    <button ref={employer} style={{ backgroundColor: "gray" }} className={`rounded-tr-full rounded-br-full w-[50%]  py-2 text-white opacity-40`} onClick={() => { changeCurrent("employer") }}>Employer</button>
                </div>

                <form className='flex flex-col gap-8' onSubmit={setRoleSubmit}>

                    <div>
                        <label htmlFor="role">Type your selection :</label>
                        <input name="role" type="text" placeholder='Employee or Employer ? ' className={`${border} w-full placeholder`} onChange={fixInputRole} />
                    </div>

                    <div>
                        <input style={{ backgroundColor: "#3a4b9a", color: "white" }} className={`rounded-md w-28 py-1 cursor-pointer w-full`} type="submit" value="Confirm" />
                    </div>
                </form>
            </div>

        </div>
    )
}

export default Role
