import type { SetStateAction } from "react";
import "../RolesModals/RolesDelete.css";

interface SubprocessesDeleteProps {
    idSubprocess: number;
    setSelectedDeleteId: React.Dispatch<SetStateAction<number | null>>;
    onDeleteSubprocess: (id: number) => void;
}

export default function SubprocessesDelete({ idSubprocess, setSelectedDeleteId, onDeleteSubprocess }: SubprocessesDeleteProps) {
    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${API_URL}/procesos/subproceso/eliminar/${idSubprocess}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el subproceso.");
            }

            alert("¡Subproceso eliminado correctamente!");
            setSelectedDeleteId(null);
            onDeleteSubprocess(idSubprocess);
        } catch (err) {
            console.error("Error al eliminar subproceso: ", err);
        }
    };

    return (
        <div className="alert-delete-modal">
            <h2>¿Estás seguro que quieres eliminar este Subproceso?</h2>
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
