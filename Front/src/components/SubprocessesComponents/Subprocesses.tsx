import { useState } from "react";
import "./Subprocesses.css"
import type { Subproceso } from "../../Types/Procesos";
import { Edit, WorkflowAlt, Gear, Trash } from "@boxicons/react";
import ModalCreate from "../../Modals/ModalCreate";
import SubprocessCreate from "../../Modals/ModalChildrens/SubprocessesModals/SubprocessCreate";
import SubprocessEdit from "../../Modals/ModalChildrens/SubprocessesModals/SubprocessEdit";
import SubprocessesDelete from "../../Modals/ModalChildrens/SubprocessesModals/SubprocessesDelete";
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
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedSubprocessId, setSelectedSubprocessId] = useState<number | null>(null);
    const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

    // Función que actualiza la lista de subprocesos cuando se elimina uno
    const handleDeleteSubprocess = (id: number) => {
        setSubprocesosList(subprocesosList.filter(sp => sp.id_subproceso !== id));
    };

    // Functión que abre el modal de editar el subproceso
    const handleEditSubprocess = (id: number) => {
        setSelectedSubprocessId(id);
        setEditModalOpen(true);
    };

    return (
        <section className="subprocesses-list">
            <header>
                <span>Subprocesos</span>
                <button
                    className="btn-add-subprocess"
                    onClick={() => setModalOpen(true)}
                >
                    <WorkflowAlt size="xs" />
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
                    onEdit={() => handleEditSubprocess(sp.id_subproceso)}
                    onDelete={() => setSelectedDeleteId(sp.id_subproceso)}
                />
            ))}
            {modalOpen && <ModalCreate children={
                <SubprocessCreate
                    setSubprocesosList={setSubprocesosList}
                    idProcess={idProcess}
                    setModalOpen={setModalOpen}
                />
            } setOpen={setModalOpen} />}
            {editModalOpen && selectedSubprocessId !== null && <ModalCreate children={
                <SubprocessEdit
                    idSubprocess={selectedSubprocessId}
                    subprocesosList={subprocesosList}
                    setSubprocesosList={setSubprocesosList}
                    setModalEditOpen={setEditModalOpen}
                />
            } setOpen={setEditModalOpen} />}
            {selectedDeleteId !== null && <ModalCreate children={
                <SubprocessesDelete
                    idSubprocess={selectedDeleteId}
                    setSelectedDeleteId={setSelectedDeleteId}
                    onDeleteSubprocess={handleDeleteSubprocess}
                />
            } setOpen={() => setSelectedDeleteId(null)} />}
        </section>
    );
}

interface SubprocessProp {
    id: number;
    nombre: string;
    descripcion: string;
    onEdit: () => void;
    onDelete: () => void;
}

function Subprocess({ id, nombre, descripcion, onEdit, onDelete }: SubprocessProp) {
    const navigate = useNavigate();

    return (
        <article className="subprocess">
            <div className="info-subprocess">
                <div>
                    <WorkflowAlt size="xs" fill="#6c6c6c" />
                    <p>{nombre}</p>
                </div>
                <small>{descripcion}</small>
                <div className="list-tecnicas">
                    <button
                        className="btn-config-tecnicas"
                        onClick={() => navigate(`proccess/subprocess/${id}/techniques-dashboard`)}
                    >
                        <Gear size="xs" />
                        Gestionar Técnicas
                    </button>
                </div>
            </div>
            <div className="actions-subprocess">
                <button className="button-add-subprocess" onClick={onEdit}><Edit size="xs" /></button>
                <button className="button-add-subprocess" onClick={onDelete}><Trash size="xs" fill="#e21818ff" /></button>
            </div>
        </article>
    );
}