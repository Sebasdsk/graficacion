import "./Dashboard.css";
import HeaderDashboard from "../components/HeaderDashboard"
import Projects from "../components/ProjectsComponents/Projects";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { DashboardAlt, FolderMinus } from "@boxicons/react";
import consultAllProjects from "../services/consultAllProjects";
import { counterStatusProjects } from "../utils/counterStatusProjects";
import type { Proyecto } from "../Types/Proyectos";

export default function Dashboard() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const [projects, setProjects] = useState<Proyecto[]>([]);

    // Valores derivados de projects para mostrar el conteo en el sidebar
    const totalProyectos = projects.length;
    const contadorEstatus = counterStatusProjects(projects);
    const planificacion = contadorEstatus["Planificación"] ?? 0;
    const progreso = contadorEstatus["En Progreso"] ?? 0;
    const completado = contadorEstatus["Completado"] ?? 0;
    const cancelado = contadorEstatus["Cancelado"] ?? 0;

    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/");
    }

    const getProjects = async () => {
        try {
            const data = await consultAllProjects(token);
            setProjects(data); // Guarda los proyectos consultados en el estado
        } catch (err) {
            console.error("Error en la query: ", err)
            navigate("/");
        }
    }

    useEffect(() => {
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
                projects={projects}
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
                    setMobileOpen={setMobileOpen}
                />
                <Projects projects={projects} setProjects={setProjects}/>
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

interface ProjectsListProp {
    projects: Proyecto[];
}

function DashboardSidebar({totalProyectos, planificacion, progreso, completado, cancelado, projects}: ContadorEstatusProp & ProjectsListProp) {
    const navigate = useNavigate();

    const handleNavigation = (id_proyecto: number) => {
        navigate(`/config-projects/${id_proyecto}`)
    }
    return (
        <aside className="dashboard-sidebar">
            <header className="header-sidebar">
                <h2>FLOWTIC</h2>
            </header>
            <div className="button-container">
                <button className="dashboard-sidebar-button"><DashboardAlt /> Dashboard</button>
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
            <section className="last-projects-list">
                <h3 className="last-projects-title">Últimos Proyectos</h3>
                {projects.map(p => (
                    <button
                        key={p.id_proyecto}
                        className="button-last-proyect"
                        onClick={() => handleNavigation(p.id_proyecto)}><FolderMinus size="xs"/> {p.nombre}</button>
                ))}
            </section>
        </aside>
    );
}