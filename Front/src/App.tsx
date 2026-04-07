import { Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import ConfigProjects from "./pages/ConfigProjects"
import HomePage from "./pages/HomePage"
import TechniquesDashboard from "./pages/TechniquesDashboard"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path="/config-projects/:id" element={<ConfigProjects/>}/>
        <Route path="/config-projects/:id/proccess/subprocess/:id/techniques-dashboard" element={<TechniquesDashboard/>}/>
      </Routes>
    </>
  )
}

export default App
