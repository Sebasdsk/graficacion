import Project from "./Project";
import { type Proyecto } from "../../Types/Proyectos";
import "./ProjectsList.css"
import { useState, type SetStateAction } from "react";
import { counterStatusProjects } from "../../utils/counterStatusProjects";

interface ProjectListProp {
    projects: Proyecto[];
}

type StatusProject = "Todos" | "Planificación" | "En Progreso" | "Completado" | "Cancelado";

export default function ProjectsList({ projects }: ProjectListProp) {
    const [statusSelected, setStatusSelected] = useState<StatusProject>("Todos");

    // Este algoritmo filtra los proyectos por sus estatus
    const filteredProjects = projects.filter(p => {
        switch(statusSelected) {
            case "Planificación":
                return p.estatus === "Planificación";
            case "En Progreso":
                return p.estatus === "En Progreso";
            case "Completado":
                return p.estatus === "Completado";
            case "Cancelado":
                return p.estatus === "Cancelado";
            default:
                return projects;
        }
    });

    const totalFilterProjects = counterStatusProjects(projects);

    return (
        <section className="proyect-list">
            <MenuProjects statusSelected={statusSelected} setStatusSelected={setStatusSelected} totalfilterProjects={totalFilterProjects}/>
            <section className="list">
                {filteredProjects?.map(p => (
                    <Project
                        key={p.id_proyecto}
                        id_proyecto={p.id_proyecto}
                        nombre={p.nombre}
                        descripcion={p.descripcion}
                        estatus={p.estatus}
                        fecha_inicio={p.fecha_inicio}
                    />
                ))}
            </section>
        </section>
    );
}

interface StatusSelectedProp {
    statusSelected: StatusProject;
    setStatusSelected: React.Dispatch<SetStateAction<StatusProject>>;
}

interface TotalFilterProjects {
    totalfilterProjects: Record<StatusProject, number>;
}

function MenuProjects({ statusSelected, setStatusSelected, totalfilterProjects }: StatusSelectedProp & TotalFilterProjects) {
    return (
        <section className="menu-projects">
            <button
                className={`button-menu ${statusSelected === "Todos" ? "selected" : ""}`}
                onClick={() => setStatusSelected("Todos")}
            >
                Todos
            </button>
            <button
                className={`button-menu ${statusSelected === "Planificación" ? "selected" : ""}`}
                onClick={() => setStatusSelected("Planificación")}
            >
                Planeación ({totalfilterProjects["Planificación"] ?? 0})
            </button>
            <button
                className={`button-menu ${statusSelected === "En Progreso" ? "selected" : ""}`}
                onClick={() => setStatusSelected("En Progreso")}
            >
                En Progreso ({totalfilterProjects["En Progreso"] ?? 0})
            </button>
            <button
                className={`button-menu ${statusSelected === "Completado" ? "selected" : ""}`}
                onClick={() => setStatusSelected("Completado")}
            >
                Completados ({totalfilterProjects["Completado"] ?? 0})
            </button>
            <button
                className={`button-menu ${statusSelected === "Cancelado" ? "selected" : ""}`}
                onClick={() => setStatusSelected("Cancelado")}
            >
                Cancelados ({totalfilterProjects["Cancelado"] ?? 0})
            </button>
        </section>
    );
}