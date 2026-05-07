import { useState, useEffect } from "react";
import "./SubprocessCreate.css"; // Reusing the create css since structure is identical
import type { Subproceso } from "../../../Types/Procesos";

interface SubprocessEditProps {
    idSubprocess: number;
    subprocesosList: Subproceso[];
    setSubprocesosList: React.Dispatch<React.SetStateAction<Subproceso[]>>;
    setModalEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SubprocessEdit({ idSubprocess, subprocesosList, setSubprocesosList, setModalEditOpen }: SubprocessEditProps) {
    const [subprocessName, setSubprocessName] = useState<string>("");
    const [subprocessDescription, setSubprocessDescription] = useState<string>("");

    const handleSubmit = async () => {
        const API_URL = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${API_URL}/procesos/subproceso/actualizar/${idSubprocess}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nombre: subprocessName,
                    descripcion: subprocessDescription,
                }),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el subproceso");
            }

            alert("Subproceso actualizado exitosamente");
            setSubprocesosList(subprocesosList.map(sp => sp.id_subproceso === idSubprocess ? { ...sp, nombre: subprocessName, descripcion: subprocessDescription } : sp));
            setModalEditOpen(false);
        } catch (error) {
            console.error("Error:", error);
        }
    };

        useEffect(() => {
        const sp = subprocesosList.find(s => s.id_subproceso === idSubprocess);
        if (sp) {
            setSubprocessName(sp.nombre);
            setSubprocessDescription(sp.descripcion || "");
        }
    }, [idSubprocess, subprocesosList]);

    return (
        <section onSubmit={handleSubmit} className="create-subprocess">
            <header className="header-create-subprocess">
                <h3>Editar Subproceso</h3>
            </header>
            <hr />
            <form action={handleSubmit} className="form-create-subprocess">
                <div className="subprocess-name">
                    <label htmlFor="subprocess-name">Nombre</label>
                    <input
                        type="text"
                        id="subprocess-name"
                        placeholder="Ingrese el nombre del subproceso"
                        value={subprocessName}
                        onChange={(e) => setSubprocessName(e.target.value)}
                        required
                    />
                </div>
                <div className="subprocess-description">
                    <label htmlFor="subprocess-description">Descripción</label>
                    <textarea
                        id="subprocess-description"
                        placeholder="Ingrese la descripción del subproceso"
                        value={subprocessDescription}
                        onChange={(e) => setSubprocessDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button className="btn-create-subprocess">Guardar Cambios</button>
            </form>
        </section>
    );
}
