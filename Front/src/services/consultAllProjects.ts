export default async function consultAllProjects(token: string | null) {
    const API_URL = "http://localhost:3000/api/proyectos/lista";

    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`, // Envía el token
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error("Error al consultar los proyectos.");
    }

    const data = await response.json();
    return data;
}