import "./LimiteSistemaNode.css";

// Definimos qué datos va a recibir nuestro nodo
export type LimiteSistemaNodeData = {
    label: string;
    alto: number;
    ancho: number;
};

export default function LimiteSistemaNode({ data }: { data: LimiteSistemaNodeData } ) {
    return (
        <div className="limite-sistema-node" style={{ width: `${data.ancho}px`, height: `${data.alto}px` }}>
            <h4>{data.label}</h4>
        </div>
    );
}