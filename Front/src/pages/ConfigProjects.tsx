import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { DashboardAlt, ArrowLeftStroke, Calendar, Pencil } from "@boxicons/react";
import ResumeProject from "../components/ConfigProjectsComponents/ResumeProject";
import EditProject from "../components/ConfigProjectsComponents/EditProject";
import Stakeholders from "../components/RolesComponents/Roles";
import Process from "../components/ProcessesComponents/Processes";
import ModalCreate from "../Modals/ModalCreate";
import HeaderConfigProject from "../components/HeaderConfigProject";
import { type Proyecto } from "../Types/Proyectos";
import "./ConfigProjects.css"

type OptionsProjects = "Roles" | "Procesos";

export default function ConfigProjects() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    // Estado que maneja la apertura de el modal para editar el proyecto
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [option, setOption] = useState<OptionsProjects>("Roles");
    const [project, setProject] = useState<Proyecto | null>(null);
    const [projectName, setProjectName] = useState<string>("");
    const [projectDescription, setProjectDescription] = useState<string>("");
    const [projectDate, setProjectDate] = useState<string>("");
    const [projectStatus, setProjectStatus] = useState<string>("")
    
    // Con el hook "useParams" obtenemos el id pasado en la ruta desde el componente Project
    const idProject = useParams();

    const checkStatus = (estatus: string) => {
        switch(estatus) {
            case "Planificación":
                return "planificacion";
            case "En Progreso":
                return "en-progreso";
            case "Completado":
                return "completado";
            case "Cancelado":
                return "cancelado";
            default:
                return "planificacion";
        }
    };

    const API_URL = `http://localhost:3000/api/proyectos/ver/${idProject.id}`;

    useEffect(() => {
        const getProject = async () => {
            const token = localStorage.getItem("token");

            try {
                const repsonse = await fetch(API_URL, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`, // Envía el token
                        'Content-Type': 'application/json'
                    }
                });

                if (!repsonse.ok) {
                    alert("Error al obtener el proyecto.");
                    return;
                }

                const data = await repsonse.json();
                setProject(data);
                setProjectName(data.nombre);
                setProjectDescription(data.descripcion);

                const dateClean = data.fecha_inicio.split("T")[0];
                setProjectDate(dateClean);
                setProjectStatus(data.estatus);
            } catch (err) {
                console.error(err);
                alert("Error al obtener el proyecto");
            }
        }

        getProject();
    }, []);

    return (
        <main className={`configurate-container ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
            <ProjectSideBar/>
            {mobileOpen && <div 
                    className="backdrop"
                    onClick={() => setMobileOpen(!mobileOpen)}
                />}
            <section className="configurate-body">
                <header className="configurate-header">
                    <HeaderConfigProject
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                        mobileOpen={mobileOpen}
                        setMobileOpen={setMobileOpen}
                    />
                    <div className="section-header">
                        <div className="data-project">
                            <div className="principal-info">
                                <button
                                    className="button-go-back"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    <ArrowLeftStroke />
                                </button>
                                <div>
                                    <h1>{project?.nombre}</h1>
                                    <p>{project?.descripcion}</p>
                                </div>
                            </div>
                            <dl className="secundary-info">
                                <div className="state-project">
                                    <dt>Estado:</dt>
                                    <dd className={`status-project ${checkStatus(projectStatus)}`}>{projectStatus}</dd>
                                </div>
                                <div className="date-project">
                                    <dt>
                                        <Calendar size="xs"/>
                                        Creado el
                                    </dt>
                                    <dd>{projectDate}</dd>
                                </div>
                            </dl>
                        </div>
                        <button
                            className="button-edit-project"
                            onClick={() => setOpenEditModal(true)}
                        >
                            <Pencil size="xs"/> Editar
                        </button>
                    </div>
                </header>
                <section className="config-content">
                    <ResumeProject/>
                    <div className="buttons-menu">
                        <button 
                            className={`button-menu ${option === "Roles" ? "selected" : ""}`}
                            onClick={() => setOption("Roles")}
                        >
                            Roles y Stakeholders
                        </button>
                        <button
                        onClick={() => setOption("Procesos")}
                            className={`button-menu ${option === "Procesos" ? "selected" : ""}`}
                        >
                            Procesos
                        </button>
                    </div>
                    {option === "Roles" && <Stakeholders/>}
                    {option === "Procesos" && <Process/>}
                </section>
            </section>
            {openEditModal && <ModalCreate
                children={
                <EditProject
                    projectName={projectName}
                    setProjectName={setProjectName}
                    projectDescription={projectDescription}
                    setProjectDescription={setProjectDescription}
                    projectDate={projectDate}
                    setProjectDate={setProjectDate}
                    projectStatus={projectStatus}
                    setProjectStatus={setProjectStatus}
                />
                } setOpen={setOpenEditModal}/>}
        </main>
    );
}

function ProjectSideBar() {
    // Mock data
    const totalRoles = 0;
    const totalStakeholders = 0;
    const totalProcesos = 0;
    const totalSubprocesos = 0;

    return (
        <aside className="sidebar">
            <header className="header-sidebar">
                <h2>FLOWTIC</h2>
            </header>
            <div className="button-container">
                <button className="button-dashboard">
                    <DashboardAlt /> Dashboard
                </button>
            </div>
            <section className="resume-sidebar">
                <h3>Resumen</h3>
                <dl className="resume-list">
                    <dt>
                        <div className="icon-roles"></div>
                        Roles
                    </dt>
                    <dd>{totalRoles}</dd>

                    <dt>
                        <div className="icon-stakeholders"></div>
                        Stakeholders
                    </dt>
                    <dd>{totalStakeholders}</dd>

                    <dt>
                        <div className="icon-procesos"></div>
                        Procesos
                    </dt>
                    <dd>{totalProcesos}</dd>

                    <dt>
                        <div className="icon-subprocesos"></div>
                        Subprocesos
                    </dt>
                    <dd>{totalSubprocesos}</dd>
                </dl>
            </section>
        </aside>
    );
}