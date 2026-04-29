import { useContext, useState } from "react";
import "./ProcessesCreate.css";
import { ProjectIdContext } from "../../../pages/ConfigProjects";
import type { Proceso } from "../../../Types/Procesos";

// Esta interfaz es para pasar el estado para abrir/cerrar el modal de creación de procesos
interface OpenCreateProcessModalProp {
    setCreateProcess: React.Dispatch<React.SetStateAction<boolean>>;
}

// Pasar el setter de procesos 
interface SetProcesosProp {
    setProcesos: React.Dispatch<React.SetStateAction<Proceso[]>>;
}

export default function ProcessesCreate({ setCreateProcess, setProcesos }: OpenCreateProcessModalProp & SetProcesosProp) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const projectId = useContext(ProjectIdContext); // Utiliza el contexto para obtener el ID del proyecto

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Lógica para crear un nuevo proceso
        const API_URL = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${API_URL}/procesos/crear_proceso`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ nombre, descripcion, id_proyecto: projectId }),
            });

            if (!response.ok) {
                throw new Error("Error al crear el proceso");
            }

            const data = await response.json();
            alert("Proceso creado exitosamente");
            setCreateProcess(false); // Cierra el modal después de crear el proceso
            setProcesos((prevProcesos) => [...prevProcesos, data.proceso]); // Agrega el nuevo proceso a la lista de procesos
            console.log("Proceso creado:", data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <form className="create-process" onSubmit={handleSubmit}>
            <header className="header-create-process">
                <h3>Crear Nuevo Proceso</h3>
            </header>
            <hr />
            <div className="body-create-process">
                <div className="process-name">
                    <label htmlFor="nombre-proceso">Nombre</label>
                    <input
                        type="text"
                        id="nombre-proceso"
                        placeholder="Ingrese el nombre del proceso"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required/>
                </div>
                <div className="process-description">
                    <label
                        htmlFor="description-process">Descripción</label>
                    <textarea
                        id="description-process"
                        placeholder="Descripción breve del proceso"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    />
                </div>
                <button>Crear Proceso</button>
            </div>
        </form>
    );
}