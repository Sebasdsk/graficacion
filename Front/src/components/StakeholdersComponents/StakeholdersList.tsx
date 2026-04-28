import { Trash, Edit, User, Envelope } from "@boxicons/react";
import "./StakeholdersList.css"
import StakeholdersEdit from "../../Modals/ModalChildrens/StakeholdersModals/StakeholdersEdit";
import { useEffect, useState } from "react";
import Modal from "../../Modals/Modal";
import type { Stakeholder } from "../../Types/Stakeholders";

interface StakeholderIdProp {
    idRole: number;
    onStakeholderAdded?: () => void;
}

export default function StakeholdersList({ idRole, onStakeholderAdded }: StakeholderIdProp) {
    const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);

    // Esta función actualiza la UI del stakeholder editado dinámicamente sin refresh
    const handleUpdateStakeholder = (updateStake: Stakeholder) => {
        setStakeholders(stakeholders.map(s => 
            s.id_stakeholder === updateStake.id_stakeholder ? updateStake : s
        ));
    }

    const getStakeholders = async () => {
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${API_URL}/stakeholders/lista-stakeholders/${idRole}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`, // Envía el token
                    'Content-Type': 'application/json'
                }
            });

            if (!response) {
                throw new Error("Error al obtener los stakeholders del rol", response);
            }

            const data = await response.json();
            setStakeholders(data);
        } catch (err) {
            console.log("Error en la query: ", err);
        }
    };

    useEffect(() => {
        getStakeholders();
    }, []);

    // Refrescar cuando se notifique que se agregó uno nuevo
    useEffect(() => {
        if (onStakeholderAdded) {
            getStakeholders();
        }
    }, [onStakeholderAdded]);

    return (
        <div className="stakeholders-list">
            {stakeholders.length === 0 && (
                <div className="no-stakeholders-list">No hay stakeholders en este rol</div>
            )}
            {stakeholders.length > 0 && stakeholders.map(s => (
                <Stakeholder
                    key={s.id_stakeholder}
                    id={s.id_stakeholder}
                    nombre={s.nombre}
                    email={s.contacto_email}
                    handleUpdateStakeholder={handleUpdateStakeholder}/>
            ))}
        </div>
    );
}

interface StakeholdersInfoProp {
    id: number;
    nombre: string;
    email: string;
    handleUpdateStakeholder?: (updateStake: Stakeholder) => void;
}

function Stakeholder({ id, nombre, email, handleUpdateStakeholder }: StakeholdersInfoProp) {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
        <article className="stakeholder-info">
            <div className="stakeholder-detail">
                <div className="stakeholder-name">
                    <User size="xs"/>
                    {nombre}
                </div>
                <div className="stakeholder-email">
                    <Envelope size="xs"/>
                    {email}
                </div>
            </div>
            <div className="buttons-actions">
                <button
                    onClick={() => setSelectedId(id)}>
                    <Edit size="sm"/>
                </button>
                <button><Trash size="sm" /></button>
            </div>
            {selectedId && <Modal
                children={
                    <StakeholdersEdit 
                        id_stakeholder={id}
                        nombre={nombre}
                        contacto_email={email}
                        setSelectedId={setSelectedId} 
                        onUpdateStakeholder={handleUpdateStakeholder}
                    />
                }
                setSelectedId={setSelectedId}/>
            }
        </article>
    );
}