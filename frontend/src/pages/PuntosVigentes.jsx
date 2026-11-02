
import { useState } from "react";
import { Link } from "react-router-dom";
import { obtenerPuntosVigentes } from "../services/puntosService";

function PuntosVigentes() {
    const [numrun, setNumrun] = useState("");
    const [puntos, setPuntos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [consultado, setConsultado] = useState(false);
    const [error, setError] = useState("");

    async function consultarPuntos(e) {
        e.preventDefault();

        if (!numrun.trim()) {
            setError("Debes ingresar el RUN del cliente.");
            return;
        }

        try {
            setCargando(true);
            setError("");
            setConsultado(false);
            setPuntos([]);

            const respuesta = await obtenerPuntosVigentes(numrun.trim());

            const resultado = respuesta.data ?? respuesta.puntos ?? respuesta;

            setPuntos(Array.isArray(resultado) ? resultado : []);
            setConsultado(true);
        } catch (err) {
            setError(
                err.message || "No fue posible consultar los puntos vigentes."
            );
        } finally {
            setCargando(false);
        }
    }

    function formatearColumna(columna) {
        const nombres = {
            NRO_TARJETA: "N° tarjeta",
            NRO_TRANSACCION: "N° transacción",
            FECHA_TRANSACCION: "Fecha transacción",
            FECHA_VENCIMIENTO: "Fecha vencimiento",
            PUNTOS: "Puntos",
            PUNTOS_VIGENTES: "Puntos vigentes",
            SALDO_PUNTOS: "Saldo de puntos",
            MES_ANNO: "Mes y año",
            NUMRUN: "RUN"
        };

        return nombres[columna.toUpperCase()] ??
            columna.replaceAll("_", " ").toLowerCase();
    }

    function formatearValor(valor) {
        if (valor === null || valor === undefined) {
            return "—";
        }

        if (valor instanceof Date) {
            return valor.toLocaleDateString("es-CL");
        }

        return String(valor);
    }

    const columnas = puntos.length > 0
        ? Object.keys(puntos[0])
        : [];

    return (
        <main className="page">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Puntos vigentes</h1>
                    <p className="page-description">
                        Consulta los puntos disponibles de un cliente.
                    </p>
                </div>

                <Link to="/puntos" className="button button-secondary">
                    Volver
                </Link>
            </header>

            <section className="card">
                <div className="card-header">
                    <h2 className="card-title">Buscar cliente</h2>
                </div>

                <form className="form" onSubmit={consultarPuntos}>
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
                            {cargando ? "Consultando..." : "Consultar puntos"}
                        </button>
                    </div>
                </form>
            </section>

            {cargando && (
                <div className="loading">
                    Consultando puntos vigentes...
                </div>
            )}

            {consultado && !cargando && (
                <section className="card">
                    <div className="card-header">
                        <div>
                            <h2 className="card-title">
                                Resultado de la consulta
                            </h2>
                            <p className="page-description">
                                RUN consultado: {numrun}
                            </p>
                        </div>
                    </div>

                    {puntos.length > 0 ? (
                        <>
                            <p className="page-description">
                                Registros encontrados: {puntos.length}
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
                                        {puntos.map((punto, indice) => (
                                            <tr key={indice}>
                                                {columnas.map(columna => (
                                                    <td key={columna}>
                                                        {formatearValor(
                                                            punto[columna]
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
                            No se encontraron puntos vigentes para este cliente.
                        </div>
                    )}
                </section>
            )}
        </main>
    );
}
export default PuntosVigentes;