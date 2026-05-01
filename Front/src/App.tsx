import { Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ConfigProjects from "./pages/ConfigProjects"
import HomePage from "./pages/HomePage"
import TechniquesDashboard from "./pages/TechniquesDashboard"
import UMLs from "./pages/UMLs"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path="/config-projects/:id" element={<ConfigProjects />} />
        <Route path="/config-projects/:id/proccess/subprocess/:id/techniques-dashboard" element={<TechniquesDashboard />} />
        <Route path="/diagrams-uml" element={<UMLs/>}/>
      </Routes>
    </>
  )
}

export default App
