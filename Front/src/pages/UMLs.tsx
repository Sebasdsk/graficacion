import { useState, useCallback, useEffect } from 'react';
import {
    ReactFlow,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    Background,
    MiniMap,
    Controls,
    ConnectionMode,
    type Node,
    type Edge,
    type OnConnect,
    type OnNodesChange,
    type OnEdgesChange
} from '@xyflow/react';
import { useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ActorNode from '../components/UMLsComponents/ActorNode';
import "./UMLs.css";
import { Save } from '@boxicons/react';
import { useNavigate, useParams } from 'react-router';
import CasoUsoNode from '../components/UMLsComponents/CasoUsoNode';
import LimiteSistemaNode from '../components/UMLsComponents/LimiteSistemaNode';
import ClassNode from '../components/UMLsComponents/ClassNode';
import PaqueteNodeData from '../components/UMLsComponents/PaqueteNode';
import ObjectNode from '../components/UMLsComponents/ObjectNode';
import LifelineNode from '../components/UMLsComponents/LifelineNode';
import type { Rol } from '../Types/Roles';
import type { Proceso } from '../Types/Procesos';

// Tipos de nodo
const nodeTypes = {
    actor: ActorNode,
    useCase: CasoUsoNode,
    systemBoundary: LimiteSistemaNode,
    class: ClassNode,
    package: PaqueteNodeData,
    object: ObjectNode,
    lifeline: LifelineNode
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

type DiagramType = 'use-case' | 'class' | 'package' | 'sequence';

export default function UMLs() {
    const { id_project } = useParams();
    const [selectTypeDiagram, setSelectTypeDiagram] = useState<DiagramType>('use-case');
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [roles, setRoles] = useState<Rol[]>([]);
    const [procesos, setProcesos] = useState<Proceso[]>([]);
    const reactFlow = useReactFlow(); // Esto para obtener información sobre el flujo de ReactFlow

    // Encontrar el nodo y conexión seleccionados (React Flow maneja automáticamente la propiedad 'selected')
    const selectedNode = nodes.find(node => node.selected);
    const selectedEdge = edges.find(edge => edge.selected);

    const onNodesChange: OnNodesChange = useCallback(
        (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange: OnEdgesChange = useCallback(
        (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect: OnConnect = useCallback(
        (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );

    // Estilos de las conexiones según el tipo de diagrama
    const stylesEdges: Record<DiagramType, { type: string; style: React.CSSProperties; markerEnd?: any }> = {
        'use-case': {
            type: 'straight',
            style: { strokeWidth: 1, stroke: '#1a1a1a' }
        },
        'class': {
            type: 'smoothstep',
            style: { strokeWidth: 1, stroke: '#1a1a1a' }
        },
        'package': {
            type: 'smoothstep',
            style: { strokeWidth: 2, stroke: '#1a1a1a', strokeDasharray: '5,5' },
            markerEnd: { type: 'arrowclosed' }
        },
        'sequence': {
            type: 'step',
            style: { strokeWidth: 1, stroke: '#1a1a1a', strokeDasharray: '4' }
        },
    };

    // Cambia el estilo de la conexión según el tipo de diagrama seleccionado
    const edgeConfig = stylesEdges[selectTypeDiagram];

    // Función que agrega un nuevo nodo al tablero del diagrama
    const addNode = () => {
        const newNode = {
            id: `actor-${nodes.length + 1}`,
            type: 'actor',
            position: { x: Math.random() * 100, y: Math.random() * 100 }, // Posición aleatoria
            data: { label: `Node ${nodes.length + 1}` },
        };
        setNodes([...nodes, newNode]); // Agrega el nodo al array
    };

    // Función que agrega un nuevo nodo de caso de uso al tablero del diagrama
    const addUseCase = () => {
        const newNode = {
            id: `use-case-${nodes.length + 1}`,
            type: 'useCase',
            position: { x: Math.random() * 100, y: Math.random() * 100 }, // Posición aleatoria
            data: { label: `Use Case ${nodes.length + 1}` },
        };
        setNodes([...nodes, newNode]); // Agrega el nodo al array
    };

    // Función para agregar un nuevo nodo de límite de sistema al tablero del diagrama
    const addLimiteSistema = () => {
        const newNode = {
            id: `limite-sistema-${nodes.length + 1}`,
            type: 'systemBoundary',
            position: { x: Math.random() * 100, y: Math.random() * 100 }, // Posición aleatoria
            data: {
                label: `Sistema ${nodes.length + 1}`,
                alto: 400,
                ancho: 300
            },
        };
        setNodes([...nodes, newNode]); // Agrega el nodo al array
    };

    // Función para agregar un nuevo nodo de clase al tablero del diagrama
    const addClassNode = () => {
        const newNode = {
            id: `class-${nodes.length + 1}`,
            type: 'class',
            position: { x: Math.random() * 100, y: Math.random() * 100 },
            data: {
                label: `Clase ${nodes.length + 1}`,
                attributes: [],
                methods: []
            },
        };
        setNodes([...nodes, newNode]);
    };

    // Función para agregar un nuevo nodo de paquete al tablero del diagrama
    const addPackageNode = () => {
        const newNode = {
            id: `package-${nodes.length + 1}`,
            type: 'package',
            position: { x: Math.random() * 100, y: Math.random() * 100 },
            data: {
                label: `Paquete ${nodes.length + 1}`,
                items: []
            },
        };
        setNodes([...nodes, newNode]);
    };

    // Función para agregar un nuevo nodo de objeto de secuencia
    const addObjectNode = () => {
        const newNode = {
            id: `object-${nodes.length + 1}`,
            type: 'object',
            position: { x: Math.random() * 100, y: Math.random() * 100 },
            data: { label: `:Objeto ${nodes.length + 1}` },
        };
        setNodes([...nodes, newNode]);
    };

    // Función para agregar una nueva línea de vida de secuencia
    const addLifelineNode = () => {
        const newNode = {
            id: `lifeline-${nodes.length + 1}`,
            type: 'lifeline',
            position: { x: Math.random() * 100, y: Math.random() * 100 },
            data: { height: 300 },
        };
        setNodes([...nodes, newNode]);
    };

    // Función que actualiza los datos del nodo seleccionado
    const updateNodeData = (field: string, value: any) => {
        if (!selectedNode) return;

        setNodes((nds) =>
            nds.map((node) =>
                node.id === selectedNode.id
                    ? { ...node, data: { ...node.data, [field]: value } }
                    : node
            )
        );
    };

    // Función helper para obtener el valor de forma segura
    const getNodeValue = (field: string, defaultValue: any = '') => {
        if (!selectedNode) return defaultValue;
        return selectedNode.data[field] ?? defaultValue;
    };

    // Función que actualiza la etiqueta de la conexión seleccionada
    const updateEdgeLabel = (value: string) => {
        if (!selectedEdge) return;

        setEdges((eds) =>
            eds.map((edge) =>
                edge.id === selectedEdge.id
                    ? { ...edge, label: value }
                    : edge
            )
        );
    };

    // Método para obtener los roles, procesos y subprocesos del proyecto al cargar la página
    const getProjectData = async () => {
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL;

        const headers = {
            "Authorization": `Bearer ${token}`
        };

        try {
            const rolesResponse = await fetch(`${API_URL}/roles/proyecto/${id_project}`, { headers });
            if (rolesResponse) {
                const dataRoles = await rolesResponse.json();
                setRoles(dataRoles);
            }

            const procesosResponse = await fetch(`${API_URL}/procesos/proyecto/${id_project}`, { headers });
            if (procesosResponse) {
                const dataProcesos = await procesosResponse.json();
                setProcesos(dataProcesos);
            }
        } catch (err) {
            console.error("Error las peticiones: ", err);
        }
    };

    // Esta función se encarga de convertir el estado actual del diagrama (nodos, conexiones, etc.)
    // a un formato serializable para su almacenamiento o procesamiento posterior
    const handleSaveDiagram = () => {
        // Esto convierte el diagrama a un objeto serializable, para su posterior almacenamiento o procesamiento
        const flowData = reactFlow.toObject();
        console.log("Diagrama guardado: ", flowData); // Imprimir el objeto del diagrama
    }

    useEffect(() => {
        getProjectData();
    }, []);

    // Obtener los subprocesos de los procesos
    const subprocesosFlattened = procesos.flatMap(p => p.subproceso);

    return (
        <div className='diagram-container-page'>
            <header className='header-diagram-map'>
                <FlowticGraficsLogo />
                <button
                    className='button-save-diagram'
                    onClick={handleSaveDiagram}
                >
                    <Save size='sm' /> Guardar
                </button>
            </header>

            <main className='principal-container-page'>
                <aside className='sidebar-uml-editor'>
                    {/* Selector de tipo de diagrama, esto es temporal solo para ver los cambios de los estilos de las conexiones */}
                    <section className='diagram-selector' style={{ marginBottom: '1rem', padding: '1rem' }}>
                        <h4>Tipo de Diagrama</h4>
                        <select
                            value={selectTypeDiagram}
                            onChange={(e) => setSelectTypeDiagram(e.target.value as DiagramType)}
                            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
                        >
                            <option value="use-case">Diagrama de Casos de Uso</option>
                            <option value="class">Diagrama de Clases</option>
                            <option value="sequence">Diagrama de Secuencia</option>
                            <option value="package">Diagrama de Paquetes</option>
                        </select>
                    </section>

                    {selectTypeDiagram === 'use-case' && (
                        <section className='elements-diagram'>
                            <h4>Elementos del Diagrama</h4>
                            <button
                                className='button-add-node'
                                onClick={addNode}
                            >
                                Actor
                                <small>Haz click para agregar un actor</small>
                            </button>
                            <button
                                className='button-add-node'
                                onClick={addUseCase}
                            >
                                Caso de Uso
                                <small>Haz click para agregar un caso de uso</small>
                            </button>
                            <button
                                className='button-add-node'
                                onClick={addLimiteSistema}
                            >
                                Límite del sistema
                                <small>Haz click para agregar un límite del sistema</small>
                            </button>
                        </section>
                    )}

                    {selectTypeDiagram === 'class' && (
                        <section className='elements-diagram'>
                            <h4>Elementos del Diagrama</h4>
                            <button
                                className='button-add-node'
                                onClick={addClassNode}
                            >
                                Clase
                                <small>Haz click para agregar una clase</small>
                            </button>
                        </section>
                    )}

                    {selectTypeDiagram === 'sequence' && (
                        <section className='elements-diagram'>
                            <h4>Elementos del Diagrama</h4>
                            <button
                                className='button-add-node'
                                onClick={addNode}
                            >
                                Actor
                                <small>Haz click para agregar un actor</small>
                            </button>
                            <button
                                className='button-add-node'
                                onClick={addObjectNode}
                            >
                                Objeto
                                <small>Haz click para agregar un objeto</small>
                            </button>
                            <button
                                className='button-add-node'
                                onClick={addLifelineNode}
                            >
                                Línea de Vida
                                <small>Haz click para agregar una línea de vida</small>
                            </button>
                        </section>
                    )}

                    {selectTypeDiagram === 'package' && (
                        <section className='elements-diagram'>
                            <h4>Elementos del Diagrama</h4>
                            <button
                                className='button-add-node'
                                onClick={addPackageNode}
                            >
                                Paquete
                                <small>Haz click para agregar un paquete</small>
                            </button>
                        </section>
                    )}

                    <section className='project-info'>
                        <h4>Información del Proyecto</h4>
                        <dd style={{ fontSize: ".9rem" }}>Roles y Stakeholders</dd>
                        {roles.map(r => (
                            <dt key={r.id_rol}><small style={{ color: "#505050", font: ".7rem" }}> - {r.nombre} ({r.stakeholder.length})</small></dt>
                        ))}
                        <dd style={{ fontSize: ".9rem" }}>Procesos</dd>
                        {procesos.map(p => (
                            <dt key={p.id_proceso}><small style={{ color: "#505050", font: ".7rem" }}> - {p.nombre}</small></dt>
                        ))}
                        <dd style={{ fontSize: ".9rem" }}>Subprocesos</dd>
                        {subprocesosFlattened.map(s => (
                            <dt key={s.id_subproceso}><small style={{ color: "#505050", font: ".7rem" }}> - {s.nombre}</small></dt>
                        ))}
                    </section>
                </aside>

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                    connectionMode={ConnectionMode.Loose}
                    defaultEdgeOptions={{
                        type: edgeConfig.type,
                        style: edgeConfig.style,
                        markerEnd: { type: 'arrowclosed' } // Opcional: agregar flecha por defecto
                    }}
                    className='Reactflow-map'
                >
                    <Background />
                    <Controls />
                    <MiniMap />
                </ReactFlow>

                {/* Formulario dinámico que muestra cuando hay un nodo o conexión seleccionada */}
                {(selectedNode || selectedEdge) && (
                    <aside className='sidebar-properties-right'>
                        {selectedNode ? (
                            <section className='node-properties-form'>
                                <h4>Propiedades del Elemento</h4>
                                <p><small>Tipo: {selectedNode.type}</small></p>
                                <div className='form-group'>
                                    <label>Nombre:</label>
                                    <input
                                        type="text"
                                        value={String(getNodeValue('label', ''))}
                                        onChange={(e) => updateNodeData('label', e.target.value)}
                                        placeholder="Nombre del elemento"
                                    />
                                </div>

                                {/* Campos específicos para Límite del Sistema */}
                                {selectedNode.type === 'systemBoundary' && (
                                    <>
                                        <div className='form-group'>
                                            <label>Alto:</label>
                                            <input
                                                type="number"
                                                value={(selectedNode.data as any).alto || 300}
                                                onChange={(e) => updateNodeData('alto', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <label>Ancho:</label>
                                            <input
                                                type="number"
                                                value={(selectedNode.data as any).ancho || 400}
                                                onChange={(e) => updateNodeData('ancho', parseInt(e.target.value))}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Campos específicos para Clase */}
                                {selectedNode.type === 'class' && (
                                    <>
                                        <div className='form-group'>
                                            <label>Atributos:</label>
                                            <div className="dynamic-list-container">
                                                {((selectedNode.data as any).attributes || []).map((attr: string, index: number) => (
                                                    <div key={index} className="dynamic-list-item" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                        <input
                                                            type="text"
                                                            value={attr}
                                                            onChange={(e) => {
                                                                const newAttrs = [...((selectedNode.data as any).attributes || [])];
                                                                newAttrs[index] = e.target.value;
                                                                updateNodeData('attributes', newAttrs);
                                                            }}
                                                            placeholder="+ atributo"
                                                            style={{ flex: 1 }}
                                                        />
                                                        <button
                                                            className="button-remove-item"
                                                            onClick={() => {
                                                                const newAttrs = ((selectedNode.data as any).attributes || []).filter((_: any, i: number) => i !== index);
                                                                updateNodeData('attributes', newAttrs);
                                                            }}
                                                            style={{ padding: '0 0.5rem', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                        >
                                                            x
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    className="button-add-item"
                                                    onClick={() => {
                                                        const newAttrs = [...((selectedNode.data as any).attributes || []), ''];
                                                        updateNodeData('attributes', newAttrs);
                                                    }}
                                                    style={{ width: '100%', padding: '0.5rem', backgroundColor: '#f0f0f0', border: '1px dashed #ccc', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    + Agregar Atributo
                                                </button>
                                            </div>
                                        </div>

                                        <div className='form-group'>
                                            <label>Métodos:</label>
                                            <div className="dynamic-list-container">
                                                {((selectedNode.data as any).methods || []).map((method: string, index: number) => (
                                                    <div key={index} className="dynamic-list-item" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                        <input
                                                            type="text"
                                                            value={method}
                                                            onChange={(e) => {
                                                                const newMethods = [...((selectedNode.data as any).methods || [])];
                                                                newMethods[index] = e.target.value;
                                                                updateNodeData('methods', newMethods);
                                                            }}
                                                            placeholder="+ método()"
                                                            style={{ flex: 1 }}
                                                        />
                                                        <button
                                                            className="button-remove-item"
                                                            onClick={() => {
                                                                const newMethods = ((selectedNode.data as any).methods || []).filter((_: any, i: number) => i !== index);
                                                                updateNodeData('methods', newMethods);
                                                            }}
                                                            style={{ padding: '0 0.5rem', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                        >
                                                            x
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    className="button-add-item"
                                                    onClick={() => {
                                                        const newMethods = [...((selectedNode.data as any).methods || []), ''];
                                                        updateNodeData('methods', newMethods);
                                                    }}
                                                    style={{ width: '100%', padding: '0.5rem', backgroundColor: '#f0f0f0', border: '1px dashed #ccc', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    + Agregar Método
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {selectedNode.type === 'package' && (
                                    <div className='form-group'>
                                        <label>Items:</label>
                                        <div className="dynamic-list-container">
                                            {((selectedNode.data as any).items || []).map((item: string, index: number) => (
                                                <div key={index} className="dynamic-list-item" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                    <input
                                                        type="text"
                                                        value={item}
                                                        onChange={(e) => {
                                                            const newItems = [...(selectedNode.data as any).items || []]
                                                            newItems[index] = e.target.value;
                                                            updateNodeData('items', newItems);
                                                        }}
                                                        style={{ flex: 1 }}
                                                    />
                                                    <button
                                                        className="button-remove-item"
                                                        onClick={() => {
                                                            const newItems = [...(selectedNode.data as any).items || []].filter((_: any, i: number) => i !== index);
                                                            updateNodeData('items', newItems);
                                                        }}
                                                        style={{ padding: '0 0.5rem', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                    >
                                                        x
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                className="button-add-item"
                                                onClick={() => {
                                                    const newItems = [...((selectedNode.data as any).items || []), ''];
                                                    updateNodeData('items', newItems);
                                                }}
                                                style={{ width: '100%', padding: '0.5rem', backgroundColor: '#f0f0f0', border: '1px dashed #ccc', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                + Agregar Item
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Campos específicos para Línea de vida */}
                                {selectedNode.type === 'lifeline' && (
                                    <>
                                        <div className='form-group'>
                                            <label>Alto:</label>
                                            <input
                                                type="number"
                                                value={(selectedNode.data as any).height || 300}
                                                onChange={(e) => updateNodeData('height', parseInt(e.target.value))}
                                            />
                                        </div>
                                    </>
                                )}

                                <button
                                    className='button-delete-node'
                                    onClick={() => setNodes(nodes.filter(n => n.id !== selectedNode.id))}
                                >
                                    Eliminar Elemento
                                </button>
                            </section>
                        ) : selectedEdge ? (
                            <section className='node-properties-form'>
                                <h4>Propiedades de la Conexión</h4>
                                <div className='form-group'>
                                    <label>Etiqueta:</label>
                                    <input
                                        type="text"
                                        value={selectedEdge.label ? String(selectedEdge.label) : ''}
                                        onChange={(e) => updateEdgeLabel(e.target.value)}
                                        placeholder="Etiqueta de conexión"
                                    />
                                </div>
                                <button
                                    className='button-delete-node'
                                    onClick={() => setEdges(edges.filter(e => e.id !== selectedEdge.id))}
                                >
                                    Eliminar Conexión
                                </button>
                            </section>
                        ) : null}
                    </aside>
                )}
            </main>
        </div>
    );
}

function FlowticGraficsLogo() {
    const navigate = useNavigate();
    return (
        <div
            className='logo-flowtic-grafics'
            onClick={() => navigate(-1)}
        >
            <h2 className='flowtic'>FLOWTIC</h2>
            <span className='flowtic-graphics'>Graphics</span>
        </div>
    );
}