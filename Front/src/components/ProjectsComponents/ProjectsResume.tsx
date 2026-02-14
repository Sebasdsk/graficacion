import "./ProjectsResume.css"
import { FolderMinus, Play, CheckCircle } from "@boxicons/react";

export default function ProjectsResume() {
    return (
        <div className="projects-resume">
            <TotalProjects/>
            <InProgress/>
            <CompleteProjects/>
        </div>
    );
}

function TotalProjects() {
    return(
        <article className="total-projects">
            <div>
                <h3>Total Proyectos</h3>
                <p>0</p>
            </div>
            <div className="icon-folder">
                <FolderMinus />
            </div>
        </article>
    );
}

function InProgress() {
    return(
        <article className="in-progress">
            <div>
                <h3>En Proceso</h3>
                <p>0</p>
            </div>
            <div className="icon-play">
                <Play />
            </div>
        </article>
    );
}

function CompleteProjects() {
    return(
        <article className="complete-projects">
            <div>
                <h3>Completados</h3>
                <p>0</p>
            </div>
            <div className="icon-check">
                <CheckCircle />
            </div>
        </article>
    );
}