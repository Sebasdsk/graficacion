import { Plus, Trash } from "@boxicons/react";
import "./DocumentoForm.css";
import { useState } from "react";

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

export default function DocumentoForm() {
    const [nombreDocumento, setNombreDocumento] = useState("");
    const [tipoDocumento, setTipoDocumento] = useState("");
    const [fuente, setFuente] = useState("");
    const [fechaAnalisis, setFechaAnalisis] = useState("");

    const [hallazgosList, setHallazgosList] = useState<HallazgoClave[]>([]);
    const [requisitosList, setRequisitosList] = useState<RequisitoIdentificado[]>([]);

    const agregarHallazgo = () => {
        const nuevoId = hallazgosList.length > 0 ? Math.max(...hallazgosList.map(h => h.id_hallazgo)) + 1 : 1;
        setHallazgosList(prev => [...prev, { id_hallazgo: nuevoId, texto: "", pagina: "" }]);
    };

    const eliminarHallazgo = (id: number) => {
        setHallazgosList(prev => prev.filter(h => h.id_hallazgo !== id));
    };

    const agregarRequisito = () => {
        const nuevoId = requisitosList.length > 0 ? Math.max(...requisitosList.map(r => r.id_requisito)) + 1 : 1;
        setRequisitosList(prev => [...prev, { id_requisito: nuevoId, texto: "", tipo: "" }]);
    };

    const eliminarRequisito = (id: number) => {
        setRequisitosList(prev => prev.filter(r => r.id_requisito !== id));
    };

    return (
        <>
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
                        <label htmlFor="fecha-analisis" >Fecha de Análisis</label>
                        <input
                            type="date"
                            id="fecha-analisis"
                            value={fechaAnalisis}
                            onChange={(e) => setFechaAnalisis(e.target.value)}
                        />
                    </div>
                </div>
            </section>

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
                                    const nuevos = hallazgosList.map(item =>
                                        item.id_hallazgo === hallazgo.id_hallazgo
                                            ? { ...item, texto: e.target.value }
                                            : item
                                    );
                                    setHallazgosList(nuevos);
                                }}
                            />
                            <input
                                type="text"
                                className="input-texto-secundario"
                                placeholder="Página"
                                value={hallazgo.pagina}
                                onChange={(e) => {
                                    const nuevos = hallazgosList.map(item =>
                                        item.id_hallazgo === hallazgo.id_hallazgo
                                            ? { ...item, pagina: e.target.value }
                                            : item
                                    );
                                    setHallazgosList(nuevos);
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
                                    const nuevos = requisitosList.map(item =>
                                        item.id_requisito === requisito.id_requisito
                                            ? { ...item, texto: e.target.value }
                                            : item
                                    );
                                    setRequisitosList(nuevos);
                                }}
                            />
                            <input
                                type="text"
                                className="input-texto-secundario"
                                placeholder="Tipo"
                                value={requisito.tipo}
                                onChange={(e) => {
                                    const nuevos = requisitosList.map(item =>
                                        item.id_requisito === requisito.id_requisito
                                            ? { ...item, tipo: e.target.value }
                                            : item
                                    );
                                    setRequisitosList(nuevos);
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
        </>
    );
}
