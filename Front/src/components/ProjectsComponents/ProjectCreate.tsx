import "./ProjectCreate.css"

export default function ProjectCreate() {
    return (
        <section className="project-create">
            <header>
                <h3> Crear Nuevo Proyecto</h3>
            </header>
            <hr />
            <form action="sumbit" className="form-create-project">
                <div className="input-name">
                    <label htmlFor="proyect-name">Nombre del proyecto</label>
                    <input type="text" placeholder="Ingrese el nombre"/>
                </div>
                <div className="input-description">
                    <label htmlFor="proyect-description">Descripción del proyecto</label>
                    <textarea name="proyect-description" id="description" placeholder="Ingrese la descripción"></textarea>
                </div>
                <div className="input-info">
                    <label htmlFor="date-start">Fecha de inicio del proyecto</label>
                    <input type="date" />
                </div>
                <button className="button-create">Crear Proyecto</button>
            </form>
        </section>
    );
}