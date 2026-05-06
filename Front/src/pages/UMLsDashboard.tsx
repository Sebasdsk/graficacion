import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash, ArrowLeftStroke } from "@boxicons/react";
import type { Rol } from "../Types/Roles";
import type { Proceso } from "../Types/Procesos";
import "./UMLsDashboard.css";

// Mock data
const mockDiagrams = [
    { id: 1, tipo: 'Casos de Uso', colorClass: 'casos', name: 'Diagrama de casos de uso de ejemplo', descripcion: 'Descripción de ejemplo para este diagrama de Casos de uso', nodos: 0, conexiones: 0 },
    { id: 2, tipo: 'Clases', colorClass: 'clases', name: 'Diagrama de clases de ejemplo', descripcion: 'Descripción de ejemplo para este Diagrama de Clases', nodos: 0, conexiones: 0 },
    { id: 3, tipo: 'Secuencia', colorClass: 'secuencia', name: 'Diagrama de secuencias de ejemplo', descripcion: 'Descripción de ejemplo para este diagrama de Secuencia.', nodos: 0, conexiones: 0 },
    { id: 4, tipo: 'Paquetes', colorClass: 'paquetes', name: 'Diagrama de paquetes de ejemplo', descripcion: 'Descripción de ejemplo para este diagrama de Paquetes.', nodos: 0, conexiones: 0 },
];

export default function UMLsDashboard() {
    const { id_project } = useParams();
    const navigate = useNavigate();
    const [projectName, setProjectName] = useState("Cargando...");
    const [projectDescription, setProjectDescription] = useState("Cargando...");
    const [rolesProyecto, setRolesProyecto] = useState<Rol[]>([]);
    const [procesos, setProcesos] = useState<Proceso[]>([]);

    const API_URL = import.meta.env.VITE_API_URL;

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        if (!token || !id_project) return;

        const headers = {
            "Authorization": `Bearer ${token}`
        };

        try {
            // Fetch project details
            const projectRes = await fetch(`${API_URL}/proyectos/ver/${id_project}`, { headers });
            if (projectRes.ok) {
                const projectData = await projectRes.json();
                setProjectName(projectData.nombre);
                setProjectDescription(projectData.descripcion);
            }

            // Fetch roles
            const rolesRes = await fetch(`${API_URL}/roles/proyecto/${id_project}`, { headers });
            if (rolesRes.ok) {
                const rolesData = await rolesRes.json();
                setRolesProyecto(rolesData);
            }

            // Fetch processes and subprocesses
            const procesosRes = await fetch(`${API_URL}/procesos/proyecto/${id_project}`, { headers });
            if (procesosRes.ok) {
                const procesosData = await procesosRes.json();
                setProcesos(procesosData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id_project]);

    const totalSubprocesos = procesos.reduce((acc, proceso) => {
        return acc + (proceso.subproceso ? proceso.subproceso.length : 0);
    }, 0);

    return (
        <div className="diagramas-dashboard-page">
            <header className="diagramas-dashboard-header">
                <button
                    className="button-back-to-project"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeftStroke />
                    Volver al Proyecto
                </button>
                <h3>
                    Flowtic 
                    <span className='flowtic-graphics'>Graphics</span>
                </h3>
            </header>
            <main className="principal-container-umls-page">
                <div className="dashboard-header-container">
                    <a className="back-link" onClick={() => navigate(`/projects/${id_project}`)}>
                    </a>
                    <div className="dashboard-header">
                        <div className="dashboard-title-wrapper">
                            <h1>{projectName}</h1>
                            <p>{projectDescription}</p>
                        </div>
                        <button className="btn-primary">
                            <Plus /> Nuevo Diagrama
                        </button>
                    </div>
                </div>

                <section className="roles-procesos-section">
                    <article className="info-card">
                        <h3>Roles y Stakeholders</h3>
                        <div className="roles-list">
                            {rolesProyecto.map(rol => (
                                <div key={rol.id_rol} className="role-item">
                                    {rol.nombre} <span className="role-count">({rol.stakeholder ? rol.stakeholder.length : 0})</span>
                                </div>
                            ))}
                            {rolesProyecto.length === 0 && <span className="role-count">No hay roles asignados</span>}
                        </div>
                    </article>

                    <article className="info-card">
                        <h3>Procesos</h3>
                        <div className="procesos-list">
                            {procesos.map(proceso => (
                                <div key={proceso.id_proceso} className="proceso-item">
                                    {proceso.nombre}
                                </div>
                            ))}
                            {procesos.length === 0 && <span className="role-count">No hay procesos</span>}
                        </div>
                    </article>

                    <article className="info-card">
                        <h3>Subprocesos Totales</h3>
                        <div className="subprocesos-stats">
                            <span className="subprocesos-number">{totalSubprocesos}</span>
                            <span className="subprocesos-label">En {procesos.length} procesos</span>
                        </div>
                    </article>
                </section>

                <section className={`dashboard-content ${mockDiagrams.length > 0 ? 'has-diagrams' : ''}`}>
                    {mockDiagrams.length === 0 ? (
                        <div className="no-diagrams-container">
                            <h2>No hay diagramas aún</h2>
                            <small>Crea tu primer diagrama UML para visualizar la arquitectura del sistema</small>
                            <button className="btn-primary">
                                <Plus />
                                Crear Primer Diagrama
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2>Diagramas UML</h2>
                            <ul className="diagrams-grid">
                                {mockDiagrams.map(diagram => (
                                    <article className="diagram-card" key={diagram.id}>
                                        <div className="diagram-type-badge">
                                            <div className={`badge-dot ${diagram.colorClass}`}></div>
                                            {diagram.tipo}
                                        </div>
                                        <div className="diagram-info">
                                            <h3>{diagram.name}</h3>
                                            <p>{diagram.descripcion}</p>
                                        </div>
                                        <div className="diagram-stats">
                                            <span>{diagram.nodos} nodos</span>
                                            <span>{diagram.conexiones} conexiones</span>
                                        </div>
                                        <div className="diagram-actions">
                                            <button
                                                className="btn-edit"
                                                onClick={() => navigate("/uml-editor")}
                                            >
                                                <Edit />
                                                Editar
                                            </button>
                                            <button className="btn-delete"><Trash color="#ef4444" /></button>
                                        </div>
                                    </article>
                                ))}
                            </ul>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
}