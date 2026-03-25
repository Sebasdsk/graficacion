import type { Proyecto } from "../Types/Proyectos";

export default async function consultOneProject(idProject: string, token: string): Promise<Proyecto | null> {
    const API_URL = `http://localhost:3000/api/proyectos/ver/${idProject}`;

    const response = await fetch(API_URL, {
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