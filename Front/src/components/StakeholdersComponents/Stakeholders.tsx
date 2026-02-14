import { useState } from "react";
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

            {createStake ? <CreateStakeHolder/> : <StakeholdersList/>}
        </section>
    )
}

function StakeholdersList() {
    return(
        <div className="stakeholders-list">
            {stakeholders.map(s => (
                <Stakeholder
                    key={s.id}
                    nombre={s.nombre}
                    puesto={s.puesto}
                    rol={s.rol}
                    correo={s.correo}/>
            ))}
        </div>
    );
}

interface StakeholdersProp {
    nombre: string;
    puesto: string;
    rol: string;
    correo: string;
}

function Stakeholder({nombre, puesto, rol, correo} : StakeholdersProp ) {
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
                <button className="button-edit-stake"><Edit /></button>
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

function CreateStakeHolder() {
    return (
        <section className="create-stakeholder">
            <header>
                <h3>Crear Stakeholder</h3>
            </header>
            <form action="sumbit" className="form-stakeholder">
                <div className="input-name">
                    <label htmlFor="name-stake">Nombre</label>
                    <input type="text" placeholder="Ingrese el nombre"/>
                </div>
                <div className="input-puesto">
                    <label htmlFor="puesto">Puesto</label>
                    <input type="text" placeholder="Ingrese el puesto o área de trabajo"/>
                </div>
                <div className="input-rol">
                    <label htmlFor="Role">Rol</label>
                    <input type="text" placeholder="Ingrese el rol del stakeholder"/>
                </div>
                <div className="input-email">
                    <label htmlFor="email">Correo</label>
                    <input type="email" placeholder="Ingrese el correo del stakeholder"/>
                </div>
                <button>Crear Stakeholder</button>
            </form>
        </section>
    );
}