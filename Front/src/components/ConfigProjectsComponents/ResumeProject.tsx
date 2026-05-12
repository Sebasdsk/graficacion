import "./ResumeProject.css";
import { UserCircle, Group, Workflow } from "@boxicons/react";

interface TotalRolesProp {
    totalRoles: number;
}

interface TotalStakeholdersProp {
    totalStakeholders: number;
}

interface TotalProcesosProp {
    totalProcesos: number;
}

interface TotalSubprocesosProp {
    totalSubprocesos: number;
}

export default function ResumeProject({ totalRoles, totalStakeholders, totalProcesos, totalSubprocesos }: TotalRolesProp & TotalProcesosProp & TotalStakeholdersProp & TotalSubprocesosProp) {
    return (
        <section className="resume-project">
            <TotalRoles totalRoles={totalRoles}/>
            <TotalStakeholders totalStakeholders={totalStakeholders} totalRoles={totalRoles}/>
            <TotalProcesos totalProcesos={totalProcesos}/>
            <TotalSubprocesos totalSubprocesos={totalSubprocesos} totalProcesos={totalProcesos}/>
        </section>
    );
}

function TotalRoles({ totalRoles }: TotalRolesProp) {
    return (
        <article className="total-roles-container">
            <header className="header-total-roles">
                <h3>Total Roles</h3>
                <div>
                    <UserCircle size="xs"/>
                </div>
            </header>
            <div className="body-total-roles">
                <p>{totalRoles}</p>
                <small>Incluye Product Owner y Tech Leader</small>
            </div>
        </article>
    );
}

function TotalStakeholders({ totalStakeholders, totalRoles }: TotalStakeholdersProp & TotalRolesProp) {
    return (
        <article className="total-stakeholders-container">
            <header className="header-total-stakeholders">
                <h3>Total Stakeholders</h3>
                <div>
                    <Group size="xs"/>
                </div>
            </header>
            <div className="body-total-stakeholders">
                <p>{totalStakeholders}</p>
                <small>Asignados a {totalRoles} roles</small>
            </div>
        </article>
    );
}

function TotalProcesos({ totalProcesos }: TotalProcesosProp) {
    return (
        <article className="total-procesos-container">
            <header className="header-total-procesos">
                <h3>Total Procesos</h3>
                <div>
                    <Workflow size="xs"/>
                </div>
            </header>
            <div className="body-total-procesos">
                <p>{totalProcesos}</p>
                <small>Definidos en el proyecto</small>
            </div>
        </article>
    );
}

function TotalSubprocesos({ totalSubprocesos, totalProcesos }: TotalSubprocesosProp & TotalProcesosProp) {
    return (
        <article className="total-subprocesos-container">
            <header className="header-total-subprocesos">
                <h3>Total Subprocesos</h3>
                <div>
                    <Workflow size="xs"/>
                </div>
            </header>
            <div className="body-total-subprocesos">
                <p>{totalSubprocesos}</p>
                <small>En {totalProcesos} procesos</small>
            </div>
        </article>
    );
}