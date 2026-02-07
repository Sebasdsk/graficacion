import "./Dashboard.css";
import HeaderDashboard from "../components/HeaderDashboard"
import ProjectsList from "../components/ProjectsList";
import { Plus } from "@boxicons/react"; // Icono del "+" se importa el componente ya que en <i> no funciona
import { useNavigate } from "react-router";

export default function Dashboard() {
    return (
        <main className="panel-control">
            <HeaderDashboard/>
            <section className="panel-body">
                <ProjectsList/>
                <CreateProject/>
            </section>
        </main>
    );
}

function CreateProject() {
    const navigate = useNavigate();
    return (
        <div className="button-container">
            <button onClick={() => navigate("/projects")} className="button-new-project">
                <Plus />
            </button>
        </div>
    );
}