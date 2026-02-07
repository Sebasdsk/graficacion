import "./Dashboard.css";
import HeaderDashboard from "../components/HeaderDashboard"
import ProjectsList from "../components/ProjectsList";
import ProjectsResume from "../components/ProjectsResume";
import { Plus } from "@boxicons/react"; // Icono del "+" se importa el componente ya que en <i> no funciona
import { useNavigate } from "react-router";

export default function Dashboard() {
    return (
        <main className="panel-control">
            <HeaderDashboard/>
            <header className="panel-header">
                <div>
                    <h1>Proyectos</h1>
                    <small>Gestiona tus proyectos del análisis de procesos de tu negocio</small>
                </div>
                <CreateProject/>
            </header>
            <section className="panel-body">
                <ProjectsResume/>
                <ProjectsList/>
            </section>
        </main>
    );
}

function CreateProject() {
    const navigate = useNavigate();
    return (
        <button onClick={() => navigate("/projects")} className="button-new-project">
            <Plus />
            <p>Nuevo Proyecto</p>
        </button>
    );
}