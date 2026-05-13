import { Plus, Trash, ChevronUp, ChevronDown } from "@boxicons/react";
import "./CuestionarioForm.css";
import { useEffect, useState } from "react";

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
    // Respuestas
    respuestaTexto?: string;
    respuestaNumero?: number;   
    idOpcionSeleccionada?: number;
}

interface TecnicaProps {
    tecnica: any;
}

// Mapea el enum de la BD al tipo del frontend
const mapTipoPregunta = (tipo: string): TipoPregunta => {
    if (tipo === "opcion_multiple") return "Opción Múltiple";
    if (tipo === "escala") return "Escala";
    return "Texto Libre";
};

export default function CuestionarioForm({ tecnica }: TecnicaProps) {
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

    const token = localStorage.getItem("token");
    const API_URL = import.meta.env.VITE_API_URL;

    // Manejar cambios en la información general del cuestionario
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
            contraido: false,
            // Respuestas
            respuestaTexto: "",
            respuestaNumero: undefined,
            idOpcionSeleccionada: undefined
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

    // Cargar datos del cuestionario desde el backend
    const getCuestionario = async () => {
        try {
            const response = await fetch(
                `${API_URL}/cuestionarios/${tecnica.cuestionarioData.id_cuestionario}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Error al obtener el cuestionario");
            }

            const data = await response.json();

            // Cargar información general
            setInfoGeneral({
                objetivo: data.objetivo || "",
                audiencia: data.audiencia_objetivo || "",
                responsable: data.responsable || "",
                metodo: data.metodo_distribucion || "",
                fechaDistribucion: data.fecha_distribucion ? data.fecha_distribucion.split("T")[0] : "",
                fechaLimite: data.fecha_limite ? data.fecha_limite.split("T")[0] : "",
                respuestasRecibidas: data.respuestas_recibidas || 0,
                instrucciones: data.instrucciones || ""
            });

            const preguntasMapeadas: PreguntaCuestionario[] =
                data.pregunta_cuestionario.map((p: any) => {
                    // Obtener primera respuesta
                    const respuesta =
                        p.detalle_respuesta?.[0];
                    return {
                        id_pregunta: p.id_pregunta,
                        textoPregunta: p.pregunta || "",
                        tipo: mapTipoPregunta(p.tipo_pregunta),
                        opciones: (p.opcion_respuesta || []).map((op: any) => ({
                            id: op.id_opcion,
                            texto: op.texto_opcion
                        })),
                        escalaMin: p.valor_minimo ?? 1,
                        escalaMax: p.valor_maximo ?? 5,
                        etiquetaMin: p.etiqueta_minima || "",
                        etiquetaMax: p.etiqueta_maxima || "",
                        contraido: false,
                        // RESPUESTAS
                        respuestaTexto: respuesta?.respuesta_texto || "",
                        respuestaNumero: respuesta?.respuesta_numero || undefined,
                        idOpcionSeleccionada: respuesta?.id_opcion || undefined
                    };
                });

            setPreguntas(preguntasMapeadas);
        } catch (err) {
            console.error("Error en la petición:", err);
        }
    };

    // Método para guardar las respuestas
    const guardarRespuestas = async () => {
        const body = {
            respuestas: preguntas.map(p => ({
                id_pregunta: p.id_pregunta,
                respuesta_texto: p.respuestaTexto || null,
                respuesta_numero: p.respuestaNumero ?? null,
                id_opcion: p.idOpcionSeleccionada ?? null
            }))
        };
        console.log(body);
        try {
            const response = await fetch(
                `${API_URL}/cuestionarios/${tecnica.cuestionarioData.id_cuestionario}/responder`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                }
            );
            if (!response.ok) {
                throw new Error("Error al guardar respuestas");
            }

            const data = await response.json();
            console.log("Respuestas guardadas:", data);

            // Recargar cuestionario
            await getCuestionario();
        } catch (error) {
            console.error(error);
        }

    };

    // Guardar los cambios del cuestionario
    const handleSubmit = async () => {
        const body = {
            objetivo: infoGeneral.objetivo,
            audiencia_objetivo: infoGeneral.audiencia,
            responsable: infoGeneral.responsable,
            metodo_distribucion: infoGeneral.metodo,
            fecha_distribucion: infoGeneral.fechaDistribucion || null,
            fecha_limite: infoGeneral.fechaLimite || null,
            respuestas_recibidas: infoGeneral.respuestasRecibidas,
            instrucciones: infoGeneral.instrucciones,
            preguntas: preguntas.map(p => ({
                textoPregunta: p.textoPregunta,
                tipo: p.tipo,
                escalaMin: p.escalaMin,
                escalaMax: p.escalaMax,
                etiquetaMin: p.etiquetaMin,
                etiquetaMax: p.etiquetaMax,
                opciones: p.opciones,
            })) 
        };

        console.log(body);

        try {
            const response = await fetch(
                `${API_URL}/cuestionarios/${tecnica.cuestionarioData.id_cuestionario}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                }
            );

            if (!response.ok) {
                throw new Error("Error al actualizar el cuestionario");
            }

            const data = await response.json();
            console.log("Cuestionario actualizado:", data);

            // Recargar datos
            await getCuestionario();
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    useEffect(() => {
        getCuestionario();
    }, []);

    return (
        <form action={handleSubmit}>
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

                                    {p.tipo === "Texto Libre" && (
                                        <div className="input-container-cuestionario">
                                            <label>Respuesta</label>
                                            <textarea
                                                placeholder="Escribe tu respuesta"
                                                value={p.respuestaTexto || ""}
                                                onChange={(e) =>
                                                    actualizarPregunta(
                                                        p.id_pregunta,
                                                        "respuestaTexto",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    )}
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
                                            <div className="respuesta-opciones">
                                                <label>Selecciona una opción</label>
                                                {p.opciones.map((op) => (
                                                    <label key={op.id} className="radio-option">
                                                        <input
                                                            type="radio"
                                                            name={`pregunta-${p.id_pregunta}`}
                                                            checked={p.idOpcionSeleccionada === op.id}
                                                            onChange={() =>
                                                                actualizarPregunta(
                                                                    p.id_pregunta,
                                                                    "idOpcionSeleccionada",
                                                                    op.id
                                                                )
                                                            }
                                                        />
                                                        {op.texto}
                                                    </label>
                                                ))}
                                            </div>
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
                                            <div className="input-container-cuestionario">
                                                <label>Respuesta</label>
                                                <input
                                                    type="number"
                                                    min={p.escalaMin}
                                                    max={p.escalaMax}
                                                    value={p.respuestaNumero || ""}
                                                    onChange={(e) =>
                                                        actualizarPregunta(
                                                            p.id_pregunta,
                                                            "respuestaNumero",
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </article>
                    ))}
                    {preguntas.length > 0 && (
                        <button
                            className="button-confirm-responses"
                            type="button"
                            onClick={guardarRespuestas}
                        >
                            Guardar Respuestas
                        </button>
                    )}
                </div>
            </section>
            <div className="buttons-techniques-section">
                <button className="button-cancel-changes">Cancelar Cambios</button>
                <button
                    className="button-confirm-changes"
                    type="submit"
                >
                    Guardar Cambios
                </button>
            </div>
        </form>
    );
}
