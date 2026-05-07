import type { SetStateAction } from "react";
import "../RolesModals/RolesDelete.css";

interface ProcessesDeleteProps {
    idProcess: number;
    setSelectedDeleteId: React.Dispatch<SetStateAction<number | null>>;
    onDeleteProcess: (id: number) => void;
}

export default function ProcessesDelete({ idProcess, setSelectedDeleteId, onDeleteProcess }: ProcessesDeleteProps) {
    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${API_URL}/procesos/eliminar_proceso/${idProcess}`, {
                method: "PATCH",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el proceso.");
            }

            alert("¡Proceso eliminado correctamente!");
            setSelectedDeleteId(null);
            onDeleteProcess(idProcess);
        } catch (err) {
            console.error("Error al eliminar proceso: ", err);
        }
    };

    return (
        <div className="alert-delete-modal">
            <h2>¿Estás seguro que quieres eliminar este Proceso?</h2>
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
