import SubprocessList from "../SubprocessesComponents/Subprocesses";
import ProcessesCreate from "../../Modals/ModalChildrens/ProcessesModals/ProcessesCreate";
import ProcessesEdit from "../../Modals/ModalChildrens/ProcessesModals/ProcessesEdit";
import Modal from "../../Modals/Modal";
import { Plus, Edit, Workflow, Trash } from "@boxicons/react"; 
import "./Processes.css"
import { useState, type SetStateAction } from "react";
import ModalCreate from "../../Modals/ModalCreate";

// Datos de prueba
const procesos = [
    {id: 1, nombre: "Proceso numero 1", descripcion: "Descripción del proceso número 1"},
    {id: 2, nombre: "Proceso numero 2", descripcion: "Descripción del proceso número 2"},
    {id: 3, nombre: "Proceso numero 3", descripcion: "Descripción del proceso número 3"},
];

// Contenedor principal de los procesos
export default function Processes() {
    const [createProcess, setCreateProcess] = useState<boolean>(false);
    // Este state se usa para abrir el modal para editar el proceso seleccionado
    const [selectedProcessId, setSelectedProcessId] = useState<number | null>(null);

    const ButtonCreateProcess = () => {
        return (
            <button
                onClick={() => setCreateProcess(true)}
                className="button-create-process"
            >
                <Plus/> Crear Proceso
            </button>
        )
    };
    
    return(
        <section className="processes">
            <header className="processes-header">
                <h2>Gestionar Procesos</h2>
                <ButtonCreateProcess/>
            </header>
            <ProccessesList setSelectedProcessId={setSelectedProcessId}/>

            {createProcess && <ModalCreate children={<ProcessesCreate/>} setOpen={setCreateProcess}/>}
            {selectedProcessId !== null && <Modal setSelectedId={setSelectedProcessId}>
                <ProcessesEdit idProcess={selectedProcessId} />
            </Modal>}
        </section>
    );
}

// Prop para pasar el setter a el componente "Process" para abrir el modal para edtar el proceso
export interface SetSelectedProcessId {
    setSelectedProcessId: React.Dispatch<SetStateAction<number | null>>;
}

// Lista de los procesos
function ProccessesList({setSelectedProcessId}: SetSelectedProcessId) {
    return (
        <div className="processes-list">
            {procesos.map(p => (
                <Process
                    key={p.id}
                    id={p.id}
                    nombre={p.nombre}
                    descripcion={p.descripcion}
                    setSelectedProcessId={setSelectedProcessId}
                />
            ))}
        </div>
    );
}

interface ProcessProp {
    id: number;
    nombre: string;
    descripcion: string;
}

// Cada proceso por separado
function Process({ id, nombre, descripcion, setSelectedProcessId }: ProcessProp & SetSelectedProcessId) {
    return (
        <article className="process">
            <header className="process-header">
                <div className="about-process">
                    <Workflow />
                    <div className="info-process">
                        <h3>{nombre}</h3>
                        <small>{descripcion}</small>
                    </div>
                </div>
                <div className="left-header-process">
                    <div className="subprocess-counter">
                        {0} subprocesos
                    </div>
                    <div className="actions-process-buttons">
                        <button
                            className="button-edit-process"
                            onClick={() => setSelectedProcessId(id)}
                        >
                            <Edit size="sm"/>
                        </button>
                        <button className="button-delete-process">
                            <Trash fill="#e21818ff" size="sm"/>
                        </button>
                    </div>
                </div>
            </header>
            <div className="process-body">
                <SubprocessList id={id}/>
            </div>
        </article>
    );
}