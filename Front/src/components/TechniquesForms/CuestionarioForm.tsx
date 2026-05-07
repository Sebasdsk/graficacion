import { Plus, Trash, ChevronUp, ChevronDown } from "@boxicons/react";
import "./CuestionarioForm.css";
import { useState } from "react";

type TipoPregunta = "Texto Libre" | "Opción Múltiple" | "Escala";

interface OpcionRespuesta {
    id: number;
    texto: string;
}

interface PreguntaCuestionario {
    id_pregunta: number;
    textoPregunta: string;
    tipo: TipoPregunta;
    opciones: OpcionRespuesta[];
    escalaMin: number;
    escalaMax: number;
    etiquetaMin: string;
    etiquetaMax: string;
    contraido: boolean;
}

export default function CuestionarioForm() {
    const [preguntas, setPreguntas] = useState<PreguntaCuestionario[]>([]);

    const [infoGeneral, setInfoGeneral] = useState({
        objetivo: "",
        audiencia: "",
        responsable: "",
        metodo: "",
        fechaDistribucion: "",
        fechaLimite: "",
        respuestasRecibidas: 0,
        instrucciones: ""
    });

    // Manejar cambios en la información general el cuestionario
    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInfoGeneral({
            ...infoGeneral,
            [e.target.name]: e.target.value
        });
    };

    // Agregar pregunta
    const agregarPregunta = () => {
        const nuevoId = preguntas.length > 0 ? Math.max(...preguntas.map(p => p.id_pregunta)) + 1 : 1;
        const nuevaPregunta: PreguntaCuestionario = {
            id_pregunta: nuevoId,
            textoPregunta: "",
            tipo: "Texto Libre",
            opciones: [],
            escalaMin: 1,
            escalaMax: 5,
            etiquetaMin: "",
            etiquetaMax: "",
            contraido: false
        };
        setPreguntas([...preguntas, nuevaPregunta]);
    };

    // Eliminar pregunta
    const eliminarPregunta = (id: number) => {
        setPreguntas(preguntas.filter(p => p.id_pregunta !== id));
    };

    // Método para actualizar el contenido de una pregunta
    const actualizarPregunta = (id: number, campo: keyof PreguntaCuestionario, valor: any) => {
        setPreguntas(preguntas.map(p => {
            if (p.id_pregunta === id) {
                const updated = { ...p, [campo]: valor };
                // Si se cambia el tipo a "Opción Múltiple" y no hay opciones, se crean dos opciones vacías
                if (campo === "tipo" && valor === "Opción Múltiple" && p.opciones.length === 0) {
                    updated.opciones = [
                        { id: 1, texto: "" },
                        { id: 2, texto: "" }
                    ];
                }
                return updated;
            }
            return p;
        }));
    };

    // Función que contrae y expande una pregunta
    const toggleContraer = (id: number) => {
        setPreguntas(preguntas.map(p => p.id_pregunta === id ? { ...p, contraido: !p.contraido } : p));
    };

    // Agregar opción a la pregunta, solo cuando es de Opción Múltiple
    const agregarOpcion = (idPregunta: number) => {
        setPreguntas(preguntas.map(p => {
            if (p.id_pregunta === idPregunta) {
                const nuevoIdOpcion = p.opciones.length > 0 ? Math.max(...p.opciones.map(o => o.id)) + 1 : 1;
                return {
                    ...p,
                    opciones: [...p.opciones, { id: nuevoIdOpcion, texto: "" }]
                };
            }
            return p;
        }));
    };

    // Actualizar dinámicamente el texto de una opción
    const actualizarOpcion = (idPregunta: number, idOpcion: number, texto: string) => {
        setPreguntas(preguntas.map(p => {
            if (p.id_pregunta === idPregunta) {
                return {
                    ...p,
                    opciones: p.opciones.map(o => o.id === idOpcion ? { ...o, texto } : o)
                };
            }
            return p;
        }));
    };

    // Eliminar una opción
    const eliminarOpcion = (idPregunta: number, idOpcion: number) => {
        setPreguntas(preguntas.map(p => {
            if (p.id_pregunta === idPregunta) {
                return {
                    ...p,
                    opciones: p.opciones.filter(o => o.id !== idOpcion)
                };
            }
            return p;
        }));
    };

    return (
        <>
            <section className="cuestionario-informacion-section">
                <header className="header-cuestionario-section">
                    <h2>Información General del Cuestionario</h2>
                </header>
                <div className="info-cuestionario-div">
                    <div className="input-container-cuestionario">
                        <label htmlFor="objetivo">Objetivo del Cuestionario</label>
                        <textarea
                            name="objetivo"
                            id="objetivo"
                            placeholder="Describe el propósito y objetivos del cuestionario"
                            value={infoGeneral.objetivo}
                            onChange={handleInfoChange}
                        />
                    </div>
                    <div className="input-container-cuestionario">
                        <label htmlFor="audiencia">Audiencia Objetivo</label>
                        <textarea
                            name="audiencia"
                            id="audiencia"
                            placeholder="Ej: Usuarios finales del sistema, stakeholders, equipo de desarrollo"
                            value={infoGeneral.audiencia}
                            onChange={handleInfoChange}
                        />
                    </div>
                    <div className="cuestionario-row">
                        <div className="input-container-cuestionario">
                            <label htmlFor="responsable">Responsable</label>
                            <input
                                type="text"
                                name="responsable"
                                id="responsable"
                                placeholder="Nombre del responsable"
                                value={infoGeneral.responsable}
                                onChange={handleInfoChange}
                            />
                        </div>
                        <div className="input-container-cuestionario">
                            <label htmlFor="metodo">Método de Distribución</label>
                            <input
                                type="text"
                                name="metodo"
                                id="metodo"
                                placeholder="Ej: Email, En línea, Presencial"
                                value={infoGeneral.metodo}
                                onChange={handleInfoChange}
                            />
                        </div>
                    </div>
                    <div className="cuestionario-row">
                        <div className="input-container-cuestionario">
                            <label htmlFor="fechaDistribucion">Fecha de Distribución</label>
                            <input
                                type="date"
                                name="fechaDistribucion"
                                id="fechaDistribucion"
                                value={infoGeneral.fechaDistribucion}
                                onChange={handleInfoChange}
                            />
                        </div>
                        <div className="input-container-cuestionario">
                            <label htmlFor="fechaLimite">Fecha Límite</label>
                            <input
                                type="date"
                                name="fechaLimite"
                                id="fechaLimite"
                                value={infoGeneral.fechaLimite}
                                onChange={handleInfoChange}
                            />
                        </div>
                        <div className="input-container-cuestionario">
                            <label htmlFor="respuestasRecibidas">Respuestas Recibidas</label>
                            <input
                                type="number"
                                name="respuestasRecibidas"
                                id="respuestasRecibidas"
                                min={0}
                                value={infoGeneral.respuestasRecibidas}
                                onChange={handleInfoChange}
                            />
                        </div>
                    </div>
                    <div className="input-container-cuestionario">
                        <label htmlFor="instrucciones">Instrucciones para los Participantes</label>
                        <textarea
                            name="instrucciones"
                            id="instrucciones"
                            placeholder="Instrucciones generales para completar el cuestionario"
                            value={infoGeneral.instrucciones}
                            onChange={handleInfoChange}
                        />
                    </div>
                </div>
            </section>

            <section className="preguntas-cuestionario-section">
                <header className="header-preguntas-cuestionario-section">
                    <h2>Preguntas del Cuestionario</h2>
                    <button
                        type="button"
                        className="button-add-pregunta-cuestionario"
                        onClick={agregarPregunta}
                    >
                        <Plus />
                        Agregar Pregunta
                    </button>
                </header>
                <div className="preguntas-cuestionario-list">
                    {preguntas.length === 0 && (
                        <div className="no-preguntas-cuestionario">No hay preguntas aún. Agrega la primera</div>
                    )}
                    {preguntas.map((p, index) => (
                        <article key={p.id_pregunta} className="pregunta-cuestionario-card">
                            <header className="pregunta-cuestionario-header">
                                <div className="pregunta-header-left">
                                    <button
                                        type="button"
                                        className="button-collapse-pregunta"
                                        onClick={() => toggleContraer(p.id_pregunta)}
                                    >
                                        {p.contraido ? <ChevronDown /> : <ChevronUp />}
                                        Pregunta {index + 1} &nbsp;&nbsp; {p.contraido ? "Expandir" : "Contraer"}
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    className="button-delete-pregunta-cuestionario"
                                    onClick={() => eliminarPregunta(p.id_pregunta)}
                                >
                                    <Trash fill="#ff1c1cff" />
                                </button>
                            </header>
                            {/* Contenido de la pregunta cuando no está contraido su contenido */}
                            {!p.contraido && (
                                <div className="pregunta-cuestionario-body">
                                    <div className="input-container-cuestionario">
                                        <input
                                            type="text"
                                            placeholder="Escribe tu pregunta aquí"
                                            value={p.textoPregunta}
                                            onChange={(e) => actualizarPregunta(p.id_pregunta, "textoPregunta", e.target.value)}
                                        />
                                    </div>
                                    <div className="input-container-cuestionario">
                                        <label>Tipo de Pregunta</label>
                                        <select
                                            value={p.tipo}
                                            onChange={(e) => actualizarPregunta(p.id_pregunta, "tipo", e.target.value as TipoPregunta)}
                                        >
                                            <option value="Texto Libre">Texto Libre</option>
                                            <option value="Opción Múltiple">Opción Múltiple</option>
                                            <option value="Escala">Escala</option>
                                        </select>
                                    </div>

                                    {p.tipo === "Opción Múltiple" && (
                                        <div className="pregunta-opciones-container">
                                            <div className="header-opciones">
                                                <span>Opciones de Respuesta</span>
                                                <button
                                                    type="button"
                                                    className="button-add-opcion"
                                                    onClick={() => agregarOpcion(p.id_pregunta)}
                                                >
                                                    <Plus size="sm" />
                                                    Agregar Opción
                                                </button>
                                            </div>
                                            {p.opciones.map((op, idx) => (
                                                <div key={op.id} className="opcion-item">
                                                    <input
                                                        type="text"
                                                        placeholder={`Opción ${idx + 1}`}
                                                        value={op.texto}
                                                        onChange={(e) => actualizarOpcion(p.id_pregunta, op.id, e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="button-delete-opcion"
                                                        onClick={() => eliminarOpcion(p.id_pregunta, op.id)}
                                                    >
                                                        <Trash fill="#ff1c1cff" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {p.tipo === "Escala" && (
                                        <div className="pregunta-escala-container">
                                            <div className="escala-row">
                                                <div className="input-container-cuestionario">
                                                    <label>Valor Mínimo</label>
                                                    <input
                                                        type="number"
                                                        value={p.escalaMin}
                                                        onChange={(e) => actualizarPregunta(p.id_pregunta, "escalaMin", Number(e.target.value))}
                                                    />
                                                </div>
                                                <div className="input-container-cuestionario">
                                                    <label>Valor Máximo</label>
                                                    <input
                                                        type="number"
                                                        value={p.escalaMax}
                                                        onChange={(e) => actualizarPregunta(p.id_pregunta, "escalaMax", Number(e.target.value))}
                                                    />
                                                </div>
                                            </div>
                                            <div className="escala-row">
                                                <div className="input-container-cuestionario">
                                                    <label>Etiqueta Mínima</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Ej: Muy en desacuerdo"
                                                        value={p.etiquetaMin}
                                                        onChange={(e) => actualizarPregunta(p.id_pregunta, "etiquetaMin", e.target.value)}
                                                    />
                                                </div>
                                                <div className="input-container-cuestionario">
                                                    <label>Etiqueta Máxima</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Ej: Muy de acuerdo"
                                                        value={p.etiquetaMax}
                                                        onChange={(e) => actualizarPregunta(p.id_pregunta, "etiquetaMax", e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}
