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
                    <input type="text" placeholder="Ingrese el nombre del proceso"/>
                </div>
                <div className="process-description">
                    <label htmlFor="description-process">Descripción</label>
                    <textarea id="description-process" placeholder="Descripción breve del proceso"></textarea>
                </div>
                <button>Crear Proceso</button>
            </div>
        </form>
    );
}