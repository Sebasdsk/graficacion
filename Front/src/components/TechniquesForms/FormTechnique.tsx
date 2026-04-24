import type { TipoTecnica } from "../../Types/Techniques";
import "./FormTechnique.css";

interface TypeTechniqueProp {
    children: React.ReactNode
    tipoTecnica: TipoTecnica;
}

export default function FormTechnique({ tipoTecnica, children }: TypeTechniqueProp) {
    const estatusTecnica = "estatus";
    const ultimaActualizacion = "dd-mm-yyyy";

    return(
        <form action="" className="form-technique">
            <header className="form-header-technique">
                <h1>"Título de la Técnica"</h1>
                <p>"Descripción de la Técnica"</p>
            </header>
            <section className="principal-info-technique">
                <div className="technique-type">
                    <dt>Tipo de técnica</dt>
                    <dd>{tipoTecnica.nombre}</dd>
                </div>
                <div className="technique-status">
                    <dt>Estatus</dt>
                    <dd>{estatusTecnica}</dd>
                </div>
                <div className="last-update-technique">
                    <dt>Última Actualización</dt>
                    <dd>{ultimaActualizacion}</dd>
                </div>
            </section>
            {children}
        </form>
    )
}