import { ReactFlow, Background, Handle, Position} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import "./FlowticDiagramsCard.css";
import { useNavigate } from 'react-router';

const nodeTypes = {
    classNode: ClassNode,
};

const nodes = [
    {
        id: '1',
        type: 'classNode',
        position: { x: 10, y: -20 },
        data: {
            label: 'Usuario',
            attributes: [
                '+ id: number',
                '+ nombre: string',
                '+ email: string',
            ],
        },
    },
    {
        id: '2',
        type: 'classNode',
        position: { x: 120, y: 40 },
        data: {
            label: 'Proyecto',
            attributes: [
                '+ id: number',
                '+ nombre: string',
            ],
        },
    },
    {
        id: '3',
        type: 'classNode',
        position: { x: 20, y: 120 },
        data: {
            label: 'Proceso',
            attributes: [
                '+ id: number',
                '+ nombre: string',
            ],
        },
    },
    {
        id: '4',
        type: 'classNode',
        position: { x: 330, y: -10 },
        data: {
            label: 'Subproceso',
            attributes: [
                '+ id: number',
                '+ orden: number',
            ],
        },
    },
    {
        id: '5',
        type: 'classNode',
        position: { x: 300, y: 100 },
        data: {
            label: 'Técnica',
            attributes: [
                '+ id: number',
                '+ tipo: string',
            ],
        },
    },
];

const edges = [
    // Usuario → Proyecto (puedes dejarlo normal o hacerlo más preciso)
    {
        id: 'e1-2',
        type: 'step',
        source: '1',
        sourceHandle: 'right',
        target: '2',
        targetHandle: 'top',
        animated: true
    },

    // Proyecto → Proceso (abajo → arriba)
    {
        id: 'e2-3',
        type: 'step',
        source: '2',
        sourceHandle: 'bottom',
        target: '3',
        targetHandle: 'top',
        animated: true
    },

    // Proceso → Subproceso (derecha → izquierda)
    {
        id: 'e3-4',
        type: 'step',
        source: '3',
        sourceHandle: 'right',
        target: '4',
        targetHandle: 'left',
        animated: true
    },

    // Subproceso → Técnica (abajo → arriba)
    {
        id: 'e4-5',
        type: 'step',
        source: '4',
        sourceHandle: 'bottom',
        target: '5',
        targetHandle: 'top',
        animated: true
    },
];

export default function FlowticCard() {
    const navigate = useNavigate();

    return (
        <article className="flowtic-graphics-card">
            <div className="flowtic-graphics-card-banner">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    fitView
                    proOptions={{ hideAttribution: true }}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                    zoomOnScroll={false}
                    panOnScroll={false}
                    zoomOnPinch={false}
                >
                    <Background
                        gap={16}
                        size={1}
                    />
                </ReactFlow>
            </div>
            <div className='flowtic-graphics-content'>
                <h3>
                    Flowtic 
                    <span className='flowtic-graphics'>Graphics</span>
                </h3>
                <small>Modela la estructura de tu sistema</small>
                <button
                    className="open-flowtic-graphics"
                    onClick={() => navigate("/diagrams-uml")}
                >
                    Abrir Editor
                </button>
            </div>
        </article>
    );
}


function ClassNode({ data }: any) {
    return (
        <div className="class-node">
            {/* entrada */}
            <Handle type="target" position={Position.Top} id="top" />
            <Handle type="target" position={Position.Left} id="left" />
            <div className="class-node-header">
                {data.label}
            </div>
            <div className="class-node-body">
                {data.attributes?.map((attr: string, i: number) => (
                <div key={i} className="class-attr">
                    {attr}
                </div>
                ))}
            </div>
            {/* salida */}
            <Handle type="source" position={Position.Right} id="right" />
            <Handle type="source" position={Position.Bottom} id="bottom" />
        </div>
    );
}