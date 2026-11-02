
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
    obtenerDetalleTarjeta,
    obtenerDetalleAporteSbif
} from "../services/tarjetasService";

function TarjetaDetalle() {
    const { nroTarjeta } = useParams();

    const [puntos, setPuntos] = useState([]);
    const [aportes, setAportes] = useState([]);

    const [cargando, setCargando] = useState(true);
    const [errorPuntos, setErrorPuntos] = useState("");
    const [errorSbif, setErrorSbif] = useState("");

    useEffect(() => {
        async function cargarDetalles() {
            setCargando(true);
            setErrorPuntos("");
            setErrorSbif("");

            const [resultadoPuntos, resultadoSbif] = await Promise.allSettled([
                obtenerDetalleTarjeta(nroTarjeta),
                obtenerDetalleAporteSbif(nroTarjeta)
            ]);

            if (resultadoPuntos.status === "fulfilled") {
                const respuesta = resultadoPuntos.value;
                const resultado =
                    respuesta.data ?? respuesta.detalles ?? respuesta;

                setPuntos(Array.isArray(resultado) ? resultado : []);
            } else {
                setErrorPuntos(
                    resultadoPuntos.reason.message ||
                    "No fue posible consultar los puntos CATB."
                );
            }

            if (resultadoSbif.status === "fulfilled") {
                const respuesta = resultadoSbif.value;
                const resultado =
                    respuesta.data ?? respuesta.detalles ?? respuesta;

                setAportes(Array.isArray(resultado) ? resultado : []);
            } else {
                setErrorSbif(
                    resultadoSbif.reason.message ||
                    "No fue posible consultar los aportes SBIF."
                );
            }

            setCargando(false);
        }

        cargarDetalles();
    }, [nroTarjeta]);

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
        return Number(valor).toLocaleString("es-CL", {
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
                        Detalle de tarjeta CATB
                    </h1>

                    <p className="page-description">
                        Historial de puntos y aportes SBIF.
                    </p>
                </div>

                <Link to="/tarjetas" className="button button-secondary">
                    Volver
                </Link>
            </header>

            <p className="page-description">
                Número de tarjeta: {nroTarjeta}
            </p>

            {/* SISTEMA DE PUNTOS CATB */}
            <section className="card">
                <div className="card-header">
                    <div>
                        <h2 className="card-title">
                            Sistema de puntos CATB
                        </h2>

                        <p className="page-description">
                            Movimientos y puntos generados por la tarjeta.
                        </p>
                    </div>
                </div>

                {cargando ? (
                    <div className="loading">
                        Consultando puntos...
                    </div>
                ) : errorPuntos ? (
                    <div className="alert alert-error">
                        {errorPuntos}
                    </div>
                ) : puntos.length > 0 ? (
                    <>
                        <p className="page-description">
                            Movimientos encontrados: {puntos.length}
                        </p>

                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>RUN</th>
                                        <th>N° transacción</th>
                                        <th>Fecha</th>
                                        <th>Tipo</th>
                                        <th>Monto</th>
                                        <th>Puntos CATB</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {puntos.map((detalle, indice) => (
                                        <tr
                                            key={`${obtenerCampo(detalle, "nro_transaccion")}-${indice}`}
                                        >
                                            <td>
                                                {obtenerCampo(detalle, "numrun")}-
                                                {obtenerCampo(detalle, "dvrun")}
                                            </td>

                                            <td>
                                                {obtenerCampo(detalle, "nro_transaccion")}
                                            </td>

                                            <td>
                                                {formatearFecha(
                                                    obtenerCampo(detalle, "fecha_transaccion")
                                                )}
                                            </td>

                                            <td>
                                                {obtenerCampo(detalle, "tipo_transaccion")}
                                            </td>

                                            <td>
                                                {formatearMonto(
                                                    obtenerCampo(detalle, "monto_transaccion")
                                                )}
                                            </td>

                                            <td>
                                                {obtenerCampo(detalle, "puntos_allthebest")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="empty-state">
                        No existen movimientos con puntos CATB para esta tarjeta.
                    </div>
                )}
            </section>

            {/* APORTE SBIF */}
            <section className="card">
                <div className="card-header">
                    <div>
                        <h2 className="card-title">
                            Aporte SBIF
                        </h2>

                        <p className="page-description">
                            Aportes generados por las transacciones de la tarjeta.
                        </p>
                    </div>
                </div>

                {cargando ? (
                    <div className="loading">
                        Consultando aportes SBIF...
                    </div>
                ) : errorSbif ? (
                    <div className="alert alert-error">
                        {errorSbif}
                    </div>
                ) : aportes.length > 0 ? (
                    <>
                        <p className="page-description">
                            Aportes encontrados: {aportes.length}
                        </p>

                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>RUN</th>
                                        <th>N° transacción</th>
                                        <th>Fecha</th>
                                        <th>Tipo</th>
                                        <th>Monto transacción</th>
                                        <th>Aporte SBIF</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {aportes.map((detalle, indice) => (
                                        <tr
                                            key={`${obtenerCampo(detalle, "nro_transaccion")}-${indice}`}
                                        >
                                            <td>
                                                {obtenerCampo(detalle, "numrun")}-
                                                {obtenerCampo(detalle, "dvrun")}
                                            </td>

                                            <td>
                                                {obtenerCampo(detalle, "nro_transaccion")}
                                            </td>

                                            <td>
                                                {formatearFecha(
                                                    obtenerCampo(detalle, "fecha_transaccion")
                                                )}
                                            </td>

                                            <td>
                                                {obtenerCampo(detalle, "tipo_transaccion")}
                                            </td>

                                            <td>
                                                {formatearMonto(
                                                    obtenerCampo(detalle, "monto_transaccion")
                                                )}
                                            </td>

                                            <td>
                                                {formatearMonto(
                                                    obtenerCampo(detalle, "aporte_sbif")
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
                        No existen aportes SBIF registrados para esta tarjeta.
                    </div>
                )}
            </section>
        </main>
    );
}

export default TarjetaDetalle;