import { useState, useCallback } from 'react';
import {
    ReactFlow,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    Background,
    MiniMap,
    Controls,
    type Node,
    type Edge,
    type OnConnect,
    type OnNodesChange,
    type OnEdgesChange
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ActorNode from '../components/UMLsComponents/ActorNode';
import "./UMLs.css";
import { Save } from '@boxicons/react';
import { useNavigate } from 'react-router';
import CasoUsoNode from '../components/UMLsComponents/CasoUsoNode';
import LimiteSistemaNode from '../components/UMLsComponents/LimiteSistemaNode';

const nodeTypes = {
    actor: ActorNode, 
    useCase: CasoUsoNode,
    systemBoundary: LimiteSistemaNode
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

type DiagramType = 'use-case' | 'class' | 'activity' | 'sequence';

export default function UMLs() {
    const [selectTypeDiagram, setSelectTypeDiagram] = useState<DiagramType>('use-case');
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    // Encontrar el nodo seleccionado (React Flow maneja automáticamente la propiedad 'selected')
    const selectedNode = nodes.find(node => node.selected);
    
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

    return (
        <div className='diagram-container-page'>
            <header className='header-diagram-map'>
                <FlowticGraficsLogo/>
                <button
                    className='button-save-diagram'
                > 
                    <Save size='sm'/> Guardar
                </button>
            </header>
            
            <main className='principal-container-page'>
                <aside className='sidebar-uml-editor'>
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

                    <section className='project-info'>
                        <h4>Información del Proyecto</h4>
                        <dd><small>Roles</small></dd>
                        <dt>{0}</dt>
                        <dd><small>Procesos</small></dd>
                        <dt>{0}</dt>
                        <dd><small>Subprocesos</small></dd>
                        <dt>{0}</dt>
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
                    className='Reactflow-map'
                >
                    <Background />
                    <Controls />
                    <MiniMap />
                </ReactFlow>

                {/* Formulario dinámico que muestra cuando hay un nodo seleccionado */}
                {selectedNode && (
                    <aside className='sidebar-properties-right'>
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

                            <button 
                                className='button-delete-node'
                                onClick={() => setNodes(nodes.filter(n => n.id !== selectedNode.id))}
                            >
                                Eliminar Elemento
                            </button>
                        </section>
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