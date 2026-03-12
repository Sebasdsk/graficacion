import SubprocessList from "../SubprocessesComponents/Subprocesses";
import ProcessesCreate from "../../Modals/ModalChildrens/ProcessesModals/ProcessesCreate";
import ProcessesEdit from "../../Modals/ModalChildrens/ProcessesModals/ProcessesEdit";
import Modal from "../../Modals/Modal";
import { Plus, X, Edit } from "@boxicons/react"; 
import "./Processes.css"
import { useState, type SetStateAction } from "react";

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

    const ButtonCancelCreate = () => {
        return (
            <button
                onClick={() => setCreateProcess(false)}
                className="button-cancel-create"
            >
                <X/> Cancelar
            </button>
        )
    };
    
    return(
        <section className="processes">
            <header className="processes-header">
                <h2>Gestionar Procesos</h2>
                {!createProcess ? <ButtonCreateProcess/> : <ButtonCancelCreate/>}
            </header>
            {!createProcess ? <ProccessesList setSelectedProcessId={setSelectedProcessId}/> : <ProcessesCreate/>}

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
                <div>
                    <h3>{nombre}</h3>
                    <small>{descripcion}</small>
                </div>
                <button
                    className="button-edit-process"
                    onClick={() => setSelectedProcessId(id)}><Edit/></button>
            </header>
            <div className="process-body">
                <SubprocessList id={id}/>
            </div>
        </article>
    );
}