import "./Dashboard.css";
import HeaderDashboard from "../components/HeaderDashboard"

export default function Dashboard() {
    return (
        <main className="panel-control">
            <HeaderDashboard/>
            <section className="panel-body">
                <span>Aquí aparecerán tus plantillas</span>
            </section>
        </main>
    );
}