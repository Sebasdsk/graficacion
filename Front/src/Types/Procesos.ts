import type { Rol } from "./Roles";

export interface Proceso {
    id_proceso: number;
    nombre: string;
    descripcion: string;
    subproceso: Subproceso[];
    id_rol: string;
    rol: Rol;
}

export interface Subproceso {
    id_subproceso: number;
    nombre: string;
    descripcion: string;
    id_proceso: number;
}