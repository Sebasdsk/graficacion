import "./StakeholdersCreate.css"

export default function StakeholdersCreate() {
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