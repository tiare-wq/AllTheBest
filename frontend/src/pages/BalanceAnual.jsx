import { useEffect, useState } from "react";
import {
    obtenerBalanceAnual,
    obtenerBalancePorAnio
} from "../services/reportesService";

function BalanceAnual() {
    const [balances, setBalances] = useState([]);
    const [anio, setAnio] = useState("");
    const [filtroAplicado, setFiltroAplicado] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        cargarBalance();
    }, []);

    async function cargarBalance(anioSeleccionado = "") {
        try {
            setCargando(true);
            setError("");

            const respuesta = anioSeleccionado
                ? await obtenerBalancePorAnio(anioSeleccionado)
                : await obtenerBalanceAnual();

            const resultado =
                respuesta.data ?? respuesta.balances ?? respuesta;

            setBalances(Array.isArray(resultado) ? resultado : []);
            setFiltroAplicado(anioSeleccionado);
        } catch (err) {
            setError(
                err.message || "No fue posible consultar el balance anual."
            );
            setBalances([]);
        } finally {
            setCargando(false);
        }
    }

    function buscarPorAnio(e) {
        e.preventDefault();

        if (!/^\d{4}$/.test(anio)) {
            setError("Ingresa un año válido de cuatro dígitos.");
            return;
        }

        cargarBalance(anio);
    }

    function limpiarFiltro() {
        setAnio("");
        cargarBalance();
    }

    function obtenerCampo(registro, campo) {
        return registro[campo] ??
            registro[campo.toUpperCase()] ??
            "—";
    }

    function formatearFecha(fecha) {
        if (!fecha) return "—";

        const valor = new Date(fecha);

        if (Number.isNaN(valor.getTime())) return fecha;

        return valor.toLocaleDateString("es-CL", {
            timeZone: "UTC"
        });
    }

    function formatearMonto(valor) {
        if (valor === null || valor === undefined || valor === "") {
            return "—";
        }

        const numero = Number(valor);

        if (!Number.isFinite(numero)) return "—";

        return numero.toLocaleString("es-CL", {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0
        });
    }

    return (
        <main className="page">
            <header className="page-header">
                <div>
                    <h1 className="page-title">
                        Balance anual
                    </h1>

                    <p className="page-description">
                        Consulta el historial anual de transacciones,
                        cuotas, pagos y deudas de las tarjetas CATB.
                    </p>
                </div>
            </header>

            {/* FILTRO POR AÑO */}
            <section className="card">
                <div className="card-header">
                    <div>
                        <h2 className="card-title">
                            Consultar balance
                        </h2>

                        <p className="page-description">
                            Selecciona un año para filtrar los registros.
                        </p>
                    </div>
                </div>

                <form className="form" onSubmit={buscarPorAnio}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label" htmlFor="anio">
                                Año
                            </label>

                            <input
                                id="anio"
                                type="number"
                                className="form-control"
                                placeholder="Ej. 2026"
                                min="1900"
                                max="9999"
                                value={anio}
                                onChange={(e) => setAnio(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="button button-primary"
                            disabled={cargando || !anio}
                        >
                            Buscar
                        </button>

                        <button
                            type="button"
                            className="button button-secondary"
                            onClick={limpiarFiltro}
                            disabled={cargando}
                        >
                            Ver todos
                        </button>
                    </div>
                </form>
            </section>

            {/* RESULTADOS */}
            <section className="card">
                <div className="card-header">
                    <div>
                        <h2 className="card-title">
                            Detalle de movimientos y cuotas
                        </h2>

                        <p className="page-description">
                            {filtroAplicado
                                ? `Balance correspondiente al año ${filtroAplicado}.`
                                : "Todos los registros del balance anual."}
                        </p>
                    </div>
                </div>

                {cargando ? (
                    <div className="loading">
                        Consultando balance anual...
                    </div>
                ) : error ? (
                    <div className="alert alert-error">
                        {error}
                    </div>
                ) : balances.length > 0 ? (
                    <>
                        <p className="page-description">
                            Registros encontrados: {balances.length}
                        </p>

                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Mes / Año</th>
                                        <th>RUN cliente</th>
                                        <th>N° tarjeta</th>
                                        <th>Fecha transacción</th>
                                        <th>N° transacción</th>
                                        <th>Tipo transacción</th>
                                        <th>Monto total</th>
                                        <th>Último vencimiento</th>
                                        <th>Cuota</th>
                                        <th>Fecha vencimiento</th>
                                        <th>Valor cuota</th>
                                        <th>Fecha pago</th>
                                        <th>Monto pagado</th>
                                        <th>Deuda cuota</th>
                                        <th>Deuda pendiente</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {balances.map((registro, indice) => (
                                        <tr
                                            key={`${obtenerCampo(registro, "nro_tarjeta")}-${obtenerCampo(registro, "nro_transaccion")}-${indice}`}
                                        >
                                            <td>
                                                {obtenerCampo(registro, "mes_anno")}
                                            </td>

                                            <td>
                                                {obtenerCampo(registro, "run_cliente")}
                                            </td>

                                            <td>
                                                {obtenerCampo(registro, "nro_tarjeta")}
                                            </td>

                                            <td>
                                                {formatearFecha(
                                                    obtenerCampo(registro, "fecha_transaccion")
                                                )}
                                            </td>

                                            <td>
                                                {obtenerCampo(registro, "nro_transaccion")}
                                            </td>

                                            <td>
                                                {obtenerCampo(registro, "tipo_transaccion")}
                                            </td>

                                            <td>
                                                {formatearMonto(
                                                    obtenerCampo(registro, "monto_total_transaccion")
                                                )}
                                            </td>

                                            <td>
                                                {formatearFecha(
                                                    obtenerCampo(registro, "fecha_venc_ult_cuota")
                                                )}
                                            </td>

                                            <td>
                                                {obtenerCampo(registro, "nro_cuota_pagada")}
                                            </td>

                                            <td>
                                                {formatearFecha(
                                                    obtenerCampo(registro, "fecha_venc_cuota")
                                                )}
                                            </td>

                                            <td>
                                                {formatearMonto(
                                                    obtenerCampo(registro, "valor_cuota")
                                                )}
                                            </td>

                                            <td>
                                                {formatearFecha(
                                                    obtenerCampo(registro, "fecha_pago")
                                                )}
                                            </td>

                                            <td>
                                                {formatearMonto(
                                                    obtenerCampo(registro, "monto_pagado")
                                                )}
                                            </td>

                                            <td>
                                                {formatearMonto(
                                                    obtenerCampo(registro, "deuda_pago_cuota")
                                                )}
                                            </td>

                                            <td>
                                                {formatearMonto(
                                                    obtenerCampo(registro, "deuda_por_pagar")
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="empty-state">
                        No existen registros para el balance anual.
                    </div>
                )}
            </section>
        </main>
    );
}

export default BalanceAnual;