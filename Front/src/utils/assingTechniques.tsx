import { BookOpen, FileDetail, Message, MessageCircleQuestionMark, Eye, LightBulb, TrendingUp } from "@boxicons/react/index";
import type { JSX } from "react";
import type { TipoTecnica } from "../Types/Techniques";

// Diccionario para asignar los iconos a los títulos de las técnicas en la UI
const iconDictionary: Record<TipoTecnica["nombre"], JSX.Element> = {
    "Entrevista": <Message />,
    "Cuestionario": <MessageCircleQuestionMark />,
    "Historias de Usuario": <BookOpen />,
    "Observación": <Eye />,
    "Documentos": <FileDetail />,
    "Focus Group": <LightBulb />,
    "Seguimiento Transaccional": <TrendingUp />
};

// Función que devuelve el icono correspondiente a un tipo de técnica
export const asignarIconoTecnica = (tipoEntrevista: string) => {
    return iconDictionary[tipoEntrevista] || null;
}