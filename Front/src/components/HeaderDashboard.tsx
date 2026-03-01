import { User, DockLeft } from "@boxicons/react";
import "./HeaderDashboard.css"
import type { SetStateAction } from "react";

interface CollapsedProp {
    collapsed: boolean;
    setCollapsed: React.Dispatch<SetStateAction<boolean>>;
    mobileOpen: boolean;
    setMobileOpen: React.Dispatch<SetStateAction<boolean>>;
}

export default function HeaderDashboard({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: CollapsedProp ) {
    const nombre = "Usuario"
    const correo = "usuario_prueba@mail.com";

    const letterName = nombre.split("");

    return (
        <header className="header">
            <section className="info-user">
                <div className="toggle-button">
                    <button className="button-desktop" onClick={() => setCollapsed(!collapsed)}>
                        <DockLeft />
                    </button>
                    <button className="button-mobile" onClick={() => setMobileOpen(!mobileOpen)}>
                        <DockLeft />
                    </button>
                </div>
                <div className="avatar">
                    <p className="letter-name">{letterName[0]}</p>
                </div>
                <div className="info">
                    <p>¡Hola! {nombre}</p>
                    <p>{correo}</p>
                </div>
            </section>
            <section className="options-buttons">
                <button className="button-one"><User pack="filled" /> Mi Perfil</button>
            </section>
        </header>
    );
}