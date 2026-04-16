import type { Tecnica } from "../Types/Techniques";

// Función que separa las técnicas por el tipo, para mostrar en la interfaz de el dashboard de Técnicas
export function filterTechniques(tecnicas: Tecnica[]) {
    return tecnicas.reduce<Record<string, Tecnica[]>>((acc, tecnica) => {
        const key = tecnica.tipo.nombre;

        if (!acc[key]) {
            acc[key] = []; // Si no existe la clave en el acc, inicializa el arreglo
        }

        acc[key].push(tecnica); // Agrega la técnica al arreglo correspondiente

        return acc;
    }, {});
}
