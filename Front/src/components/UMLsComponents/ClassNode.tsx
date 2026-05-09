import { Handle, Position } from '@xyflow/react';
import "./ClassNode.css";

export type ClassNodeData = {
    label: string;
    attributes: string[];
    methods: string[];
};

export default function ClassNode({ data }: { data: ClassNodeData }) {
    return (
        <div className="class-node-container">
            <Handle type="target" position={Position.Top} className="class-node-handle" />
            <Handle type="source" position={Position.Top} className="class-node-handle" id="top-src" />

            <Handle type="target" position={Position.Right} className="class-node-handle" />
            <Handle type="source" position={Position.Right} className="class-node-handle" id="right-src" />

            <div className="class-node-header">
                <strong>{data.label}</strong>
            </div>

            <div className="class-node-body">
                <div className="class-node-section">
                    {data.attributes && data.attributes.length > 0 ? (
                        data.attributes.map((attr, index) => (
                            <div key={`attr-${index}`} className="class-node-item">{attr}</div>
                        ))
                    ) : (
                        <div className="class-node-empty">Sin atributos</div>
                    )}
                </div>
                <div className="class-node-section">
                    {data.methods && data.methods.length > 0 ? (
                        data.methods.map((method, index) => (
                            <div key={`method-${index}`} className="class-node-item">{method}</div>
                        ))
                    ) : (
                        <div className="class-node-empty">Sin métodos</div>
                    )}
                </div>
            </div>

            <Handle type="target" position={Position.Left} className="class-node-handle" />
            <Handle type="source" position={Position.Left} className="class-node-handle" id="left-src" />

            <Handle type="target" position={Position.Bottom} className="class-node-handle" />
            <Handle type="source" position={Position.Bottom} className="class-node-handle" id="bottom-src" />
        </div>
    );
}
