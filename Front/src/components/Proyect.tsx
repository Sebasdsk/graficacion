import "./Proyect.css"

interface ProyectoProp {
    id: number;
    nombre: string;
    descripcion: string;
    colaboradores: number;
}

export default function Proyect( { id, nombre, descripcion, colaboradores }: ProyectoProp ) {
    return (
        <article className="project-container">
            <header className="project-header">
                <div>
                    <p>{id}</p>
                </div>
                <p>{nombre}</p>
            </header>
            <section className="project-body">
                {descripcion}
                <p>Colaboradores: {colaboradores}</p>
            </section>
        </article>
    );
}