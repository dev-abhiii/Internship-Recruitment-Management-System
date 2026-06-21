import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import CandidateDashboard from './pages/CandidateDashboard'
import RecruiterDashboard from './pages/RecruiterDashboard'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to ='/login' replace />}/>
          <Route path='/login' element={<Login />} />
          <Route path='/candidate' element={<CandidateDashboard/>} />
          <Route path='/recruiter' element={<RecruiterDashboard/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
