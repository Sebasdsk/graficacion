import React, { useEffect, useState, useContext, type SetStateAction } from "react";
import { ProjectIdContext } from "../../pages/ConfigProjects";
import type { Rol } from "../../Types/Roles";
import Modal from "../../Modals/Modal";
import StakeholdersCreate from "../../Modals/ModalChildrens/StakeholdersModals/StakeholdersCreate";
import RolesCreate from "../../Modals/ModalChildrens/RolesModals/RolesCreate";
import RolesEdit from "../../Modals/ModalChildrens/RolesModals/RolesEdit";
import { Plus, Edit, UserPlus, Trash } from "@boxicons/react"; 
import StakeholderList from "../StakeholdersComponents/StakeholdersList";
import ModalCreate from "../../Modals/ModalCreate";
import "./Roles.css";

export default function Roles() {
    const projectId = useContext(ProjectIdContext); // Acceder al contexto del proyecto seleccionado
    const [createRole, setCreateRole] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [roles, setRoles] = useState<Rol[]>([]); // Guarda los roles obtenidos del back
    const [idRol, setIdRol] = useState<number>(0)
    
    // Esto extrae el rol en base al id seleccionado para pasarlo como prop
    const roleEditar = roles.find(r => r.id_rol === selectedId);

    // Función que actualiza el rol en la UI, para reflejar los cambios directamente
    const handleUpdateRole = (updateRole: Rol) => {
        setRoles(roles.map(r => 
            r.id_rol === updateRole.id_rol ? updateRole : r
        ));
    };

    const getAllRoles = async () => {
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${API_URL}/roles/proyecto/${projectId}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`, // Envía el token
                    'Content-Type': 'application/json'
                }
            });

            if (!response) {
                throw new Error("No se pudo conseguir los roles", response);
            }

            const data = await response.json();
            console.log(data);
            setRoles(data);
        } catch (err) {
            console.error("Error al conseguir los roles de este proyecto.", err);
        }
    }

    useEffect(() => {
        getAllRoles();
    }, []);

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
                selectedId={selectedId}
                setIdRol={setIdRol}
                roles={roles}/>
            {selectedId !== null && 
                <Modal
                    children={
                        <RolesEdit
                            selectedId={selectedId}
                            setSelectedId={setSelectedId}
                            roleEditar={roleEditar}
                            onUpdateRole={handleUpdateRole}
                        />
                    }
                    setSelectedId={setSelectedId}
                />
            }
            {openModal &&
                <ModalCreate
                    children={<StakeholdersCreate idRol={idRol}/>}
                    setOpen={setOpenModal}/>
            }
        </section>
    )
}

interface RolesStateProp {
    roles: any[];
}

// Este prop es para abrir el modal para editar un stakeholder
interface SelectedIdProp {
    selectedId: number | null;
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

function RolesList({ selectedId, setSelectedId, setOpenModal, setIdRol, roles }: SelectedIdProp & OpenModalCreateStakeholderProp & SetIdRol & RolesStateProp) {
    return(
        <div className="roles-list">
            {roles.map(r => (
                <Role
                    key={r.id_rol}
                    id={r.id_rol}
                    nombre={r.nombre}
                    descripcion={r.descripcion}
                    estatus={r.estatus}
                    selectedId={selectedId}
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
    estatus: string;
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
                <button className="button-delete-role">
                    <Trash fill="#e10303ff"/>
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