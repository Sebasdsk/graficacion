import "./Dashboard.css";
import HeaderDashboard from "../components/HeaderDashboard"
import ProjectsList from "../components/ProjectsComponents/ProjectsList";
import ProjectsResume from "../components/ProjectsComponents/ProjectsResume";
import ProjectCreate from "../components/ProjectsComponents/ProjectCreate";
import { Plus, X } from "@boxicons/react";
import { useEffect, useState, type SetStateAction } from "react";
import { useNavigate } from "react-router";

let projects: [];
let totalProjects: number;

export default function Dashboard() {
    // Este state se utiliza para mostrar o no el componente de ProjectCreate y el botón CreateProject o CancelCreate
    const [createProject, setCreateProject] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const API_URL = "http://localhost:3000/api/proyectos/lista";

    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/");
    }

    useEffect(() => {
        const consultListProyects = async () => {
            try {
                setLoading(true);
    
                const response = await fetch(API_URL, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`, // Envía el token
                        'Content-Type': 'application/json'
                    }
                });
    
                if (!response.ok) {
                    alert("Error en la espuesta");
                    console.error(response);
                    return;
                }

                const data = await response.json();
                projects = data;
                totalProjects = projects.length;
            } catch (err) {
                console.error("Error en la query: ", err)
            } finally {
                setLoading(false);
            }
        }

        consultListProyects();
    }, []);

    console.log(totalProjects)

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
            {!loading ? <section className="panel-body">
                <ProjectsResume totalProjects={totalProjects}/>
                {createProject
                    ? <ProjectCreate/>
                    : <ProjectsList projects={projects}/>}
            </section> : <span className="loader">Cargando...</span>}
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