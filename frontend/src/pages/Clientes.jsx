import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerClientes } from "../services/clientesService";

function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        cargarClientes();
    }, []);

    async function cargarClientes() {
        try {
            setCargando(true);
            setError("");

            const respuesta = await obtenerClientes();
            setClientes(respuesta);
        } catch (error) {
            setError("No fue posible cargar los clientes.");
            console.error(error);
        } finally {
            setCargando(false);
        }
    }

    function obtenerNombre(cliente) {
        return [
            cliente.pnombre ?? cliente.PNOMBRE,
            cliente.snombre ?? cliente.SNOMBRE,
            cliente.appaterno ?? cliente.APPATERNO,
            cliente.apmaterno ?? cliente.APMATERNO
        ]
            .filter(Boolean)
            .join(" ");
    }

    const clientesFiltrados = clientes.filter((cliente) => {
        const run = String(cliente.numrun ?? cliente.NUMRUN ?? "");
        const nombre = obtenerNombre(cliente).toLowerCase();

        const termino = busqueda.toLowerCase();

        return run.includes(termino) || nombre.includes(termino);
    });

    return (
        <main className="page">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Clientes</h1>
                    <p className="page-description">
                        Administración y registro de clientes.
                    </p>
                </div>

                <div className="page-actions">
                    <Link
                        to="/clientes/nuevo"
                        className="button button-primary"
                    >
                        + Nuevo cliente
                    </Link>
                </div>
            </header>

            <section className="card">
                <div className="card-header">
                    <h2 className="card-title">Listado de clientes</h2>
                </div>

                <div className="filter-bar">
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Buscar por RUN o nombre..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                {cargando && (
                    <p className="loading">Cargando clientes...</p>
                )}

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {!cargando && !error && (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>RUN</th>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Teléfono</th>
                                    <th>Tipo de cliente</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {clientesFiltrados.map((cliente) => {
                                    const run =
                                        cliente.numrun ?? cliente.NUMRUN;

                                    const dv =
                                        cliente.dvrun ?? cliente.DVRUN;

                                    return (
                                        <tr key={run}>
                                            <td>{`${run}-${dv}`}</td>
                                            <td>{obtenerNombre(cliente)}</td>
                                            <td>
                                                {cliente.correo ?? cliente.CORREO ?? "—"}
                                            </td>
                                            <td>
                                                {cliente.fono_contacto ??
                                                    cliente.FONO_CONTACTO ??
                                                    "—"}
                                            </td>
                                            <td>
                                                {cliente.nombre_tipo_cliente ??
                                                    cliente.NOMBRE_TIPO_CLIENTE ??
                                                    "—"}
                                            </td>
                                            <td>
                                                <div className="table-actions">
                                                    <Link
                                                        to={`/clientes/${run}/editar`}
                                                        className="button button-secondary"
                                                    >
                                                        Editar
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {clientesFiltrados.length === 0 && (
                            <div className="empty-state">
                                No se encontraron clientes.
                            </div>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Clientes;