import React from 'react'
import logo from '../../Assets/Logo/Job_Hunters_Black_Small-removebg.png'
import { Link, useNavigate } from 'react-router-dom';

const HeaderEmployee = () => {
    return (
            <nav className='Header w-full bg-gradient-to-br from-indigo-800 to-purple-800 h-[5%] flex justify-between items-center text-white px-2'>
                <div className='h-auto'>
                    <img src={logo} alt="Job Hunters Logo" className='h-full w-[78px]' />
                </div>

                <div className='flex space-x-4'>
                    <Link to="/user-home">Home</Link>
                    <Link to="/user-dashboard">Profile</Link>
                </div>
            </nav>
    )
}

export default HeaderEmployee
