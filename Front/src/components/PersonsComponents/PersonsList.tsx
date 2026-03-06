import { Trash, Edit, User, Envelope } from "@boxicons/react";
import "./PersonsList.css"

// Mock data
const persons = [
    {id: 1, nombre: "Sebastián", email: "sebas@email.com", idStake: 1},
    {id: 2, nombre: "Carlos", email: "carlos@email.com", idStake: 2},
    {id: 3, nombre: "Luis", email: "luis@email.com", idStake: 1},
    {id: 4, nombre: "Mario", email: "mario@email.com", idStake: 1},
    {id: 5, nombre: "Maria", email: "maria@email.com", idStake: 2},
];

interface StakeholderIdProp {
    idStake: number;
}

export default function PersonsList({ idStake }: StakeholderIdProp) {

    const personsFilter = persons.filter(p => p.idStake === idStake);

    return (
        <div className="persons-list">
            {personsFilter.map(p => (
                <Person key={p.id} id={p.id} nombre={p.nombre} email={p.email}/>
            ))}
        </div>
    );
}

interface PerosonInfoProp {
    id: number;
    nombre: string;
    email: string;
}

function Person({ nombre, email }: PerosonInfoProp) {
    return (
        <article className="person-info">
            <div className="person-detail">
                <div className="person-name">
                    <User size="xs"/>
                    {nombre}
                </div>
                <div className="person-email">
                    <Envelope size="xs"/>
                    {email}
                </div>
            </div>
            <div className="buttons-actions">
                <button><Edit size="sm" /></button>
                <button><Trash size="sm" /></button>
            </div>
        </article>
    );
}