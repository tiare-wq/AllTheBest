import { useState } from "react";
import { Link } from "react-router-dom";
import { obtenerTransaccionesPorCliente } from "../services/transaccionesService";

function TransaccionesCliente() {
    const [numrun, setNumrun] = useState("");
    const [transacciones, setTransacciones] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [consultado, setConsultado] = useState(false);
    const [error, setError] = useState("");

    async function consultarTransacciones(e) {
        e.preventDefault();

        if (!numrun.trim()) {
            setError("Debes ingresar el RUN del cliente.");
            return;
        }

        try {
            setCargando(true);
            setError("");
            setConsultado(false);
            setTransacciones([]);

            const respuesta = await obtenerTransaccionesPorCliente(
                numrun.trim()
            );

            const resultado =
                respuesta.data ?? respuesta.transacciones ?? respuesta;

            setTransacciones(Array.isArray(resultado) ? resultado : []);
            setConsultado(true);
        } catch (err) {
            setError(
                err.message || "No fue posible consultar las transacciones."
            );
        } finally {
            setCargando(false);
        }
    }

    function formatearColumna(columna) {
        const nombres = {
            NRO_TARJETA: "N° tarjeta",
            NRO_TRANSACCION: "N° transacción",
            FECHA_TRANSACCION: "Fecha",
            MONTO_TRANSACCION: "Monto",
            MONTO: "Monto",
            TIPO_TRANSACCION: "Tipo de transacción",
            DESC_TIPO_TRANSACCION: "Tipo de transacción",
            DESCRIPCION: "Descripción",
            ESTADO: "Estado",
            NUMRUN: "RUN"
        };

        return nombres[columna.toUpperCase()] ??
            columna.replaceAll("_", " ").toLowerCase();
    }

    function formatearValor(valor, columna) {
        if (valor === null || valor === undefined) {
            return "—";
        }

        if (
            columna.toUpperCase().includes("FECHA") &&
            !Number.isNaN(new Date(valor).getTime())
        ) {
            return new Date(valor).toLocaleDateString("es-CL", {
                timeZone: "UTC"
            });
        }

        if (columna.toUpperCase().includes("MONTO")) {
            const numero = Number(valor);

            if (!Number.isNaN(numero)) {
                return numero.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                    maximumFractionDigits: 0
                });
            }
        }

        return String(valor);
    }

    const columnas = transacciones.length > 0
        ? Object.keys(transacciones[0])
        : [];

    return (
        <main className="page">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Transacciones por cliente</h1>
                    <p className="page-description">
                        Consulta el historial de transacciones de un cliente.
                    </p>
                </div>

                <Link to="/transacciones" className="button button-secondary">
                    Volver
                </Link>
            </header>

            <section className="card">
                <div className="card-header">
                    <h2 className="card-title">Buscar cliente</h2>
                </div>

                <form className="form" onSubmit={consultarTransacciones}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="numrun">
                            RUN del cliente
                        </label>

                        <input
                            id="numrun"
                            name="numrun"
                            type="number"
                            className="form-control"
                            placeholder="Ingresa el RUN sin puntos ni dígito verificador"
                            value={numrun}
                            onChange={(e) => setNumrun(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="button button-primary"
                            disabled={cargando}
                        >
                            {cargando
                                ? "Consultando..."
                                : "Consultar transacciones"}
                        </button>
                    </div>
                </form>
            </section>

            {cargando && (
                <div className="loading">
                    Consultando historial de transacciones...
                </div>
            )}

            {consultado && !cargando && (
                <section className="card">
                    <div className="card-header">
                        <div>
                            <h2 className="card-title">
                                Historial de transacciones
                            </h2>

                            <p className="page-description">
                                RUN consultado: {numrun}
                            </p>
                        </div>
                    </div>

                    {transacciones.length > 0 ? (
                        <>
                            <p className="page-description">
                                Transacciones encontradas: {transacciones.length}
                            </p>

                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            {columnas.map(columna => (
                                                <th key={columna}>
                                                    {formatearColumna(columna)}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {transacciones.map((transaccion, indice) => (
                                            <tr key={indice}>
                                                {columnas.map(columna => (
                                                    <td key={columna}>
                                                        {formatearValor(
                                                            transaccion[columna],
                                                            columna
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            No se encontraron transacciones para este cliente.
                        </div>
                    )}
                </section>
            )}
        </main>
    );
}

export default TransaccionesCliente;