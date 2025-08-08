import React, { useContext, useState } from 'react'
import bg from '../assets/authBg.png'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'

function SignUp() {

  const { serverUrl, userData, setUserData } = useContext(UserDataContext)

  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)


  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("")
    setLoading(true)
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signup`, { name, email, password }, { withCredentials: true })
      setUserData(result.data)
      setLoading(false)
      navigate('/customize')
    } catch (error) {
      console.log(error)
      setUserData(null)
      setLoading(false)
      setError(error.response.data.message)
    }
  }

  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${bg})` }}>
      <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000069] backdrop-blur shadow-lg shadow-black flex flex-col justify-center items-center gap-[20px] px-[20px]' onSubmit={handleSignUp}>
        <h1 className='text-white text-[30px] font-semibold mb-[30px]'>Register To <span className='text-blue-500'>Virtual Assistant</span></h1>
        <input type="text" placeholder='Enter your name' className='w-full h-[60px] outline-none border-2 border-white bg-transparent rounded-[10px] px-[20px] py-[10px] text-[18px] text-white placeholder-gray-300' required value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder='Email Id' className='w-full h-[60px] outline-none border-2 border-white bg-transparent rounded-[10px] px-[20px] py-[10px] text-[18px] text-white placeholder-gray-300' required value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className='relative w-full h-[60px] border-2 border-white bg-transparent text-white rounded-[10px] text-[18px]'>
          <input type={showPassword ? 'text' : 'password'} placeholder='Password' className='w-full h-full rounded-[10px] outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]' required value={password} onChange={(e) => setPassword(e.target.value)} />
          {showPassword ? <IoEye className='absolute top-[18px] right-[20px] text-white w-[25px] h-[25px] cursor-pointer' onClick={() => setShowPassword(!showPassword)} /> : <IoEyeOff className='absolute top-[18px] right-[20px] text-white w-[25px] h-[25px] cursor-pointer' onClick={() => setShowPassword(!showPassword)} />}
        </div>
        {error.length > 0 && <p className='text-red-500 text-[18px]'>*{error}</p>}
        <button className='min-w-[150px] h-[60px] mt-[30px] text-black bg-white rounded-[10px] text-[18px] font-semibold cursor-pointer' disabled={loading}>{loading ? "Loading..." : 'Sign Up'}</button>
        <p className='text-white text-[18px] cursor-pointer' onClick={() => navigate('/signin')}>Already have an account? <span className='text-blue-400'>Sign In</span></p>
      </form>
    </div>
  )
}

export default SignUp