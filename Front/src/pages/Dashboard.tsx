import "./Dashboard.css";
import HeaderDashboard from "../components/HeaderDashboard"
import ProyectsList from "../components/ProyectsList";

export default function Dashboard() {
    return (
        <main className="panel-control">
            <HeaderDashboard/>
            <section className="panel-body">
                <ProyectsList/>
            </section>
        </main>
    );
}