import "./Login.css";

export default function Login() {
    return (
        <main className="login-page">
            <FormLogin/>
        </main>
    );
}

function FormLogin() {
    return (
        <form action="sumbit" className="login-form">
            <header className="login-header">
                <h3>Iniciar Sesión</h3>
                <span>Ingresa tus credenciales</span>
            </header>

            <section className="inputs-values">
                <div className="user-input">
                    <label htmlFor="mail">Usuario</label>
                    <input type="text" placeholder="Ingrese su usuario"/>
                </div>
                <div className="passw-input">
                    <label htmlFor="paassw">Contraseña</label>
                    <input type="password"  placeholder="Ingrese su contraseña"/>
                </div>
                <button className="login-button">Ingresar</button>
            </section>
        </form>
    );
}