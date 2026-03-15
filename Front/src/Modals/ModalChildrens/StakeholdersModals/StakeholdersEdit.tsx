import { Edit } from "@boxicons/react";
import "./StakeholdersEdit.css";

export default function StakeholdersEdit() {
    return (
        <section className="edit-stakeholder">
            <header>
                <h3>Editar Stakeholder</h3>
            </header>
            <form action="" className="form-edit-stakeholder">
                <div className="stake-name">
                    <label htmlFor="stakeholder-name">Nombre</label>
                    <input
                        type="text"
                        id="stakeholder-name"
                        placeholder="Nuevo nombre del stakeholder"
                        required/>
                </div>
                <div className="stake-email">
                    <label htmlFor="stakeholder-email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="stakeholder-email"
                        placeholder="Nuevo correo del stakeholder"/>
                </div>
                <button className="button-edit-stakeholder">
                    <Edit/>
                    Editar Stakeholder
                </button>
            </form>
        </section>
    );
}