import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash, ArrowLeftStroke, WorkflowAlt } from "@boxicons/react";
import type { Rol } from "../Types/Roles";
import type { Proceso } from "../Types/Procesos";
import "./UMLsDashboard.css";
import ModalCreate from "../Modals/ModalCreate";
import Modal from "../Modals/Modal";
import UMLsCreate from "../Modals/ModalChildrens/UMLsModals/UMLsCreate";
import UMLsEdit from "../Modals/ModalChildrens/UMLsModals/UMLsEdit";
import UMLsDelete from "../Modals/ModalChildrens/UMLsModals/UMLsDelete";

export interface DiagramaUml {
    id_diagrama: number;
    tipo_diagrama: string;
    colorClass: string;
    nombre: string;
    descripcion: string;
    nodos: number;
    conexiones: number;
}

export default function UMLsDashboard() {
    const { id_project } = useParams();
    const navigate = useNavigate();
    const [projectName, setProjectName] = useState("Cargando...");
    const [projectDescription, setProjectDescription] = useState("Cargando...");
    const [rolesProyecto, setRolesProyecto] = useState<Rol[]>([]);
    const [procesos, setProcesos] = useState<Proceso[]>([]);
    const [diagramasUML, setDiagramasUML] = useState<DiagramaUml[]>([]);
    const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [selectedEditDiagram, setSelectedEditDiagram] = useState<DiagramaUml | null>(null);
    const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

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

    // Función para obtener los diagramas UML
    const fetchDiagramas = async () => {
        const token = localStorage.getItem("token");
        if (!token || !id_project) return;

        const headers = {
            "Authorization": `Bearer ${token}`
        };

        try {
            const diagramasRes = await fetch(`${API_URL}/diagramasUML/proyecto/${id_project}`, { headers });
            if (diagramasRes.ok) {
                const diagramasData = await diagramasRes.json();
                setDiagramasUML(diagramasData);
            }
        } catch (error) {
            console.error("Error fetching diagramas:", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchDiagramas();
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
                        <button
                            className="btn-primary"
                            onClick={() => setOpenCreateModal(true)}
                        >
                            <Plus /> Nuevo Diagrama
                        </button>
                    </div>
                </div>

                <section className={`dashboard-content ${diagramasUML.length > 0 ? 'has-diagrams' : ''}`}>
                    {diagramasUML.length === 0 ? (
                        <div className="no-diagrams-container">
                            <h2>No hay diagramas aún</h2>
                            <small>Crea tu primer diagrama UML para visualizar la arquitectura del sistema</small>
                            <button
                                className="btn-primary"
                                onClick={() => setOpenCreateModal(true)}
                            >
                                <Plus />
                                Crear Primer Diagrama
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2>Diagramas UML</h2>
                            <ul className="diagrams-grid">
                                {diagramasUML.map(diagram => (
                                    <article className="diagram-card" key={diagram.id_diagrama}>
                                        <div className="diagram-type-badge">
                                            <div className={`badge-dot ${diagram.tipo_diagrama}`}></div>
                                            {diagram.tipo_diagrama === "use_case" && "Casos de Uso"}
                                            {diagram.tipo_diagrama === "class" && "Clases"}
                                            {diagram.tipo_diagrama === "sequence" && "Secuencia"}
                                            {diagram.tipo_diagrama === "package" && "Paquetes"}
                                        </div>
                                        <div className="diagram-info">
                                            <h3>{diagram.nombre}</h3>
                                            <p>{diagram.descripcion}</p>
                                        </div>
                                        <div className="diagram-stats">
                                            <span>{diagram.nodos} nodos</span>
                                            <span>{diagram.conexiones} conexiones</span>
                                        </div>
                                        <div className="diagram-actions">
                                            <button
                                                className="btn-diagram"
                                                onClick={() => navigate(`/uml-editor/${id_project}/uml/${diagram.id_diagrama}`)}
                                            >
                                                <WorkflowAlt />
                                                Diagramar
                                            </button>
                                            <button 
                                                className="btn-edit"
                                                onClick={() => {
                                                    setSelectedEditDiagram(diagram);
                                                    setOpenEditModal(true);
                                                }}
                                            >
                                                <Edit color="#4a4a4a" />
                                            </button>
                                            <button 
                                                className="btn-delete"
                                                onClick={() => setSelectedDeleteId(diagram.id_diagrama)}
                                            >
                                                <Trash color="#ef4444" />
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </ul>
                        </>
                    )}
                </section>

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
            </main>
            {openCreateModal && (
                <ModalCreate
                    children={
                    <UMLsCreate
                        idProject={Number(id_project)}
                        setModalOpen={setOpenCreateModal}
                        setDiagramasUML={setDiagramasUML}
                    />}
                    setOpen={setOpenCreateModal}
                />
            )}
            {openEditModal && selectedEditDiagram && (
                <ModalCreate
                    children={
                        <UMLsEdit
                            diagram={selectedEditDiagram}
                            setModalOpen={setOpenEditModal}
                            setDiagramasUML={setDiagramasUML}
                        />
                    }
                    setOpen={setOpenEditModal}
                />
            )}
            {selectedDeleteId !== null && (
                <Modal
                    setSelectedId={setSelectedDeleteId}
                    children={
                        <UMLsDelete
                            idDiagrama={selectedDeleteId}
                            setSelectedDeleteId={setSelectedDeleteId}
                            onDeleteDiagram={(id) => {
                                setDiagramasUML(prev => prev.filter(d => d.id_diagrama !== id));
                            }}
                        />
                    }
                />
            )}
        </div>
    );
}