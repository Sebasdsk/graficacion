import { useParams } from "react-router";
import { useEffect, useState, type SetStateAction } from "react";
import { Edit, Group, Workflow, NoteBook, ArrowLeftStroke } from "@boxicons/react";
import EditProject from "../components/ConfigProjectsComponents/EditProject";
import Stakeholders from "../components/StakeholdersComponents/Stakeholders";
import Process from "../components/ProcessesComponents/Processes";
import Techniques from "../components/Techniques";
import { type Proyecto } from "../Types/Proyectos";
import "./ConfigProjects.css"

type OptionsProjects = "Configuracion" | "Stakeholders" | "Procesos" | "Tecnicas";

export default function ConfigProjects() {
    const [option, setOption] = useState<OptionsProjects>("Configuracion");
    const [project, setProject] = useState<Proyecto | null>(null);
    const [projectName, setProjectName] = useState<string>("");
    const [projectDescription, setProjectDescription] = useState<string>("");
    const [projectDate, setProjectDate] = useState<string>("");
    const [projectStatus, setProjectStatus] = useState<string>("")
    
    // Con el hook "useParams" obtenemos el id pasado en la ruta desde el componente Project
    const idProject = useParams();

    const API_URL = `http://localhost:3000/api/proyectos/ver/${idProject.id}`;

    useEffect(() => {
        const getProject = async () => {
            const token = localStorage.getItem("token");

            try {
                const repsonse = await fetch(API_URL, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`, // Envía el token
                        'Content-Type': 'application/json'
                    }
                });

                if (!repsonse.ok) {
                    alert("Error al obtener el proyecto.");
                    return;
                }

                const data = await repsonse.json();
                setProject(data);
                
                setProjectName(data.nombre);
                setProjectDescription(data.descripcion);
                setProjectDate(data.fecha_inicio);
                setProjectStatus(data.estatus);
            } catch (err) {
                console.error(err);
                alert("Error al obtener el proyecto");
            }
        }

        getProject();
    }, []);

    return (
        <main className="configurate-container">
            <header className="configurate-header">
                <nav className="navbar">
                    <a href="/dashboard"><ArrowLeftStroke /> Volver al menú</a>
                </nav>
                <div className="data-project">
                    <h1>{project?.nombre}</h1>
                    <p>{project?.descripcion}</p>
                </div>
            </header>
            <section className="configurate-body">
                <ProjectSideBar setOption={setOption}/>
                <section className="config-content">
                    {option === "Configuracion" &&
                        <EditProject
                            projectName={projectName}
                            setProjectName={setProjectName}
                            projectDescription={projectDescription}
                            setProjectDescription={setProjectDescription}
                            projectDate={projectDate.split("T")[0]}
                            setProjectDate={setProjectDate}
                            projectStatus={projectStatus}
                            setProjectStatus={setProjectStatus}/>}
                    {option === "Stakeholders" && <Stakeholders/>}
                    {option === "Procesos" && <Process/>}
                    {option === "Tecnicas" && <Techniques/>}
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
                <button onClick={() => setOption("Tecnicas")}>
                    <NoteBook />
                    Técnicas de Levantamiento
                </button>
            </section>
        </aside>
    );
}