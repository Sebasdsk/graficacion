import "./ProcessesCreate.css"

export default function ProcessesCreate() {
    return (
        <form className="create-process">
            <header className="header-create-process">
                <h3>Crear Nuevo Proceso</h3>
            </header>
            <hr />
            <div className="body-create-process">
                <div className="process-name">
                    <label htmlFor="">Nombre</label>
                    <input type="text"/>
                </div>
                <div className="process-description">
                    <label htmlFor="">Descripción</label>
                    <textarea name=""></textarea>
                </div>
                <button>Crear Proceso</button>
            </div>
        </form>
    );
}