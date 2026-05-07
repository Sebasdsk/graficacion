import { useState, type SetStateAction } from "react";
import "./ProjectCreate.css"
import { useNavigate } from "react-router";
import type { Proyecto } from "../../../Types/Proyectos";

interface SetProjectsProp {
    projects: Proyecto[];
    setProjects: React.Dispatch<SetStateAction<Proyecto[]>>;
    setCreateProject: React.Dispatch<SetStateAction<boolean>>;
}

export default function ProjectCreate({ projects, setProjects, setCreateProject }: SetProjectsProp) {
    const [projectName, setProjectName] = useState<string>("");
    const [projectDescription, setProjectDescription] = useState<string>("");
    const [projectDate, setProjectDate] = useState<string>("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false); // Este estaado es un loader para la petición

    const API_URL = import.meta.env.VITE_API_URL;

    const createProject = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        }

        const body = {
            nombre: projectName,
            descripcion: projectDescription,
            fecha_inicio: projectDate,
        };

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/proyectos/crear_proyecto`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                alert("Error al crear el proyecto");
                console.error("Error al crear el proyecto: ", await response.json());
                return;
            }

            const data = await response.json();
            const fechaFormat = new Date(data.project.fecha_inicio).toISOString().split('T')[0];
            data.project.fecha_inicio = fechaFormat;

            setProjects([...projects, data.project]);

            alert("¡Proyecto creado!");
            setCreateProject(false);
        } catch (err) {
            console.error("Error al crear el proyecto: ", err);
            alert("Error al crear el proyecto");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="project-create">
            <header>
                <h3> Crear Nuevo Proyecto</h3>
            </header>
            <form action={createProject} className="form-create-project">
                <div className="input-name">
                    <label htmlFor="proyect-name">Nombre del proyecto</label>
                    <input
                        type="text"
                        id="proyect-name"
                        placeholder="Ingrese el nombre"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required />
                </div>
                <div className="input-description">
                    <label htmlFor="proyect-description">Descripción del proyecto</label>
                    <textarea
                        name="proyect-description"
                        id="proyect-description"
                        placeholder="Ingrese la descripción"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        required />
                </div>
                <div className="input-info">
                    <label htmlFor="date-start">Fecha de inicio del proyecto</label>
                    <input
                        type="date"
                        id="date-start"
                        value={projectDate}
                        onChange={(e) => setProjectDate(e.target.value)}
                        required />
                </div>
                <button className={!loading ? "button-create" : "button-create-loading"}>{!loading ? "Crear Proyecto" : "En proceso..."}</button>
            </form>
        </section>
    );
}