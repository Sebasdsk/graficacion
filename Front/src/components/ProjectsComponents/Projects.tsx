import { useEffect, useState, type SetStateAction } from "react";
import ProjectsResume from "./ProjectsResume";
import ProjectsList from "./ProjectsList";
import ProjectCreate from "./ProjectCreate";
import { Plus } from "@boxicons/react";
import { useNavigate } from "react-router";
import ModalCreate from "../../Modals/ModalCreate";
import consultAllProjects from "../../services/consultAllProjects";
import "./Projects.css"
import type { Proyecto } from "../../Types/Proyectos";

export default function Projects() {
    // Este state se utiliza para mostrar o no el componente de ProjectCreate
    const [createProject, setCreateProject] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [projects, setProjects] = useState<Proyecto[]>([]);
    const [totalProjects, setTotalProjects] = useState<number>(0);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/");
    }

    useEffect(() => {
            const getAllProjects = async () => {
                try {
                    setLoading(true);
                    const data = await consultAllProjects(token);
                    setProjects(data);
                    setTotalProjects(data.length);
                } catch (err) {
                    console.error("Error en la query: ", err)
                    navigate("/");
                } finally {
                    setLoading(false);
                }
            }
    
            getAllProjects();
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