import SubprocessList from "../SubprocessesComponents/Subprocesses";
import ProcessesCreate from "../../Modals/ModalChildrens/ProcessesModals/ProcessesCreate";
import ProcessesEdit from "../../Modals/ModalChildrens/ProcessesModals/ProcessesEdit";
import Modal from "../../Modals/Modal";
import { Plus, Edit, Workflow, Trash } from "@boxicons/react"; 
import "./Processes.css"
import { useContext, useEffect, useState, type SetStateAction } from "react";
import ModalCreate from "../../Modals/ModalCreate";
import type { Proceso, Subproceso } from "../../Types/Procesos";
import { ProjectIdContext } from "../../pages/ConfigProjects";
import { useNavigate } from "react-router";

// Contenedor principal de los procesos
export default function Processes() {
    const navigate = useNavigate();
    // Estado para manejar los datos de los procesos consultados
    const [procesos, setProcesos] = useState<Proceso[]>([]);
    const [createProcess, setCreateProcess] = useState<boolean>(false);
    // Este state se usa para abrir el modal para editar el proceso seleccionado
    const [selectedProcessId, setSelectedProcessId] = useState<number | null>(null);
    const projectId = useContext(ProjectIdContext);

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    const getProcess = async () => {
        const response = await fetch(`${API_URL}/procesos/proyecto/${projectId}`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            navigate("/login");
            throw new Error("Error al obtener los procesos");
        }

        const data = await response.json();
        setProcesos(data);
    }

    useEffect(() => {
        getProcess();
    }, []);

    const ButtonCreateProcess = () => {
        return (
            <button
                onClick={() => setCreateProcess(true)}
                className="button-create-process"
            >
                <Plus size="xs"/> Crear Proceso
            </button>
        )
    };
    
    return(
        <section className="processes">
            <header className="processes-header">
                <h2>Gestionar Procesos</h2>
                <ButtonCreateProcess/>
            </header>
            {procesos.length === 0 ? (
                <p className="no-processes">No hay procesos asociados a este proyecto</p>
            ) : (
                <ProccessesList procesos={procesos} setSelectedProcessId={setSelectedProcessId}/>
            )}

            {createProcess &&
                <ModalCreate
                    children={
                        <ProcessesCreate
                            setCreateProcess={setCreateProcess}
                            setProcesos={setProcesos}
                        />
                    }
                    setOpen={setCreateProcess}/>
            }
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

interface ProcessListProps {
    procesos: Proceso[];
}

// Lista de los procesos
function ProccessesList({ procesos, setSelectedProcessId }: ProcessListProps & SetSelectedProcessId) {
    console.log("Proceso id:", procesos);
    return (
        <div className="processes-list">
            {procesos.map(p => (
                <Process
                    key={p.id_proceso}
                    id_proceso={p.id_proceso}
                    nombre={p.nombre}
                    descripcion={p.descripcion}
                    subprocesos={p.subprocesos}
                    setSelectedProcessId={setSelectedProcessId}
                />
            ))}
        </div>
    );
}

interface ProcessProp {
    id_proceso: number;
    nombre: string;
    descripcion: string;
    subprocesos?: Subproceso[];
}

// Cada proceso por separado
function Process({ id_proceso, nombre, descripcion, subprocesos, setSelectedProcessId }: ProcessProp & SetSelectedProcessId) {
    // Aqui se evita que haya valor undefined en caso de no haber subprocesos relacionados al proceso
    const safeSubprocesses = subprocesos || [];
    const [subprocessList, setSubprocessList] = useState<Subproceso[]>(safeSubprocesses);
    const totalSubprocesses = subprocessList.length;

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
                        {totalSubprocesses} subprocesos
                    </div>
                    <div className="actions-process-buttons">
                        <button
                            className="button-edit-process"
                            onClick={() => setSelectedProcessId(id_proceso)}
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
                <SubprocessList subprocesosList={subprocessList} setSubprocesosList={setSubprocessList} idProcess={id_proceso}/>
            </div>
        </article>
    );
}