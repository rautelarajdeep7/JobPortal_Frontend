import React, { useEffect, useState, useContext } from 'react'
import HeaderEmployee from './HeaderEmployee'
import toast from 'react-hot-toast'
import axios from 'axios';
import Cookies from 'js-cookie';
import { newContext } from '../../Context/Context'
import { Link, useNavigate } from 'react-router-dom';
import baseURL from '../../config.js'  

const Dashboard = () => {

    axios.defaults.withCredentials = true;  // It allows axios to send cookies with the request, and also allows axios to receive cookies from the server,
    //  and store them in the browser under cookies. in Application tab of inspect element.

    const [userData, set_userData] = useState();
    const [detailsOf, set_detailsOf] = useState("basic_details");
    const aside_btn_style = "cursor-pointer p-2 hover:bg-black hover:text-white duration-150";
    // const { ID } = useContext(newContext);
    // const UID = Cookies.get('JHUid'); // Commenting because now we will be getting user ID from local storage.
    const UID = localStorage.getItem("JHUid");
    const token = localStorage.getItem("authToken");

    const [previewImage, set_previewImage] = useState(null);
    const [previewResume, set_previewResume] = useState("No resume uploaded");


    // Once we are navigated to this page, we can see the data of the user through the ID stored in the context. 
    // But if we refresh the page, the ID will be lost and we will be redirected to the login page. So, we need to store the ID in the cookies so that we can access the ID even after refreshing the page.
    const navigate = useNavigate();

    // const id = "678e50c1f6005bbc4cdcdb26";
    const fetchUserData = async () => {

        if (!UID) {
            navigate('/', { replace: true });
            return;
        }
        try {
            console.log("ID is : ", UID)

            const response = await axios.get(`${baseURL}/user-dashboard/${UID}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            });
            if (response.status == "201") {
                console.log("User Data found");
                set_userData(response.data.user_data);
            }

        }

        catch (error) {
            console.log("Error fetching User data : ", error.message);
            toast.error("Error fetching User data !");

            if (error.response) {
                console.log("Error Response from backend: ", error.response.data.message);
                toast.error(error.response.data.message);

                if (error.response.status == "401") {
                    navigate('/', { replace: true });
                }

            }
        }
    }
    useEffect(() => {
        fetchUserData();
    }, [previewImage, previewResume])

    const uploadFile = async (e) => {
        e.preventDefault();
        const file = e.target.files[0]
        /*const form_Data = new FormData(e.target);
        // const data = Object.fromEntries(form_Data);
        form_Data.append('files', e.target.children[0].files);

        console.log(e.target.children[0].files);*/

        if (file) {

            if (file.type !== 'application/pdf') {
                set_previewImage(URL.createObjectURL(file));
            }
            else {
                set_previewImage(URL.createObjectURL(file));
            }

            const form_Data = new FormData();
            form_Data.append('files', file);

            try {
                const response = await axios.post(`${baseURL}/upload/${UID}`, form_Data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }

                )

                if (response.status == '201') {
                    if (file.type !== 'application/pdf') {
                        set_previewImage(response.data.path);
                        console.log("Image uploaded successfully");
                        toast.success("Image uploaded successfully");
                    }
                    else {
                        set_previewResume(response.data.path);
                        console.log("Resume uploaded successfully");
                        toast.success("Resume uploaded successfully");
                    }
                }

            }
            catch (error) {
                console.log("Error uploading file : ", error.message);
                toast.error("Error uploading file !");

                if (error.response) {
                    console.log("Error Response from backend: ", error.response.data.message);
                    toast.error(error.response.data.message);
                    if (error.response.status == "401" || error.response.status == "400") {
                        navigate('/', { replace: true });
                    }
                }

            }

        }

        // try {
        //     const response = await axios.post(`http://localhost:3000/api/upload/${UID}`, form_Data,

        //     )

        //     if (response.status == '201') {
        //         console.log("Image uploaded successfully");
        //         toast.success("Image uploaded successfully");
        //     }

        // }
        // catch (error) {
        //     console.log("Error uploading image : ", error.message);
        //     toast.error("Error uploading image !");

        //     if (error.response) {
        //         console.log("Error Response from backend: ", error.response.data.message);
        //         toast.error(error.response.data.message);
        //     }

        // }
    }

    return (
        <>
            <header>

                <HeaderEmployee />

            </header>

            <div className='MainContent flex min-h-[92.7vh]'>
                <div className='AsideBar w-[15%] bg-gradient-to-br to-indigo-200 from-purple-200'>
                    <div className={`${aside_btn_style}`} onClick={() => { set_detailsOf("basic_details") }}>Basic Details</div>
                    <div className={`${aside_btn_style}`} onClick={() => { set_detailsOf("skills") }}>Skills</div>
                    <div className={`${aside_btn_style}`} onClick={() => { set_detailsOf("employment") }}>Employment</div>
                    <div className={`${aside_btn_style}`} onClick={() => { set_detailsOf("education") }}>Education</div>
                    <div className={`${aside_btn_style}`} onClick={() => { set_detailsOf("projects") }}>Projects</div>
                    <div className={`${aside_btn_style}`} onClick={() => { set_detailsOf("personal_details") }}>Personal</div>
                    <div className={`${aside_btn_style}`} onClick={() => { set_detailsOf("applied_jobs") }}>Applied Jobs</div>

                </div>
                <div className='ContentBox w-full  bg-white px-4 py-2'>

                    <div className='bg-gray-100 w-full rounded-xl p-6'>
                        {
                            detailsOf == "basic_details" ?
                                <>
                                    <div className='w-[10rem] h-[10rem] bg-gray-100 border border-slate-950 rounded-full flex justify-center  items-center text-gray-700 text-xs overflow-hidden relative hover:opacity-50 group'>
                                        <div className='w-[10rem] h-[10rem] absolute flex justify-center items-center hidden group-hover:block'>Click to change</div>
                                        <img src={userData?.profile_img ? userData.profile_img : previewImage} alt="No image" className='h-full object-cover' />
                                        <i className='fa-solid fa-camera absolute text-base text-black bottom-6 right-6 cursor-pointer' onClick={() => document.querySelector('input[type="file"]').click()} > </i>
                                    </div>

                                    {/* <form action={`http://localhost:3000/api/upload/${UID}`} method="POST" encType='multipart/form-data'> */}

                                    {/* <form onSubmit={uploadImage} encType='multipart/form-data'> */}
                                    <input type="file" name="files" accept='image/png , image/jpg , image/jpeg' className='text-xs hidden' onChange={uploadFile} />

                                    <input type="file" name="files" accept='application/pdf' className='text-xs hidden' onChange={uploadFile} />
                                    <i className="fa-solid fa-file-arrow-up cursor-pointer text-red-700" onClick={() => document.querySelectorAll('input[type="file"]')[1].click()}></i> <a href={userData?.resume ? userData.resume : ""} target='_blank' className='text-xs text-blue-500 '>{userData?.resume ? "View" : ""}</a> <br /> <br /> <hr /> <br />
                                    {/* <button type='submit' className='border bg-blue-600 text-white px-1 py-1 text-xs mt-1'>Upload</button> */}
                                    {/* </form> <br /> */}

                                    First name : {userData?.fname} &nbsp; &nbsp; &nbsp; &nbsp;
                                    Last Name :  {userData?.lname} <br /> <br />
                                    Email :  {userData?.email} <br /> <br />
                                    Phone No. :  {userData?.phone} <br /> <br />
                                </> :

                                ""
                        }
                        {
                            detailsOf == "skills" ?
                                <>
                                    Skills : {userData?.skills} &nbsp; &nbsp; &nbsp; &nbsp;
                                </> :

                                ""
                        }

                        {
                            detailsOf == "employment" ?
                                <>
                                    Current Employment : {userData?.current_emp} <br /> <br />
                                    Previous Employment : {userData?.previous_emp} <br /> <br />

                                </> :

                                ""
                        }

                        {
                            detailsOf == "education" ?
                                <>
                                    Graduation : {userData?.graduation} <br /> <br />
                                    Post Graduation : {userData?.post_graduation} <br /> <br />
                                    Intermediate : {userData?.intermediate} <br /> <br />
                                    High School : {userData?.high_school} <br /> <br />
                                </> :

                                ""
                        }

                        {
                            detailsOf == "projects" ?
                                <>
                                    Projects : {userData?.projects}
                                </> :

                                ""
                        }

                        {
                            detailsOf == "personal_details" ?
                                <>
                                    Mobile : {userData?.phone} <br /> <br />
                                    Secondary : {userData?.phone_secondary} <br /> <br />
                                    Email : {userData?.email} <br /> <br />
                                    Address : {userData?.address} <br /> <br />
                                </> :

                                ""
                        }
                        {
                            detailsOf == "applied_jobs" ?
                                <>
                                </> :

                                ""
                        }

                    </div>



                </div>
            </div>

        </>
    )
}

export default Dashboard
