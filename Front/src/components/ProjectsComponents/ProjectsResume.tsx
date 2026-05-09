import type { Proyecto } from "../../Types/Proyectos";
import type { Rol } from "../../Types/Roles";
import "./ProjectsResume.css"
import { FolderMinus, UserCircle, CheckCircle, Group } from "@boxicons/react";

interface CounterDashboardProp {
    totalProjects: number;
}

interface ProjectsResumeProp {
    projects: Proyecto[];
}

interface TotalRolesProp {
    roles: Rol[];
}

interface TotalStakeholdersProp {
    totalStakeholders: number;
}

export default function ProjectsResume({ projects, totalProjects, roles, totalStakeholders }: CounterDashboardProp & TotalRolesProp & TotalStakeholdersProp & ProjectsResumeProp) {
    return (
        <div className="projects-resume">
            <TotalProjects totalProjects={totalProjects} projects={projects}/>
            <TotalRoles roles={roles} totalProjects={totalProjects}/>
            <TotalStakeholders totalStakeholders={totalStakeholders}/>
            <CompleteProjects projects={projects}/>
        </div>
    );
}

function TotalProjects({ projects, totalProjects }: CounterDashboardProp & ProjectsResumeProp) {
    const inProgressProjects = projects.filter(p => p.estatus === "En Progreso").length;
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
                <small>{inProgressProjects} En progreso</small>
            </div>
        </article>
    );
}

function TotalRoles({ roles, totalProjects }: TotalRolesProp & CounterDashboardProp) {
    const totalRoles = roles.length;

    return(
        <article className="total-roles">
            <header className="header-total-roles">
                <h3>Total Roles</h3>
                <div className="icon-play">
                    <UserCircle size="xs"/>
                </div>
            </header>
            <div className="body-total-roles">
                <p>{totalRoles}</p>
                <small>En {totalProjects} Proyectos</small>
            </div>
        </article>
    );
}

function TotalStakeholders({ totalStakeholders }: TotalStakeholdersProp) {
    return (
        <article className="total-persons">
            <header className="header-total-persons">
                <h3>Total Stakeholders</h3>
                <div className="icon-play">
                    <Group size="xs"/>
                </div>
            </header>
            <div className="body-total-persons">
                <p>{totalStakeholders}</p>
                <small>Asignados a roles</small>
            </div>
        </article>
    );
}

function CompleteProjects({ projects }: ProjectsResumeProp) {
    const completeProjects = projects.filter(p => p.estatus === "Completado").length;
    const cancelProjects = projects.filter(p => p.estatus === "Cancelado").length;

    return(
        <article className="complete-projects">
            <header className="header-complete-projects">
                <h3>Completados</h3>
                <div className="icon-check">
                    <CheckCircle size="xs"/>
                </div>
            </header>
            <div className="body-complete-projects">
                <p>{completeProjects}</p>
                <small>{cancelProjects} Cancelados</small>
            </div>
        </article>
    );
}