import React from 'react'
import logo from '../../Assets/Logo/Job_Hunters_Black_Small-removebg.png'

const HeaderEmployer = () => {
    return (
            <nav className='Header w-full bg-black h-[5%] flex justify-between items-center text-white px-2'>
                <div className='h-auto'>
                    <img src={logo} alt="Job Hunters Logo" className='h-full w-[78px]' />
                </div>

                <div>
                    <a href="">Home</a>
                </div>
            </nav>
    )
}

export default HeaderEmployer
