import React from 'react';
import { Link } from 'react-router-dom';

const VerificationSuccess = () => {
  return (
    <div className="w-screen h-screen bg-gradient-to-r from-green-500 to-teal-400 flex justify-center items-center">
      <div className="w-[30rem] h-[20rem] bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center items-center text-center space-y-6">
        <p className="text-2xl font-semibold text-gray-800">
          Email Verification Successful
        </p>
        <i className="fa-solid fa-circle-check text-green-600 text-4xl"></i>
        <p className="text-gray-600 text-lg">
          Your email has been successfully verified! You can now log in to your account.
        </p>
        <Link to="/">
          <button className="w-[10rem] h-[2.8rem] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
            Login Now
          </button>
        </Link>
      </div>
    </div>
  );
}

export default VerificationSuccess;
