import { Handle, Position } from '@xyflow/react';
import './ObjectNode.css';

export type ObjectNodeData = {
    label: string;
};

export default function ObjectNode({ data }: { data: ObjectNodeData }) {
    return (
        <div className="object-node">
            <Handle type="target" position={Position.Top} className="object-node-handle" />
            <Handle type="source" position={Position.Top} className="object-node-handle" id="top-source" />
            
            <div className="object-node-label">
                <u>{data.label}</u>
            </div>

            <Handle type="target" position={Position.Bottom} className="object-node-handle" />
            <Handle type="source" position={Position.Bottom} className="object-node-handle" id="bottom-source" />
            
            <Handle type="target" position={Position.Left} className="object-node-handle" />
            <Handle type="source" position={Position.Right} className="object-node-handle" id="right-source" />
        </div>
    );
}
