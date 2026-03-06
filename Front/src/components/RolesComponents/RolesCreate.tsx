import "./RolesCreate.css"

export default function RolesCreate() {
    return (
        <section className="create-stakeholder">
            <header>
                <h3>Crear Stakeholder</h3>
            </header>
            <form action="sumbit" className="form-stakeholder">
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
                <button>Crear Stakeholder</button>
            </form>
        </section>
    );
}