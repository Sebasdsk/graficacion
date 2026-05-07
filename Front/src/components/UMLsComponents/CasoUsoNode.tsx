import { Handle, Position } from '@xyflow/react';
import "./CasoUsoNode.css";

// Definimos qué datos va a recibir nuestro nodo
export type UseCaseNodeData = {
    label: string;
};

export default function CasoUsoNode({ data }: { data: UseCaseNodeData }) {
    return (
        <div className="caso-uso-container">
            {/* Handle superior */}
            <Handle type="target" position={Position.Top} className="caso-uso-handle" />
            <Handle type="source" position={Position.Top} className="caso-uso-handle" id="a" />

            {/* Handle derecho */}
            <Handle type="target" position={Position.Right} className="caso-uso-handle" />
            <Handle type="source" position={Position.Right} className="caso-uso-handle" id="b" />

            {/* La etiqueta del caso de uso */}
            <div className="caso-uso-label">{data.label}</div>

            {/* Handle izquierdo */}
            <Handle type="target" position={Position.Left} className="caso-uso-handle" />
            <Handle type="source" position={Position.Left} className="caso-uso-handle" id="c" />

            {/* Handle inferior */}
            <Handle type="target" position={Position.Bottom} className="caso-uso-handle" />
            <Handle type="source" position={Position.Bottom} className="caso-uso-handle" id="d" />
        </div>
    );
}