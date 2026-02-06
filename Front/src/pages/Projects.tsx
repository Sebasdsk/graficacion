import { useState, type SetStateAction } from "react";

export default function Projects() {
    const [create, setCreate] = useState<boolean>(false);

    return (
        <main className="proyects-page">
            <header>
                <h3>Nuevo Proyecto</h3>
            </header>
            {!create && <ProjectCreate setCreate={setCreate}/>}
            {create && <ProjectsConfiguration/>}
        </main>
    );
}

// Interfaz para pasar los prop a los hijos con el estado setCreate
interface SetCreateProjectProp {
    setCreate: React.Dispatch<SetStateAction<boolean>>
}

function ProjectCreate({setCreate}: SetCreateProjectProp) {
    return (
        <form action="sumbit">
            <div>
                <label htmlFor="proyect-name">Nombre del proyecto</label>
                <input type="text" placeholder="Ingrese el nombre"/>
            </div>
            <div>
            <label htmlFor="proyect-description">Descripción del proyecto</label>
                <textarea name="proyect-description" id="description">Ingrese la descrpción</textarea>
            </div>
            <div>
                <label htmlFor="proyect-problematic">Problemática del proyecto</label>
                <textarea name="proyect-problematic" id="problematic">Ingrese la problemática</textarea>
            </div>
            <button onClick={() => setCreate(true)} className="button-create">Continuar</button>
        </form>
    );
}

function ProjectsConfiguration() {
    return (
        <section>
            <header>
                <p>Configuración del proyecto</p>
            </header>
            <section>
                <div>
                    <button>Gestionar procesos</button>
                    <small>Gestiona los procesos que tiene tu proyecto</small>
                </div>
            </section>
        </section>
    );
}