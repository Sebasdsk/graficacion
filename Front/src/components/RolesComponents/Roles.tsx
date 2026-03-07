import React, { useState, type SetStateAction } from "react";
import Modal from "../../Modals/Modal";
import StakeholdersCreate from "./RolesCreate";
import StakeholdersEdit from "./RolesEdit";
import { Plus, Edit, UserPlus } from "@boxicons/react"; 
import StakeholderList from "../StakeholdersComponents/StakeholdersList";
import ModalCreate from "../../Modals/ModalCreate";
import "./Roles.css"

// Datos de prueba para la UI
const roles = [
    {id: 1, nombre: "Product Owner", descripcion: "Responsable máximo de maximizar el valor del producto"},
    {id: 2, nombre: "Tech Leader", descripcion: "Desarrollador de software senior encargado de guiar técnicamente a un equipo de desarrollo"}
]

export default function Roles() {
    const [createRole, setCreateRole] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Botón para mostrar el formulario de crear un nuevo stakeholder
    const AddRole = () => {
        return ( 
            <button
                onClick={() => setCreateRole(true)}
                className="button-add-role"
            >
                <Plus /> Agregar Rol
            </button>
        )
    }

    return (
        <section className="roles">
            <header className="roles-header">
                <h2>Roles y Stakeholders</h2>
                <AddRole/>
            </header>

            {createRole &&
                <ModalCreate
                    children={<StakeholdersCreate/>}
                    setOpen={setCreateRole}
            />}
            <RolesList setSelectedId={setSelectedId}/>
            {selectedId !== null && 
                <Modal
                    children={<StakeholdersEdit selectedId={selectedId}/>}
                    setSelectedId={setSelectedId}
            />}
        </section>
    )
}

// Este prop es para abrir el modal para editar un stakeholder
interface SelectedIdProp {
    setSelectedId: React.Dispatch<SetStateAction<number | null>>;
}

function RolesList({ setSelectedId }: SelectedIdProp) {
    return(
        <div className="roles-list">
            {roles.map(r => (
                <Role
                    key={r.id}
                    id={r.id}
                    nombre={r.nombre}
                    descripcion={r.descripcion}
                    setSelectedId={setSelectedId}/>
            ))}
        </div>
    );
}

interface RolesProp {
    id: number;
    nombre: string;
    descripcion: string;
}

function Role({ id, nombre, descripcion, setSelectedId } : RolesProp & SelectedIdProp) {
    return (
        <article className="role">
            <header className="role-header">
                <div className="role-info">
                    <h3>{nombre}</h3>
                    <p>{descripcion}</p>
                </div>
                <button
                    className="button-edit-role"
                    onClick={() => setSelectedId(id)}
                >
                    <Edit />
                </button>
            </header>
            <section className="role-body">
                <header className="header-role-body">
                    <span>{0} stakeholders</span>
                    <button className="add-stakeholder"><UserPlus size="xs"/> Agregar Stakeholders</button>
                </header>
                <hr />
                <StakeholderList idRole={id}/>
            </section>
        </article>
    )
}