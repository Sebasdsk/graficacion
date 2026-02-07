import "./Dashboard.css";
import HeaderDashboard from "../components/HeaderDashboard"
import ProjectsList from "../components/ProjectsList";

export default function Dashboard() {
    return (
        <main className="panel-control">
            <HeaderDashboard/>
            <section className="panel-body">
                <ProjectsList/>
            </section>
        </main>
    );
}