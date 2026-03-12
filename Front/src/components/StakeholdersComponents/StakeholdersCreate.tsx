export default function StakeholdersCreate() {
    return(
        <section className="create-stakeholder">
            <header>
                <h3>Crear Stakeholder</h3>
            </header>
            <form action="" className="form-stakeholder">
                <div className="stakeholder-name">
                    <label htmlFor="stakeholder-name">Nombre</label>
                    <input type="text" id="stakeholder-name"/>
                </div>
                <div className="stakeholder-email">
                    <label htmlFor="stakeholder-email">Correo Electrónico (Opcional)</label>
                    <input type="text" id="stakeholder-email"/>
                </div>
                <button className="button-create-stakeholder">Crear Stakeholder</button>
            </form>
        </section>
    );
}