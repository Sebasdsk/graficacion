import "./ProcessesEdit.css"; 

interface SelectedProcessId {
    idProcess: number;
}

export default function ProcessesEdit({idProcess}: SelectedProcessId) {
    console.log(idProcess); // Mas adelante se utilizará el id del proceso seleccionado
    return(
        <section className="edit-process-container">
            <header className="header-edit-process">
                <h3>Editar Proceso</h3>
            </header>
            <hr />
            <form className="edit-process">
                <div className="body-edit-process">
                    <div className="process-name">
                        <label htmlFor="">Nombre</label>
                        <input type="text" placeholder="Nombre del proceso"/>
                    </div>
                    <div className="process-description">
                        <label htmlFor="">Descripción</label>
                        <textarea name="" placeholder="Descripción breve del proceso"></textarea>
                    </div>
                    <button>Editar Proceso</button>
                </div>
            </form>
        </section>
    );
}