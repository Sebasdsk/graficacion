import { useState, type SetStateAction } from "react";
import "./Projects.css"

export default function Projects() {
    const [create, setCreate] = useState<boolean>(false);

    return (
        <main className="projects-page">
            {!create && <ProjectCreate setCreate={setCreate}/>}
            {create && <ProjectsConfiguration setCreate={setCreate}/>}
        </main>
    );
}

// Interfaz para pasar los prop a los hijos con el estado setCreate
interface SetCreateProjectProp {
    setCreate: React.Dispatch<SetStateAction<boolean>>
}

function ProjectCreate({setCreate}: SetCreateProjectProp) {
    return (
        <section className="project-create">
            <header>
                <h3>Nuevo Proyecto</h3>
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
                <div className="input-problematic">
                    <label htmlFor="proyect-problematic">Problemática del proyecto</label>
                    <textarea name="proyect-problematic" id="problematic" placeholder="Ingrese la problemática"></textarea>
                </div>
                <button onClick={() => setCreate(true)} className="button-create">Continuar</button>
            </form>
        </section>
    );
}

function ProjectsConfiguration({setCreate}: SetCreateProjectProp) {
    return (
        <section className="project-configuration">
            <header className="header-project-configuration">
                <div className="return-button">
                    <button onClick={() => setCreate(false)}>Atrás</button>
                </div>
                <h3>Configuración del proyecto</h3>
            </header>
            <hr />
            <div className="body-project-configuration">
                <article className="process">
                    <button>Gestionar procesos</button>
                    <small>Gestiona los procesos que tiene tu proyecto</small>
                </article>
                <article className="stakeholders">
                    <button>Gestionar stakeholders</button>
                    <small>Gestiona a los colaboradores en el proyecto</small>
                </article>
            </div>
        </section>
    );
}