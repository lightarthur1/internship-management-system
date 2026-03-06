import React from 'react'
import Landing from './Pages/Landing'
import Login from './Pages/Login'
import { BrowserRouter,Route,Routes } from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}



export default App