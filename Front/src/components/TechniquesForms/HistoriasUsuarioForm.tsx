import { Plus, Trash } from "@boxicons/react";
import "./HistoriasUsuarioForm.css";
import { useState } from "react";

export interface CriterioAceptacion {
    id_criterio: number;
    texto: string;
}

export default function HistoriasUsuarioForm() {
    const [tituloHistoria, setTituloHistoria] = useState("");
    const [como, setComo] = useState("");
    const [quiero, setQuiero] = useState("");
    const [paraQue, setParaQue] = useState("");
    const [prioridad, setPrioridad] = useState("Alta");
    const [storyPoints, setStoryPoints] = useState("");

    const [criteriosList, setCriteriosList] = useState<CriterioAceptacion[]>([]);

    // Función para agregar un nuevo criterio a la historia
    const agregarCriterio = () => {
        const nuevoId = criteriosList.length > 0 ? Math.max(...criteriosList.map(c => c.id_criterio)) + 1 : 1;
        setCriteriosList(prev => [...prev, { id_criterio: nuevoId, texto: "" }]);
    };

    // Función para eliminar un criterio de la lista
    const eliminarCriterio = (id: number) => {
        setCriteriosList(prev => prev.filter(c => c.id_criterio !== id));
    };

    return (
        <>
            <section className="historia-usuario-section">
                <header className="header-historia-section">
                    <h2>Historia de Usuario</h2>
                </header>

                <div className="input-container full-width">
                    <label>Título de la Historia</label>
                    <input
                        type="text"
                        placeholder="Ingrese el título para esta historia de usuario"
                        value={tituloHistoria}
                        onChange={(e) => setTituloHistoria(e.target.value)}
                    />
                </div>

                <div className="input-container full-width">
                    <label>Como...</label>
                    <input
                        type="text"
                        placeholder="Ingrese el rol para esta historia"
                        value={como}
                        onChange={(e) => setComo(e.target.value)}
                    />
                </div>

                <div className="input-container full-width textarea-container">
                    <label>Quiero...</label>
                    <textarea
                        placeholder="Ingrese la necesidad del usuario"
                        value={quiero}
                        onChange={(e) => setQuiero(e.target.value)}
                    />
                </div>

                <div className="input-container full-width textarea-container">
                    <label>Para que...</label>
                    <textarea
                        placeholder="Ingrese el beneficio de la historia"
                        value={paraQue}
                        onChange={(e) => setParaQue(e.target.value)}
                    />
                </div>

                <div className="info-row">
                    <div className="input-container">
                        <label>Prioridad</label>
                        <select
                            value={prioridad}
                            onChange={(e) => setPrioridad(e.target.value)}
                        >
                            <option value="Alta">Alta</option>
                            <option value="Media">Media</option>
                            <option value="Baja">Baja</option>
                        </select>
                    </div>
                    <div className="input-container">
                        <label>Story Points (Opcional)</label>
                        <input
                            type="number"
                            placeholder="5"
                            value={storyPoints}
                            onChange={(e) => setStoryPoints(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            <section className="criterios-aceptacion-section">
                <header className="header-criterios-section">
                    <h2>Criterios de Aceptación</h2>
                    <button
                        type="button"
                        className="button-add-criterio"
                        onClick={agregarCriterio}
                    >
                        <Plus />
                        Agregar Criterio
                    </button>
                </header>
                <div className="criterios-items">
                    {criteriosList.length === 0 && (
                        <div className="no-criterios">No hay criterios de aceptación. Agrega el primero.</div>
                    )}
                    {criteriosList.map((criterio, index) => (
                        <article key={criterio.id_criterio} className="criterio-card">
                            <div className="numero-criterio">{index + 1}</div>
                            <div className="contenido-criterio">
                                <input
                                    type="text"
                                    placeholder="Descripción del criterio..."
                                    value={criterio.texto}
                                    onChange={(e) => {
                                        const nuevos = criteriosList.map(item =>
                                            item.id_criterio === criterio.id_criterio
                                                ? { ...item, texto: e.target.value }
                                                : item
                                        );
                                        setCriteriosList(nuevos);
                                    }}
                                />
                                <button
                                    type="button"
                                    className="button-delete-criterio"
                                    onClick={() => eliminarCriterio(criterio.id_criterio)}
                                >
                                    <Trash fill="#ff1c1cff" />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}
