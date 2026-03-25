import { useEffect, useState } from "react";
import "./EditProject.css"
import type { Proyecto } from "../../../Types/Proyectos";

interface ProyectosProp {
    proyecto: Proyecto | null;
    setProyecto: React.Dispatch<React.SetStateAction<Proyecto | null>>;
}

interface OpenEditProjectModalProp {
    setOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditProject({proyecto, setProyecto, setOpenEditModal }: ProyectosProp & OpenEditProjectModalProp) {
    const [projectName, setProjectName] = useState<string>("");
    const [projectDescription, setProjectDescription] = useState<string>("");
    const [projectDate, setProjectDate] = useState<string>("");
    const [projectStatus, setProjectStatus] = useState<string>("");

    const API_URL = `${import.meta.env.VITE_API_URL}/proyectos/actualizar/${proyecto?.id_proyecto}`;

    const editProject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const response = await fetch(API_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre: projectName,
                descripcion: projectDescription,
                fecha: projectDate,
                estatus: projectStatus,
            }),
        });
        if (!response.ok) {
            throw new Error("Error al editar el proyecto");
        }

        const data = await response.json();
        setProjectName(data.nombre);
        setProjectDescription(data.descripcion);
        setProjectDate(data.fecha_inicio);
        setProjectStatus(data.estatus);

        // Actualiza la referencia del proyecto
        setProyecto({
            id_proyecto: data.id_proyecto,
            nombre: data.nombre,
            descripcion: data.descripcion,
            fecha_inicio: data.fecha_inicio,
            estatus: data.estatus,
        });
        alert("Proyecto editado correctamente");
        setOpenEditModal(false); // Cierra el modal
    }

    // Sincroniza el estado local del formulario con los datos del proyecto cuando se actualiza la prop proyecto
    useEffect(() => {
        if (proyecto) {
            setProjectName(proyecto.nombre);
            setProjectDescription(proyecto.descripcion);
            setProjectDate(proyecto.fecha_inicio);
            setProjectStatus(proyecto.estatus);
        }
    }, [proyecto]);

    return (
        <section className="edit-project">
            <header>
                <h2>Editar Proyecto</h2>
            </header>
            <form onSubmit={editProject} className="form-edit-project">
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
                    </select>
                </div>
                <button className="button-edit">Editar Proyecto</button>
            </form>
        </section>
    );
}