import type { Rol } from "./Roles";
import type { Proceso } from "./Procesos";

export interface Proyecto {
    id_proyecto: number;
    nombre: string;
    descripcion: string;
    estatus: string;
    fecha_inicio: string;
    rol: Rol[];
    proceso: Proceso[]
}