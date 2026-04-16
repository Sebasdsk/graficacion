import "./CreateNewTechnique.css";
import { X, Plus } from "@boxicons/react";

interface CreateNewTechniqueProps {
    onClose: () => void;
}

export default function CreateNewTechnique({ onClose }: CreateNewTechniqueProps) {
    return (
        <section className="create-technique-page">
            <header className="create-technique-header">
                <h1>Nueva Técnica de Recolección</h1>
                <p>Registra una nueva técnica para recolectar requerimientos</p>
            </header>
            <form action="" className="create-technique-form">
                <label htmlFor="techniqueType">Tipo de Técnica *</label>
                <select id="techniqueType" name="techniqueType" required>
                    <option value="">Selecciona un tipo de técnica</option>
                    <option value="entrevista">Entrevista</option>
                    <option value="cuestionario">Cuestionario</option>
                    <option value="observacion">Observación</option>
                    <option value="focusGroup">Focus Group</option>
                    <option value="historiasUsuario">Historias de Usuario</option>
                    <option value="documentos">Documentos</option>
                    <option value="seguimientoTransacional">Seguimiento Transacional</option>
                </select>

                <label htmlFor="techniqueName">Nombre de la Técnica *</label>
                <input
                    type="text"
                    id="techniqueName"
                    name="techniqueName"
                    placeholder="Ingresa el nombre de la técnica" 
                    required 
                />

                <label htmlFor="description">Descripción (Opcional)</label>
                <textarea 
                    id="description"
                    name="description"
                    placeholder="Ingresa una descripción breve de esta técnica"
                />

                <div className="button-group">
                    <button
                        type="button"
                        className="cancel-button-technique"
                        onClick={onClose}
                    >
                        <X size="xs" />
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="create-button-technique"
                    >
                        <Plus size="xs" />
                        Crear Técnica
                    </button>
                </div>
            </form>
        </section>
    );
}