export type estatusTecnica = "Completada" | "En Progreso" | "Planificada" | "Eliminada";

export interface TipoTecnica {
    id: number;
    nombre: string;
}

export interface Tecnica {
    id: number;
    nombre: string;
    descripcion: string;
    tipo: TipoTecnica;
    estatus: estatusTecnica
}
