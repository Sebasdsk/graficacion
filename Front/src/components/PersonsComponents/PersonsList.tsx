import { Trash, Edit } from "@boxicons/react";
import "./PersonsList.css"

// Mock data
const persons = [
    {id: 1, nombre: "Sebastián", idStake: 1},
    {id: 2, nombre: "Carlos", idStake: 2},
    {id: 3, nombre: "Luis", idStake: 1},
    {id: 4, nombre: "Mario", idStake: 1},
    {id: 5, nombre: "Maria", idStake: 2},
];

interface StakeholderIdProp {
    idStake: number;
}

export default function PersonsList({ idStake }: StakeholderIdProp) {

    const personsFilter = persons.filter(p => p.idStake === idStake);

    return (
        <div className="persons-list">
            {personsFilter.map(p => (
                <Person key={p.id} id={p.id} nombre={p.nombre}/>
            ))}
        </div>
    );
}

interface PerosonInfoProp {
    id: number;
    nombre: string;
}

function Person({ id, nombre }: PerosonInfoProp) {
    return (
        <article className="person-info">
            <div className="person-detail">
                <div>
                    {id}
                </div>
                <div>
                    {nombre}
                </div>
            </div>
            <div className="buttons-actions">
                <button><Edit size="xs" /></button>
                <button><Trash size="xs" /></button>
            </div>
        </article>
    );
}