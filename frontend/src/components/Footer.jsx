import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="main-footer">
            <div className="footer-container">

                <section className="footer-brand">
                    <div className="footer-logo">
                        <span className="footer-symbol">A</span>

                        <div>
                            <h2>ALL THE BEST</h2>
                            <span>RETAIL & FINANCIAL SERVICES</span>
                        </div>
                    </div>

                    <p>
                        Más que compras, acompañamos tus proyectos.
                        Gestionamos tus servicios y beneficios con
                        confianza y compromiso.
                    </p>
                </section>

                <section className="footer-section">
                    <h3>PLATAFORMA</h3>

                    <Link to="/clientes">Clientes</Link>
                    <Link to="/tarjetas">Tarjetas CATB</Link>
                    <Link to="/transacciones/cliente">Transacciones</Link>
                </section>

                <section className="footer-section">
                    <h3>SERVICIOS</h3>

                    <Link to="/puntos/vigentes">Puntos vigentes</Link>
                    <Link to="/aportes">Aportes SBIF</Link>
                    <Link to="/reportes">Reportes</Link>
                </section>

                <section className="footer-section">
                    <h3>INFORMACIÓN</h3>

                    <p>Administración de clientes</p>
                    <p>Gestión de tarjetas CATB</p>
                    <p>Control de transacciones</p>
                </section>

            </div>

            <div className="footer-bottom">
                <p>
                    © {new Date().getFullYear()} ALL THE BEST.
                    Todos los derechos reservados.
                </p>

                <span>Gestión y administración de servicios financieros.</span>
            </div>
        </footer>
    );
}
export default Footer;