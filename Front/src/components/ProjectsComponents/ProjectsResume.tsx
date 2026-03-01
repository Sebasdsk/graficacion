import "./ProjectsResume.css"
import { FolderMinus, UserCircle, CheckCircle, Group } from "@boxicons/react";

interface CounterDashboardProp {
    totalProjects: number;
}

export default function ProjectsResume({ totalProjects }: CounterDashboardProp) {
    return (
        <div className="projects-resume">
            <TotalProjects totalProjects={totalProjects}/>
            <TotalRoles/>
            <TotalPersons/>
            <CompleteProjects/>
        </div>
    );
}

function TotalProjects({ totalProjects }: CounterDashboardProp) {
    return(
        <article className="total-projects">
            <header className="header-total-projects">
                <h3>Total Proyectos</h3>
                <div className="icon-folder">
                    <FolderMinus size="xs"/>
                </div>
            </header>
            <div className="body-total-projects">
                <p>{totalProjects}</p>
                <small>0 En progreso</small>
            </div>
        </article>
    );
}

function TotalRoles() {
    return(
        <article className="total-roles">
            <header className="header-total-roles">
                <h3>Total Roles</h3>
                <div className="icon-play">
                    <UserCircle size="xs"/>
                </div>
            </header>
            <div className="body-total-roles">
                <p>0</p>
                <small>En 0 Proyectos</small>
            </div>
        </article>
    );
}

function TotalPersons() {
    return (
        <article className="total-persons">
            <header className="header-total-persons">
                <h3>Total Personas</h3>
                <div className="icon-play">
                    <Group size="xs"/>
                </div>
            </header>
            <div className="body-total-persons">
                <p>0</p>
                <small>Asignadas a roles</small>
            </div>
        </article>
    );
}

function CompleteProjects() {
    return(
        <article className="complete-projects">
            <header className="header-complete-projects">
                <h3>Completados</h3>
                <div className="icon-check">
                    <CheckCircle size="xs"/>
                </div>
            </header>
            <div className="body-complete-projects">
                <p>0</p>
                <small>0 Cancelados</small>
            </div>
        </article>
    );
}