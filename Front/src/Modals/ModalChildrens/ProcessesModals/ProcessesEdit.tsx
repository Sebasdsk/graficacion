import { useState, useEffect } from "react";
import "./ProcessesEdit.css";
import type { Proceso } from "../../../Types/Procesos";

interface ProcessesEditProps {
    idProcess: number;
    procesos: Proceso[];
    setProcesos: React.Dispatch<React.SetStateAction<Proceso[]>>;
    setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function ProcessesEdit({ idProcess, procesos, setProcesos, setSelectedId }: ProcessesEditProps) {
    const [nombre, setNombre] = useState<string>("");
    const [descripcion, setDescripcion] = useState<string>("");

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    useEffect(() => {
        const proccess = procesos.find(proc => proc.id_proceso === idProcess);
        if (proccess) {
            setNombre(proccess.nombre);
            setDescripcion(proccess.descripcion || "");
        }
    }, [idProcess, procesos]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/procesos/actualizar_proceso/${idProcess}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ nombre, descripcion })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setProcesos(procesos.map(p => p.id_proceso === idProcess ? { ...p, nombre, descripcion } : p));
                setSelectedId(null);
            } else {
                alert("Error al actualizar proceso");
            }
        } catch (error) {
            console.error("Error al actualizar proceso:", error);
        }
    };

    return (
        <section className="edit-process-container">
            <header className="header-edit-process">
                <h3>Editar Proceso</h3>
            </header>
            <hr />
            <form className="edit-process" onSubmit={handleSubmit}>
                <div className="body-edit-process">
                    <div className="process-name">
                        <label>Nombre</label>
                        <input type="text" placeholder="Nombre del proceso" value={nombre} onChange={e => setNombre(e.target.value)} required />
                    </div>
                    <div className="process-description">
                        <label>Descripción</label>
                        <textarea placeholder="Descripción breve del proceso" value={descripcion} onChange={e => setDescripcion(e.target.value)} required></textarea>
                    </div>
                    <button type="submit">Editar Proceso</button>
                </div>
            </form>
        </section>
    );
}