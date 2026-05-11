import type { TipoTecnica } from "../../Types/Techniques";
import "./FormTechnique.css";

interface TypeTechniqueProp {
    children: React.ReactNode;
    tipoTecnica: TipoTecnica;
    tecnica: any;
}

export default function FormTechnique({ tipoTecnica, tecnica, children }: TypeTechniqueProp) {
    const ultimaActualizacion = "dd-mm-yyyy";

    return(
        <section className="form-technique">
            <header className="form-header-technique">
                <h1>{tecnica.titulo}</h1>
                <p>{tecnica.descripcion}</p>
            </header>
            <section className="principal-info-technique">
                <div className="technique-type">
                    <dt>Tipo de técnica</dt>
                    <dd>{tipoTecnica.nombre}</dd>
                </div>
                <div className="technique-status">
                    <dt>Estatus</dt>
                    <dd>{tecnica.estatus}</dd>
                </div>
                <div className="last-update-technique">
                    <dt>Última Actualización</dt>
                    <dd>{ultimaActualizacion}</dd>
                </div>
            </section>
            {children}
        </section>
    )
}