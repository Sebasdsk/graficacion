import { useContext, useEffect, useState } from "react";
import "./ProcessesCreate.css";
import { ProjectIdContext } from "../../../pages/ConfigProjects";
import type { Proceso } from "../../../Types/Procesos";
import type { Rol } from "../../../Types/Roles";

// Esta interfaz es para pasar el estado para abrir/cerrar el modal de creación de procesos
interface OpenCreateProcessModalProp {
    setCreateProcess: React.Dispatch<React.SetStateAction<boolean>>;
}

// Pasar el setter de procesos 
interface SetProcesosProp {
    setProcesos: React.Dispatch<React.SetStateAction<Proceso[]>>;
}

export default function ProcessesCreate({ setCreateProcess, setProcesos }: OpenCreateProcessModalProp & SetProcesosProp) {
    const [nombre, setNombre] = useState<string>("");
    const [descripcion, setDescripcion] = useState<string>("");
    const [rolParticipante, setRolParticipante] = useState<string>("");
    const [roles, setRoles] = useState<Rol[]>([]);
    const projectId = useContext(ProjectIdContext); // Utiliza el contexto para obtener el ID del proyecto

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    const getRoles = async () => {
        try {
            const response = await fetch(`${API_URL}/roles/proyecto/${projectId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error al obtener los roles: ${response}`);
            }

            const data = await response.json();
            setRoles(data);
        } catch (err) {

        }
    }

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${API_URL}/procesos/crear_proceso`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre: nombre,
                    descripcion: descripcion,
                    id_proyecto: projectId,
                    id_rol: rolParticipante
                }),
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

    useEffect(() => {
        getRoles();
    }, []);

    return (
        <form className="create-process" action={handleSubmit}>
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
                        required />
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
                <div className="process-roles">
                    <label htmlFor="rol-participante">Rol participante</label>
                    <select
                        name="rol-participante"
                        id="rol-participante"
                        value={rolParticipante}
                        onChange={(e) => setRolParticipante(e.target.value)}
                    >
                        {roles.length === 0 && (
                            <option value="">-- No hay roles en el proyecto --</option>
                        )}
                        {roles.length > 0 && (
                            <option value="">-- Seleccione un Rol --</option>
                        )}
                        {roles.length > 0 && roles.map(r => (
                            <option key={r.id_rol} value={r.id_rol}>{r.nombre}</option>
                        ))}
                    </select>
                </div>
                <button>Crear Proceso</button>
            </div>
        </form>
    );
}