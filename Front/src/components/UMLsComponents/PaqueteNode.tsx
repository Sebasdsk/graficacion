import { Handle, Position } from '@xyflow/react';
import "./PaqueteNode.css";

export type PaqueteNodeData = {
    label: string;
    items: string[];
};

export default function PaqueteNode({ data }: { data: PaqueteNodeData }) {
    return (
        <div className='paquete-node-container'>
            <Handle type="target" position={Position.Top} className="class-node-handle" />
            <Handle type="source" position={Position.Top} className="class-node-handle" id="top-src" />

            <Handle type="target" position={Position.Right} className="class-node-handle" />
            <Handle type="source" position={Position.Right} className="class-node-handle" id="right-src" />

            <div className='paquete-header'>
                <h3>{data.label}</h3>
            </div>

            <div className='paquete-items-container'>
                {data.items && data.items.length > 0 ? (
                    data.items.map((item, index) => (
                        <div key={`item-${index}`}>{item}</div>
                    ))
                ) : (
                    <div className='no-items-paquete-node'>Sin items</div>
                )}
            </div>

            <Handle type="target" position={Position.Left} className="class-node-handle" />
            <Handle type="source" position={Position.Left} className="class-node-handle" id="left-src" />

            <Handle type="target" position={Position.Bottom} className="class-node-handle" />
            <Handle type="source" position={Position.Bottom} className="class-node-handle" id="bottom-src" />
        </div>
    );
}
