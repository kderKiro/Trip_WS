

import Header from './landingPage/components/Header'

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import UserProfile from './UserProfile/UserProfile'

import Register from './landingPage/components/Register'


import { useState } from 'react'





function App() {

  const [UserInfo, setUserInfo] = useState(() => {
    // 1. Try to get the user from local storage immediately
    const savedUser = localStorage.getItem('FT_user');

    // 2. If it exists, parse it. If not, return the default.
    // This happens BEFORE the first render.
    return savedUser ? JSON.parse(savedUser) : { UserName: "Default", UserType: "Agency" };
  });

  return (

    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/Home" replace />}></Route>
        <Route path="/*" element={<Header setUserInfo={setUserInfo} userInfo={UserInfo} />} />
        <Route path="/register" element={<Register setUserInfo={setUserInfo} />} />
        <Route path="/Profile/*" element={<UserProfile Username={UserInfo.UserName} U_type={UserInfo.UserType} />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
