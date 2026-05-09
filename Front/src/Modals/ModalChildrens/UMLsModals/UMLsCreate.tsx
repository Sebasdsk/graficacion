import type { DiagramaUml } from "../../../pages/UMLsDashboard";
import { useState } from "react";
import "./UMLsCreate.css";

interface SelectedProjectId {
    idProject: number;
}

interface setModalOpenProp {
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface setDiagramasUMLProp {
    setDiagramasUML: React.Dispatch<React.SetStateAction<DiagramaUml[]>>;
}

export default function UMLsCreate({ idProject, setModalOpen, setDiagramasUML }: SelectedProjectId & setModalOpenProp & setDiagramasUMLProp) {
    const [formData, setFormData] = useState({
        tipo_diagrama: '',
        nombre: '',
        descripcion: ''
    });

    const API_URL = import.meta.env.VITE_API_URL;

    const handleSubmitUML = async () => {
        const token = localStorage.getItem("token");
        
        try {
            const response = await fetch(`${API_URL}/diagramasUML/crear-diagrama`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id_proyecto: idProject,
                    nombre: formData.nombre,
                    descripcion: formData.descripcion,
                    tipo: formData.tipo_diagrama,
                }),
            });

            if (!response.ok) {
                throw new Error("Error al crear el diagrama");
            }
            
            const data = await response.json();
            alert("Diagrama creado exitosamente");
            // Actualiza la lista de diagramas UML y agrega el nuevo diagrama
            setDiagramasUML(prev => [...prev, data]);
            setModalOpen(false); // Cierra el modal automáticamente después de crear el diagrama
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <section className="create-uml">
            <header className="header-create-uml">
                <h3>Nuevo Diagrama UML</h3>
            </header>
            {/* Formulario para crear un nuevo diagrama UML */}
            <hr />
            <form action={handleSubmitUML} className="form-create-uml">
                <div className="diagram-type">
                    <label htmlFor="tipo-diagrama">Tipo de diagrama:</label>
                    <select
                        id="tipo-diagrama"
                        name="tipo-diagrama"
                        value={formData.tipo_diagrama}
                        onChange={e => setFormData({ ...formData, tipo_diagrama: e.target.value })}
                        required
                    >
                        <option value="">-- Seleccionar tipo --</option>
                        <option value="use_case">Diagrama de Casos de Uso</option>
                        <option value="class">Diagrama de Clases</option>
                        <option value="sequence">Diagrama de Secuencia</option>
                        <option value="package">Diagrama de Paquetes</option>
                    </select>
                </div>
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
                <button type="submit" className="btn-create-uml">Crear Diagrama</button>
            </form>
        </section>
    );
}
