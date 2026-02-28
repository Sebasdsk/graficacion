import "./Dashboard.css";
import HeaderDashboard from "../components/HeaderDashboard"
import Projects from "../components/ProjectsComponents/Projects";
import { useEffect, useState, type SetStateAction } from "react";
import { useNavigate } from "react-router";

type OptionsDashboard = "Home" | "Proyectos";

export default function Dashboard() {
    const [option, setOption] = useState<OptionsDashboard>("Home");
    const navigate = useNavigate();

    const API_URL = "http://localhost:3000/api/proyectos/lista";

    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/");
    }

    useEffect(() => {
        const consultListProyects = async () => {
            try {
    
                const response = await fetch(API_URL, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`, // Envía el token
                        'Content-Type': 'application/json'
                    }
                });
    
                if (!response.ok) {
                    console.error(response);
                    navigate("/");
                    return;
                }
                
            } catch (err) {
                console.error("Error en la query: ", err)
                navigate("/");
            }
        }

        consultListProyects();
    }, []);

    return (
        <main className="panel-control">
            <DashboardSidebar setOption={setOption}/>
            {option === "Home" && 
                <div className="home">
                <div className="title-home">
                    <h1>Home</h1>
                </div>
                <HeaderDashboard/>
                
            </div>
            }
            {option === "Proyectos" && <Projects/>}
        </main>
    );
}


interface OptionsDashboardProp {
    setOption: React.Dispatch<SetStateAction<OptionsDashboard>>;
}

function DashboardSidebar({ setOption }: OptionsDashboardProp) {
    return (
        <aside className="dashboard-sidebar">
            <header className="header-sidebar">
                <h2>FLOWTIC</h2>
            </header>
            <button onClick={() => setOption("Home")}>Home</button>
            <button onClick={() => setOption("Proyectos")}>Proyectos</button>
            <button>Cerrar Sesión</button>
        </aside>
    );
}