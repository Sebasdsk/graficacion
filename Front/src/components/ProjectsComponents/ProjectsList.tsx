import Project from "./Project";
import { type Proyecto } from "../../Types/Proyectos";
import "./ProjectsList.css"
import { useState, type SetStateAction } from "react";

interface ProjectListProp {
    projects: Array<Proyecto>;
}

type StatusProject = "Todos" | "Planeacion" | "En Progreso" | "Completado" | "Cancelado";

export default function ProjectsList({ projects }: ProjectListProp) {
    const [statusSelected, setStatusSelected] = useState<StatusProject>("Todos");

    return (
        <section className="proyect-list">
            <MenuProjects statusSelected={statusSelected} setStatusSelected={setStatusSelected}/>
            <section className="list">
                {projects?.map(p => (
                    <Project
                        key={p.id_proyecto}
                        id_proyecto={p.id_proyecto}
                        nombre={p.nombre}
                        descripcion={p.descripcion}
                        estatus={p.estatus}
                        fecha_inicio={p.fecha_inicio}
                        colaboradores={p.colaboradores}
                        procesos={p.procesos}
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

function MenuProjects({ statusSelected, setStatusSelected }: StatusSelectedProp) {
    return (
        <section className="menu-projects">
            <button
                className={`button-menu ${statusSelected === "Todos" ? "selected" : ""}`}
                onClick={() => setStatusSelected("Todos")}
            >
                Todos
            </button>
            <button
                className={`button-menu ${statusSelected === "Planeacion" ? "selected" : ""}`}
                onClick={() => setStatusSelected("Planeacion")}
            >
                Planeación
            </button>
            <button
                className={`button-menu ${statusSelected === "En Progreso" ? "selected" : ""}`}
                onClick={() => setStatusSelected("En Progreso")}
            >
                En Progreso
            </button>
            <button
                className={`button-menu ${statusSelected === "Completado" ? "selected" : ""}`}
                onClick={() => setStatusSelected("Completado")}
            >
                Completados
            </button>
            <button
                className={`button-menu ${statusSelected === "Cancelado" ? "selected" : ""}`}
                onClick={() => setStatusSelected("Cancelado")}
            >
                Cancelados
            </button>
        </section>
    );
}