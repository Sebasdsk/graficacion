import { Cog } from "@boxicons/react";
import { useNavigate } from "react-router";
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

export default function Project( { id, nombre, descripcion, estatus, fechaCreacion, colaboradores, procesos }: ProyectoProp ) {
    const navigate = useNavigate();

    // Esta función dirige a la página de configuración de proyecto como parámetro el id del proyecto seleccionado
    const handleNavigation = () => {
        navigate(`/config-projects/${id}`);
    }

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
                <button onClick={handleNavigation} className="watch-project">
                    <Cog />
                    <p>Configurar Proyecto</p>
                </button>
            </div>
        </article>
    );
}