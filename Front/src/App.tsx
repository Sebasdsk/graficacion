import { Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Projects from "./pages/Projects"

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/projects" element={<Projects/>}/>
      </Routes>
    </>
  )
}

export default App
