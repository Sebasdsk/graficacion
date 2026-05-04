import { Plus, Trash } from "@boxicons/react";
import "./SeguimientoForm.css";
import { useState } from "react";

interface Etapa {
    id_etapa: number;
    nombre: string;
    rolResponsable: string;
    descripcion: string;
    entradas: string;
    salidas: string;
}

export default function SeguimientoForm() {
    const [descripcionFlujo, setDescripcionFlujo] = useState("");
    const [cuellosBotella, setCuellosBotella] = useState("");
    const [mejorasPropuestas, setMejorasPropuestas] = useState("");

    const [etapas, setEtapas] = useState<Etapa[]>([]);

    // Función que agrega una nueva etapa a la lista de etapas
    const agregarEtapa = () => {
        const nuevoId = etapas.length > 0 ? Math.max(...etapas.map(e => e.id_etapa)) + 1 : 1;
        const nuevaEtapa: Etapa = {
            id_etapa: nuevoId,
            nombre: "",
            rolResponsable: "",
            descripcion: "",
            entradas: "",
            salidas: ""
        };
        setEtapas([...etapas, nuevaEtapa]);
    };

    // Función que elimina una etapa de la lista de etapas por su id
    const eliminarEtapa = (id: number) => {
        setEtapas(etapas.filter(e => e.id_etapa !== id));
    };

    // Funcuión que actualiza un campo específico de una etapa por su id
    const actualizarEtapa = (id: number, campo: keyof Etapa, valor: string) => {
        setEtapas(etapas.map(e => e.id_etapa === id ? { ...e, [campo]: valor } : e));
    };

    return (
        <>
            <section className="seguimiento-informacion-section">
                <h2>Información del Proceso</h2>
                <div className="input-container-seguimiento">
                    <label htmlFor="descripcion-flujo">Descripción del Flujo</label>
                    <textarea
                        id="descripcion-flujo"
                        placeholder="Describe el flujo general del proceso..."
                        value={descripcionFlujo}
                        onChange={(e) => setDescripcionFlujo(e.target.value)}
                    />
                </div>
            </section>

            <section className="seguimiento-etapas-section">
                <header className="header-etapas-section">
                    <h2>Etapas del Proceso</h2>
                    <button
                        type="button"
                        className="button-add-etapa"
                        onClick={agregarEtapa}
                    >
                        <Plus />
                        Agregar Etapa
                    </button>
                </header>
                <div className="etapas-list">
                    {etapas.length === 0 && (
                        <div className="no-etapas">No hay etapas aún. Agrega la primera.</div>
                    )}
                    {etapas.map((etapa, index) => (
                        <article key={etapa.id_etapa} className="etapa-card">
                            <header className="etapa-header">
                                <div className="etapa-header-left">
                                    <div className="numero-etapa">{index + 1}</div>
                                    <span>Etapa {index + 1}</span>
                                </div>
                                <button
                                    type="button"
                                    className="button-delete-etapa"
                                    onClick={() => eliminarEtapa(etapa.id_etapa)}
                                >
                                    <Trash fill="#ff1c1cff" />
                                </button>
                            </header>

                            <div className="etapa-body">
                                <div className="etapa-row">
                                    <div className="input-container-seguimiento">
                                        <label>Nombre de la Etapa</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: Aprobación de solicitud"
                                            value={etapa.nombre}
                                            onChange={(e) => actualizarEtapa(etapa.id_etapa, "nombre", e.target.value)}
                                        />
                                    </div>
                                    <div className="input-container-seguimiento">
                                        <label>Rol Responsable</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: Gerente de Operaciones"
                                            value={etapa.rolResponsable}
                                            onChange={(e) => actualizarEtapa(etapa.id_etapa, "rolResponsable", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="input-container-seguimiento">
                                    <label>Descripción</label>
                                    <textarea
                                        placeholder="Describe esta etapa..."
                                        value={etapa.descripcion}
                                        onChange={(e) => actualizarEtapa(etapa.id_etapa, "descripcion", e.target.value)}
                                    />
                                </div>
                                <div className="etapa-row">
                                    <div className="input-container-seguimiento">
                                        <label>Entradas (Inputs)</label>
                                        <input
                                            type="text"
                                            placeholder="¿Qué se recibe?"
                                            value={etapa.entradas}
                                            onChange={(e) => actualizarEtapa(etapa.id_etapa, "entradas", e.target.value)}
                                        />
                                    </div>
                                    <div className="input-container-seguimiento">
                                        <label>Salidas (Outputs)</label>
                                        <input
                                            type="text"
                                            placeholder="¿Qué se genera?"
                                            value={etapa.salidas}
                                            onChange={(e) => actualizarEtapa(etapa.id_etapa, "salidas", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="seguimiento-cuellos-section">
                <h2>Cuellos de Botella Identificados</h2>
                <div className="input-container-seguimiento">
                    <textarea
                        placeholder="Describe los cuellos de botella encontrados..."
                        value={cuellosBotella}
                        onChange={(e) => setCuellosBotella(e.target.value)}
                    />
                </div>
            </section>

            <section className="seguimiento-mejoras-section">
                <h2>Mejoras Propuestas</h2>
                <div className="input-container-seguimiento">
                    <textarea
                        placeholder="Describe las mejoras sugeridas..."
                        value={mejorasPropuestas}
                        onChange={(e) => setMejorasPropuestas(e.target.value)}
                    />
                </div>
            </section>
        </>
    );
}
