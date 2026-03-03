import { useEffect, useState, type SetStateAction } from "react";
import ProjectsResume from "./ProjectsResume";
import ProjectsList from "./ProjectsList";
import ProjectCreate from "./ProjectCreate";
import { Plus } from "@boxicons/react";
import { useNavigate } from "react-router";
import ModalCreate from "../../Modals/ModalCreate";
import "./Projects.css"

let projects: [];
let totalProjects: number;

export default function Projects() {
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
                        console.error(response);
                        navigate("/");
                        return;
                    }
    
                    const data = await response.json();
                    projects = data;
                    totalProjects = projects.length;
                } catch (err) {
                    console.error("Error en la query: ", err)
                    navigate("/");
                } finally {
                    setLoading(false);
                }
            }
    
            consultListProyects();
        }, []);
    return (
        <section className="projects-component">
            <header className="projects-header">
                <div>
                    <h1>Proyectos</h1>
                    <small>Gestiona tus proyectos del análisis de procesos de tu negocio</small>
                </div>
                <CreateProject setCreateProject={setCreateProject}/>
            </header>
            {!loading ? <section className="projects-body">
                <ProjectsResume totalProjects={totalProjects}/>
                <ProjectsList projects={projects}/>
            </section> : <span className="loader">Cargando...</span>}
            {createProject && <ModalCreate
                children={<ProjectCreate/>}
                setOpen={setCreateProject}/>}
        </section>
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
            <Plus size="xs"/>Nuevo Proyecto
        </button>
    );
}