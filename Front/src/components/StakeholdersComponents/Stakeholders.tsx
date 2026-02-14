import React, { useState, type SetStateAction } from "react";
import Modal from "../../Modals/Modal";
import StakeholdersCreate from "./StakeholdersCreate";
import StakeholdersEdit from "./StakeholdersEdit";
import { Plus, X, Apartment, Envelope, UserCircle, Edit } from "@boxicons/react"; 
import "./Stakeholders.css"

// Datos de prueba para la UI
const stakeholders = [
    {id: 1, nombre: "Luis Soto", puesto: "Gerente de ventas", rol: "Gerente", correo: "luis@mail.com"},
    {id: 2, nombre: "Carlos Bojórquez", puesto: "Supervisor de operaciones", rol: "Spervisor", correo: "carlxs@mail.com"},
    {id: 3, nombre: "Sebastían Villa", puesto: "Financiador de operaciones", rol: "Financiero", correo: "sebas@mail.com"},
]

export default function Stakeholders() {
    const [createStake, setCreateStake] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Botón para mostrar el formulario de crear un nuevo stakeholder
    const AddStakeholder = () => {
        return ( 
            <button
                onClick={() => setCreateStake(true)}
                className="button-add-stake"
            >
                <Plus /> Agregar Stakeholder
            </button>
        )
    }

    // Botón que cancela la operación de crear un nuevo stakeholder y muestra la lista
    const CancelAddStakeholder = () => {
        return (
            <button
                onClick={() => setCreateStake(false)}
                className="button-cancel-add"
            >
                <X /> Cancelar
            </button>
        )
    }

    return (
        <section className="stakeholders">
            <header className="stakeholders-header">
                <h2>Stakeholders</h2>
                {createStake ? <CancelAddStakeholder/> : <AddStakeholder/>}
            </header>

            {createStake ? <StakeholdersCreate/> : <StakeholdersList setSelectedId={setSelectedId}/>}
            {selectedId !== null && <Modal children={<StakeholdersEdit selectedId={selectedId}/>} setSelectedId={setSelectedId}/>}
        </section>
    )
}

// Este prop es para abrir el modal para editar un stakeholder
interface SelectedIdProp {
    setSelectedId: React.Dispatch<SetStateAction<number | null>>;
}

function StakeholdersList({ setSelectedId }: SelectedIdProp) {
    return(
        <div className="stakeholders-list">
            {stakeholders.map(s => (
                <Stakeholder
                    key={s.id}
                    id={s.id}
                    nombre={s.nombre}
                    puesto={s.puesto}
                    rol={s.rol}
                    correo={s.correo}
                    setSelectedId={setSelectedId}/>
            ))}
        </div>
    );
}

interface StakeholdersProp {
    id: number;
    nombre: string;
    puesto: string;
    rol: string;
    correo: string;
}

function Stakeholder({ id, nombre, puesto, rol, correo, setSelectedId } : StakeholdersProp & SelectedIdProp) {
    return (
        <article className="stakeholder">
            <header className="stakeholder-header">
                <div className="stake-info">
                    <div className="user-icon">
                        <UserCircle />
                    </div>
                    <div className="stake-data">
                        <h3>{nombre}</h3>
                        <span>{puesto}</span>
                    </div>
                </div>
                <button
                    className="button-edit-stake"
                    onClick={() => setSelectedId(id)}
                >
                    <Edit />
                </button>
            </header>
            <hr />
            <div className="stakeholder-body">
                <div className="rol-div">
                    <Apartment />
                    <span>{rol}</span>
                </div>
                <div className="email-div">
                    <Envelope />
                    <span>{correo}</span>
                </div>
            </div>
        </article>
    )
}