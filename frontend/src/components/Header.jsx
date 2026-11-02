import { NavLink } from "react-router-dom";

const enlaces = [
    { nombre: "Clientes", ruta: "/clientes" },
    { nombre: "Tarjetas", ruta: "/tarjetas" },
    { nombre: "Registrar Tarjeta", ruta: "/tarjetas/nuevo" },
    { nombre: "Transacciones", ruta: "/transacciones" },
    { nombre: "Registrar Transacción", ruta: "/transacciones/nuevo"},
    { nombre: "Balance Anual", ruta: "/balance"},
    { nombre: "Puntos", ruta: "/puntos" },
];

function Header() {
    return (
        <header className="main-header">
            <div className="header-container">

                <NavLink to="/" className="brand">
                    <span className="brand-symbol">A</span>

                    <span className="brand-text">
                        <strong>ALL THE BEST</strong>
                        <small>RETAIL & FINANCIAL SERVICES</small>
                    </span>
                </NavLink>

                <nav className="main-nav">
                    {enlaces.map(enlace => (
                        <NavLink
                            key={enlace.ruta}
                            to={enlace.ruta}
                            end={enlace.ruta === "/"}
                            className={({ isActive }) =>
                                `nav-link ${isActive ? "active" : ""}`
                            }
                        >
                            {enlace.nombre}
                        </NavLink>
                    ))}
                </nav>

            </div>
        </header>
    );
}

export default Header;