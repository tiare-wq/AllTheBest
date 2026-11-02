import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registrarTransaccion } from "../services/transaccionesService";
import { obtenerTarjetas } from "../services/tarjetasService";
import { obtenerTiposTransaccion, obtenerSucursales } from "../services/catalogosService";

function TransaccionForm() {
    const navigate = useNavigate();

    const [tarjetas, setTarjetas] = useState([]);
    const [tiposTransaccion, setTiposTransaccion] = useState([]);
    const [sucursales, setSucursales] = useState([]);

    const [formulario, setFormulario] = useState({
        nro_tarjeta: "",
        nro_transaccion: "",
        cod_tptran_tarjeta: "",
        fecha_transaccion: new Date().toISOString().slice(0, 10),
        monto_transaccion: "",
        total_cuotas_transaccion: "",
        monto_total_transaccion: "",
        id_sucursal: ""
    });

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        async function cargarDatos() {
            try {
                const [respuestaTarjetas, respuestaTipos, respuestaSucursales] = await Promise.all([
                    obtenerTarjetas(),
                    obtenerTiposTransaccion(),
                    obtenerSucursales()
                ]);

                setTarjetas(
                    Array.isArray(respuestaTarjetas)
                        ? respuestaTarjetas
                        : respuestaTarjetas.data ?? []
                );

                setTiposTransaccion(
                    Array.isArray(respuestaTipos)
                        ? respuestaTipos
                        : respuestaTipos.data ?? []
                );

                setSucursales(
                    Array.isArray(respuestaSucursales)
                        ? respuestaSucursales
                        : respuestaSucursales.data ?? []
                );
            } catch (err) {
                setError("No fue posible cargar las tarjetas y tipos de transacción.");
            } finally {
                setCargando(false);
            }
        }

        cargarDatos();
    }, []);

    function manejarCambio(e) {
        const { name, value } = e.target;

        setFormulario((actual) => ({
            ...actual,
            [name]: value
        }));
    }

    async function manejarSubmit(e) {
        e.preventDefault();
        setError("");
        setMensaje("");

        if (
            !formulario.nro_tarjeta ||
            !formulario.nro_transaccion ||
            !formulario.cod_tptran_tarjeta ||
            !formulario.fecha_transaccion ||
            !formulario.monto_transaccion ||
            !formulario.total_cuotas_transaccion ||
            !formulario.monto_total_transaccion ||
            !formulario.id_sucursal
        ) {
            setError("Completa todos los campos.");
            return;
        }

        if (
            !Number.isInteger(Number(formulario.nro_transaccion)) ||
            Number(formulario.nro_transaccion) <= 0
        ) {
            setError("El número de transacción debe ser un entero positivo.");
            return;
        }

        if (
            !Number.isFinite(Number(formulario.monto_transaccion)) ||
            Number(formulario.monto_transaccion) <= 0
        ) {
            setError("El monto debe ser mayor que cero.");
            return;
        }

        if (
            !Number.isFinite(Number(formulario.total_cuotas_transaccion)) ||
            Number(formulario.total_cuotas_transaccion) <= 0
        ) {
            setError("El número total de cuotas debe ser mayor a 0.");
            return;
        }

        if (
            !Number.isFinite(Number(formulario.monto_total_transaccion)) ||
            Number(formulario.monto_total_transaccion) < formulario.monto_transaccion
        ) {
            setError("El monto debe ser mayor o igual que el monto de transacción.");
            return;
        }

        try {
            setGuardando(true);

            const datos = {
                nro_tarjeta: Number(formulario.nro_tarjeta),
                nro_transaccion: Number(formulario.nro_transaccion),
                cod_tptran_tarjeta: Number(formulario.cod_tptran_tarjeta),
                fecha_transaccion: formulario.fecha_transaccion,
                monto_transaccion: Number(formulario.monto_transaccion),
                total_cuotas_transaccion: Number(formulario.total_cuotas_transaccion),
                monto_total_transaccion: Number(formulario.monto_total_transaccion),
                id_sucursal: Number(formulario.id_sucursal)
            };

            await registrarTransaccion(datos);

            setMensaje("Transacción registrada correctamente.");

            setTimeout(() => {
                navigate("/transacciones");
            }, 1000);

        } catch (err) {
            setError(
                err.message || "No fue posible registrar la transacción."
            );
        } finally {
            setGuardando(false);
        }
    }

    if (cargando) {
        return <p className="loading">Cargando información...</p>;
    }

    return (
        <main className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Registrar transacción</h1>
                    <p className="page-description">
                        Ingresa los datos de la nueva transacción de tarjeta.
                    </p>
                </div>

                <Link to="/transacciones" className="button button-secondary">
                    Volver
                </Link>
            </div>

            <section className="card">
                <div className="card-header">
                    <h2 className="card-title">Datos de la transacción</h2>
                </div>

                <form onSubmit={manejarSubmit} className="form">
                    <div className="form-grid">

                        <div className="form-group">
                            <label className="form-label" htmlFor="nro_tarjeta">
                                Tarjeta
                            </label>

                            <select
                                id="nro_tarjeta"
                                name="nro_tarjeta"
                                className="form-control"
                                value={formulario.nro_tarjeta}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="">Selecciona una tarjeta</option>

                                {tarjetas.map((tarjeta) => (
                                    <option
                                        key={tarjeta.NRO_TARJETA}
                                        value={tarjeta.NRO_TARJETA}
                                    >
                                        {tarjeta.NRO_TARJETA}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="nro_transaccion">
                                Número de transacción
                            </label>

                            <input
                                id="nro_transaccion"
                                name="nro_transaccion"
                                type="number"
                                min="1"
                                className="form-control"
                                value={formulario.nro_transaccion}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label
                                className="form-label"
                                htmlFor="cod_tptran_tarjeta"
                            >
                                Tipo de transacción
                            </label>

                            <select
                                id="cod_tptran_tarjeta"
                                name="cod_tptran_tarjeta"
                                className="form-control"
                                value={formulario.cod_tptran_tarjeta}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="">Selecciona un tipo</option>

                                {tiposTransaccion.map((tipo) => (
                                    <option
                                        key={tipo.COD_TPTRAN_TARJETA}
                                        value={tipo.COD_TPTRAN_TARJETA}
                                    >
                                        {tipo.NOMBRE_TPTRAN_TARJETA}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label
                                className="form-label"
                                htmlFor="fecha_transaccion"
                            >
                                Fecha de transacción
                            </label>

                            <input
                                id="fecha_transaccion"
                                name="fecha_transaccion"
                                type="date"
                                className="form-control"
                                value={formulario.fecha_transaccion}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label
                                className="form-label"
                                htmlFor="monto_transaccion"
                            >
                                Monto de transacción (CLP)
                            </label>

                            <input
                                id="monto_transaccion"
                                name="monto_transaccion"
                                type="number"
                                min="1"
                                step="1"
                                className="form-control"
                                value={formulario.monto_transaccion}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="nro_cuotas">
                                Número total de cuotas
                            </label>

                            <input
                                id="nro_cuotas"
                                name="total_cuotas_transaccion"
                                type="number"
                                min="1"
                                step="1"
                                className="form-control"
                                value={formulario.total_cuotas_transaccion}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="total_trans">
                                Monto total transacción
                            </label>

                            <input
                                id="total_trans"
                                name="monto_total_transaccion"
                                type="number"
                                min="1"
                                step="1"
                                className="form-control"
                                value={formulario.monto_total_transaccion}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="id_sucursal">
                                Sucursal
                            </label>

                            <select
                                id="id_sucursal"
                                name="id_sucursal"
                                className="form-control"
                                value={formulario.id_sucursal}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="">Selecciona un ID de la sucursal</option>

                                {sucursales.map((sucursal) => (
                                    <option
                                        key={sucursal.ID_SUCURSAL}
                                        value={sucursal.ID_SUCURSAL}
                                    >
                                        {sucursal.ID_SUCURSAL}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    {error && (
                        <div className="alert alert-error">{error}</div>
                    )}

                    {mensaje && (
                        <div className="alert alert-success">{mensaje}</div>
                    )}

                    <div className="form-actions">
                        <Link
                            to="/transacciones"
                            className="button button-secondary"
                        >
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            className="button button-primary"
                            disabled={guardando}
                        >
                            {guardando ? "Registrando..." : "Registrar transacción"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default TransaccionForm;