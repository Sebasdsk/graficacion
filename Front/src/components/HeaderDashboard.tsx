import { User } from "@boxicons/react";
import "./HeaderDashboard.css"

export default function HeaderDashboard() {
    const nombre = "Usuario"
    const correo = "usuario_prueba@mail.com";

    const letterName = nombre.split("");

    return (
        <header className="header">
            <section className="info-user">
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