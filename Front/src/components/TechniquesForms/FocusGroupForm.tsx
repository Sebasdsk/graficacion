import { Plus, Trash } from "@boxicons/react";
import "./FocusGroupForm.css";
import { useEffect, useState } from "react";
import type { Rol } from "../../Types/Roles";
import { useParams } from "react-router";
import type { Stakeholder } from "../../Types/Stakeholders";

interface Participante {
    id: number;
    stakeholder: number | null;
    rol: number | null;
}

interface Idea {
    id: number;
    texto: string;
    votos: number;
}

export default function FocusGroupForm() {
    const { id_project } = useParams();
    const [tema, setTema] = useState<string>("");
    const [fecha, setFecha] = useState<string>("");
    const [duracion, setDuracion] = useState<string>("");
    const [conclusiones, setConclusiones] = useState<string>("");

    const [participantes, setParticipantes] = useState<Participante[]>([]);
    const [roles, setRoles] = useState<Rol[]>([]);
    const [ideas, setIdeas] = useState<Idea[]>([]);

    // Función para agregar un nuevo participante en blanco al Focus group
    const agregarParticipante = () => {
        const nuevoId = participantes.length > 0 ? Math.max(...participantes.map(p => p.id)) + 1 : 1;
        setParticipantes([...participantes, { id: nuevoId, stakeholder: null, rol: null }]);
    };

    // Función para eliminar un participante del Focus group
    const eliminarParticipante = (id: number) => {
        setParticipantes(participantes.filter(p => p.id !== id));
    };

    // Función para actualizar un participante del Focus group
    const actualizarParticipante = (id: number, campo: keyof Participante, valor: any) => {
        setParticipantes(prevParticipantes => 
            prevParticipantes.map(p => 
                p.id === id ? { ...p, [campo]: valor } : p
            )
        );
    };

    // Función para agregar una nueva idea en blanco al Focus group
    const agregarIdea = () => {
        const nuevoId = ideas.length > 0 ? Math.max(...ideas.map(i => i.id)) + 1 : 1;
        setIdeas([...ideas, { id: nuevoId, texto: "", votos: 0 }]);
    };

    // Función para eliminar una idea del Focus group
    const eliminarIdea = (id: number) => {
        setIdeas(ideas.filter(i => i.id !== id));
    };

    // Función para actualizar una idea del Focus group
    const actualizarIdea = (id: number, campo: keyof Idea, valor: any) => {
        setIdeas(ideas.map(i => i.id === id ? { ...i, [campo]: valor } : i));
    };

    // Esta función filtra los stakeholders disponibles para un participante específico,
    // excluyendo aquellos que ya están asignados a otros participantes (excepto el participante actual)
    const filterStakeholders = (participantes: Participante[], stakeholders: Stakeholder[], participanteActualId: number) => {
        const resultado: Stakeholder[] = [];
        for (let i = 0; i < stakeholders.length; i++) {
            const stakeholder = stakeholders[i];
            let estaOcupado = false; // Indica si el stakeholder está ocupado

            for (let j = 0; j < participantes.length; j++) {
                const participante = participantes[j];

                // Verifica si el stakeholder es el mismo que el del participante
                const mismoStakeholder = stakeholder.id_stakeholder === participante.stakeholder;
                // Verifica si el participante no es el actual
                const esOtroParticipante = participante.id !== participanteActualId;

                // Si el stakeholder está ocupado, es decir, es el mismo que el del participante actual, lo excluimos
                if (mismoStakeholder && esOtroParticipante) {
                    estaOcupado = true;
                    break;
                }
            }
            // Si no está ocupado, ahora si, lo guardamos en el array de resultados
            if (!estaOcupado) {
                resultado.push(stakeholder);
            }
        }
        return resultado;
    }

    // Esta función obtiene los stakeholders disponibles para un participante específico
    const getStakeholdersDisponibles = (p: Participante) => {
        if (!p.rol) return [];

        const rol = roles.find(r => r.id_rol === p.rol);
        const stakeholdersDelRol = rol?.stakeholder || [];

        return filterStakeholders(participantes, stakeholdersDelRol, p.id);
    };

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    const getRoles = async () => {
        const response = await fetch(`${API_URL}/roles/proyecto/${id_project}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        setRoles(data);
    };

    useEffect(() => {
        getRoles();
    }, []);

    return (
        <>
            <section className="focus-informacion-section">
                <h2>Información del Focus Group</h2>
                <div className="input-container-focus">
                    <label htmlFor="tema">Tema/Objetivo</label>
                    <input
                        type="text"
                        id="tema"
                        placeholder="¿Cuál es el tema principal?"
                        value={tema}
                        onChange={(e) => setTema(e.target.value)}
                    />
                </div>
                <div className="focus-row">
                    <div className="input-container-focus">
                        <label htmlFor="fecha">Fecha</label>
                        <input
                            type="date"
                            id="fecha"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                        />
                    </div>
                    <div className="input-container-focus">
                        <label htmlFor="duracion">Duración</label>
                        <input
                            type="text"
                            id="duracion"
                            placeholder="Ej: 1.5 horas"
                            value={duracion}
                            onChange={(e) => setDuracion(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            <section className="focus-participantes-section">
                <header className="header-participantes-section">
                    <h2>Participantes</h2>
                    <button
                        type="button"
                        className="button-add-participante"
                        onClick={agregarParticipante}
                    >
                        <Plus />
                        Agregar Participante
                    </button>
                </header>
                <div className="participantes-list">
                    {participantes.length === 0 && (
                        <div className="no-participantes">No hay participantes aún.</div>
                    )}
                    {participantes.map(p => (
                        <ParticipanteItem
                            key={p.id}
                            p={p}
                            roles={roles}
                            participantes={participantes}
                            setParticipantes={setParticipantes}
                            actualizarParticipante={actualizarParticipante}
                            eliminarParticipante={eliminarParticipante}
                            getStakeholdersDisponibles={getStakeholdersDisponibles}
                        />
                    ))}
                </div>
            </section>

            <section className="focus-ideas-section">
                <header className="header-ideas-section">
                    <h2>Ideas Generadas</h2>
                    <button
                        type="button"
                        className="button-add-idea"
                        onClick={agregarIdea}
                    >
                        <Plus />
                        Agregar Idea
                    </button>
                </header>
                <div className="ideas-list">
                    {ideas.length === 0 && (
                        <div className="no-ideas">No hay ideas aún.</div>
                    )}
                    {ideas.map(i => (
                        <div key={i.id} className="idea-item">
                            <input
                                type="text"
                                placeholder="Idea..."
                                value={i.texto}
                                onChange={(e) => actualizarIdea(i.id, "texto", e.target.value)}
                            />
                            <input
                                type="number"
                                min={0}
                                value={i.votos}
                                onChange={(e) => actualizarIdea(i.id, "votos", Number(e.target.value))}
                            />
                            <button
                                type="button"
                                className="button-delete-item"
                                onClick={() => eliminarIdea(i.id)}
                            >
                                <Trash fill="#ff1c1cff" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="focus-conclusiones-section">
                <h2>Conclusiones</h2>
                <div className="input-container-focus">
                    <textarea
                        placeholder="Resume las conclusiones principales..."
                        value={conclusiones}
                        onChange={(e) => setConclusiones(e.target.value)}
                    />
                </div>
            </section>
        </>
    );
}

interface ParticipanteItemProps {
    p: Participante;
    roles: Rol[];
    participantes: Participante[];
    setParticipantes: React.Dispatch<React.SetStateAction<Participante[]>>;
    actualizarParticipante: (id: number, campo: keyof Participante, valor: any) => void;
    eliminarParticipante: (id: number) => void;
    getStakeholdersDisponibles: (p: Participante) => Stakeholder[];
}

function ParticipanteItem ({
    p,
    roles,
    setParticipantes,
    actualizarParticipante,
    eliminarParticipante,
    getStakeholdersDisponibles
}: ParticipanteItemProps) {
    const stakeholdersDisponibles = getStakeholdersDisponibles(p);

    return (
        <div className="participante-item">
            <select
                value={p.rol ?? ""}
                onChange={(e) => {
                const nuevoRol = e.target.value ? Number(e.target.value) : null;

                setParticipantes(prev =>
                    prev.map(part =>
                    part.id === p.id
                        ? { ...part, rol: nuevoRol, stakeholder: null }
                        : part
                    )
                );
                }}
            >
                <option value="">--Selecciona un rol--</option>
                {roles.map(rol => (
                <option key={rol.id_rol} value={rol.id_rol}>
                    {rol.nombre}
                </option>
                ))}
            </select>

            <select
                value={p.stakeholder ?? ""}
                onChange={(e) => {
                    const nuevoStakeholder = e.target.value
                        ? Number(e.target.value)
                        : null;

                    actualizarParticipante(p.id, "stakeholder", nuevoStakeholder);
                }}
                disabled={!p.rol}
            >
                {stakeholdersDisponibles.length === 0 ? (
                <option value="">--No hay stakeholders disponibles--</option>
                ) : (
                <>
                    <option value="">--Selecciona un stakeholder--</option>
                    {stakeholdersDisponibles.map(stake => (
                    <option key={stake.id_stakeholder} value={stake.id_stakeholder}>
                        {stake.nombre}
                    </option>
                    ))}
                </>
                )}
            </select>

            <button
                type="button" 
                className="button-delete-item"
                onClick={() => eliminarParticipante(p.id)}
            >
                <Trash fill="#ff1c1cff" />
            </button>
        </div>
    );
};
