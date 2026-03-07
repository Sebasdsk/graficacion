import type { Proyecto } from "../Types/Proyectos";

// Esta función hace un conteo para mostrar el número de proyecto de cada estatus
export function counterStatusProjects(proyectos: Proyecto[]) {
    const proyectosStatus = proyectos.reduce<Record<string, number>>((acc, proyecto) => {
        const key = proyecto.estatus; // Crea la clave para acumular los valores

        if (!acc[key]) {
            acc[key] = 0; // Si no existe la clave en el acc, inicializa el contador
        }

        acc[key]++; // Incrementa el contador de esa clave en el acc

        return acc;
    }, {})

    return proyectosStatus;
}