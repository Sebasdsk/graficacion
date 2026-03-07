import "./Dashboard.css";
import HeaderDashboard from "../components/HeaderDashboard"
import Projects from "../components/ProjectsComponents/Projects";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { DashboardAlt } from "@boxicons/react";
import consultAllProjects from "../services/consultAllProjects";
import { counterStatusProjects } from "../utils/counterStatusProjects";

export default function Dashboard() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);

    // Estados para mostrar el conteo de los proyectos por estatus en el sidebar
    const [totalProyectos, setTotalProyectos] = useState<number>(0);
    const [planificacion, setPlanificacion] = useState<number>(0);
    const [progreso, setProgreso] = useState<number>(0);
    const [completado, setCompletado] = useState<number>(0);
    const [cancelado, setCancelado] = useState<number>(0);

    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/");
    }

    useEffect(() => {
        const getProjects = async () => {
            try {
                const data = await consultAllProjects(token);
                setTotalProyectos(data.length); // Cuenta el total de proyectos

                const contadorEstatus = counterStatusProjects(data)
                // Guarda el número de cada estatus de los proyectos
                setPlanificacion(contadorEstatus["Planificación"] | 0);
                setProgreso(contadorEstatus["En Progreso"] | 0);
                setCompletado(contadorEstatus["Completado"] | 0);
                setCancelado(contadorEstatus["Cancelado"] | 0);
            } catch (err) {
                console.error("Error en la query: ", err)
                navigate("/");
            }
        }

        getProjects();
    }, []);

    return (
        <main className={`panel-control ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
            <DashboardSidebar 
                totalProyectos={totalProyectos}
                planificacion={planificacion}
                progreso={progreso}
                completado={completado}
                cancelado={cancelado}
            />
            {mobileOpen && <div 
                    className="backdrop"
                    onClick={() => setMobileOpen(!mobileOpen)}
                />}
            <section className="dashboard-main">
                <HeaderDashboard
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}/>
                <Projects/>
            </section>
        </main>
    );
}

// Props para el contador de los estatus de los proyectos
interface ContadorEstatusProp {
    totalProyectos: number;
    planificacion: number;
    progreso: number;
    completado: number;
    cancelado: number;
}


function DashboardSidebar({totalProyectos, planificacion, progreso, completado, cancelado}: ContadorEstatusProp) {
    return (
        <aside className="dashboard-sidebar">
            <header className="header-sidebar">
                <h2>FLOWTIC</h2>
            </header>
            <div className="button-container">
                <button className="button-dashboard"><DashboardAlt /> Dashboard</button>
            </div>
            <section className="resume-sidebar">
                <h3>Resumen</h3>
                <dl className="resume-list">
                    <dt className="all-projects">Total Proyectos</dt>
                    <dd className="count-all-projects">{totalProyectos}</dd>

                    <dt>
                        <div className="icon-planning"></div>
                        Planificación
                    </dt>
                    <dd>{planificacion}</dd>

                    <dt>
                        <div className="icon-progress"></div>
                        En Progreso
                    </dt>
                    <dd>{progreso}</dd>

                    <dt>
                        <div className="icon-complete"></div>
                        Completados
                    </dt>
                    <dd>{completado}</dd>

                    <dt>
                        <div className="icon-cancel"></div>
                        Cancelados
                    </dt>
                    <dd>{cancelado}</dd>
                </dl>
            </section>
        </aside>
    );
}