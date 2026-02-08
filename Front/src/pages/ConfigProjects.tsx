import { useParams } from "react-router";
import { useState, type SetStateAction } from "react";
import { Edit, Group, Workflow } from "@boxicons/react";
import EditProject from "../components/ConfigProjectsComponents/EditProject";
import "./ConfigProjects.css"

type OptionsProjects = "Configuracion" | "Stakeholders" | "Procesos";

export default function ConfigProjects() {
    const [option, setOption] = useState<OptionsProjects>("Configuracion");
    
    // Con el hook "useParams" obtenemos el id pasado en la ruta desde el componente Project
    const idProject = useParams();
    console.log(idProject);

    return (
        <main className="configurate-container">
            <header className="configurate-header">
                <nav className="navbar">
                    <a href="/">Volver al menú</a>
                </nav>
                <div className="data-project">
                    <h1>"Nombre del Proyecto"</h1>
                    <p>"Descripción del proyecto en configuración"</p>
                </div>
            </header>
            <section className="configurate-body">
                <ProjectSideBar setOption={setOption}/>
                <section className="config-content">
                    {option === "Configuracion" && <EditProject/>}
                </section>
            </section>
        </main>
    );
}

interface OptionsProjectProp {
    setOption: React.Dispatch<SetStateAction<OptionsProjects>>;
}

function ProjectSideBar({ setOption }: OptionsProjectProp ) {
    return (
        <aside className="sidebar">
            <section className="extern-configuration">
                <button onClick={() => setOption("Configuracion")}>
                    <Edit />
                    Editar Proyectos
                </button>
                <button onClick={() => setOption("Stakeholders")}>
                    <Group />
                    Stakeholders
                    </button>
                <button onClick={() => setOption("Procesos")}>
                    <Workflow />
                    Procesos
                    </button>
            </section>
        </aside>
    );
}