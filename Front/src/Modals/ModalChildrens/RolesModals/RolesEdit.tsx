import { Edit } from "@boxicons/react";
import { useEffect, useState, type SetStateAction } from "react";
import "./RolesEdit.css"
import type { Rol } from "../../../Types/Roles";

interface StakeholderIdProp {
    selectedId: number | null;
    setSelectedId: React.Dispatch<SetStateAction<number | null>>;
    roleEditar?: Rol;
    onUpdateRole: (updateRole: any) => void;
}

export default function RolesEdit ({ selectedId, setSelectedId, roleEditar, onUpdateRole }: StakeholderIdProp) {
    const [nombreRole, setNombreRole] = useState(roleEditar?.nombre);
    const [descripcionRole, setDescripcionRole] = useState(roleEditar?.descripcion);
    const [estatusRole, setEstausRole] = useState(roleEditar?.estatus);

    useEffect(() => {
        if (selectedId && roleEditar) {
            setNombreRole(roleEditar.nombre);
            setDescripcionRole(roleEditar.descripcion);
            setEstausRole(roleEditar.estatus);
        }
    }, [selectedId, roleEditar]);

    const handleUpdateRole = async () => {
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL;

        const bodyUpdate = {
            id_rol: selectedId,
            nombre: nombreRole,
            descripcion: descripcionRole,
            estatus: estatusRole,
        };

        try {
            console.log(bodyUpdate);
            const response = await fetch(`${API_URL}/roles/actualizar/${selectedId}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`, // Envía el token
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyUpdate)
            });

            if (!response) {
                throw new Error("Error al actualizar el rol:", response);
            }

            const data = await response.json();
            alert("¡¡Rol editado correctamente!!");
            onUpdateRole(data.rolUpdate); // Actualiza los datos del rol actualizado en el callback
            setSelectedId(null);
        } catch (err) {
            console.log("Error en la petición: ", err);
        }
    }

    return (
        <section className="edit-role">
            <header>
                <h3>Editar Rol</h3>
            </header>
            <hr />
            <form action={handleUpdateRole} className="form-role">
                <div className="input-name">
                    <label htmlFor="name-stake">Nombre</label>
                    <input
                        type="text"
                        id="name-stake"
                        placeholder="Ingrese el nombre"
                        value={nombreRole}
                        onChange={(e) => setNombreRole(e.target.value)}/>
                </div>
                <div className="input-description">
                    <label htmlFor="stake-description">Descripción</label>
                    <textarea
                        name="description"
                        id="stake-description"
                        placeholder="Breve descripción de lo que representa"
                        value={descripcionRole}
                        onChange={(e) => setDescripcionRole(e.target.value)}/>
                </div>
                <div className="input-status">
                    <label htmlFor="select-status">Estatus</label>
                    <select 
                        name="status"
                        id="select-status"
                        value={estatusRole}
                        onChange={(e) => setEstausRole(e.target.value)}
                    >
                        <option value=""> -Seleccionar estatus- </option>
                        <option value="A">Activo</option>
                        <option value="I">Inactivo</option>
                    </select>
                </div>
                <button className="button-edit"><Edit/> Editar Rol</button>
            </form>
        </section>
    );
}