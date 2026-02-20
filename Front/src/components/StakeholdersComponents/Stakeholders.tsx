import React, { useState, type SetStateAction } from "react";
import Modal from "../../Modals/Modal";
import StakeholdersCreate from "./StakeholdersCreate";
import StakeholdersEdit from "./StakeholdersEdit";
import { Plus, X, UserCircle, Edit } from "@boxicons/react"; 
import "./Stakeholders.css"

// Datos de prueba para la UI
const stakeholders = [
    {id: 1, nombre: "Product Owner", descripcion: "Responsable máximo de maximizar el valor del producto"},
    {id: 2, nombre: "Tech Leader", descripcion: "Desarrollador de software senior encargado de guiar técnicamente a un equipo de desarrollo"}
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
                    descripcion={s.descripcion}
                    setSelectedId={setSelectedId}/>
            ))}
        </div>
    );
}

interface StakeholdersProp {
    id: number;
    nombre: string;
    descripcion: string;
}

function Stakeholder({ id, nombre, descripcion, setSelectedId } : StakeholdersProp & SelectedIdProp) {
    return (
        <article className="stakeholder">
            <header className="stakeholder-header">
                <div className="stake-info">
                    <div className="user-icon">
                        <UserCircle />
                    </div>
                    <div className="stake-data">
                        <h3>{nombre}</h3>
                        <span>{descripcion}</span>
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
            <section className="stakeholder-body">
                <header className="header-stakeholder-body">
                    <span>Miembros</span>
                    <button className="add-person"><Plus/></button>
                </header>
                <div className="list-persons">
                    
                </div>
            </section>
        </article>
    )
}