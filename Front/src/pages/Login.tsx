import { useState, type FormEvent } from "react";
import "./Login.css";
import { useNavigate } from "react-router";

export default function Login() {
    return (
        <main className="login-page">
            <FormLogin/>
        </main>
    );
}

function FormLogin() {
    const [email, setEmail] = useState<string>("");
    const [passw, setPassw] = useState<string>("");
    const navigate = useNavigate();

    // const APIURL = "http://localhost:3000/auth/login" // Esta url no es la del back por ahora

    // Método para iniciar sesión
    const signIn = async (e: FormEvent) => {
        e.preventDefault(); // Esto es para que no se refresque la página al presionar el botón
        if (email.trim() === '' || passw.trim() === '') {
            alert("Por favor llene todos los datos"); // Esto será cambiado
            return;
        }

        try {
            /*
            const response = await fetch(APIURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    correo: email, // Esto puede cambiar ya que el back esté listo
                    contrasena: passw // Esto también
                })
            });
            */

            // Es solo de prueba
            if (email === "admin123@gmail.com" && passw === "admin1234") {
                navigate('/dashboard');
                return;
            }

            /*
            if (!response.ok) {
                alert("Error al iniciar sesión");
                return
            }
            */

            // const data = await response.json();
            //navigate("/dashboard");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <form onSubmit={signIn} className="login-form">
            <header className="login-header">
                <h3>Iniciar Sesión</h3>
                <span>Ingresa tus credenciales</span>
            </header>

            <section className="inputs-values">
                <div className="user-input">
                    <label htmlFor="mail">Correo</label>
                    <input
                        type="text"
                        placeholder="Ingrese su correo"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="passw-input">
                    <label htmlFor="paassw">Contraseña</label>
                    <input
                        type="password" 
                        placeholder="Ingrese su contraseña"
                        value={passw}
                        onChange={(e) => setPassw(e.target.value)}
                    />
                </div>
                <button className="login-button">Ingresar</button>
            </section>
        </form>
    );
}