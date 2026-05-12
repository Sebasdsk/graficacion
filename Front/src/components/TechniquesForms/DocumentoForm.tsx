import { Plus, Trash } from "@boxicons/react";
import "./DocumentoForm.css";
import { useEffect, useState } from "react";

export interface HallazgoClave {
    id_hallazgo: number;
    texto: string;
    pagina: string;
}

export interface RequisitoIdentificado {
    id_requisito: number;
    texto: string;
    tipo: string;
}

interface TecnicaProps {
    tecnica: any;
}

export default function DocumentoForm({ tecnica }: TecnicaProps) {
    const [nombreDocumento, setNombreDocumento] = useState("");
    const [tipoDocumento, setTipoDocumento] = useState("");
    const [fuente, setFuente] = useState("");
    const [fechaAnalisis, setFechaAnalisis] = useState("");
    const [observaciones, setObservaciones] = useState("");

    const [hallazgosList, setHallazgosList] = useState<HallazgoClave[]>([]);
    const [requisitosList, setRequisitosList] = useState<RequisitoIdentificado[]>([]);

    const token = localStorage.getItem("token");
    const API_URL = import.meta.env.VITE_API_URL;

    // ── Hallazgos ──────────────────────────────────────────────
    const agregarHallazgo = () => {
        const nuevoId = hallazgosList.length > 0 ? Math.max(...hallazgosList.map(h => h.id_hallazgo)) + 1 : 1;
        setHallazgosList(prev => [...prev, { id_hallazgo: nuevoId, texto: "", pagina: "" }]);
    };

    const eliminarHallazgo = (id: number) => {
        setHallazgosList(prev => prev.filter(h => h.id_hallazgo !== id));
    };

    // ── Requisitos ─────────────────────────────────────────────
    const agregarRequisito = () => {
        const nuevoId = requisitosList.length > 0 ? Math.max(...requisitosList.map(r => r.id_requisito)) + 1 : 1;
        setRequisitosList(prev => [...prev, { id_requisito: nuevoId, texto: "", tipo: "" }]);
    };

    const eliminarRequisito = (id: number) => {
        setRequisitosList(prev => prev.filter(r => r.id_requisito !== id));
    };

    // ── GET datos del backend ──────────────────────────────────
    const getDocumento = async () => {
        try {
            const response = await fetch(
                `${API_URL}/documentos/${tecnica.documentoData.id_analisis_documento}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) throw new Error("Error al obtener el documento");

            const data = await response.json();
            console.log("Documento data:", data);

            // Info general
            setNombreDocumento(data.nombre_documento || "");
            setTipoDocumento(data.tipo_documento || "");
            setFuente(data.fuente || "");
            setFechaAnalisis(data.fecha_analisis ? data.fecha_analisis.split("T")[0] : "");
            setObservaciones(data.observaciones || "");

            // Hallazgos
            if (data.hallazgo_documento?.length > 0) {
                setHallazgosList(
                    data.hallazgo_documento.map((h: any, i: number) => ({
                        id_hallazgo: i + 1,
                        texto: h.descripcion || "",
                        pagina: h.pagina !== null ? String(h.pagina) : ""
                    }))
                );
            }

            // Requisitos
            if (data.requisito_documento?.length > 0) {
                setRequisitosList(
                    data.requisito_documento.map((r: any, i: number) => ({
                        id_requisito: i + 1,
                        texto: r.descripcion || "",
                        tipo: r.tipo_requisito || ""
                    }))
                );
            }
        } catch (err) {
            console.error("Error en la petición:", err);
        }
    };

    // ── PUT guardar cambios ────────────────────────────────────
    const handleSubmit = async () => {
        const body = {
            nombre_documento: nombreDocumento,
            tipo_documento: tipoDocumento,
            fuente,
            fecha_analisis: fechaAnalisis || null,
            observaciones,
            hallazgos: hallazgosList.map(h => ({
                texto: h.texto,
                pagina: h.pagina
            })),
            requisitos: requisitosList.map(r => ({
                texto: r.texto,
                tipo: r.tipo
            }))
        };

        try {
            const response = await fetch(
                `${API_URL}/documentos/${tecnica.documentoData.id_analisis_documento}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                }
            );

            if (!response.ok) throw new Error("Error al actualizar el documento");

            const data = await response.json();
            console.log("Documento actualizado:", data);

            // Recargar datos
            await getDocumento();
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    useEffect(() => {
        getDocumento();
    }, []);

    return (
        <form action={handleSubmit}>
            {/* ── Información general ── */}
            <section className="documento-informacion-section">
                <header className="header-documento-section">
                    <h2>Información del Documento</h2>
                </header>

                <div className="info-row">
                    <div className="input-container">
                        <label htmlFor="nombre-documento">Nombre del Documento</label>
                        <input
                            type="text"
                            placeholder="Ej: Manual de usuario v2.1"
                            id="nombre-documento"
                            value={nombreDocumento}
                            onChange={(e) => setNombreDocumento(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="tipo">Tipo</label>
                        <input
                            type="text"
                            placeholder="Ej: Manual, Regulación, Procedimiento"
                            id="tipo"
                            value={tipoDocumento}
                            onChange={(e) => setTipoDocumento(e.target.value)}
                        />
                    </div>
                </div>

                <div className="info-row">
                    <div className="input-container">
                        <label htmlFor="fuente">Fuente</label>
                        <input
                            type="text"
                            placeholder="Ej: Departamento de Calidad"
                            id="fuente"
                            value={fuente}
                            onChange={(e) => setFuente(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="fecha-analisis">Fecha de Análisis</label>
                        <input
                            type="date"
                            id="fecha-analisis"
                            value={fechaAnalisis}
                            onChange={(e) => setFechaAnalisis(e.target.value)}
                        />
                    </div>
                </div>

                <div className="input-container full-width">
                    <label htmlFor="observaciones">Observaciones Generales</label>
                    <textarea
                        id="observaciones"
                        placeholder="Observaciones o notas adicionales sobre el documento..."
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                    />
                </div>
            </section>

            {/* ── Hallazgos clave ── */}
            <section className="hallazgos-clave-section">
                <header className="header-items-section">
                    <h2>Hallazgos Clave</h2>
                    <button
                        type="button"
                        className="button-add-item"
                        onClick={agregarHallazgo}
                    >
                        <Plus />
                        Agregar Hallazgo
                    </button>
                </header>
                <div className="items-list">
                    {hallazgosList.length === 0 && (
                        <div className="no-items">No hay hallazgos registrados. Agrega el primero.</div>
                    )}
                    {hallazgosList.map((hallazgo) => (
                        <article key={hallazgo.id_hallazgo} className="item-card">
                            <input
                                type="text"
                                className="input-texto-principal"
                                placeholder="Hallazgo..."
                                value={hallazgo.texto}
                                onChange={(e) => {
                                    setHallazgosList(prev =>
                                        prev.map(item =>
                                            item.id_hallazgo === hallazgo.id_hallazgo
                                                ? { ...item, texto: e.target.value }
                                                : item
                                        )
                                    );
                                }}
                            />
                            <input
                                type="text"
                                className="input-texto-secundario"
                                placeholder="Página"
                                value={hallazgo.pagina}
                                onChange={(e) => {
                                    setHallazgosList(prev =>
                                        prev.map(item =>
                                            item.id_hallazgo === hallazgo.id_hallazgo
                                                ? { ...item, pagina: e.target.value }
                                                : item
                                        )
                                    );
                                }}
                            />
                            <button
                                type="button"
                                className="button-delete-item"
                                onClick={() => eliminarHallazgo(hallazgo.id_hallazgo)}
                            >
                                <Trash fill="#ff1c1cff" />
                            </button>
                        </article>
                    ))}
                </div>
            </section>

            {/* ── Requisitos identificados ── */}
            <section className="requisitos-identificados-section">
                <header className="header-items-section">
                    <h2>Requisitos Identificados</h2>
                    <button
                        type="button"
                        className="button-add-item"
                        onClick={agregarRequisito}
                    >
                        <Plus />
                        Agregar Requisito
                    </button>
                </header>
                <div className="items-list">
                    {requisitosList.length === 0 && (
                        <div className="no-items">No hay requisitos registrados. Agrega el primero.</div>
                    )}
                    {requisitosList.map((requisito) => (
                        <article key={requisito.id_requisito} className="item-card">
                            <input
                                type="text"
                                className="input-texto-principal"
                                placeholder="Requisito..."
                                value={requisito.texto}
                                onChange={(e) => {
                                    setRequisitosList(prev =>
                                        prev.map(item =>
                                            item.id_requisito === requisito.id_requisito
                                                ? { ...item, texto: e.target.value }
                                                : item
                                        )
                                    );
                                }}
                            />
                            <input
                                type="text"
                                className="input-texto-secundario"
                                placeholder="Tipo"
                                value={requisito.tipo}
                                onChange={(e) => {
                                    setRequisitosList(prev =>
                                        prev.map(item =>
                                            item.id_requisito === requisito.id_requisito
                                                ? { ...item, tipo: e.target.value }
                                                : item
                                        )
                                    );
                                }}
                            />
                            <button
                                type="button"
                                className="button-delete-item"
                                onClick={() => eliminarRequisito(requisito.id_requisito)}
                            >
                                <Trash fill="#ff1c1cff" />
                            </button>
                        </article>
                    ))}
                </div>
            </section>

            {/* ── Botones ── */}
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
