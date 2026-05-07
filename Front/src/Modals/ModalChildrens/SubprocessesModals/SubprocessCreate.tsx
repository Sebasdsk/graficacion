import { useState } from "react";
import "./SubprocessCreate.css";
import type { Subproceso } from "../../../Types/Procesos";

interface SelectedProcessId {
    idProcess: number;
}

interface SetSubprocessList {
    setSubprocesosList: React.Dispatch<React.SetStateAction<Subproceso[]>>;
}

interface setModalOpenProp {
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SubprocessCreate({ idProcess, setSubprocesosList, setModalOpen }: SelectedProcessId & SetSubprocessList & setModalOpenProp) {
    const [subprocessName, setSubprocessName] = useState<string>("");
    const [subprocessDescription, setSubprocessDescription] = useState<string>("");

    const API_URL = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${API_URL}/procesos/subproceso`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nombre: subprocessName,
                    descripcion: subprocessDescription,
                    id_proceso: idProcess,
                }),
            });

            if (!response.ok) {
                throw new Error("Error al crear el subproceso");
            }

            const data = await response.json();
            alert("Subproceso creado exitosamente");
            console.log("Subproceso creado:", data);
            // Actualiza la lista de subprocesos y agrega el nuevo subproceso
            setSubprocesosList(prev => [...prev, data.subproceso]);
            setModalOpen(false); // Cierra el modal automáticamente después de crear el subproceso
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <section onSubmit={handleSubmit} className="create-subprocess">
            <header className="header-create-subprocess">
                <h3>Nuevo Subproceso</h3>
            </header>
            <hr />
            <form  className="form-create-subprocess">
                <div className="subprocess-name">
                    <label htmlFor="subprocess-name">Nombre</label>
                    <input
                        type="text"
                        id="subprocess-name"
                        placeholder="Ingrese el nombre del subproceso"
                        value={subprocessName}
                        onChange={(e) => setSubprocessName(e.target.value)}
                    />
                </div>
                <div className="subprocess-description">
                    <label htmlFor="subprocess-description">Descripción</label>
                    <textarea
                        id="subprocess-description"
                        placeholder="Ingrese la descripción del subproceso"
                        value={subprocessDescription}
                        onChange={(e) => setSubprocessDescription(e.target.value)}
                    ></textarea>
                </div>
                <button className="btn-create-subprocess">Crear Subproceso</button>
            </form>
        </section>
    );
}