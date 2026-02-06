import Proyect from "./Proyect";
import "./ProyectList.css"

// Datos de prueba, para la UI
const proyectos = [
    {id: 1, nombre: "Proyecto 1", descripcion: "", colaboradores: 2},
    {id: 2, nombre: "Proyecto 2", descripcion: "", colaboradores: 3},
    {id: 3, nombre: "Proyecto 3", descripcion: "", colaboradores: 2},
    {id: 4, nombre: "Proyecto 4", descripcion: "", colaboradores: 3}
]

export default function ProyectsList() {
    return (
        <section className="proyect-list">
            <div>
                <h3>Lista de proyectos</h3>
            </div>
            <hr />
            <section className="list">
                {proyectos.map(p => (
                    <Proyect id={p.id} nombre={p.nombre} descripcion={p.descripcion} colaboradores={p.colaboradores}/>
                ))}
            </section>
        </section>
    );
}