import './App.css'
import logo from './Assets/Logo/Job_Hunters_Black_Small-removebg.png'
import Login from './Components/Common/Login'
import VerificationSuccess from './Components/Mail_Components/VerificationSuccess'
import VerificationFailed from './Components/Mail_Components/VerificationFailed'
import ForgotPassword from './Components/Common/ForgotPassword'
import PasswordChanged from './Components/Common/PasswordChanged'
// import Role from './Components/Role'
import Dashboard from './Components/Employee/Dashboard'
import EmployerDashboard from './Components/Employer/EmployerDashboard'
import Cookie from './Extra/CookieCreate'
import UserHome from './Components/Employee/UserHome'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';


function App() {

  return (
    <>
      <BrowserRouter>

        <Toaster position='top-right' />  {/* You can pass various options to the Toaster component to customize the appearance and behavior of the toasts. */}

        <Routes>

          <Route path='/' element={<>
            <div className='mb-[-3rem] h-12 cursor-pointer flex justify-between'>
              <img src={logo} alt="Job Hunters Logo" className='h-full w-[100px]' />
              <div className='text-white'><pre>Home     About     Contact     Services </pre></div>
            </div>
            <Login></Login>
          </>}></Route>

          <Route path='/mail-verified-successfully' element={<VerificationSuccess />}></Route>
          <Route path='/mail-verification-failed' element={<VerificationFailed />}></Route>

          <Route path='/forgot-password' element={<ForgotPassword />}></Route>
          <Route path='/password-changed' element={<PasswordChanged />}></Route>

          {/* <Route path='/role-selection' element={<Role />}></Route> */}

          <Route path='/user-dashboard' element={<Dashboard />}></Route>
          <Route path='/employer-dashboard' element={<EmployerDashboard />}></Route>

          <Route path='/cookie-page' element={<Cookie />}></Route>

          <Route path='/user-home' element={<UserHome />}></Route>
          


        </Routes>

      </BrowserRouter>


    </>
  )
}

export default App
