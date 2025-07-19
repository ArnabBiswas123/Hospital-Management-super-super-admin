import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/login'
import { Toaster } from './components/ui/toaster'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Login></Login>}></Route>
        <Route path="/superadmin" element={<Dashboard></Dashboard>}></Route>
        <Route path="/superadmin/hospitalbranch/:hospitalid" element={<Dashboard></Dashboard>}></Route>
        <Route path="/superadmin/addhospitalbranch" element={<Dashboard></Dashboard>}></Route>
      </Routes>
    </>
  )
}

export default App
