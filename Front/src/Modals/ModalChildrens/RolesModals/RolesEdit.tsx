import { Edit } from "@boxicons/react";
import "./RolesEdit.css"

interface StakeholderIdProp {
    selectedId: number | null
}

export default function RolesEdit ({ selectedId }: StakeholderIdProp) {
    console.log(selectedId);
    return (
        <section className="edit-role">
            <header>
                <h3>Editar Rol</h3>
            </header>
            <hr />
            <form action="sumbit" className="form-role">
                <div className="input-name">
                    <label htmlFor="name-stake">Nombre</label>
                    <input
                        type="text"
                        id="name-stake"
                        placeholder="Ingrese el nombre"/>
                </div>
                <div className="input-description">
                    <label htmlFor="stake-description">Descripción</label>
                    <textarea
                    name="description"
                    id="stake-description"
                    placeholder="Breve descripción de lo que representa"/>
                </div>
                <div className="input-status">
                    <label htmlFor="select-status">Estatus</label>
                    <select name="status" id="select-status">
                        <option value=""> -Seleccionar estatus- </option>
                    </select>
                </div>
                <button className="button-edit"><Edit/> Editar Rol</button>
            </form>
        </section>
    );
}