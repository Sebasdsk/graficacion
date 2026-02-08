import { useParams } from "react-router";

export default function ConfigProjects() {
    // Con el hook "useParams" obtenemos el id pasado en la ruta desde el componente Project
    const idProject = useParams();
    const id = idProject.id;

    return (
        <section>
            <header>
                <h1>Configuración de un proyecto</h1>
                <span>Número de proyecto: {id}</span>
            </header>
        </section>
    );
}