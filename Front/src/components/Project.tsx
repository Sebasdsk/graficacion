import { Eye } from "@boxicons/react";
import "./Project.css"

interface ProyectoProp {
    id: number;
    nombre: string;
    descripcion: string;
    estatus: string;
    fechaCreacion: string;
    colaboradores: number;
    procesos: number;
}

export default function Project( { nombre, descripcion, estatus, fechaCreacion, colaboradores, procesos }: ProyectoProp ) {
    return (
        <article className="project-container">
            <header className="project-header">
                <p>{nombre}</p>
                <small>{descripcion}</small>
            </header>
            <hr />
            <div className="project-body">
                <div className="info-project">
                    <span>{estatus}</span>
                    <span>{fechaCreacion}</span>
                </div>
                <div className="relations-projects">
                    <div className="stakeholders-container">
                        <span>{colaboradores}</span>
                        <p>Colaboradores</p>
                    </div>
                    <div className="process-container">
                        <span>{procesos}</span>
                        <p>Procesos</p>
                    </div>
                </div>
                <button className="watch-project">
                    <Eye />
                    <p>Ver</p>
                </button>
            </div>
        </article>
    );
}