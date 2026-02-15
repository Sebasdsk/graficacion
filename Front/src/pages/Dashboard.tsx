import "./Dashboard.css";
import HeaderDashboard from "../components/HeaderDashboard"
import ProjectsList from "../components/ProjectsComponents/ProjectsList";
import ProjectsResume from "../components/ProjectsComponents/ProjectsResume";
import ProjectCreate from "../components/ProjectsComponents/ProjectCreate";
import { Plus, X } from "@boxicons/react"; // Icono del "+" se importa el componente ya que en <i> no funciona
import { useState, type SetStateAction } from "react";

export default function Dashboard() {
    // Este state se utiliza para mostrar o no el componente de ProjectCreate y el botón CreateProject o CancelCreate
    const [createProject, setCreateProject] = useState<boolean>(false);

    return (
        <main className="panel-control">
            <HeaderDashboard/>
            <header className="panel-header">
                <div>
                    <h1>Proyectos</h1>
                    <small>Gestiona tus proyectos del análisis de procesos de tu negocio</small>
                </div>
                {createProject
                    ? <CancelCreate setCreateProject={setCreateProject}/>
                    : <CreateProject setCreateProject={setCreateProject}/>}
            </header>
            <section className="panel-body">
                <ProjectsResume/>
                {createProject
                    ? <ProjectCreate/>
                    : <ProjectsList/>}
            </section>
        </main>
    );
}

// Interfaz para pasar los prop a los botones con el estado setCreateProject
interface SetCreateProjectProp {
    setCreateProject: React.Dispatch<SetStateAction<boolean>>
}

// Este botón es para agregar un nuevo proyecto y actualiza la UI y muestra el componente "ProjectCreate"
function CreateProject({ setCreateProject }: SetCreateProjectProp) {
    return (
        <button onClick={() => setCreateProject(true)} className="button-new-project">
            <Plus />
            <p>Nuevo Proyecto</p>
        </button>
    );
}

// Este botón es para cancelar la operación de crear un nuevo proyecto y muestra de nuevo el componente "ProjectsList"
function CancelCreate({ setCreateProject }: SetCreateProjectProp) {
    return (
        <button onClick={() => setCreateProject(false)} className="button-cancel-project">
            <X />
            <p>Cancelar</p>
        </button>
    );
}