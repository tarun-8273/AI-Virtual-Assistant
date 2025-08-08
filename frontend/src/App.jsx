import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Custmoize from './pages/Custmoize'
import { UserDataContext } from './context/UserContext'
import Home from './pages/Home'
import Custmoize2 from './pages/Custmoize2'

function App() {

  const { userData, setUserData } = useContext(UserDataContext)

  return (
    <div>
      <Routes>
        <Route path="/" element={(userData?.assistantImage && userData?.assistantName) ? <Home /> : <Navigate to="/customize" />} />
        <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" />} />
        <Route path="/customize" element={userData ? <Custmoize /> : <Navigate to="/signup" />} />
        <Route path="/customize2" element={userData ? <Custmoize2 /> : <Navigate to="/signup" />} />
      </Routes>
    </div>
  )
}

export default App