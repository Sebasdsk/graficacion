import React, { useState, type SetStateAction } from "react";
import Modal from "../../Modals/Modal";
import StakeholdersCreate from "../StakeholdersComponents/StakeholdersCreate";
import RolesCreate from "./RolesCreate";
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
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [idRol, setIdRol] = useState<number>(0);

    // Botón para mostrar el formulario de crear un nuevo stakeholder
    const AddRole = () => {
        return ( 
            <button
                onClick={() => setCreateRole(true)}
                className="button-add-role"
            >
                <Plus size="xs"/> Agregar Rol
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
                    children={<RolesCreate/>}
                    setOpen={setCreateRole}/>
            }
            <RolesList
                setSelectedId={setSelectedId}
                setOpenModal={setOpenModal}
                setIdRol={setIdRol}/>
            {selectedId !== null && 
                <Modal
                    children={<StakeholdersEdit selectedId={selectedId}/>}
                    setSelectedId={setSelectedId}/>
            }
            {openModal &&
                <ModalCreate
                    children={<StakeholdersCreate idRol={idRol}/>}
                    setOpen={setOpenModal}/>
            }
        </section>
    )
}

// Este prop es para abrir el modal para editar un stakeholder
interface SelectedIdProp {
    setSelectedId: React.Dispatch<SetStateAction<number | null>>;
}

// Prop para pasar el setter del estado para abrir el modal de crear stakeholder
interface OpenModalCreateStakeholderProp {
    setOpenModal: React.Dispatch<SetStateAction<boolean>>;
}

// Prop que pasa el setter para indicar desde que rol se agregará el stakeholder
interface SetIdRol {
    setIdRol: React.Dispatch<SetStateAction<number>>;
}

function RolesList({ setSelectedId, setOpenModal, setIdRol }: SelectedIdProp & OpenModalCreateStakeholderProp & SetIdRol) {
    return(
        <div className="roles-list">
            {roles.map(r => (
                <Role
                    key={r.id}
                    id={r.id}
                    nombre={r.nombre}
                    descripcion={r.descripcion}
                    setSelectedId={setSelectedId}
                    setOpenModal={setOpenModal}
                    setIdRol={setIdRol}/>
            ))}
        </div>
    );
}

interface RolesProp {
    id: number;
    nombre: string;
    descripcion: string;
}

function Role({ id, nombre, descripcion, setSelectedId, setOpenModal, setIdRol } : RolesProp & SelectedIdProp & OpenModalCreateStakeholderProp & SetIdRol) {
    // Esta función cambia dos states, para indicar que se debe abrir el modal y para pasar el id del rol con props
    const handleCreateStakeholder = () => {
        setOpenModal(true); // Pone en true el estado para abrir el modal de crear un stakeholder
        setIdRol(id); // Cambia el estado al id del rol actual para pasarlo por props al modal
    };
    
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
                    <button
                        className="add-stakeholder"
                        onClick={handleCreateStakeholder}
                    >
                        <UserPlus size="xs"/>
                        Agregar Stakeholders
                    </button>
                </header>
                <hr />
                <StakeholderList idRole={id}/>
            </section>
        </article>
    )
}