import { useState } from "react";
import "./Subprocesses.css"
import type { Subproceso } from "../../Types/Procesos";
import { Edit, WorkflowAlt, Gear } from "@boxicons/react";  
import ModalCreate from "../../Modals/ModalCreate";
import SubprocessCreate from "../../Modals/ModalChildrens/SubprocessesModals/SubprocessCreate";
import { useNavigate } from "react-router";

interface SubprocessListProp {
    subprocesosList: Subproceso[];
    setSubprocesosList: React.Dispatch<React.SetStateAction<Subproceso[]>>;
}

interface IdProcessProp {
    idProcess: number;
}

export default function SubprocessList({ subprocesosList, setSubprocesosList, idProcess }: SubprocessListProp & IdProcessProp) {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <section className="subprocesses-list">
            <header>
                <span>Subprocesos</span>
                <button
                    className="btn-add-subprocess"
                    onClick={() => setModalOpen(true)}
                >
                    <WorkflowAlt size="xs"/>
                    Agregar Subproceso
                </button>
            </header>
            {!subprocesosList.length && <p className="no-subprocesses">No hay subprocesos para este proceso.</p>}
            {subprocesosList.map(sp => (
                <Subprocess
                    key={sp.id_subproceso}
                    id={sp.id_subproceso}
                    nombre={sp.nombre}
                    descripcion={sp.descripcion}
                    idProcess={sp.id_proceso}
                />
            ))}
            {modalOpen && <ModalCreate children={
                <SubprocessCreate
                    setSubprocesosList={setSubprocesosList}
                    idProcess={idProcess}
                    setModalOpen={setModalOpen}
                />
            } setOpen={setModalOpen}/>}
        </section>
    );
}

interface SubprocessProp {
    id: number;
    nombre: string;
    descripcion: string;
    idProcess: number;
}

function Subprocess({ id, nombre, descripcion, idProcess }: SubprocessProp ) {
    const navigate = useNavigate();
    console.log("Subproceso ID:", id);
    console.log("ID del Proceso:", idProcess);

    return(
        <article className="subprocess">
            <div className="info-subprocess">
                <div>
                    <WorkflowAlt size="xs" fill="#6c6c6c"/>
                    <p>{nombre}</p>
                </div>
                <small>{descripcion}</small>
                <div className="list-tecnicas">
                    <button
                        className="btn-config-tecnicas"
                        onClick={() => navigate(`proccess/subprocess/${id}/techniques-dashboard`)}
                    >
                        <Gear size="xs"/>
                        Gestionar Técnicas
                    </button>
                </div>
            </div>
            <button className="button-add-subprocess"><Edit size="xs"/></button>
        </article>
    );
}