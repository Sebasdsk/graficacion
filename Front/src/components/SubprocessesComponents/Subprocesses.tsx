import "./Subprocesses.css"

const subprocess = [
    {id: 1, nombre: "Subproceso 1", descripcion: "Subproceso del proceso X", idProcess: 1},
    {id: 2, nombre: "Subproceso 2", descripcion: "Subproceso del proceso X", idProcess: 1},
    {id: 3, nombre: "Subproceso 3", descripcion: "Subproceso del proceso X", idProcess: 2},
    {id: 4, nombre: "Subproceso 4", descripcion: "Subproceso del proceso X", idProcess: 2},
    {id: 5, nombre: "Subproceso 5", descripcion: "Subproceso del proceso X", idProcess: 3},
    {id: 6, nombre: "Subproceso 6", descripcion: "Subproceso del proceso X", idProcess: 3},
];

interface IdSubprocessProp {
    id: number;
}

export default function SubprocessList({ id }: IdSubprocessProp) {
    const filterSubprocess = subprocess.filter(sp => sp.idProcess === id);
    
    return (
        <section className="subprocesses-list">
            <span>Subprocesos</span>
            {filterSubprocess.map(sp => (
                <Subprocess
                    key={sp.id}
                    id={sp.id}
                    nombre={sp.nombre}
                    descripcion={sp.descripcion}
                />
            ))}
        </section>
    );
}

interface SubprocessProp {
    id: number;
    nombre: string;
    descripcion: string;
}

function Subprocess({ nombre, descripcion }: SubprocessProp ) {
    return(
        <article className="subprocess">
            <p>{nombre}</p>
            <small>{descripcion}</small>
        </article>
    );
}