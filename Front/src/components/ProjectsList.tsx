import Project from "./Project";
import "./ProjectList.css"

// Datos de prueba, para la UI
const proyectos = [
    {id: 1, nombre: "Proyecto 1", descripcion: "Descripción del proyecto 1", estatus: "Planificación", fechaCreacion: "1/2/2026", colaboradores: 2, procesos: 2},
    {id: 2, nombre: "Proyecto 2", descripcion: "Descripción del proyecto 2", estatus: "En Progreso", fechaCreacion: "23/12/2025", colaboradores: 3, procesos: 2},
    {id: 3, nombre: "Proyecto 3", descripcion: "Descripción del proyecto 3", estatus: "Planificación", fechaCreacion: "4/2/2026", colaboradores: 2, procesos: 2},
];

export default function ProjectsList() {
    return (
        <section className="proyect-list">
            <header>
                <h2>Lista de proyectos</h2>
            </header>
            <hr />
            <section className="list">
                {proyectos.map(p => (
                    <Project
                        key={p.id}
                        id={p.id}
                        nombre={p.nombre}
                        descripcion={p.descripcion}
                        estatus={p.estatus}
                        fechaCreacion={p.fechaCreacion}
                        colaboradores={p.colaboradores}
                        procesos={p.procesos}
                    />
                ))}
            </section>
        </section>
    );
}