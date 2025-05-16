import React from 'react';
import { Link } from 'react-router-dom';

const VerificationFailed = () => {
  return (
    <div className="w-screen h-screen bg-gradient-to-r from-red-400 to-pink-500 flex justify-center items-center">
      <div className="w-[30rem] h-[20rem] bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center items-center text-center space-y-6">
        <p className="text-2xl font-semibold text-gray-800">
          Email Verification Failed
        </p>
        <i className="fa-solid fa-circle-xmark text-red-600 text-4xl"></i>
        <p className="text-gray-600 text-lg">
          Oops! Something went wrong with your email verification. Please try again.
        </p>
        <Link to="/">
          <button className="w-[10rem] h-[2.8rem] bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75">
            Try Again
          </button>
        </Link>
      </div>
    </div>
  );
};

export default VerificationFailed;
