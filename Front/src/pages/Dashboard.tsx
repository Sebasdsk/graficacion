import "./Dashboard.css";
import HeaderDashboard from "../components/HeaderDashboard"
import Projects from "../components/ProjectsComponents/Projects";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { DashboardAlt } from "@boxicons/react";  

export default function Dashboard() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);

    const API_URL = "http://localhost:3000/api/proyectos/lista";

    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/");
    }

    useEffect(() => {
        const consultListProyects = async () => {
            try {
    
                const response = await fetch(API_URL, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`, // Envía el token
                        'Content-Type': 'application/json'
                    }
                });
    
                if (!response.ok) {
                    console.error(response);
                    navigate("/");
                    return;
                }
                
            } catch (err) {
                console.error("Error en la query: ", err)
                navigate("/");
            }
        }

        consultListProyects();
    }, []);

    return (
        <main className={`panel-control ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
            <DashboardSidebar/>
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


function DashboardSidebar() {
    const totalProyectos = 0;
    const proyectosPlanificacion = 0;
    const proyectosProgreso = 0;
    const proyectosCompletados = 0;
    const proyectosCancelados = 0;
    
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
                    <dd>{proyectosPlanificacion}</dd>

                    <dt>
                        <div className="icon-progress"></div>
                        En Progreso
                    </dt>
                    <dd>{proyectosProgreso}</dd>

                    <dt>
                        <div className="icon-complete"></div>
                        Completados
                    </dt>
                    <dd>{proyectosCompletados}</dd>

                    <dt>
                        <div className="icon-cancel"></div>
                        Cancelados
                    </dt>
                    <dd>{proyectosCancelados}</dd>
                </dl>
            </section>
        </aside>
    );
}