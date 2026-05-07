import type { Proyecto } from "../Types/Proyectos";

export default async function consultOneProject(idProject: string, token: string): Promise<Proyecto | null> {
    const API_URL = import.meta.env.VITE_API_URL;

    const response = await fetch(`${API_URL}/proyectos/ver/${idProject}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`, // Envía el token
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error("Error al consultar el proyecto.");
    }

    const data: Proyecto = await response.json();
    return data;
}