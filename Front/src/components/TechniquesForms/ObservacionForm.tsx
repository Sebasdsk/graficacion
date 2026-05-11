import { Plus, Trash } from "@boxicons/react";
import "./ObservacionForm.css";
import { useEffect, useState } from "react";
import type { Rol } from "../../Types/Roles";
import { useParams } from "react-router";
import type { Observacion } from "../../Types/Observaciones";

interface TecnicaProps {
    tecnica: any;
}

export default function ObservacionForm({ tecnica }: TecnicaProps) {
    const { id_project } = useParams();
    const [roles, setRoles] = useState<Rol[]>([]);
    const [rolSeleccionado, setRolSeleccionado] = useState<number | null>(null);
    const [idStakeholder, setIdStakeholder] = useState<number | null>(null);
    const [ubicacion, setUbicacion] = useState("");
    const [fecha, setFecha] = useState("");
    const [duracion, setDuracion] = useState("");
    const [hallazgos, setHallazgos] = useState("");

    const [observacionesList, setObservacionesList] = useState<Observacion[]>([]);

    // Obtener stakeholders del rol seleccionado
    const stakeholdersDelRol = rolSeleccionado
        ? roles.find(r => r.id_rol === rolSeleccionado)?.stakeholder || [] : [];

    const getRolesAndStakehodlers = async () => {
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${API_URL}/roles/proyecto/${id_project}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error("Error al obtener los roles y stakeholders.");
            }

            const data = await response.json();
            setRoles(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getRolesAndStakehodlers();
    }, []);

    // Función para agregar una observación a la lista
    const agregarObservacion = () => {
        const nuevoId = observacionesList.length > 0 ? Math.max(...observacionesList.map(o => o.id_observacion)) + 1 : 1;

        // Body para crear la nueva observación vacía
        const nuevaObservacion: Observacion = {
            id_observacion: nuevoId,
            hora: "",
            categoria: "",
            descripcion: ""
        };
        setObservacionesList(prev => [...prev, nuevaObservacion])
    };

    // Función que elimina la observación de la lista
    const eliminarObservacion = (id: number) => {
        const filtradas = observacionesList.filter(o => o.id_observacion !== id);
        setObservacionesList(filtradas);
    };

    const token = localStorage.getItem("token");
    const API_URL = import.meta.env.VITE_API_URL;

    // Guardar los cambios de la Observación
    const handleSubmit = async () => {
        const body = {
            id_stakeholder: idStakeholder,
            ubicacion,
            fecha,
            duracion,
            hallazgos,
            observaciones: observacionesList
        };

        try {
            const response = await fetch(`${API_URL}/observaciones/${tecnica.observacionData.id_observacion}`,
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
                throw new Error("Error al actualizar observación");
            }
            const data = await response.json();
            console.log(data);

        } catch (error) {
            console.error(error);
        }
    };

    const getObservación = async () => {
        try {
            const response = await fetch(`${API_URL}/observaciones/${tecnica.observacionData.id_observacion}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Error al obtener la técnica de Observación");
            }

            const data = await response.json();
            setRolSeleccionado(data.stakeholder.id_rol);
            setIdStakeholder(data.id_stakeholder);
            setUbicacion(data.ubicacion || "");
            setFecha(data.fecha ? data.fecha.split("T")[0] : "");
            setDuracion(String(data.duracion || ""));
            setHallazgos(data.hallazgos || "");
            setObservacionesList(data.observacion_detalle);
        } catch (err) {
            console.error("Error en la petición:", err);
        }
    }

    useEffect(() => {
        getObservación();
    },[]);

    return (
        <form action={handleSubmit}>
            <section className="observacion-informacion-section">
                <header className="header-observacion-section">
                    <h2>Información de la Observación</h2>
                </header>
                <div className="info-row">
                    <div className="input-container">
                        <label htmlFor="roles-select">Rol</label>
                        <select
                            name="roles"
                            id="roles-select"
                            value={rolSeleccionado || ""}
                            onChange={(e) => setRolSeleccionado(Number(e.target.value))}
                        >
                            <option value="">-- Selecciona un rol --</option>
                            {roles.length > 0 && roles.map(r => (
                                <option key={r.id_rol} value={r.id_rol}>
                                    {r.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-container">
                        <label htmlFor="persona-observada">Persona Observada</label>
                        <select
                            name="persona-observada"
                            id="persona-observada"
                            value={idStakeholder || ""}
                            onChange={(e) => setIdStakeholder(Number(e.target.value))}
                        >
                            <option value="">-- Selecciona un stakeholder --</option>
                            {stakeholdersDelRol.length > 0 ? (
                                stakeholdersDelRol.map(s => (
                                    <option key={s.id_stakeholder} value={s.id_stakeholder}>
                                        {s.nombre}
                                    </option>
                                ))
                            ) : (rolSeleccionado && <option value="">-- No hay Stakeholders --</option>)}
                        </select>
                    </div>
                </div>
                <div className="info-row">
                    <div className="input-container">
                        <label htmlFor="ubicacion">Ubicación</label>
                        <input
                            type="text"
                            placeholder="Ej: Oficina, Departamento de Ventas"
                            id="ubicacion"
                            value={ubicacion}
                            onChange={(e) => setUbicacion(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="fecha">Fecha</label>
                        <input
                            type="date"
                            id="fecha"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="duracion">Duración</label>
                        <input
                            id="duracion"
                            type="text" placeholder="Ej: 2 horas"
                            value={duracion}
                            onChange={(e) => setDuracion(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            <section className="observaciones-list-section">
                <header className="header-observaciones-list">
                    <h2>Observaciones</h2>
                    <button
                        type="button"
                        className="button-add-observacion"
                        onClick={agregarObservacion}
                    >
                        <Plus />
                        Agregar Observación
                    </button>
                </header>
                <div className="observaciones-items">
                    {observacionesList.length === 0 && (
                        <div className="no-observaciones">No hay observaciones. Agrega la primera.</div>
                    )}
                    {observacionesList.map((obs, index) => (
                        <article key={obs.id_observacion} className="observacion-card">
                            <div className="numero-observacion">{index + 1}</div>
                            <div className="contenido-observacion">
                                <div className="fila-inputs-observacion">
                                    <input
                                        type="text"
                                        placeholder="Hora/Momento"
                                        value={obs.hora}
                                        onChange={(e) => {
                                            const nuevas = observacionesList.map(item =>
                                                item.id_observacion === obs.id_observacion
                                                    ? { ...item, hora: e.target.value }
                                                    : item
                                            );
                                            setObservacionesList(nuevas);
                                        }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Categoría"
                                        value={obs.categoria}
                                        onChange={(e) => {
                                            const nuevas = observacionesList.map(item =>
                                                item.id_observacion === obs.id_observacion
                                                    ? { ...item, categoria: e.target.value }
                                                    : item
                                            );
                                            setObservacionesList(nuevas);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="button-delete-observacion"
                                        onClick={() => eliminarObservacion(obs.id_observacion)}
                                    >
                                        <Trash fill="#ff1c1cff" />
                                    </button>
                                </div>
                                <div className="textarea-observacion">
                                    <textarea
                                        placeholder="Describe lo observado..."
                                        value={obs.descripcion}
                                        onChange={(e) => {
                                            const nuevas = observacionesList.map(item =>
                                                item.id_observacion === obs.id_observacion
                                                    ? { ...item, descripcion: e.target.value }
                                                    : item
                                            );
                                            setObservacionesList(nuevas);
                                        }}
                                    />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="hallazgos-section">
                <h2>Hallazgos y Conclusiones</h2>
                <textarea
                    placeholder="Resume los principales hallazgos de la observación..."
                    value={hallazgos}
                    onChange={(e) => setHallazgos(e.target.value)}
                />
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
