import { Plus, Trash } from "@boxicons/react";
import "./SeguimientoForm.css";
import { useEffect, useState } from "react";
import type { Rol } from "../../Types/Roles";
import { useParams } from "react-router";

interface Etapa {
    id_etapa: number;
    nombre: string;
    id_rol: number;
    descripcion: string;
    entradas: string;
    salidas: string;
    cuelloBotella: string;
    mejoraPropuesta: string;
}

interface TecnicaProps {
    tecnica: any;
}

export default function SeguimientoForm({ tecnica }: TecnicaProps) {
    const { id_project } = useParams();
    const [descripcionFlujo, setDescripcionFlujo] = useState("");
    const [rolSeleccionado, setRolSeleccionado] = useState<number | null>(null);
    const [etapas, setEtapas] = useState<Etapa[]>([]);
    const [roles, setRoles] = useState<Rol[]>([]);

    const token = localStorage.getItem("token");
    const API_URL = import.meta.env.VITE_API_URL;

    // Función que agrega una nueva etapa a la lista de etapas
    const agregarEtapa = () => {
        const nuevoId = etapas.length > 0 ? Math.max(...etapas.map(e => e.id_etapa)) + 1 : 1;
        const nuevaEtapa: Etapa = {
            id_etapa: nuevoId,
            nombre: "",
            id_rol: 0,
            descripcion: "",
            entradas: "",
            salidas: "",
            cuelloBotella: "",
            mejoraPropuesta: ""
        };
        setEtapas([...etapas, nuevaEtapa]);
    };

    // Función que elimina una etapa de la lista de etapas por su id
    const eliminarEtapa = (id: number) => {
        setEtapas(etapas.filter(e => e.id_etapa !== id));
    };

    // Función que actualiza un campo específico de una etapa por su id
    const actualizarEtapa = (id: number, campo: keyof Etapa, valor: string) => {
        setEtapas(etapas.map(e => e.id_etapa === id ? { ...e, [campo]: valor } : e));
    };

    const getRoles = async () => {
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

    // Obtener los datos del seguimiento desde el backend
    const getSeguimiento = async () => {
        try {
            const response = await fetch(
                `${API_URL}/seguimiento/${tecnica.seguimientoData.id_seguimiento}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Error al obtener el seguimiento transaccional");
            }

            const data = await response.json();
            setDescripcionFlujo(data.descripcion_flujo || "");

            if (data.etapa_proceso && data.etapa_proceso.length > 0) {
                const etapasMapeadas: Etapa[] = data.etapa_proceso.map((e: any) => ({
                    id_etapa: e.id_etapa,
                    nombre: e.nombre_etapa || "",
                    id_rol: setRolSeleccionado(e.id_rol),
                    descripcion: e.descripcion || "",
                    entradas: e.entradas || "",
                    salidas: e.salidas || "",
                    cuelloBotella: e.cuello_botella || "",
                    mejoraPropuesta: e.mejora_propuesta || ""
                }));
                setEtapas(etapasMapeadas);
            }
        } catch (err) {
            console.error("Error en la petición:", err);
        }
    };

    // Guardar los cambios del seguimiento
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const body = {
            descripcion_flujo: descripcionFlujo,
            etapas: etapas.map(e => ({
                nombre: e.nombre,
                id_rol: rolSeleccionado,
                descripcion: e.descripcion,
                entradas: e.entradas,
                salidas: e.salidas,
                cuello_botella: e.cuelloBotella,
                mejora_propuesta: e.mejoraPropuesta
            }))
        };

        try {
            const response = await fetch(
                `${API_URL}/seguimiento/${tecnica.seguimientoData.id_seguimiento}`,
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
                throw new Error("Error al actualizar el seguimiento transaccional");
            }

            const data = await response.json();
            console.log("Seguimiento actualizado:", data);
            await getSeguimiento();
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    useEffect(() => {
        getRoles();
        getSeguimiento();
    }, []);

    return (
        <form onSubmit={handleSubmit}>
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
                                        <label>Rol Responsable (Opcional)</label>
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
                                <div className="etapa-row">
                                    <div className="input-container-seguimiento">
                                        <label>Cuello de Botella</label>
                                        <input
                                            type="text"
                                            placeholder="Identifica obstáculos..."
                                            value={etapa.cuelloBotella}
                                            onChange={(e) => actualizarEtapa(etapa.id_etapa, "cuelloBotella", e.target.value)}
                                        />
                                    </div>
                                    <div className="input-container-seguimiento">
                                        <label>Mejora Propuesta</label>
                                        <input
                                            type="text"
                                            placeholder="Propón una solución..."
                                            value={etapa.mejoraPropuesta}
                                            onChange={(e) => actualizarEtapa(etapa.id_etapa, "mejoraPropuesta", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <div className="buttons-techniques-section">
                <button type="button" className="button-cancel-changes" onClick={() => getSeguimiento()}>Cancelar Cambios</button>
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
