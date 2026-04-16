export default function EntrevistaConfig() {
    const tipoTecnica = "";
    const estatus = "";
    const ultimaModificacion = "";

    return (
        <section className="entrevista-config-page">
            <header>
                <div>
                    <h1>Configuración de Entrevista</h1>
                    <p>Ajusta los parámetros para la técnica de entrevista.</p>
                </div>
                <span>{estatus}</span>
            </header>
            <form className="entrevista-config-form">
                <section>
                    <dl>
                        <div>
                            <dt>Tipo de Técnica:</dt>
                            <dd>{tipoTecnica}</dd>
                        </div>
                        <div>
                            <label htmlFor="statusEntrevista">Estado de la Entrevista:</label>
                            <select
                                name="Estatus de Entrevista"
                                id="statusEntrevista" value={estatus}
                            >
                                <option value="pendiente">Pendiente</option>
                                <option value="en_proceso">En Proceso</option>
                                <option value="finalizada">Finalizada</option>
                            </select>
                        </div>
                        <div>
                            <dt>Última Modificación:</dt>
                            <dd>{ultimaModificacion}</dd>
                        </div>
                    </dl>
                </section>
                <section>
                    <div className="form-group">
                        <label htmlFor="entrevistador">Entrevistador:</label>
                        <input type="text" id="entrevistador" name="entrevistador" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fecha">Fecha:</label>
                        <input type="date" id="fecha" name="fecha" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="duracion">Duración:</label>
                        <input type="text" id="duracion" name="duracion" />
                    </div>
                        <button type="submit">Guardar Configuración</button>
                </section>
            </form>
        </section>
    );
}
