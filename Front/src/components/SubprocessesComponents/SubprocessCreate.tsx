export default function SubprocessCreate() {
    return (
        <section className="create-subprocess">
            <header className="header-create-subprocess">
                <h3>Nuevo Subproceso</h3>
            </header>
            <hr />
            <form className="form-create-subprocess">
                <div className="subprocess-name">
                    <label htmlFor="">Nombre</label>
                    <input type="text" />
                </div>
                <div className="subprocess-description">
                    <label htmlFor="">Descripción</label>
                    <textarea name="" id=""></textarea>
                </div>
                <button>Crear Subproceso</button>
            </form>
        </section>
    );
}