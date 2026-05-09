import { Handle, Position } from '@xyflow/react';
import './LifelineNode.css';

export type LifelineNodeData = {
    height?: number;
};

export default function LifelineNode({ data }: { data: LifelineNodeData }) {
    const height = data.height || 200;
    
    return (
        <div className="lifeline-node" style={{ height: `${height}px` }}>
            <Handle type="target" position={Position.Top} className="lifeline-node-handle" style={{ top: 0 }} />
            <Handle type="source" position={Position.Top} className="lifeline-node-handle" id="top" style={{ top: 0 }} />

            {/* Múltiples handles en el lado izquierdo */}
            <Handle type="target" position={Position.Left} className="lifeline-node-handle" id="left-top" style={{ top: '25%' }} />
            <Handle type="source" position={Position.Left} className="lifeline-node-handle" id="left-top-source" style={{ top: '25%' }} />
            
            <Handle type="target" position={Position.Left} className="lifeline-node-handle" id="left-middle" style={{ top: '50%' }} />
            <Handle type="source" position={Position.Left} className="lifeline-node-handle" id="left-middle-source" style={{ top: '50%' }} />
            
            <Handle type="target" position={Position.Left} className="lifeline-node-handle" id="left-bottom" style={{ top: '75%' }} />
            <Handle type="source" position={Position.Left} className="lifeline-node-handle" id="left-bottom-source" style={{ top: '75%' }} />
            
            <div className="lifeline-dashed-line"></div>

            <div className="lifeline-activation-box"></div>

            {/* Múltiples handles en el lado derecho */}
            <Handle type="target" position={Position.Right} className="lifeline-node-handle" id="right-top" style={{ top: '25%' }} />
            <Handle type="source" position={Position.Right} className="lifeline-node-handle" id="right-top-source" style={{ top: '25%' }} />
            
            <Handle type="target" position={Position.Right} className="lifeline-node-handle" id="right-middle" style={{ top: '50%' }} />
            <Handle type="source" position={Position.Right} className="lifeline-node-handle" id="right-middle-source" style={{ top: '50%' }} />
            
            <Handle type="target" position={Position.Right} className="lifeline-node-handle" id="right-bottom" style={{ top: '75%' }} />
            <Handle type="source" position={Position.Right} className="lifeline-node-handle" id="right-bottom-source" style={{ top: '75%' }} />

            <Handle type="target" position={Position.Bottom} className="lifeline-node-handle" style={{ bottom: 0, top: 'auto' }} />
            <Handle type="source" position={Position.Bottom} className="lifeline-node-handle" id="bottom" style={{ bottom: 0, top: 'auto' }} />
        </div>
    );
}
