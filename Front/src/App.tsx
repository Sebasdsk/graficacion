import { Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ConfigProjects from "./pages/ConfigProjects"
import HomePage from "./pages/HomePage"
import TechniquesDashboard from "./pages/TechniquesDashboard"
import UMLs from "./pages/UMLs"
import UMLsDashboard from "./pages/UMLsDashboard"
import { ReactFlowProvider } from "@xyflow/react"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path="/config-projects/:id_project" element={<ConfigProjects />} />
        <Route path="/config-projects/:id_project/proccess/subprocess/:id_subproceso/techniques-dashboard" element={<TechniquesDashboard />} />
        <Route path="/uml-editor/:id_project/uml/:id_diagrama" element={
          // Esto es importante, el editor de UML no se renderizará.
          // Porque en el mismo se utiliza el hook "useReactFlow()"
          // que necesita estar dentro de un "ReactFlowProvider" para funcionar correctamente.
          <ReactFlowProvider>
            <UMLs/>
          </ReactFlowProvider>
        }/>
        <Route path="/uml-dashboard/:id_project" element={<UMLsDashboard />} />
      </Routes>
    </>
  )
}

export default App
