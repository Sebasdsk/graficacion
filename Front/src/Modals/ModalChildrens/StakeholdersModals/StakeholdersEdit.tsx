import { Edit } from "@boxicons/react";
import "./StakeholdersEdit.css";
import { useState, type SetStateAction } from "react";

interface StakeholdersValuesEditProp {
    id_stakeholder: number;
    nombre: string;
    contacto_email: string;
    setSelectedId: React.Dispatch<SetStateAction<number | null>>;
    onUpdateStakeholder?: (updateStake: any) => void;
}

export default function StakeholdersEdit({ id_stakeholder, nombre, contacto_email, setSelectedId, onUpdateStakeholder }: StakeholdersValuesEditProp) {
    const [stakeholderName, setStakeholderName] = useState<string>(nombre);
    const [stakeholderContacto, setStakeholderContacto] = useState<string>(contacto_email);

    const handleUpdateStakeholder = async () => {
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL;

        const bodyUpdate = {
            nombre: stakeholderName,
            correo: stakeholderContacto 
        };

        try {
            const response = await fetch(`${API_URL}/stakeholders/editar-stakeholder/${id_stakeholder}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyUpdate)
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el stakeholder");
            }

            const data = await response.json();
            alert("¡¡Stakeholder actualizado correctamente!!");
            
            if (onUpdateStakeholder) {
                onUpdateStakeholder(data.updateStakeholder);
            }
            setSelectedId(null);
            console.log(data);
        } catch (err) {
            console.log("Error en la query: ", err);
        }
    }

    return (
        <section className="edit-stakeholder">
            <header>
                <h3>Editar Stakeholder</h3>
            </header>
            <form action={handleUpdateStakeholder} className="form-edit-stakeholder">
                <div className="stake-name">
                    <label htmlFor="stakeholder-name">Nombre</label>
                    <input
                        type="text"
                        id="stakeholder-name"
                        placeholder="Nuevo nombre del stakeholder"
                        value={stakeholderName}
                        onChange={(e) => setStakeholderName(e.target.value)}
                        required
                    />
                </div>
                <div className="stake-email">
                    <label htmlFor="stakeholder-email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="stakeholder-email"
                        placeholder="Nuevo correo del stakeholder"
                        value={stakeholderContacto}
                        onChange={(e) => setStakeholderContacto(e.target.value)}
                    />
                </div>
                <button className="button-edit-stakeholder">
                    <Edit/>
                    Editar Stakeholder
                </button>
            </form>
        </section>
    );
}