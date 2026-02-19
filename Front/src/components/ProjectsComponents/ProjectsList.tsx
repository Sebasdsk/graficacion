import Project from "./Project";
import { type Proyecto } from "../../Types/Proyectos";
import "./ProjectList.css"

interface ProjectListProp {
    projects: Array<Proyecto>;
}

export default function ProjectsList({ projects }: ProjectListProp) {
    return (
        <section className="proyect-list">
            <header>
                <h2>Lista de proyectos</h2>
            </header>
            <hr />
            <section className="list">
                {projects?.map(p => (
                    <Project
                        key={p.id_proyecto}
                        id_proyecto={p.id_proyecto}
                        nombre={p.nombre}
                        descripcion={p.descripcion}
                        estatus={p.estatus}
                        fecha_inicio={p.fecha_inicio}
                        colaboradores={p.colaboradores}
                        procesos={p.procesos}
                    />
                ))}
            </section>
        </section>
    );
}