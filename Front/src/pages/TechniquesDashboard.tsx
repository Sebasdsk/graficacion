import { useNavigate, useParams } from "react-router";
import "./TechniquesDashboard.css";
import { ArrowLeftStroke, Plus, BookOpen, Dashboard, FileDetail, DockLeft } from "@boxicons/react/index";
import { useEffect, useState } from "react";

// Mock Data
const techniques = [];

export default function TechniquesDashboard() {
    const params = useParams();
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);

    const [subprocess, setSubprocess] = useState({
        nombre: "",
        descripcion: ""
    });

    const getSubproceso = async () => {
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${API_URL}/procesos/subproceso/${params.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error("Error al obtener el subproceso");
            }

            const data = await response.json();
            setSubprocess({
                nombre: data.nombre,
                descripcion: data.descripcion
            });
        } catch (error) {
            console.error("Error fetching subproceso:", error);
        }
    };

    useEffect(() => {
        getSubproceso();
    }, []);

    return (
        <main className={`techniques-dashboard-page ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
            <TechniquesSidebar
                subprocessName={subprocess.nombre}
                subprocessDescription={subprocess.descripcion}
            />
            {mobileOpen && (
                <div 
                    className="backdrop"
                    onClick={() => setMobileOpen(!mobileOpen)}
                />
            )}
            <section className="techniques-main-content">
                <header className="techniques-header">
                    <div className="header-info-buttons-container">
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="toggle-mobile-button"
                        >
                            <DockLeft size="md"/>
                        </button>
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="toggle-sidebar-button"
                        >
                            <DockLeft size="md"/>
                        </button>
                        <div className="header-content">
                            <h1>Técnicas de Recolección</h1>
                            <p>Gestiona todas las técnicas para recolectar requerimientos del subproceso.</p>
                        </div>
                    </div>
                    <button className="add-technique-button">
                        <Plus size="sm"/>
                        Nueva Técnica
                    </button>
                </header>
                <section className="techniques-content">
                    {/* Aquí agregar el contenido principal */}
                    {techniques.length === 0 && 
                        <div className="none-technique-container">
                            <BookOpen size="xl" fill="#6c6c6c"/>
                            <h2>No hay técnicas registradas</h2>
                            <p>Comienza agregando una técnica de recolección de requerimientos</p>
                            <button
                                className="add-first-technique-button"
                            >
                                <Plus size="xs"/>
                                Agregar Nueva Técnica
                            </button>
                        </div>
                    }
                </section>
            </section>
        </main>
    );
}

interface SubprocessSidebarProps {
    subprocessName: string;
    subprocessDescription: string;
}

function TechniquesSidebar({ subprocessName, subprocessDescription }: SubprocessSidebarProps) {
    const navigate = useNavigate();

    // Mock data
    const totalTecnicas = 0;
    const tecnicasCompletadas = 0;
    const tecnicasEnProgreso = 0;
    const tecnicasPlanificadas = 0;

    return (
        <aside className="techniques-sidebar">
            <header className="header-techniques-sidebar">
                <button
                    onClick={() => navigate(-1)}
                    className="back-button"
                >
                    <ArrowLeftStroke />
                    Volver al Proyecto
                </button>
                <div className="subprocess-info-techniques">
                    <span>Subproceso: </span>
                    <h2>{subprocessName}</h2>
                    <small>{subprocessDescription}</small>
                </div>
            </header>
            <section className="resume-techniques-sidebar">
                <div className="resume-item">
                    <small>Técnicas Totales</small>
                    <p>{totalTecnicas}</p>
                </div>
                <div className="resume-item">
                    <small>Técnicas Completadas</small>
                    <p>{tecnicasCompletadas}</p>
                </div>
                <div className="resume-item">
                    <small>Técnicas en Progreso</small>
                    <p>{tecnicasEnProgreso}</p>
                </div>
                <div className="resume-item">
                    <small>Técnicas Planificadas</small>
                    <p>{tecnicasPlanificadas}</p>
                </div>
            </section>
            <section className="general-view-techniques-sidebar">
                <button className="general-view-button">
                    <Dashboard size="xs"/>
                    Vista General
                </button>
                <section className="techniques-list">
                    <header className="header-techniques-list">
                        <span>TÉCNICAS ({totalTecnicas})</span>
                        {techniques.length > 0 && (
                            <button className="add-technique-button-sidebar"><Plus size="xs"/></button>
                        )}
                    </header>
                    {techniques.length === 0 && (
                        <div className="none-technique">
                            <FileDetail size="lg" fill="#cdcdcd"/>
                            <span>No hay técnicas aún</span>
                            <button className="add-technique-button-list">
                                <Plus size="xs"/>
                                Agregar Técnica
                            </button>
                        </div>
                    )}
                </section>
            </section>
        </aside>
    );
}