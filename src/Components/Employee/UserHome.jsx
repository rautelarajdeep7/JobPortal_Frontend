import React, { useState, useEffect } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom';
import baseURL from '../../config';

import HeaderEmployee from './HeaderEmployee'
import AsideBar from './AsideBar'
const UserHome = () => {
  axios.defaults.withCredentials = true;  // It allows axios to send cookies with the request, and also allows axios to receive cookies from the server,
  //  and store them in the browser under cookies. in Application tab of inspect element.
  const navigate = useNavigate();

  const [userData, set_userData] = useState();
  const [applied, setApplied] = useState(false);

  const aside_btn_style = "cursor-pointer p-2 hover:bg-black hover:text-white duration-150";

  const UID = localStorage.getItem("JHUid");
  const token = localStorage.getItem("authToken");
  const [allJobs, setAllJobs] = useState([]);


  const fetchUserData = async () => {

    if (!UID) {
      navigate('/', { replace: true });
      return;
    }
    try {
      console.log("ID is : ", UID)

      const response = await axios.get(`${baseURL}user-dashboard/${UID}`, {
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
  }, [applied])

  const fetchJobs = async () => {

    if (!UID) {
      navigate('/', { replace: true });
      return;
    }
    try {

      const response = await axios.get(`${baseURL}/suggested-jobs/${UID}`, {
        headers: {
          'authorization': `Bearer ${token}`
        }
      });
      if (response.status == "201") {
        // console.log("User Data found");
        setAllJobs(response.data.jobs);
        console.log("Jobs fetched successfully");
      }

    }

    catch (error) {
      console.log("Error fetching jobs: ", error.message);
      toast.error("Error fetching jobs !");

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
    fetchJobs();
  }, [])

  const apply = async (jobID) => {

    if (!UID) {
      navigate('/', { replace: true });
      return;
    }
    try {

      // const response = await axios.post(`http://localhost:3000/api/apply/${UID}/${jobID}`, {
      //   headers: {
      //     'authorization': `Bearer ${token}`
      //   }
      // });

      const response = await axios.post(`${baseURL}/apply/${UID}/${jobID}`, {}, {
        headers: {
          'authorization': `Bearer ${token}`
        }
      });

      if (response.status == "201") {
        console.log("Applied successfully");
        setApplied(!applied);
        // setApplied has ! applied because it will change the state of applied and re-render the component. because for it to re-render the component, the state should change.
        // If we don't change the state OR if we use run the setApplied with same value, then it will not trigger useEffect as there is no change in state in actual.
      }

    }

    catch (error) {
      console.log("Error Applying job: ", error.message);
      toast.error("Error Applying job !");

      if (error.response) {
        console.log("Error Response from backend: ", error.response.data.message);
        toast.error(error.response.data.message);

        if (error.response.status == "401") {
          navigate('/', { replace: true });
        }
      }

    }



  }


  return (
    <div>


      <header>
        <HeaderEmployee />
      </header>

      <div className='flex'>    {/* Everything after the header */}

        <AsideBar />   {/* Aside Bar */}

        <div className='w-full p-8'>  {/* Main Content */}
          <div className='text-lg'>Suggested Jobs</div> <br />
          <hr /> <br />

          <div className='flex justify-center items-center gap-2 flex-wrap'>
            {

              allJobs.map((job) => {
                const curr_date = new Date();
                const job_date = new Date(job.createdAt);
                const diff_time = Math.abs(curr_date - job_date);
                const diff_calculate = ()=>{
                    const days = Math.floor(diff_time / (1000 * 60 * 60 * 24)); // converting milliseconds to days
                    if(days<1){
                        const hours = Math.floor(diff_time / (1000 * 60 * 60)); // converting milliseconds to hours
                        if(hours<1){
                            const minutes = Math.floor(diff_time / (1000 * 60)); // converting milliseconds to minutes
                            return `${minutes} min ago`;
                        }
                        return `${hours} hr ago`;   
                    }
                    return `${days} days ago`;
                    
                }


                return (
                  <div key={job._id} className='border border-gray-300 bg-white p-4 rounded-md w-[32%] h-[190px] shadow-md shadow-black flex flex-col gap-2'>

                    <div className='text-lg font-semibold text-blue-600'>{job.designation}</div>
                    <hr />
                    <div className='text-base font-normal'>{job.organization}</div>
                    <div className='text-sm flex justify-between'><div><i className="fa-solid fa-timeline"></i> {job.experience} yr.</div> <div><i className="fa-solid fa-indian-rupee-sign"></i> {job.salary}</div> <div><i className="fa-solid fa-location-dot"></i> {job.location}</div></div>
                    <div className='text-sm'><i className="fa-solid fa-briefcase"></i> {job.work_mode}</div>

                    <div className='flex justify-between'>
                      {/* <button className='bg-green-500 text-white rounded-md flex justify-center items-center w-28 py-0.5 text-sm' onClick={() => { apply(job._id) }}>Apply</button> */}
                      <div className='text-xs'>{diff_calculate()}</div>
                      {userData?.appliedJobs.includes(job._id) ? <button disabled className='bg-gray-400 opacity-50 text-white rounded-md flex justify-center items-center w-28 py-0.5 text-sm'>Applied</button> : <button className='bg-green-500 text-white rounded-md flex justify-center items-center w-28 py-0.5 text-sm' onClick={() => { apply(job._id) }}>Apply</button>}
                    </div>
                  </div>
                )
              })

            }
          </div>


        </div>
      </div>


    </div>
  )
}

export default UserHome
