import "./ResumeProject.css";
import { UserCircle, Group, Workflow } from "@boxicons/react";

export default function ResumeProject() {
    return (
        <section className="resume-project">
            <TotalRoles/>
            <TotalStakeholders/>
            <TotalProcesos/>
            <TotalSubprocesos/>
        </section>
    );
}

function TotalRoles() {
    return (
        <article className="total-roles-container">
            <header className="header-total-roles">
                <h3>Total Roles</h3>
                <div>
                    <UserCircle size="xs"/>
                </div>
            </header>
            <div className="body-total-roles">
                <p>{0}</p>
                <small>Incluye Product Owner y Tech Leader</small>
            </div>
        </article>
    );
}

function TotalStakeholders() {
    return (
        <article className="total-stakeholders-container">
            <header className="header-total-stakeholders">
                <h3>Total Stakeholders</h3>
                <div>
                    <Group size="xs"/>
                </div>
            </header>
            <div className="body-total-stakeholders">
                <p>{0}</p>
                <small>Asignados a 0 roles</small>
            </div>
        </article>
    );
}

function TotalProcesos() {
    return (
        <article className="total-procesos-container">
            <header className="header-total-procesos">
                <h3>Total Procesos</h3>
                <div>
                    <Workflow size="xs"/>
                </div>
            </header>
            <div className="body-total-procesos">
                <p>{0}</p>
                <small>Definidos en el proyecto</small>
            </div>
        </article>
    );
}

function TotalSubprocesos() {
    return (
        <article className="total-subprocesos-container">
            <header className="header-total-subprocesos">
                <h3>Total Subprocesos</h3>
                <div>
                    <Workflow size="xs"/>
                </div>
            </header>
            <div className="body-total-subprocesos">
                <p>{0}</p>
                <small>En 0 procesos</small>
            </div>
        </article>
    );
}