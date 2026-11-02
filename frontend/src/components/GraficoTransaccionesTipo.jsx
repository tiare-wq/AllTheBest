import { useEffect, useState } from "react";
import { obtenerTransaccionesPorTipo } from "../services/reportesService";

const COLORES = [
    "#39765B",
    "#6EAA87",
    "#A5CDB2",
    "#315B49",
    "#B8D8C2",
    "#789C85",
    "#D0E3D5"
];

function GraficoTransaccionesTipo() {
    const [datos, setDatos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function cargarDatos() {
            try {
                const respuesta = await obtenerTransaccionesPorTipo();

                const resultado =
                    respuesta.data ?? respuesta.detalles ?? respuesta;

                setDatos(Array.isArray(resultado) ? resultado : []);
            } catch (err) {
                setError(
                    err.message || "No fue posible cargar las transacciones."
                );
            } finally {
                setCargando(false);
            }
        }

        cargarDatos();
    }, []);

    const total = datos.reduce(
        (suma, item) => suma + Number(item.CANTIDAD ?? item.cantidad ?? 0),
        0
    );

    let acumulado = 0;

    const segmentos = datos.map((item, indice) => {
        const cantidad = Number(item.CANTIDAD ?? item.cantidad ?? 0);
        const porcentaje = total > 0 ? (cantidad / total) * 100 : 0;

        const inicio = acumulado;
        acumulado += porcentaje;

        return {
            tipo: item.TIPO_TRANSACCION ?? item.tipo_transaccion,
            cantidad,
            porcentaje,
            color: COLORES[indice % COLORES.length],
            inicio,
            fin: acumulado
        };
    });

    const gradiente = segmentos
        .map(
            item =>
                `${item.color} ${item.inicio}% ${item.fin}%`
        )
        .join(", ");

    return (
        <section className="card">
            <div className="card-header">
                <div>
                    <h2 className="card-title">
                        Transacciones por tipo
                    </h2>

                    <p className="page-description">
                        Distribución de las transacciones registradas.
                    </p>
                </div>
            </div>

            {cargando ? (
                <div className="loading">
                    Cargando gráfico...
                </div>
            ) : error ? (
                <div className="alert alert-error">{error}</div>
            ) : datos.length === 0 || total === 0 ? (
                <div className="empty-state">
                    No existen transacciones registradas.
                </div>
            ) : (
                <div className="grafico-torta">
                    <div
                        className="grafico-torta-circulo"
                        style={{
                            background: `conic-gradient(${gradiente})`
                        }}
                    >
                        <div className="grafico-torta-centro">
                            <strong>{total.toLocaleString("es-CL")}</strong>
                            <span>Transacciones</span>
                        </div>
                    </div>

                    <div className="grafico-torta-leyenda">
                        {segmentos.map((item, indice) => (
                            <div
                                className="grafico-torta-item"
                                key={`${item.tipo}-${indice}`}
                            >
                                <span
                                    className="grafico-torta-color"
                                    style={{ backgroundColor: item.color }}
                                />

                                <div className="grafico-torta-info">
                                    <span className="grafico-torta-tipo">
                                        {item.tipo}
                                    </span>

                                    <span className="grafico-torta-cantidad">
                                        {item.cantidad.toLocaleString("es-CL")}
                                        {" · "}
                                        {item.porcentaje.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

export default GraficoTransaccionesTipo;