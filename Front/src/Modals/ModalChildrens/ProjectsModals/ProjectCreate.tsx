import { useState, type FormEvent } from "react";
import "./ProjectCreate.css"
import { useNavigate } from "react-router";

export default function ProjectCreate() {
    const [projectName, setProjectName] = useState<string>("");
    const [projectDescription, setProjectDescription] = useState<string>("");
    const [projectDate, setProjectDate] = useState<string>("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false); // Este estaado es un loader para la petición

    const API_URL = "http://localhost:3000/api/proyectos/crear_proyecto";

    const createProject = async (e: FormEvent) => {
        e.preventDefault();
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
            const response = await fetch(API_URL, {
                method: "POST",
                headers:{
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

            alert("¡Proyecto creado!");
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
            <form onSubmit={createProject} className="form-create-project">
                <div className="input-name">
                    <label htmlFor="proyect-name">Nombre del proyecto</label>
                    <input
                        type="text"
                        id="proyect-name"
                        placeholder="Ingrese el nombre"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required/>
                </div>
                <div className="input-description">
                    <label htmlFor="proyect-description">Descripción del proyecto</label>
                    <textarea
                        name="proyect-description"
                        id="proyect-description"
                        placeholder="Ingrese la descripción"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        required/>
                </div>
                <div className="input-info">
                    <label htmlFor="date-start">Fecha de inicio del proyecto</label>
                    <input
                        type="date"
                        id="date-start"
                        value={projectDate}
                        onChange={(e) => setProjectDate(e.target.value)}
                        required/>
                </div>
                <button className={!loading ? "button-create": "button-create-loading"}>{!loading ? "Crear Proyecto" : "En proceso..."}</button>
            </form>
        </section>
    );
}