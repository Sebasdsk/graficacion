import { Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import ConfigProjects from "./pages/ConfigProjects"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path="/config-projects/:id" element={<ConfigProjects/>}/>
      </Routes>
    </>
  )
}

export default App
