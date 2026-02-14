import { Edit } from "@boxicons/react";
import "./StakeholdersEdit.css"

interface StakeholderIdProp {
    selectedId: number | null
}

export default function StakeholdersEdit ({ selectedId }: StakeholderIdProp) {
    console.log(selectedId);
    return (
        <section className="edit-stakeholder">
            <header>
                <h3>Editar Stakeholder</h3>
            </header>
            <form action="sumbit" className="form-stakeholder">
                <div className="input-name">
                    <label htmlFor="name-stake">Nombre</label>
                    <input
                        type="text"
                        placeholder="Ingrese el nombre"
                    />
                </div>
                <div className="input-puesto">
                    <label htmlFor="puesto">Puesto</label>
                    <input
                        type="text"
                        placeholder="Ingrese el puesto o área de trabajo"
                    />
                </div>
                <div className="input-rol">
                    <label htmlFor="Role">Rol</label>
                    <input
                        type="text"
                        placeholder="Ingrese el rol del stakeholder"
                    />
                </div>
                <div className="input-email">
                    <label htmlFor="email">Correo</label>
                    <input
                        type="email"
                        placeholder="Ingrese el correo del stakeholder"
                    />
                </div>
                <button className="button-edit"><Edit/> Editar Stakeholder</button>
            </form>
        </section>
    );
}