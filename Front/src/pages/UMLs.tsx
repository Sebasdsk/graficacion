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
import { Plus } from '@boxicons/react';
import { useNavigate } from 'react-router';

const nodeTypes = {
    actor: ActorNode, 
};

const initialNodes: Node[] = [
    {    
        id: 'actor-1', 
        type: 'actor', // <-- Aquí le decimos que use el nodo personalizado que registramos
        position: { x: 100, y: 100 }, 
        data: { label: 'Usuario Sistema' } // Le pasamos el label que espera ActorNode
    },
];

// const initialNodes: Node[] = [
//     { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' }, style: { background: '#fff' } },
//     { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' }, style: { background: '#fff' } },
// ];
// const initialEdges: Edge[] = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

const initialEdges: Edge[] = [];

export default function UMLs() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    
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
            style: { background: '#fff' }
        };
        setNodes([...nodes, newNode]); // Agrega el nodo al array
    };
    
    return (
        <div className='diagram-container-page'>
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
                <header className='header-diagram-map'>
                    <FlowticGraficsLogo/>
                    <button 
                        onClick={addNode}
                        className='button-add-node'
                    >
                        <Plus />
                        Agregar Nodo
                    </button>
                </header>
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
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