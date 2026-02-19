import type { SetStateAction } from "react";
import "./EditProject.css"

interface ProjectValuesProp {
    projectName: string;
    setProjectName: React.Dispatch<SetStateAction<string>>;
    projectDescription: string;
    setProjectDescription: React.Dispatch<SetStateAction<string>>;
    projectDate: string;
    setProjectDate: React.Dispatch<SetStateAction<string>>;
    projectStatus: string;
    setProjectStatus: React.Dispatch<SetStateAction<string>>;
}

export default function EditProject({
    projectName, setProjectName, projectDescription,setProjectDescription,
    projectDate, setProjectDate, projectStatus, setProjectStatus }: ProjectValuesProp) {
    return (
        <section className="edit-project">
            <header>
                <h2>Editar Proyecto</h2>
            </header>
            <form action="sumbit" className="form-edit-project">
                <div className="project-name">
                    <label htmlFor="proyect-name">Nombre del proyecto</label>
                    <input
                        type="text"
                        id="proyect-name"
                        placeholder="Ingrese el nombre"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}/>
                </div>
                <div className="project-description">
                    <label htmlFor="proyect-description">Descripción del proyecto</label>
                    <textarea
                        name="proyect-description" 
                        id="proyect-description"
                        placeholder="Ingrese la descripción"
                        value={projectDescription.split("T")[0]}
                        onChange={(e) => setProjectDescription(e.target.value)}/>
                </div>
                <div className="project-date">
                    <label htmlFor="date-start">Fecha de inicio del proyecto</label>
                    <input
                        type="date"
                        id="date-start"
                        value={projectDate}
                        onChange={(e) => setProjectDate(e.target.value)}
                    />
                </div>
                <div className="project-status">
                    <label htmlFor="status">Estatus</label>
                    <select
                        name="estatus-project"
                        id="status" value={projectStatus}
                        onChange={(e) => setProjectStatus(e.target.value)}
                    >
                        <option value=""> -Seleccionar estatus- </option>
                        <option value="Planificación">Planificación</option>
                        <option value="En Progreso">En Progreso</option>
                        <option value="Completado">Completado</option>
                        <option value="Cancelado">Cancelado</option>
                    </select>
                </div>
                <button className="button-edit">Editar Proyecto</button>
            </form>
        </section>
    );
}