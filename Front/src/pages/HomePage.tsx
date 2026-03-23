import { useNavigate } from "react-router";
import "./HomePage.css"
import { HomeAlt2 } from "@boxicons/react";

export default function HomePage() {
    return (
        <main className="main-home">
            <HeaderHomePage />
            <section className="section-home">
                <h1>Bienvenido a <span className="highlight">FLOWTIC</span> Gestor de Proyectos</h1>
                <p>Tu plataforma para gestionar proyectos de manera eficiente.</p>
                <button className="button-start">Comenzar</button>
            </section>
            <section className="image-section" id="product">
                <div className="image-container">
                    <img src="./public/FLOWTIC_Dashboard_Image.png" alt="Descripción de la imagen" />
                </div>
            </section>
            <div className="backdrop">
                <article className="features" id="features">
                    <div className="text-wrapper">
                        <h2>Configura tus Proyectos y Recopila Información</h2>
                        <small>Recopila datos valiosos y prepara la información para la toma de decisiones.</small>
                    </div>
                    <div className="image-wrapper">
                        <img src="./public/FLOWTIC_Config_Project_Image.png" alt="Descripción de la imagen" />
                    </div>
                </article>
                <article className="features">
                    <div className="text-wrapper">
                        <h2>Gestiona Procesos y Subprocesos de tu Proyecto</h2>
                        <small>Describe cómo gestionar los diferentes procesos y subprocesos de tu proyecto de manera eficiente.</small>
                    </div>
                    <div className="image-wrapper">
                        <img src="./public/FLOWTIC_Config_Process_Image.png" alt="Descripción de la imagen" />
                    </div>
                </article>
            </div>
            <FooterHomePage />
        </main>
    );
}

function HeaderHomePage() {
    const navigate = useNavigate();

    return (
        <header className="header-home">
            <span className="logo">FLOWTIC</span>
            <nav className="nav-home">
                <ul>
                    <li><a href="/"><HomeAlt2 size="sm"/>  Inicio</a></li>
                    <li><a href="#product">Producto</a></li>
                    <li><a href="#features">Características</a></li>
                    <li><a href="#about">Acerca De</a></li>
                </ul>
            </nav>
            <button className="button-login" onClick={() => navigate("/login")}>Login</button>
        </header>
    );
}

function FooterHomePage() {
    return (
        <footer className="footer-home">
            <p>&copy; 2026 FLOWTIC. Todos los derechos reservados.</p>
        </footer>
    );
}
