import { Handle, Position } from '@xyflow/react';
import "./ActorNode.css";

// Definimos qué datos va a recibir nuestro nodo
export type ActorNodeData = {
    label: string;
};

// React Flow pasa varias props a los nodos personalizados, 'data' es donde va nuestra info
export default function ActorNode({ data }: { data: ActorNodeData }) {
    return (
        <div className="actor-node">
            {/* Handle superior */}
            <Handle type="target" position={Position.Top} className="actor-node-handle" />
            <Handle type="source" position={Position.Top} className="actor-node-handle" id="a" />

            {/* Handle derecho */}
            <Handle type="target" position={Position.Right} className="actor-node-handle" />
            <Handle type="source" position={Position.Right} className="actor-node-handle" id="b" />

            {/* Aquí dibujamos el "monito" de palitos */}
            <div className="actor-node-head"></div> {/* Cabeza */}
            <div className="actor-node-torso"></div> {/* Torso */}
            <div className="actor-node-arms"></div> {/* Brazos */}

            {/* Piernas del modelo del usuario */}
            <div className="actor-node-legs">
                <div className="actor-node-leg actor-node-leg-left"></div>
                <div className="actor-node-leg actor-node-leg-right"></div>
            </div>

            {/* La etiqueta del actor (ej: "Usuario", "Admin") */}
            <div className="actor-node-label">{data.label}</div>

            {/* Handle izquierdo */}
            <Handle type="target" position={Position.Left} className="actor-node-handle" />
            <Handle type="source" position={Position.Left} className="actor-node-handle" id="c" />

            {/* Handle inferior */}
            <Handle type="source" position={Position.Bottom} className="actor-node-handle" id="d" />
            <Handle type="target" position={Position.Bottom} className="actor-node-handle" />
        </div>
    );
}