import "./StakeholdersCreate.css";
import { useState } from "react";

// Se pasa el id del rol al modal de crear stakeholder para relacionarlo al rol al que pertenecerá
interface IdRoleProp {
    idRol: number;
}

interface Form {
    nombre: string;
    correo: string;
}

export default function StakeholdersCreate({ idRol }: IdRoleProp) {
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

            if (!response) {
                throw new Error("Error al crear el stakeholder: ", response);
            }

            const data = await response.json();
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