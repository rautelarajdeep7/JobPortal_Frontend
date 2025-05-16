import React from 'react'
import axios from 'axios'

const CookieCreate = () => {

  axios.defaults.withCredentials = true;  // It allows axios to send cookies with the request, and also allows axios to receive cookies from the server,
  //  and store them in the browser under cookies. in Application tab of inspect element.

    const createCookie = async () =>{
        const response = await axios.get('http://localhost:3000/api/create-cookie');
    }


  return (
    <div>
      
        <button className='bg-blue-500 text-white rounded-sm p-2 m-5' onClick={createCookie}>Click to create cookie</button>
      
    </div>
  )
}

export default CookieCreate
