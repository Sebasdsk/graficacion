import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router";
import { Eye, EyeSlash } from "@boxicons/react";

export default function Login() {
    return (
        <main className="login-page">
            <FormLogin />
            <BannerLogin />
        </main>
    );
}

function FormLogin() {
    const [email, setEmail] = useState<string>("");
    const [passw, setPassw] = useState<string>("");
    const [toggleShowPassw, setToggleShowPassw] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const navigate = useNavigate();

    const APIURL = "http://localhost:3000/api/auth/login" // Esta url no es la del back por ahora

    // Método para iniciar sesión
    const signIn = async () => {
        if (email.trim() === '' || passw.trim() === '') {
            setErrorMessage("Por favor llene todos los datos"); // Esto será cambiado
            return;
        } else {
            setErrorMessage(""); // Limpia el mensaje de error antes de hacer la petición
        }

        try {
            const response = await fetch(APIURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: passw
                })
            });

            if (!response.ok) {
                const message = await response.json();
                setErrorMessage(message.message);
                return;
            }

            const data = await response.json();
            localStorage.setItem("token", data.token); // Guarda el token en localstorage
            setErrorMessage("");
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
        }
    }

    // Función que valida si el formato del correo es válido
    const validateEmail = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    return (
        <form action={signIn} className="login-form">
            <div className="logo-container">
                <a href="/" className="back-link"><span className="highlight-text">FLOWTIC</span></a>
            </div>
            <header className="login-header">
                <h2>Iniciar Sesión</h2>
                <small>Ingrese sus credenciales para continuar</small>
            </header>
            <hr className="line-divisor-header" />

            <section className="inputs-values">
                <div className="email-input">
                    <label htmlFor="email">Correo</label>
                    <input
                        type="text"
                        id="email"
                        placeholder="Ingrese su correo"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setEmailError(validateEmail() || !email ? "" : "Formato de correo inválido")}
                    />
                    {emailError && (
                        <span className="email-error-message">{emailError}</span>
                    )}
                </div>
                <div className="passw-input">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type={toggleShowPassw ? "text" : "password"}
                        id="password"
                        placeholder="Ingrese su contraseña"
                        value={passw}
                        onChange={(e) => setPassw(e.target.value)}
                    />
                    <button className="btn-show-passw" type="button" onClick={() => setToggleShowPassw(!toggleShowPassw)}>
                        {toggleShowPassw ? <EyeSlash className="eye-icon" fill="#6c6c6c" /> : <Eye className="eye-icon" fill="#6c6c6c" />}
                    </button>
                    <a href="#">¿Olvidó su contraseña?</a>
                </div>
                <button
                    className="login-button"
                    disabled={!!emailError || !email || !passw}
                >
                    Iniciar Sesión
                </button>
                {errorMessage && (
                    <p className="error-message">{errorMessage}</p>
                )}
            </section>

            <div className="line-divisor-sign-up">
                <hr className="line-divisor" />
                <span>Ó</span>
                <hr className="line-divisor" />
            </div>

            <div className="create-account">
                <span>¿No tienes cuenta?</span>
                <a href="/register">Cree Cuenta</a>
            </div>
        </form>
    );
}

function BannerLogin() {
    const LogoFlowtic = () => {
        return (
            <div className="logo-flowtic">
                <span>FLOWTIC</span>
            </div>
        );
    }

    return (
        <div className="banner-login">
            <LogoFlowtic />
            <div className="banner-content">
                <h1>Gestiona y recopila información para tus proyectos</h1>
                <p>Inicia sesión para continuar con la elaboración de tus proyectos</p>
            </div>
        </div>
    );
}