import "./RolesCreate.css"

export default function RolesCreate() {
    return (
        <section className="create-role">
            <header>
                <h3>Crear Rol</h3>
            </header>
            <form action="sumbit" className="form-role">
                <div className="input-name">
                    <label htmlFor="name-role">Nombre</label>
                    <input
                        type="text"
                        id="name-role"
                        placeholder="Ingrese el nombre"/>
                </div>
                <div className="input-description">
                    <label htmlFor="role-description">Descripción</label>
                    <textarea
                        name="description"
                        id="role-description"
                        placeholder="Breve descripción de lo que representa"/>
                </div>
                <div className="input-status">
                    <label htmlFor="select-status">Estatus</label>
                    <select name="status" id="select-status">
                        <option value=""> -Seleccionar estatus- </option>
                    </select>
                </div>
                <button>Crear Rol</button>
            </form>
        </section>
    );
}