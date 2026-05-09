import type { DiagramaUml } from "../../../pages/UMLsDashboard";
import { useState } from "react";
import "./UMLsCreate.css"; // Reuse the create CSS

interface UMLsEditProps {
    diagram: DiagramaUml;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setDiagramasUML: React.Dispatch<React.SetStateAction<DiagramaUml[]>>;
}

export default function UMLsEdit({ diagram, setModalOpen, setDiagramasUML }: UMLsEditProps) {
    const [formData, setFormData] = useState({
        nombre: diagram.nombre,
        descripcion: diagram.descripcion
    });

    const API_URL = import.meta.env.VITE_API_URL;

    const handleSubmitUML = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        
        try {
            const response = await fetch(`${API_URL}/diagramasUML/actualizar_diagrama/${diagram.id_diagrama}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    descripcion: formData.descripcion,
                }),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el diagrama");
            }
            
            const updatedDiagram = await response.json();
            alert("Diagrama actualizado exitosamente");
            
            // Actualiza la lista de diagramas UML
            setDiagramasUML(prev => prev.map(d => 
                d.id_diagrama === diagram.id_diagrama 
                    ? { ...d, nombre: updatedDiagram.nombre, descripcion: updatedDiagram.descripcion } 
                    : d
            ));
            setModalOpen(false);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <section className="create-uml">
            <header className="header-create-uml">
                <h3>Editar Diagrama UML</h3>
            </header>
            <hr />
            <form onSubmit={handleSubmitUML} className="form-create-uml">
                <div className="diagram-name">
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Nombre del diagrama"
                        required />
                </div>
                <div className="diagram-description">
                    <label htmlFor="descripcion">Descripción:</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                        placeholder="Descripción del diagrama"
                        required></textarea>
                </div>
                <button type="submit" className="btn-create-uml">Guardar Cambios</button>
            </form>
        </section>
    );
}
