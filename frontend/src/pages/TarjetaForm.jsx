import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrarTarjeta } from "../services/tarjetasService";

function TarjetaForm() {
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        nro_tarjeta: "",
        numrun: "",
        fecha_solic_tarjeta: new Date().toISOString().split("T")[0],
        dia_pago_mensual: "",
        cupo_compra: "",
        cupo_super_avance: "",
        cupo_disp_compra: "",
        cupo_disp_sp_avance: ""
    });

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    function manejarCambio(e) {
        const { name, value } = e.target;

        setFormulario(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function manejarEnvio(e) {
        e.preventDefault();
        setError("");

        const camposNumericos = [
            "nro_tarjeta",
            "numrun",
            "dia_pago_mensual",
            "cupo_compra",
            "cupo_super_avance",
            "cupo_disp_compra",
            "cupo_disp_sp_avance"
        ];

        for (const campo of camposNumericos) {
            if (formulario[campo] === "" || !Number.isFinite(Number(formulario[campo]))) {
                setError(`El campo ${campo} debe contener un número válido.`);
                return;
            }
        }

        if (
            Number(formulario.dia_pago_mensual) < 1 ||
            Number(formulario.dia_pago_mensual) > 31
        ) {
            setError("El día de pago debe estar entre 1 y 31.");
            return;
        }

        if (
            Number(formulario.cupo_disp_compra) > Number(formulario.cupo_compra) ||
            Number(formulario.cupo_disp_sp_avance) > Number(formulario.cupo_super_avance)
        ) {
            setError("El cupo disponible no puede superar el cupo total correspondiente.");
            return;
        }

        try {
            setCargando(true);

            const datosTarjeta = {
                ...formulario,
                nro_tarjeta: Number(formulario.nro_tarjeta),
                numrun: Number(formulario.numrun),
                dia_pago_mensual: Number(formulario.dia_pago_mensual),
                cupo_compra: Number(formulario.cupo_compra),
                cupo_super_avance: Number(formulario.cupo_super_avance),
                cupo_disp_compra: Number(formulario.cupo_disp_compra),
                cupo_disp_sp_avance: Number(formulario.cupo_disp_sp_avance)
            };

            await registrarTarjeta(datosTarjeta);

            navigate("/tarjetas");
        } catch (err) {
            setError(err.message || "No fue posible registrar la tarjeta.");
        } finally {
            setCargando(false);
        }
    }

    return (
        <main className="page">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Registrar tarjeta</h1>
                    <p className="page-description">
                        Ingresa toda la información de la tarjeta del cliente.
                    </p>
                </div>

                <Link to="/tarjetas" className="button button-secondary">
                    Volver
                </Link>
            </header>

            <section className="card">
                <div className="card-header">
                    <h2 className="card-title">Información de la tarjeta</h2>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form className="form" onSubmit={manejarEnvio}>
                    <div className="form-grid">

                        {/* Número de tarjeta */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="nro_tarjeta">
                                Número de tarjeta
                            </label>
                            <input
                                id="nro_tarjeta"
                                name="nro_tarjeta"
                                className="form-control"
                                type="number"
                                value={formulario.nro_tarjeta}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                        {/* RUN del cliente */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="numrun">
                                RUN del cliente (sin dígito verificador)
                            </label>
                            <input
                                id="numrun"
                                name="numrun"
                                className="form-control"
                                type="number"
                                value={formulario.numrun}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                        {/* Fecha de solicitud */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="fecha_solic_tarjeta">
                                Fecha de solicitud
                            </label>
                            <input
                                id="fecha_solic_tarjeta"
                                name="fecha_solic_tarjeta"
                                className="form-control"
                                type="date"
                                value={formulario.fecha_solic_tarjeta}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                        {/* Día de pago */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="dia_pago_mensual">
                                Día de pago mensual
                            </label>
                            <input
                                id="dia_pago_mensual"
                                name="dia_pago_mensual"
                                className="form-control"
                                type="number"
                                min="1"
                                max="31"
                                value={formulario.dia_pago_mensual}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                        {/* Cupo de compra */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="cupo_compra">
                                Cupo total de compras
                            </label>
                            <input
                                id="cupo_compra"
                                name="cupo_compra"
                                className="form-control"
                                type="number"
                                min="0"
                                value={formulario.cupo_compra}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                        {/* Cupo de súper avance */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="cupo_super_avance">
                                Cupo total de súper avances
                            </label>
                            <input
                                id="cupo_super_avance"
                                name="cupo_super_avance"
                                className="form-control"
                                type="number"
                                min="0"
                                value={formulario.cupo_super_avance}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                        {/* Cupo disponible de compra */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="cupo_disp_compra">
                                Cupo disponible de compras
                            </label>
                            <input
                                id="cupo_disp_compra"
                                name="cupo_disp_compra"
                                className="form-control"
                                type="number"
                                min="0"
                                value={formulario.cupo_disp_compra}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                        {/* Cupo disponible de súper avance */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="cupo_disp_sp_avance">
                                Cupo disponible de súper avances
                            </label>
                            <input
                                id="cupo_disp_sp_avance"
                                name="cupo_disp_sp_avance"
                                className="form-control"
                                type="number"
                                min="0"
                                value={formulario.cupo_disp_sp_avance}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                    </div>

                    <div className="form-actions">
                        <Link to="/tarjetas" className="button button-secondary">
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            className="button button-primary"
                            disabled={cargando}
                        >
                            {cargando ? "Guardando..." : "Registrar tarjeta"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default TarjetaForm;