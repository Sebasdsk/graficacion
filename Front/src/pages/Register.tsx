import { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router";
import { Eye, EyeSlash } from "@boxicons/react";

export default function Register() {
    return (
        <main className="register-page">
            <FormRegister />
            <BannerRegister />
        </main>
    );
}

function FormRegister() {
    // Estados para majear los inputs de la info
    const [nombre, setNombre] = useState<string>("");
    const [apellidoPaterno, setApellidoPaterno] = useState<string>("");
    const [apellidoMaterno, setApellidoMaterno] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [passw, setPassw] = useState<string>("");

    const [toggleShowPassw, setToggleShowPassw] = useState<boolean>(false);

    const [emailError, setEmailError] = useState<string>("");
    const [passwError, setPasswError] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const navigate = useNavigate();
    const APIURL = import.meta.env.VITE_API_URL;

    // Función para validar si el formato del correo es válido
    const validateEmail = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    // Función para validar la contraseña
    const validatePassword = () => {
        if (!passw) return "";
        if (passw.length < 8) return "La contraseña debe tener al menos 8 caracteres";
        if (!/[A-Z]/.test(passw)) return "La contraseña debe contener al menos una mayúscula";
        if (!/[0-9]/.test(passw)) return "La contraseña debe contener al menos un número";
        return "";
    };

    const signUp = async () => {
        if (!nombre.trim() || !apellidoPaterno.trim() || !apellidoMaterno.trim() || !email.trim() || !passw.trim()) {
            setErrorMessage("Por favor llene todos los datos");
            return;
        } else {
            setErrorMessage("");
        }

        // verifica si la password es vállida
        const passwValidationError = validatePassword();
        if (passwValidationError) {
            setPasswError(passwValidationError);
            return;
        } else {
            setPasswError("");
        }

        // Verifica el formato del correo
        if (!validateEmail()) {
            setEmailError("Formato de correo inválido");
            return;
        } else {
            setEmailError("");
        }

        const bodyRegister = {
            nombre: nombre,
            apellido_paterno: apellidoPaterno,
            apellido_materno: apellidoMaterno,
            email: email,
            password: passw
        }

        try {
            const response = await fetch(`${APIURL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyRegister)
            });

            if (!response.ok) {
                const message = await response.json();
                if (message.errors && message.errors.length > 0) {
                    setErrorMessage(message.errors.join(", "));
                } else {
                    setErrorMessage(message.message || "Error al registrar");
                }
                return;
            }

            const data = await response.json();
            setSuccessMessage(data.Message || "Usuario creado exitosamente");
            setErrorMessage("");
            setPassw("");

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error(error);
            setErrorMessage("Hubo un error al intentar registrarse");
        }
    };

    return (
        <form action={signUp} className="register-form">
            <div className="logo-container">
                <a href="/" className="back-link"><span className="highlight-text">FLOWTIC</span></a>
            </div>
            <header className="register-header">
                <h2>Crear Cuenta</h2>
                <small>Ingrese sus datos para registrarse</small>
            </header>
            <hr className="line-divisor-header" />

            <section className="inputs-values">
                <div className="input-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        placeholder="Ingrese su nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>

                <div className="input-row">
                    <div className="input-group">
                        <label htmlFor="apellidoPaterno">Apellido Paterno</label>
                        <input
                            type="text"
                            id="apellidoPaterno"
                            placeholder="Apellido paterno"
                            value={apellidoPaterno}
                            onChange={(e) => setApellidoPaterno(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="apellidoMaterno">Apellido Materno</label>
                        <input
                            type="text"
                            id="apellidoMaterno"
                            placeholder="Apellido materno"
                            value={apellidoMaterno}
                            onChange={(e) => setApellidoMaterno(e.target.value)}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label htmlFor="email">Correo</label>
                    <input
                        type="text"
                        id="email"
                        placeholder="Ingrese su correo"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setEmailError(validateEmail() || !email ? "" : "Formato de correo inválido")}
                    />
                    {emailError && <span className="error-text">{emailError}</span>}
                </div>

                <div className="input-group">
                    <label htmlFor="password">Contraseña</label>
                    <div className="passw-input-wrapper">
                        <input
                            type={toggleShowPassw ? "text" : "password"}
                            id="password"
                            placeholder="Ingrese su contraseña"
                            value={passw}
                            onChange={(e) => {
                                setPassw(e.target.value);
                                setPasswError("");
                            }}
                            onBlur={() => setPasswError(validatePassword())}
                        />
                        <button className="btn-show-passw" type="button" onClick={() => setToggleShowPassw(!toggleShowPassw)}>
                            {toggleShowPassw ? <EyeSlash className="eye-icon" fill="#6c6c6c" /> : <Eye className="eye-icon" fill="#6c6c6c" />}
                        </button>
                    </div>
                    {passwError && <span className="error-text">{passwError}</span>}
                </div>

                <button
                    className="register-button"
                    disabled={!!emailError || !!passwError || !email || !passw || !nombre || !apellidoPaterno || !apellidoMaterno}
                >
                    Registrarse
                </button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </section>

            <div className="line-divisor-sign-up">
                <hr className="line-divisor" />
                <span>Ó</span>
                <hr className="line-divisor" />
            </div>

            <div className="create-account">
                <span>¿Ya tienes cuenta?</span>
                <a href="/login">Inicia Sesión</a>
            </div>
        </form>
    );
}

function BannerRegister() {
    const LogoFlowtic = () => {
        return (
            <div className="logo-flowtic">
                <span>FLOWTIC</span>
            </div>
        );
    }

    return (
        <div className="banner-register">
            <LogoFlowtic />
            <div className="banner-content">
                <h1>Únete y empieza a gestionar tus proyectos</h1>
                <p>Crea tu cuenta para organizar y recopilar información de forma eficiente</p>
            </div>
        </div>
    );
}
