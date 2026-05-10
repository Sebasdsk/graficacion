import { useState, type SetStateAction } from "react";
import ProjectsResume from "./ProjectsResume";
import ProjectsList from "./ProjectsList";
import ProjectCreate from "../../Modals/ModalChildrens/ProjectsModals/ProjectCreate";
import { Plus } from "@boxicons/react";
import { useNavigate } from "react-router";
import ModalCreate from "../../Modals/ModalCreate";
import "./Projects.css"
import type { Proyecto } from "../../Types/Proyectos";
import type { Rol } from "../../Types/Roles";

interface ProjectsProp {
    projects: Proyecto[];
    setProjects: React.Dispatch<SetStateAction<Proyecto[]>>;
}

interface TotalRolesStakeProp {
    roles: Rol[];
    totalStakeholders: number;
}

export default function Projects({ projects, setProjects, roles, totalStakeholders }: ProjectsProp & TotalRolesStakeProp) {
    // Este state se utiliza para mostrar o no el componente de ProjectCreate
    const [createProject, setCreateProject] = useState<boolean>(false);
    const navigate = useNavigate();

    const totalProjects = projects.length;

    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/login");
    }
    
    return (
        <section className="projects-component">
            <header className="projects-header">
                <div>
                    <h1>Proyectos</h1>
                    <small>Gestiona tus proyectos del análisis de procesos de tu negocio</small>
                </div>
                <CreateProject setCreateProject={setCreateProject}/>
            </header>
            <section className="projects-body">
                <ProjectsResume
                    projects={projects}
                    totalProjects={totalProjects}
                    roles={roles}
                    totalStakeholders={totalStakeholders}
                />
                <ProjectsList projects={projects}/>
            </section>
            {createProject && 
                <ModalCreate
                    children={
                        <ProjectCreate
                            projects={projects}
                            setProjects={setProjects}
                            setCreateProject={setCreateProject}
                        />
                    }
                    setOpen={setCreateProject}
                />
            }
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