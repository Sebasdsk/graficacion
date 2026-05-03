export default async function consultAllProjects(token: string | null) {
    const API_URL = import.meta.env.VITE_API_URL;

    const response = await fetch(`${API_URL}/proyectos/lista`, {
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