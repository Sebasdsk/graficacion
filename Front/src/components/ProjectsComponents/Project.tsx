import { Group, Calendar } from "@boxicons/react";
import { useNavigate } from "react-router";
import "./Project.css"

interface ProyectoProp {
    id_proyecto: number;
    nombre: string;
    descripcion: string;
    estatus: string;
    fecha_inicio: string;
    colaboradores: number;
}

export default function Project( { id_proyecto, nombre, descripcion, estatus, fecha_inicio, colaboradores }: ProyectoProp ) {
    const navigate = useNavigate();

    // Esta función dirige a la página de configuración de proyecto como parámetro el id del proyecto seleccionado
    const handleNavigation = () => {
        navigate(`/config-projects/${id_proyecto}`);
    }

    const checkStatus = (estatus: string) => {
        switch(estatus) {
            case "Planificación":
                return "planificacion";
            case "En Progreso":
                return "en-progreso";
            case "Completado":
                return "completado";
            case "Cancelado":
                return "cancelado";
            default:
                return "planificacion";
        }
    };

    return (
        <article onClick={handleNavigation} className="project-container">
            <header className="project-header">
                <h3>{nombre}</h3>
                <span className={`status-project ${checkStatus(estatus)}`}>{estatus}</span>
            </header>
            <div className="project-body">
                <div className="description-project">
                    <p>{descripcion}</p>
                </div>
                <div className="relations-projects">
                    <div className="persons-container">
                        <span><Group size="xs"/> {colaboradores ? colaboradores : 0 }</span>
                        <p>Personas</p>
                    </div>
                    <div className="date-container">
                        <span><Calendar size="xs"/> {fecha_inicio}</span>
                    </div>
                </div>
                <div className="roles-project">
                    0 roles
                </div>
            </div>
        </article>
    );
}