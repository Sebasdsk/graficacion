import { useNavigate, useParams } from "react-router";
import "./TechniquesDashboard.css";
import { ArrowLeftStroke, Plus, BookOpen, Dashboard, FileDetail, CheckCircle, Clock, Trash, Calendar } from "@boxicons/react/index";
import React, { useEffect, useState, type JSX} from "react";
import type { TipoTecnica, Tecnica, estatusTecnica } from "../Types/Techniques";
import HeaderTechniqueDashboard from "../components/HeaderTechniqueDashboard";
import CreateNewTechnique from "../components/TechniquesDashboardComponents/CreateNewTechnique";
import { filterTechniques } from "../utils/filterTechniques";
import { asignarIconoTecnica } from "../utils/assingTechniques";
import FormTechnique from "../components/TechniquesForms/FormTechnique";
import EntrevistaForm from "../components/TechniquesForms/EntrevistaForm";

// Mock Data
export const tecnicasCatalogo: TipoTecnica[] = [
    {id: 1, nombre: "Entrevista"},
    {id: 2, nombre: "Cuestionario"},
    {id: 3, nombre: "Focus Group"},
    {id: 4, nombre: "Observación"},
    {id: 5, nombre: "Historias de Usuario"},
    {id: 6, nombre: "Documentos"},
    {id: 7, nombre: "Seguimiento Transacional"}
]

const techniques: Tecnica[] = [
    {id: 1, nombre: "Entrevista con Stakeholders", descripcion: "Realizar entrevistas individuales con los principales stakeholders.", tipo: tecnicasCatalogo[0], estatus: "En Progreso"},
    {id: 2, nombre: "Cuestionario para Usuarios Finales", descripcion: "Diseñar y distribuir un cuestionario para recopilar información de los usuarios.", tipo: tecnicasCatalogo[1], estatus: "Planificada"},
    {id: 3, nombre: "Focus Group con Usuarios", descripcion: "Organizar un focus group con usuarios para obtener retroalimentación.", tipo: tecnicasCatalogo[2], estatus: "En Progreso"},
    {id: 4, nombre: "Observación de Usuarios", descripcion: "Realizar sesiones de observación con usuarios.", tipo: tecnicasCatalogo[3], estatus: "Planificada"},
    {id: 5, nombre: "Entrevista con Gerente", descripcion: "Realizar sesiones de entrevistas con el gerente.", tipo: tecnicasCatalogo[0], estatus: "Completada"},
];

type SelectedTecnique = "Vista General" | "Entrevista" | "Observación" | "Historias Usuario" | "Focus Group" | "Documentos" | "Seguimiento Transaccional";

// Diccionario para asignar dinámicamente los colores según el estatus
const statusDictionary: Record<estatusTecnica, string> = {
    "Completada": "green",
    "En Progreso": "blue",
    "Planificada": "gray",
    "Eliminada": "red"
};

const iconStatusDictionary: Record<estatusTecnica, JSX.Element> = {
    "Completada": <CheckCircle fill="#4caf50" />,
    "En Progreso": <Clock fill="#2196f3" />,
    "Planificada": <Calendar fill="#9e9e9e" />,
    "Eliminada": <Trash fill="#f44336" />
}

// Esta función cambia un tipo string a SelectedTecnique
const convertStringToTypeTecnique = (type: string) => {
    const tipo = tecnicasCatalogo.find(t => t.nombre === type)?.nombre ?? "Vista General";
    return tipo as SelectedTecnique;
}

export default function TechniquesDashboard() {
    const params = useParams();
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const [addTechnique, setAddTechnique] = useState<boolean>(false);
    const [selectedTechnique, setSelectedTechnique] = useState<SelectedTecnique>("Vista General");
    const tecnicasFiltradas = filterTechniques(techniques);
    const navigate = useNavigate();

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
                navigate("/login");
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
                addTechnique={addTechnique}
                setAddTechnique={setAddTechnique}
                selectedTechnique={selectedTechnique}
                setSelectedTechnique={setSelectedTechnique}
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
                {!addTechnique && selectedTechnique === "Vista General" && (
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
                            {/* Si no hay técnicas, muestra esto */}
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
                            {/* Si hay técnicas, mostrarlas dinámicamente y categorizarlas por tipos */}
                            {Object.entries(tecnicasFiltradas).map(([tipo, tecnicas]) => (
                                <section key={tipo} className="technique-type">
                                    <header>
                                        {asignarIconoTecnica(tipo)}
                                        <h3>{tipo}</h3>
                                    </header>
                                    <div className="techniques-list-grid">
                                        {tecnicas.map(technique => (
                                            <article
                                                key={technique.id}
                                                className="technique-card"
                                                onClick={() => setSelectedTechnique(convertStringToTypeTecnique(tipo))}>
                                                <header className="technique-card-header">
                                                    <h4>{technique.nombre}</h4>
                                                    <span>{technique.estatus}</span>
                                                </header>
                                                <p>{technique.descripcion}</p>
                                            </article>
                                        ))}
                                    </div>
                                </section>
                            ))}
                            </section>
                    </section>
                )}
                {selectedTechnique === "Entrevista" && (
                    <FormTechnique
                        tipoTecnica={tecnicasCatalogo[0]}
                        children={<EntrevistaForm/>}
                    />
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

interface SetSelectedTechnoqueProp {
    selectedTechnique: SelectedTecnique;
    setSelectedTechnique: React.Dispatch<React.SetStateAction<SelectedTecnique>>;
}

function TechniquesSidebar({
    subprocessName, subprocessDescription, 
    addTechnique, setAddTechnique,
    setSelectedTechnique }: SubprocessSidebarProps & SetAddTechniqueProp & SetSelectedTechnoqueProp) {
    const navigate = useNavigate();

    // Mock data
    const totalTecnicas = 0;
    const tecnicasCompletadas = 0;
    const tecnicasEnProgreso = 0;
    const tecnicasPlanificadas = 0;

    // Función para asignar el color según el estatus
    const asignarColorEstatus = (estatus: estatusTecnica) => {
        return statusDictionary[estatus];
    }

    const asignarIconoEstatus = (estatus: estatusTecnica) => {
        return iconStatusDictionary[estatus];
    }

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
                <button
                    className="general-view-button"
                    onClick={() => setSelectedTechnique("Vista General")}
                >
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
                    {techniques.length > 0 && (
                        <div className="technique-sidebar-list">
                            {techniques.map(tecnica => (
                                <div
                                    key={tecnica.id} 
                                    className="technique-item-sidebar"
                                    onClick={() => setSelectedTechnique(convertStringToTypeTecnique(tecnica.tipo.nombre))}>
                                    <div className="technique-item-content">
                                        {asignarIconoTecnica(tecnica.tipo.nombre)}
                                        <div>
                                            <span>{tecnica.nombre}</span>
                                            <small>{tecnica.tipo.nombre}</small>
                                        </div>
                                    </div>
                                    <div className={`status-icon ${asignarColorEstatus(tecnica.estatus)}`}>
                                            {asignarIconoEstatus(tecnica.estatus)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </section>
        </aside>
    );
}