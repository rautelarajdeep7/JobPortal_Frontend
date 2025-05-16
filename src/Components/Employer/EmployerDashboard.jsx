import React, { useEffect, useState, useRef, useContext } from 'react'
import HeaderEmployer from './HeaderEmployer'
import toast from 'react-hot-toast'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import SalaryRangeSelector from '../Extra/SalaryRangeSelector';

const EmployerDashboard = () => {
    axios.defaults.withCredentials = true;  // It allows axios to send cookies with the request, and also allows axios to receive cookies from the server,
    //  and store them in the browser under cookies. in Application tab of inspect element.
    const navigate = useNavigate();

    const aside_btn_style = "cursor-pointer p-2 py-2.5 hover:bg-gray-400 hover:text-black duration-150 text-sm font-semibold text-gray-700 rounded-r-full my-1";

    const [userData, set_userData] = useState();
    const [allJobs, setAllJobs] = useState([]);
    const [detailsOf, set_detailsOf] = useState("created_jobs");
    const [skill_array, set_skillArray] = useState([]);
    const [applicants, set_applicants] = useState([]);

    const skillRef = useRef();

    const [min_exp, set_min_exp] = useState("");
    const [max_exp, set_max_exp] = useState("");

    const [min_sal, set_min_sal] = useState("");
    const [max_sal, set_max_sal] = useState("");

    const applicantBox = useRef();

    const UID = localStorage.getItem("JHUid");
    const token = localStorage.getItem("authToken");
    const industries = [
        "Information Technology & Services",
        "Manufacturing",
        "Construction & Real Estate",
        "Energy (Oil, Gas, Renewable)",
        "Automotive",
        "Aerospace & Defense",
        "Telecommunications",
        "Electronics & Semiconductors",
        "Chemicals & Petrochemicals",
        "Banking",
        "Financial Services",
        "Accounting & Auditing",
        "Insurance",
        "Consulting",
        "Legal Services",
        "Human Resources & Recruitment",
        "Marketing & Advertising",
        "Pharmaceuticals",
        "Hospitals & Healthcare",
        "Research & Development",
        "EdTech",
        "E-learning",
        "E-commerce",
        "Food & Beverage",
        "Hospitality"
    ];
    const founded_years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1000; i--) {
        founded_years.push(i);
    }


    const getJob = useEffect(() => {

        async function getJobs() {
            try {
                const response = await axios.get(`http://localhost:3000/api/all-jobs/${UID}`, {
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
                });

                if (response.status == "201") {
                    setAllJobs(response.data.allJobs);
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
        getJobs();

    }, [])

    const createJob = async (e) => {
        e.preventDefault();
        console.log("Creating Job");

        const form_Data = new FormData(e.target);
        // form_Data.append("skills", JSON.stringify(skill_array));

        let data = Object.fromEntries(form_Data);

        data = { ...data, skills: skill_array };

        try {
            const response = await axios.post(`http://localhost:3000/api/create-job/${UID}`, data, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            });

            if (response.status == "201") {
                console.log("Job Created successfully");
                e.target.reset();
                set_skillArray([]);
                // skill_array.length=0;
                console.log(response.data.job)
                setAllJobs((prev) => { prev.push(response.data.job); return prev });

                toast.success(response.data.message);
            }

        }
        catch (error) {
            console.log("Error creating job: ", error.message);
            toast.error("Error creating job !");

            if (error.response) {
                console.log("Error Response from backend: ", error.response.data.message);
                toast.error(error.response.data.message);

                if (error.response.status == "401") {
                    navigate('/', { replace: true });
                }
            }

        }



        console.log(data);
    }

    const seeApplications = async (jobID) => {

        if (!UID) {
            navigate('/', { replace: true });
            return;
        }
        try {

            const response = await axios.get(`http://localhost:3000/api/see-applications/${jobID}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            });
            console.log(response.status)

            if (response.status == "201") {     // geting 200 status code for first job in employer dashboard but 201 for third job
                console.log(response.data.applications);
                set_applicants(response.data.applications);
                applicantBox.current.classList.toggle("hidden");
                console.log("Applications fetched successfully");
            }

        }

        catch (error) {
            console.log("Error fetching applications: ", error.message);
            toast.error("Error fetching applications !");

            if (error.response) {
                console.log("Error Response from backend: ", error.response.data.message);
                toast.error(error.response.data.message);

                if (error.response.status == "401") {
                    navigate('/', { replace: true });
                }
            }

        }



    }

    const add_skills = () => {
        if (skillRef.current.value.trim() == "") { // if the input field is empty, do not add it to the array
            return;
        }

        if (skill_array.includes(skillRef.current.value.trim())) { // if the skill is already in the array, do not add it again
            return;
        }

        // set_skillArray((prev) => { prev.push(skillRef.current.value.trim()); return prev }); // It is not working as pushing to state array does not work properly. 
        set_skillArray([...skill_array, skillRef.current.value.trim()]);
        console.log(skill_array)
        skillRef.current.value = "";
    }

    const remove_skills = (skill) => {
        set_skillArray((prev) => { return prev.filter((item) => { return item != skill }) });
        // filter method returns a new array with the elements that pass the condition in the callback function.
        // since it returns a new array and does not modify the original array, we can use it to remove elements from an array unlike push method 
        // which does not work properly.
    }

    const handle_MinExp = (e) => {
        if (Number(e.target.value) < 0 || e.target.value == "-0" || Number(e.target.value) > 30) {
            set_min_exp("");
        }
        else {
            set_min_exp(e.target.value);
            if (Number(e.target.value) > max_exp) {
                set_max_exp(e.target.value);
            }
        }

    }
    const handle_MaxExp = (e) => {
        if (Number(e.target.value) < 0 || e.target.value == "-0") {
            set_max_exp("");
        }
        else if (Number(e.target.value) > 30) {
            set_max_exp(30);
        }
        else {
            set_max_exp(e.target.value);
            if (Number(e.target.value) < min_exp) {
                set_min_exp(e.target.value);
            }
        }


    }

    const handle_MinSal = (e) => {
        if (Number(e.target.value) < 0 || e.target.value == "-0" || Number(e.target.value) > 99) {
            set_min_sal("");
        }
        else {
            set_min_sal(e.target.value);
            if (Number(e.target.value) > max_exp) {
                set_max_sal(e.target.value);
            }
        }
    }

    const handle_MaxSal = (e) => {
        if (Number(e.target.value) < 0 || e.target.value == "-0") {
            set_max_sal("");
        }
        else if (Number(e.target.value) > 99) {
            set_max_sal(99);
        }
        else {
            set_max_sal(e.target.value);
            if (Number(e.target.value) < min_exp) {
                set_min_sal(e.target.value);
            }
        }
    }


    return (
        <div>
            {/* <SalaryRangeSelector></SalaryRangeSelector> */}

            <header>
                <HeaderEmployer />
            </header>

            <div className='MainContent flex min-h-[92.7vh] '>
                {/* min-h-screen */}
                <div className='AsideBar w-[15%] bg-[rgb(216,216,231)] from-purple-200'>
                    <div className={`${aside_btn_style} ${detailsOf === "created_jobs" ? "bg-gray-800 text-white" : ""}`} onClick={() => { set_detailsOf("created_jobs") }}>Created Jobs</div>
                    <div className={`${aside_btn_style} ${detailsOf === "profile" ? "bg-gray-800 text-white" : ""}`} onClick={() => { set_detailsOf("profile") }}>Profile</div>
                    <div className={`${aside_btn_style} ${detailsOf === "create_job" ? "bg-gray-800 text-white" : ""}`} onClick={() => { set_detailsOf("create_job") }}>Create Jobs</div>
                </div>

                <div className='ContentBox w-full bg-gray- px-4 py-2 '>

                    <div className='fixed top-16 left-[38%] w-[24%] max-h-[60vh] overflow-auto bg-black text-white hidden rounded-md z-10 opacity-90' ref={applicantBox}>
                        <div className='flex justify-between px-2'>
                            <div>Applicants List</div>
                            <div className='cursor-pointer' onClick={() => { applicantBox.current.classList.toggle('hidden') }}><i className="fa-solid fa-xmark text-red-500"></i></div>
                        </div>

                        {
                            applicants.map((applicant) => {
                                return (
                                    <div key={applicant._id} className='flex justify-between items-center bg-black p-2 rounded-md my-1'>
                                        <div className='text-sm'>{applicant.fname + " " + applicant.lname}</div>
                                        <a href={applicant.resume} target='_blank' className='bg-blue-500 text-white text-xs px-2 py-0.5 rounded-md'>View Resume</a>
                                    </div>
                                )

                            })
                        }

                    </div>

                    <div className='bg-gray-100 w-full rounded-xl p-3'>
                        {
                            detailsOf == "created_jobs" ?

                                <div className='flex justify-between items-center gap-2 flex-wrap'>
                                    {

                                        allJobs.map((job) => {
                                            const curr_date = new Date();
                                            const job_date = new Date(job.createdAt);
                                            const diff_time = Math.abs(curr_date - job_date);
                                            const diff_calculate = () => {
                                                const days = Math.floor(diff_time / (1000 * 60 * 60 * 24)); // converting milliseconds to days
                                                if (days < 1) {
                                                    const hours = Math.floor(diff_time / (1000 * 60 * 60)); // converting milliseconds to hours
                                                    if (hours < 1) {
                                                        const minutes = Math.floor(diff_time / (1000 * 60)); // converting milliseconds to minutes
                                                        return `${minutes} min ago`;
                                                    }
                                                    return `${hours} hr ago`;
                                                }
                                                return `${days} days ago`;

                                            }

                                            return (
                                                <div key={job._id} className='border 1 duration-300 ring-[rgb(50,89,231)] ring-1 border-gray-300 bg-white p-2 rounded-md w-[32%] min-h-[160px] shadow-md shadow-black flex flex-col gap-2'>

                                                    <div className='text-lg font-semibold text-blue-600'>{job.designation}</div>
                                                    <hr />
                                                    <div className='text-base font-normal'>{job.organization}</div>
                                                    <div className='text-sm flex justify-between'><div><i className="fa-solid fa-user-tie"></i> {job.min_experience}-{job.max_experience} Yrs.</div> <div><i className="fa-solid fa-indian-rupee-sign"></i> {job.salary}</div> <div><i className="fa-solid fa-location-dot"></i> {job.location}</div></div>
                                                    <div className='text-sm'><i className="fa-solid fa-briefcase"></i> {job.work_mode}</div>

                                                    <div className='flex justify-between'>
                                                        <div className='text-xs'>{diff_calculate()}</div>
                                                        {/* <button className='bg-green-500 text-white rounded-md flex justify-center items-center w-28 py-0.5 text-sm' onClick={() => { apply(job._id) }}>Apply</button> */}
                                                        <button className='bg-blue-600 hover:bg-blue-700 text-white rounded-md flex justify-center items-center min-w-16 py-0.5 text-xs' onClick={() => { }}>View Job </button>
                                                        {job?.appliedBy?.length > 0 ? <button className='bg-blue-600 hover:bg-blue-700 text-white rounded-md flex justify-center items-center w-28 py-0.5 text-xs' onClick={() => { seeApplications(job._id) }}>See Applicants - {job?.appliedBy.length > 100 ? "100+" : job.appliedBy.length}</button> : <button disabled className='bg-gray-300 text-white rounded-md flex justify-center items-center w-28 py-0.5 text-xs'>No Applications</button>}
                                                    </div>

                                                </div>
                                            )
                                        })
                                    }


                                </div> :

                                ""
                        }

                        {
                            detailsOf == "profile" ?
                                <>
                                    {/* Name : {userData?.skills} &nbsp; &nbsp; &nbsp; &nbsp; */}
                                    <div className='border border-blue-300 p-4 rounded-md'>
                                        <form onSubmit={createJob} className='flex flex-col gap-4'>

                                            <div>
                                                <label htmlFor="organization">Organization : </label>
                                                <input type="text" id="organization" name="organization" placeholder=' Company name...' size="70" required />
                                            </div>

                                            <div>
                                                <label htmlFor="company_logo">Company logo : </label>
                                                <input type="file" id="company_logo" name="company_logo" placeholder=' Position Name...' size="70" required />
                                            </div>

                                            <div>
                                                <label htmlFor="industry" className='text-sm'>Industry/Sector</label> &nbsp;
                                                <select name="industry" id="industry">
                                                    {
                                                        industries.map(item => {
                                                            return (
                                                                <option value={item} key={item}>{item}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="founded_on" className='text-sm'>Year Founded</label> &nbsp;
                                                <select name="founded_on">

                                                    {
                                                        founded_years.map((year) => {
                                                            return (
                                                                <option value={year} key={year}>{year}</option>
                                                            )
                                                        })
                                                    }

                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="company_size">Company Size : </label>
                                                <input type="text" id="company_size" name="company_size" placeholder=' Company Size (in numbers)' size="70" />
                                            </div>

                                            <div>
                                                <label>Company Size : </label> <br />
                                                <label htmlFor="min_experience" className='text-sm'>Min.</label> &nbsp;
                                                <input type="number" id="min_experience" name="min_experience" onChange={handle_MinExp} value={min_exp} placeholder=' in yrs.' min='0' max={max_exp} step="0.5" required /> <br />

                                                <label htmlFor="max_experience" className='text-sm'>Max.</label> &nbsp;
                                                <input type="number" id="max_experience" name="max_experience" onChange={handle_MaxExp} value={max_exp} placeholder=' in yrs.' min={min_exp} max='30' step="0.5" required />
                                                {/* step means the increment value when we click on the up or down arrow of the number input field. We can use even decimal digits like 0.5, 2.6 etc */}
                                            </div>

                                            <div className='flex items-start justify-start gap-2'>
                                                <label htmlFor="job_desc">Job Description : </label>
                                                <textarea id="job_desc" name="job_desc" rows="5" cols="100" maxLength="7500" placeholder=' Work/Position details...' required />
                                            </div>

                                            <div className='flex flex-col justify-start items-start gap-2'>
                                                <div className='flex items-start justify-start gap-2'>
                                                    <label htmlFor="skills">Skills : </label>
                                                    <input type="text" id="skills" name="skills" ref={skillRef} size="70" placeholder=' Type in the skills and click on add...' />
                                                    <input type="button" style={{ backgroundColor: "#3a4b9a", color: "white" }} className='rounded-sm px-3 text-sm py-0.5' onClick={add_skills} value="Add"></input>
                                                </div>

                                                <div className='flex flex-wrap items-start justify-start gap-2'>
                                                    {
                                                        skill_array.map((skill, index) => {
                                                            return (
                                                                <div key={index} className='bg-blue-400 text-white text-xs px-2 py-1 rounded-md '>
                                                                    {skill} <i className="fa-solid fa-xmark cursor-pointer" onClick={() => { remove_skills(skill) }}> </i>
                                                                </div>
                                                            )
                                                        })

                                                    }
                                                </div>

                                            </div>

                                            <input type="submit" value="Create Job" style={{ backgroundColor: "#3a4b9a", color: "white" }} className='rounded-sm' />


                                        </form>
                                    </div>
                                </> :

                                ""
                        }

                        {
                            detailsOf == "create_job" ?
                                <>
                                    <div className='border border-blue-300 p-4 rounded-md'>
                                        <form onSubmit={createJob} className='flex flex-col gap-4'>

                                            <div>
                                                <label htmlFor="organization">Organization : </label>
                                                <input type="text" id="organization" name="organization" placeholder=' Company name...' size="70" required />
                                            </div>

                                            <div>
                                                <label htmlFor="designation">Designation : </label>
                                                <input type="text" id="designation" name="designation" placeholder=' Position Name...' size="70" required />
                                            </div>

                                            <div>
                                                <label>Experience Range : </label> <br />
                                                <label htmlFor="min_experience" className='text-sm'>Min.</label> &nbsp;
                                                <input type="number" id="min_experience" name="min_experience" onChange={handle_MinExp} value={min_exp} placeholder=' in yrs.' min='0' max={max_exp} step="0.5" required /> <br />

                                                <label htmlFor="max_experience" className='text-sm'>Max.</label> &nbsp;
                                                <input type="number" id="max_experience" name="max_experience" onChange={handle_MaxExp} value={max_exp} placeholder=' in yrs.' min={min_exp} max='30' step="0.5" required />
                                                {/* step means the increment value when we click on the up or down arrow of the number input field. We can use even decimal digits like 0.5, 2.6 etc */}
                                            </div>

                                            <div>
                                                <label>Salary Range : </label> <br />
                                                <label htmlFor="min_salary" className='text-sm'>Min.</label> &nbsp;
                                                <input type="number" id="min_salary" name="min_salary" value={min_sal} onChange={handle_MinSal} min='0' max={max_sal} step="0.01" placeholder=' in LPA.' /> <br />

                                                <label htmlFor="max_salary" className='text-sm'>Max.</label> &nbsp;
                                                <input type="number" id="max_salary" name="max_salary" value={max_sal} onChange={handle_MaxSal} min={min_sal} max='99' step="0.01" placeholder=' in LPA.' />
                                                {/* step means the increment value when we click on the up or down arrow of the number input field. We can use even decimal digits like 0.5, 2.6 etc  */}
                                            </div>

                                            <div>
                                                <label htmlFor="location">Location : </label>
                                                <input type="text" id="location" name="location" placeholder=' Work/Office Location' size="70" />
                                            </div>

                                            <div className='flex items-start justify-start gap-2'>
                                                <label htmlFor="job_desc">Job Description : </label>
                                                <textarea id="job_desc" name="job_desc" rows="5" cols="100" maxLength="7500" placeholder=' Work/Position details...' required />
                                            </div>

                                            <div>
                                                <label>Working Mode : </label>
                                                <label htmlFor="wfo">WFO </label>
                                                <input type="radio" id="wfo" name="work_mode" value="WFO" /> &nbsp; &nbsp;

                                                <label htmlFor="hybrid">Hybrid </label>
                                                <input type="radio" id="hybrid" name="work_mode" value="Hybrid" /> &nbsp; &nbsp;

                                                <label htmlFor="remote">Remote </label>
                                                <input type="radio" id="remote" name="work_mode" value="Remote" /> &nbsp; &nbsp;
                                            </div>

                                            <div>
                                                <label>Employment Type : </label>
                                                <label htmlFor="full_time">Full Time </label>
                                                <input type="checkbox" id="full_time" name="full_time" value="Full Time" /> &nbsp; &nbsp;

                                                <label htmlFor="permanent">Permanent </label>
                                                <input type="checkbox" id="permanent" name="permanent" value="Permanent" /> &nbsp; &nbsp;

                                                <label htmlFor="contractual">Contractual </label>
                                                <input type="checkbox" id="contractual" name="contractual" value="Contractual" /> &nbsp; &nbsp;
                                            </div>

                                            <div className='flex items-start justify-start gap-2'>
                                                <label htmlFor="qualifications">Qualifications : </label>
                                                <textarea id="qualifications" name="qualifications" rows="5" cols="70" maxLength="1500" placeholder=' Qualifications...' />
                                            </div>

                                            <div className='flex items-start justify-start gap-2'>
                                                <label htmlFor="benefits">Benefits : </label>
                                                <textarea id="benefits" name="benefits" rows="5" cols="70" maxLength="1500" placeholder=' Benefits offered by your company...' />
                                            </div>

                                            <div className='flex flex-col justify-start items-start gap-2'>
                                                <div className='flex items-start justify-start gap-2'>
                                                    <label htmlFor="skills">Skills : </label>
                                                    <input type="text" id="skills" name="skills" ref={skillRef} size="70" placeholder=' Type in the skills and click on add...' />
                                                    <input type="button" style={{ backgroundColor: "#3a4b9a", color: "white" }} className='rounded-sm px-3 text-sm py-0.5' onClick={add_skills} value="Add"></input>
                                                </div>

                                                <div className='flex flex-wrap items-start justify-start gap-2'>
                                                    {
                                                        skill_array.map((skill, index) => {
                                                            return (
                                                                <div key={index} className='bg-blue-400 text-white text-xs px-2 py-1 rounded-md '>
                                                                    {skill} <i className="fa-solid fa-xmark cursor-pointer" onClick={() => { remove_skills(skill) }}> </i>
                                                                </div>
                                                            )
                                                        })

                                                    }
                                                </div>

                                            </div>

                                            <input type="submit" value="Create Job" style={{ backgroundColor: "#3a4b9a", color: "white" }} className='rounded-sm' />


                                        </form>
                                    </div>

                                </> :

                                ""
                        }


                    </div>



                </div>
            </div>

        </div>
    )
}

export default EmployerDashboard
