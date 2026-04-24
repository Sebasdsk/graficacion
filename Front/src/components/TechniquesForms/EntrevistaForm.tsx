import type { Stakeholder } from "../../Types/Stakeholders";
import "./EntrevistaForm.css";

const stakeholders: Stakeholder[] = [];
const roles: any[] = [];

export default function EntrevistaForm() {
    return (
        <section className="entrevista-informacion-section">
            <header className="header-entrevista-section">
                <h2>Información de la Entrevista</h2>
            </header>
            <div className="entrevistado-div">
                <div className="rol-container">
                    <label htmlFor="roles-select">Rol</label>
                    <select name="roles" id="roles-select">
                        {roles.length > 0 && roles.map(r => (
                            <option value="">{r.nombre}</option>
                        ))}
                        {roles.length === 0 && (
                            <option value="">--No hay Roles--</option>
                        )}
                    </select>
                </div>
                <div className="entrevistado-container">
                    <label htmlFor="">Entrevistado</label>
                    <select name="" id="">
                        {stakeholders.length > 0 && stakeholders.map(s => (
                            <option value="">{s.nombre}</option>
                        ))}
                        {stakeholders.length === 0 && (
                            <option value="">--No hay Stakeholders--</option>
                        )}
                    </select>
                </div>
            </div>
            <div className="info-entrevista-div">
                <div className="fecha-container">
                    <label htmlFor="fechaEntrevista">Fecha</label>
                    <input type="date" id="fechaEntrevista" />
                </div>
                <div className="duracion-container">
                    <label htmlFor="">Duración</label>
                    <input type="number" />
                </div>
            </div>
        </section>
    );
}