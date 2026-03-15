import { Trash, Edit, User, Envelope } from "@boxicons/react";
import "./StakeholdersList.css"
import StakeholdersEdit from "../../Modals/ModalChildrens/StakeholdersModals/StakeholdersEdit";
import { useState } from "react";
import Modal from "../../Modals/Modal";

// Mock data
const stakeholders = [
    {id: 1, nombre: "Sebastián", email: "sebas@email.com", idRole: 1},
    {id: 2, nombre: "Carlos", email: "carlos@email.com", idRole: 2},
    {id: 3, nombre: "Luis", email: "luis@email.com", idRole: 1},
    {id: 4, nombre: "Mario", email: "mario@email.com", idRole: 1},
    {id: 5, nombre: "Maria", email: "maria@email.com", idRole: 2},
];

interface StakeholderIdProp {
    idRole: number;
}

export default function StakeholdersList({ idRole }: StakeholderIdProp) {

    const stakeholdersFilter = stakeholders.filter(s => s.idRole === idRole);

    return (
        <div className="stakeholders-list">
            {stakeholdersFilter.map(s => (
                <Stakeholder
                    key={s.id}
                    id={s.id}
                    nombre={s.nombre}
                    email={s.email}/>
            ))}
        </div>
    );
}

interface StakeholdersInfoProp {
    id: number;
    nombre: string;
    email: string;
}

function Stakeholder({ id, nombre, email }: StakeholdersInfoProp) {
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
                children={<StakeholdersEdit/>}
                setSelectedId={setSelectedId}/>
            }
        </article>
    );
}