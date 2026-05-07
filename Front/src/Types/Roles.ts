import type { Stakeholder } from "./Stakeholders";

export interface Rol {
    id_rol: number;
    nombre: string;
    descripcion: string;
    estatus: string;
    stakeholder: Stakeholder[];
}