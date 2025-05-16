import React from 'react'

const AsideBar = () => {

    const aside_btn_style = "cursor-pointer p-2 hover:bg-black hover:text-white duration-150";


    return (
        // <div className='flex flex-col w-[20%] h-[95vh] bg-gradient-to-br from-indigo-800 to-purple-800 text-white'>

        // </div>

            <div className='w-[15%] bg-gradient-to-br to-indigo-200 from-purple-200 min-h-[92.7vh]'>

                <div className={`${aside_btn_style}`}>All Filters</div> <hr />

                <div className={`${aside_btn_style}`}>Experience</div>

                <div className={`${aside_btn_style}`}>Work Mode</div>

                <div className={`${aside_btn_style}`}>Industry</div>

                <div className={`${aside_btn_style}`}>Location</div>

                <div className={`${aside_btn_style}`}>Salary</div>

                <div className={`${aside_btn_style}`}>Role Category</div>

                <div className={`${aside_btn_style}`}>Education</div>

            </div>

    )
}

export default AsideBar
