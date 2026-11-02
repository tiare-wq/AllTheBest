import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerTarjetas } from "../services/tarjetasService";

function Tarjetas() {
    const [tarjetas, setTarjetas] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    async function cargarTarjetas() {
        try {
            setCargando(true);
            setError("");

            const respuesta = await obtenerTarjetas();

            const resultado =
                respuesta.data ?? respuesta.tarjetas ?? respuesta;

            setTarjetas(Array.isArray(resultado) ? resultado : []);
        } catch (err) {
            setError(err.message || "No fue posible cargar las tarjetas.");
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarTarjetas();
    }, []);

    const tarjetasFiltradas = tarjetas.filter(tarjeta => {
        const numero = String(
            tarjeta.nro_tarjeta ?? tarjeta.NRO_TARJETA ?? ""
        );

        const run = String(
            tarjeta.numrun ?? tarjeta.NUMRUN ?? ""
        );

        return (
            numero.includes(busqueda) ||
            run.includes(busqueda)
        );
    });

    function obtenerCampo(tarjeta, campo) {
        return tarjeta[campo] ?? tarjeta[campo.toUpperCase()] ?? "—";
    }

    function formatearFecha(fecha) {
        if (!fecha) return "—";

        const valor = new Date(fecha);

        if (Number.isNaN(valor.getTime())) return fecha;

        return valor.toLocaleDateString("es-CL", {
            timeZone: "UTC"
        });
    }

    return (
        <main className="page">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Tarjetas CATB</h1>
                    <p className="page-description">
                        Administración y consulta de tarjetas de clientes.
                    </p>
                </div>

                <div className="page-actions">
                    <Link
                        to="/tarjetas/nueva"
                        className="button button-primary"
                    >
                        + Nueva tarjeta
                    </Link>
                </div>
            </header>

            <section className="card">
                <div className="card-header">
                    <h2 className="card-title">
                        Tarjetas registradas
                    </h2>
                </div>

                <div className="filter-bar">
                    <input
                        type="search"
                        className="form-control search-input"
                        placeholder="Buscar por número de tarjeta o RUN..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                    />
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                        <button
                            className="button button-secondary"
                            onClick={cargarTarjetas}
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {cargando ? (
                    <div className="loading">
                        Cargando tarjetas...
                    </div>
                ) : tarjetasFiltradas.length > 0 ? (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>N° tarjeta</th>
                                    <th>RUN cliente</th>
                                    <th>Cupo total</th>
                                    <th>Fecha otorgamiento</th>
                                    <th>Puntos</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {tarjetasFiltradas.map((tarjeta, indice) => {
                                    const numero = obtenerCampo(
                                        tarjeta,
                                        "nro_tarjeta"
                                    );

                                    const habilitado = obtenerCampo(
                                        tarjeta,
                                        "hab_puntos"
                                    );

                                    return (
                                        <tr key={numero !== "—" ? numero : indice}>
                                            <td>{numero}</td>

                                            <td>
                                                {obtenerCampo(tarjeta, "numrun")}
                                            </td>

                                            <td>
                                                {Number(
                                                    obtenerCampo(tarjeta, "cupo_compra")
                                                ).toLocaleString("es-CL", {
                                                    style: "currency",
                                                    currency: "CLP",
                                                    maximumFractionDigits: 0
                                                })}
                                            </td>

                                            <td>
                                                {formatearFecha(
                                                    obtenerCampo(
                                                        tarjeta,
                                                        "fecha_solic_tarjeta"
                                                    )
                                                )}
                                            </td>

                                            <td>
                                                {habilitado === true
                                                    ? "Habilitado"
                                                    : habilitado === false
                                                        ? "No habilitado"
                                                        : "—"}
                                            </td>

                                            <td>
                                                <div className="table-actions">
                                                    <Link
                                                        to={`/tarjetas/detalles/${numero}`}
                                                        className="button button-secondary"
                                                    >
                                                        Ver detalle
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        {busqueda
                            ? "No se encontraron tarjetas con esa búsqueda."
                            : "Todavía no hay tarjetas registradas."}
                    </div>
                )}

                {!cargando && (
                    <p className="page-description">
                        Total de tarjetas: {tarjetasFiltradas.length}
                    </p>
                )}
            </section>
        </main>
    );
}
export default Tarjetas;