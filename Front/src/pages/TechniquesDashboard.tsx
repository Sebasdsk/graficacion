import { useNavigate, useParams } from "react-router";
import "./TechniquesDashboard.css";
import { ArrowLeftStroke, Plus } from "@boxicons/react/index";
import { useEffect, useState } from "react";

export default function TechniquesDashboard() {
    const params = useParams();

    const [subprocess, setSubprocess] = useState({
        nombre: "",
        descripcion: ""
    });

    const getSubproceso = async () => {
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${API_URL}/procesos/subproceso/${params.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error("Error al obtener el subproceso");
            }

            const data = await response.json();
            setSubprocess({
                nombre: data.nombre,
                descripcion: data.descripcion
            });
        } catch (error) {
            console.error("Error fetching subproceso:", error);
        }
    };

    useEffect(() => {
        getSubproceso();
    }, []);

    return (
        <main className="techniques-dashboard-page">
            <TechniquesSidebar
                subprocessName={subprocess.nombre}
                subprocessDescription={subprocess.descripcion}
            />
            <header className="techniques-header">
                <div className="header-content">
                    <h1>Técnicas de Recolección</h1>
                    <p>Gestiona todas las técnicas para recolectar requerimientos del subproceso {subprocess.nombre}</p>
                </div>
                <button className="add-technique-button">
                    <Plus size="sm"/>
                    Agregar Técnica
                </button>
            </header>
            <section className="techniques-content">
                {/* Aquí agregar el contenido principal */}
                <div>
                    
                </div>
            </section>
        </main>
    );
}

interface SubprocessSidebarProps {
    subprocessName: string;
    subprocessDescription: string;
}

function TechniquesSidebar({ subprocessName, subprocessDescription }: SubprocessSidebarProps) {
    const navigate = useNavigate();

    return (
        <aside className="techniques-sidebar">
            <header className="header-techniques-sidebar">
                <button
                    onClick={() => navigate(-1)}
                    className="back-button"
                >
                    <ArrowLeftStroke />
                    Volver al Proyecto
                </button>
                <h2>{subprocessName}</h2>
                <small>{subprocessDescription}</small>
            </header>
        </aside>
    );
}