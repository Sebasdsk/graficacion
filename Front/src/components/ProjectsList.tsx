import Project from "./Project";
import "./ProjectList.css"

// Datos de prueba, para la UI
const proyectos = [
    {id: 1, nombre: "Proyecto 1", descripcion: "", colaboradores: 2},
    {id: 2, nombre: "Proyecto 2", descripcion: "", colaboradores: 3},
    {id: 3, nombre: "Proyecto 3", descripcion: "", colaboradores: 2},
    {id: 4, nombre: "Proyecto 4", descripcion: "", colaboradores: 3}
]

export default function ProjectsList() {
    return (
        <section className="proyect-list">
            <header>
                <h2>Lista de proyectos</h2>
            </header>
            <hr />
            <section className="list">
                {proyectos.map(p => (
                    <Project id={p.id} nombre={p.nombre} descripcion={p.descripcion} colaboradores={p.colaboradores}/>
                ))}
            </section>
        </section>
    );
}