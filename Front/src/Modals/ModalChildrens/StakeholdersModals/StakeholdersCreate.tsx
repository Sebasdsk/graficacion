import "./StakeholdersCreate.css";

// Se pasa el id del rol al modal de crear stakeholder para relacionarlo al rol al que pertenecerá
interface IdRoleProp {
    idRol: number;
}

export default function StakeholdersCreate({ idRol }: IdRoleProp) {
    // Solo para debugging
    console.log("Este stakeholder pertenecerá al rol con id: ", idRol);

    return(
        <section className="create-stakeholder">
            <header>
                <h3>Crear Stakeholder</h3>
            </header>
            <form action="" className="form-stakeholder">
                <div className="stake-name">
                    <label htmlFor="stakeholder-name">Nombre</label>
                    <input
                        type="text"
                        id="stakeholder-name"
                        placeholder="Nombre del stakeholder"
                        required/>
                </div>
                <div className="stake-email">
                    <label htmlFor="stakeholder-email">Correo Electrónico (Opcional)</label>
                    <input
                        type="email"
                        id="stakeholder-email"
                        placeholder="Correo del stakeholder"/>
                </div>
                <button className="button-create-stakeholder">Crear Stakeholder</button>
            </form>
        </section>
    );
}