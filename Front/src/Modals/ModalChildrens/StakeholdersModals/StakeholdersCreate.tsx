import "./StakeholdersCreate.css";
import { useState, type SetStateAction } from "react";

// Se pasa el id del rol al modal de crear stakeholder para relacionarlo al rol al que pertenecerá
interface IdRoleProp {
    idRol: number;
}

interface HandleOpenModalProp {
    setOpenModal: React.Dispatch<SetStateAction<boolean>>;
}

interface Form {
    nombre: string;
    correo: string;
}

// Prop con un callback para ejecutar un trigger desde "Roles.tsx"
interface OnStakeholderCreatedProp {
    onStakeholderCreated?: (roleId: number) => void;
}

export default function StakeholdersCreate({ idRol, setOpenModal, onStakeholderCreated }: IdRoleProp & HandleOpenModalProp & OnStakeholderCreatedProp) {
    const [form, setForm] = useState<Form>({
        nombre: "",
        correo: ""
    });

    // Función que cambia los valores del formulario
    const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    }
    // Solo para debugging
    console.log("Este stakeholder pertenecerá al rol con id: ", idRol);

    const handleCreateStakeholder = async () => {
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL;

        const bodyCreate = {
            nombre: form.nombre,
            correo: form.correo,
            id_rol: idRol
        };

        try {
            const response = await fetch(`${API_URL}/stakeholders/crear-stakeholder`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
                body: JSON.stringify(bodyCreate)
            });

            if (!response.ok) {
                throw new Error("Error al crear el stakeholder: ");
            }

            const data = await response.json();
            alert("¡¡Stakeholder creado!!");
            setOpenModal(false); // Cierra el modal
            
            // Llamar al callback ANTES de cerrar el modal
            if (onStakeholderCreated) {
                onStakeholderCreated(idRol);  // Pasa el idRol específico
            }
            console.log(data.stakeholder);
        } catch (err) {
            console.error("Error en la query: ", err);
        }
    }

    return(
        <section className="create-stakeholder">
            <header>
                <h3>Crear Stakeholder</h3>
            </header>
            <form action={handleCreateStakeholder} className="form-stakeholder">
                <div className="stake-name">
                    <label htmlFor="stakeholder-name">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        id="stakeholder-name"
                        placeholder="Nombre del stakeholder"
                        value={form.nombre}
                        onChange={handleChangeForm}
                        required/>
                </div>
                <div className="stake-email">
                    <label htmlFor="stakeholder-email">Correo Electrónico (Opcional)</label>
                    <input
                        type="email"
                        name="correo"
                        id="stakeholder-email"
                        placeholder="Correo del stakeholder"
                        value={form.correo}
                        onChange={handleChangeForm}/>
                </div>
                <button className="button-create-stakeholder">Crear Stakeholder</button>
            </form>
        </section>
    );
}