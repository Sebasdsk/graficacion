import SubprocessList from "../SubprocessesComponents/Subprocesses";
import { Plus, X } from "@boxicons/react"; 
import "./Processes.css"
import { useState } from "react";

// Datos de prueba
const procesos = [
    {id: 1, nombre: "Proceso numero 1", descripcion: "Descripción del proceso número 1"},
    {id: 2, nombre: "Proceso numero 2", descripcion: "Descripción del proceso número 2"},
    {id: 3, nombre: "Proceso numero 3", descripcion: "Descripción del proceso número 3"},
];

// Contenedor principal de los procesos
export default function Processes() {
    const [createProcess, setCreateProcess] = useState<boolean>(false);

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
            <ProccessesList/>
        </section>
    );
}

// Lista de los procesos
function ProccessesList() {
    return (
        <div className="processes-list">
            {procesos.map(p => (
                <Process
                    key={p.id}
                    id={p.id}
                    nombre={p.nombre}
                    descripcion={p.descripcion}
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
function Process({ id, nombre, descripcion }: ProcessProp) {
    return (
        <article className="process">
            <header className="process-header">
                <h3>{nombre}</h3>
                <small>{descripcion}</small>
            </header>
            <div className="process-body">
                <SubprocessList id={id}/>
            </div>
        </article>
    );
}