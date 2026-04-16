import { useNavigate, useParams } from "react-router";
import "./TechniquesDashboard.css";
import { ArrowLeftStroke, Plus, BookOpen, Dashboard, FileDetail } from "@boxicons/react/index";
import React, { useEffect, useState } from "react";
import type { TipoTecnica, Tecnica } from "../Types/Techniques";
import HeaderTechniqueDashboard from "../components/HeaderTechniqueDashboard";
import CreateNewTechnique from "../components/TechniquesDashboardComponents/CreateNewTechnique";
import { filterTechniques } from "../utils/filterTechniques";

// Mock Data
const tecnicasCatalogo: TipoTecnica[] = [
    {id: 1, nombre: "Entrevista"},
    {id: 2, nombre: "Cuestionario"},
    {id: 3, nombre: "Focus Group"},
    {id: 4, nombre: "Observación"},
    {id: 5, nombre: "Historias de Usuario"},
    {id: 6, nombre: "Documentos"},
    {id: 7, nombre: "Seguimiento Transacional"}
]

const techniques: Tecnica[] = [
    {id: 1, nombre: "Entrevista con Stakeholders", descripcion: "Realizar entrevistas individuales con los principales stakeholders para entender sus necesidades y expectativas.", tipo: tecnicasCatalogo[0], estatus: "en progreso"},
    {id: 2, nombre: "Cuestionario para Usuarios Finales", descripcion: "Diseñar y distribuir un cuestionario para recopilar información de los usuarios finales sobre sus requerimientos.", tipo: tecnicasCatalogo[1], estatus: "planificada"},
    {id: 3, nombre: "Focus Group con Usuarios", descripcion: "Organizar un focus group con usuarios para obtener retroalimentación sobre el producto.", tipo: tecnicasCatalogo[2], estatus: "en progreso"},
    {id: 4, nombre: "Observación de Usuarios", descripcion: "Realizar sesiones de observación con usuarios para identificar áreas de mejora en el producto.", tipo: tecnicasCatalogo[3], estatus: "planificada"}
];

export default function TechniquesDashboard() {
    const params = useParams();
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const [addTechnique, setAddTechnique] = useState<boolean>(false);
    const tecnicasFiltradas = filterTechniques(techniques);

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

    console.log(tecnicasFiltradas);

    return (
        <main className={`techniques-dashboard-page ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
            <TechniquesSidebar
                subprocessName={subprocess.nombre}
                subprocessDescription={subprocess.descripcion}
                addTechnique={addTechnique}
                setAddTechnique={setAddTechnique}
            />
            {mobileOpen && (
                <div 
                    className="backdrop"
                    onClick={() => setMobileOpen(!mobileOpen)}
                />
            )}
            <section className="techniques-main-content">
                <HeaderTechniqueDashboard
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                />
                {!addTechnique && (
                    <section className="techniques-container">
                        <header className="techniques-header">
                            <div className="header-info-buttons-container">
                                <div className="header-content">
                                    <h1>Técnicas de Recolección</h1>
                                    <p>Gestiona todas las técnicas para recolectar requerimientos del subproceso.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setAddTechnique(true)}
                                className="add-technique-button"
                            >
                                <Plus size="sm"/>
                                Nueva Técnica
                            </button>
                        </header>
                        <section className="techniques-content">
                            {/* Aquí agregar el contenido principal */}
                            {techniques.length === 0 && (
                                <div className="none-technique-container">
                                    <BookOpen size="xl" fill="#6c6c6c"/>
                                    <h2>No hay técnicas registradas</h2>
                                    <p>Comienza agregando una técnica de recolección de requerimientos</p>
                                    <button
                                        onClick={() => setAddTechnique(true)}
                                        className="add-first-technique-button"
                                    >
                                        <Plus size="xs"/>
                                        Agregar Nueva Técnica
                                    </button>
                                </div>
                            )}
                            {Object.entries(tecnicasFiltradas).map(([tipo, tecnicas]) => (
                                <div key={tipo} className="technique-type">
                                    <h3>{tipo}</h3>
                                    {tecnicas.map(technique => (
                                        <div key={technique.id} className="technique-card">
                                            <h4>{technique.nombre}</h4>
                                            <p>{technique.descripcion}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </section>
                    </section>
                )}
                {addTechnique && (<CreateNewTechnique onClose={() => setAddTechnique(false)} />)}
            </section>
        </main>
    );
}

interface SubprocessSidebarProps {
    subprocessName: string;
    subprocessDescription: string;
}

interface SetAddTechniqueProp {
    addTechnique: boolean;
    setAddTechnique: React.Dispatch<React.SetStateAction<boolean>>;
}

function TechniquesSidebar({ subprocessName, subprocessDescription, addTechnique, setAddTechnique }: SubprocessSidebarProps & SetAddTechniqueProp) {
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
                            {!addTechnique && (
                                <button
                                    className="add-technique-button-list"
                                    onClick={() => setAddTechnique(true)}
                                >
                                    <Plus size="xs"/>
                                    Agregar Técnica
                                </button>
                            )}
                        </div>
                    )}
                </section>
            </section>
        </aside>
    );
}