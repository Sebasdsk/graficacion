export interface Proceso {
    id_proceso: number;
    nombre: string;
    descripcion: string;
    subproceso: Subproceso[];
}

export interface Subproceso {
    id_subproceso: number;
    nombre: string;
    descripcion: string;
    id_proceso: number;
}