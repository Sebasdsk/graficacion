import { Handle, Position } from '@xyflow/react';

// Definimos qué datos va a recibir nuestro nodo
export type ActorNodeData = {
    label: string;
};

// React Flow pasa varias props a los nodos personalizados, 'data' es donde va nuestra info
export default function ActorNode({ data }: { data: ActorNodeData }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '50px' }}>
        
        {/* Handle superior */}
        <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
        <Handle type="source" position={Position.Top} style={{ background: '#555' }} id="a" />

        {/* Aquí dibujamos el "monito" de palitos */}
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid black' }}></div> {/* Cabeza */}
        <div style={{ width: '2px', height: '25px', backgroundColor: 'black', margin: '2px 0' }}></div> {/* Torso */}
        <div style={{ width: '30px', height: '2px', backgroundColor: 'black', marginTop: '-20px', marginBottom: '18px' }}></div> {/* Brazos */}
        {/* Piernas del modelo del usuario */}
        <div style={{ display: 'flex', width: '20px', justifyContent: 'space-between', marginTop: '-2px' }}>
            <div style={{ width: '2px', height: '20px', backgroundColor: 'black', transform: 'rotate(20deg)' }}></div>
            <div style={{ width: '2px', height: '20px', backgroundColor: 'black', transform: 'rotate(-20deg)' }}></div>
        </div>

        {/* La etiqueta del actor (ej: "Usuario", "Admin") */}
        <div style={{ marginTop: '5px', fontSize: '12px', fontWeight: 'bold' }}>{data.label}</div>

        {/* Handle inferior */}
        <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} id="b" />
        <Handle type="target" position={Position.Bottom} style={{ background: '#555' }} />

        </div>
    );
}