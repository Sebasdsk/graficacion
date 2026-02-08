import "./EditProject.css"

export default function EditProject() {
    return (
        <section className="edit-project">
            <header>
                <h2>Editar Proyecto</h2>
            </header>
            <form action="sumbit" className="form-edit-project">
                <div className="project-name">
                    <label htmlFor="proyect-name">Nombre del proyecto</label>
                    <input type="text" placeholder="Ingrese el nombre"/>
                </div>
                <div className="project-description">
                    <label htmlFor="proyect-description">Descripción del proyecto</label>
                    <textarea name="proyect-description" id="description" placeholder="Ingrese la descripción"></textarea>
                </div>
                <div className="project-info">
                    <label htmlFor="date-start">Fecha de inicio del proyecto</label>
                    <input type="date" />
                </div>
                <button className="button-edit">Editar Proyecto</button>
            </form>
        </section>
    );
}