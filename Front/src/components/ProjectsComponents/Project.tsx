import { Cog } from "@boxicons/react";
import { useNavigate } from "react-router";
import "./Project.css"

interface ProyectoProp {
    id_proyecto: number;
    nombre: string;
    descripcion: string;
    estatus: string;
    fecha_inicio: string;
    colaboradores: number;
    procesos: number;
}

export default function Project( { id_proyecto, nombre, descripcion, estatus, fecha_inicio, colaboradores, procesos }: ProyectoProp ) {
    const navigate = useNavigate();

    // Esta función dirige a la página de configuración de proyecto como parámetro el id del proyecto seleccionado
    const handleNavigation = () => {
        navigate(`/config-projects/${id_proyecto}`);
    }

    return (
        <article className="project-container">
            <header className="project-header">
                <h3>{nombre}</h3>
                <p>{descripcion}</p>
            </header>
            <hr />
            <div className="project-body">
                <div className="info-project">
                    <span>{estatus}</span>
                    <span>{fecha_inicio}</span>
                </div>
                <div className="relations-projects">
                    <div className="stakeholders-container">
                        <span>{colaboradores ? colaboradores : 0 }</span>
                        <p>Colaboradores</p>
                    </div>
                    <div className="process-container">
                        <span>{ procesos ? procesos : 0 }</span>
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