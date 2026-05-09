import type { SetStateAction } from "react";
import "../SubprocessesModals/../RolesModals/RolesDelete.css"; // Reuse the same delete CSS class since it's adapted from SubprocessesDelete

interface UMLsDeleteProps {
    idDiagrama: number;
    setSelectedDeleteId: React.Dispatch<SetStateAction<number | null>>;
    onDeleteDiagram: (id: number) => void;
}

export default function UMLsDelete({ idDiagrama, setSelectedDeleteId, onDeleteDiagram }: UMLsDeleteProps) {
    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${API_URL}/diagramasUML/eliminar_diagrama/${idDiagrama}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el diagrama.");
            }

            alert("¡Diagrama eliminado correctamente!");
            setSelectedDeleteId(null);
            onDeleteDiagram(idDiagrama);
        } catch (err) {
            console.error("Error al eliminar diagrama: ", err);
        }
    };

    return (
        <div className="alert-delete-modal">
            <h2>¿Estás seguro que quieres eliminar este Diagrama?</h2>
            <div className="buttons-div-delete">
                <button
                    className="cancel-button-delete"
                    onClick={() => setSelectedDeleteId(null)}
                >
                    Cancelar
                </button>
                <button
                    className="delete-button-confirm"
                    onClick={handleDelete}
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
}
