import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    obtenerClientePorId,
    registrarCliente,
    actualizarCliente
} from "../services/clientesService";

import {
    obtenerRegiones,
    obtenerProvincias,
    obtenerComunas,
    obtenerProfesiones,
    obtenerTiposCliente
} from "../services/catalogosService";

function ClienteForm() {
    const { numrun } = useParams();
    const navigate = useNavigate();

    const modoEdicion = Boolean(numrun);

    const [formulario, setFormulario] = useState({
        numrun: "",
        dvrun: "",
        pnombre: "",
        snombre: "",
        appaterno: "",
        apmaterno: "",
        fecha_nacimiento: "",
        fecha_inscripcion: "",
        correo: "",
        fono_contacto: "",
        direccion: "",
        cod_region: "",
        cod_provincia: "",
        cod_comuna: "",
        cod_prof_ofic: "",
        cod_tipo_cliente: ""
    });

    const [regiones, setRegiones] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [comunas, setComunas] = useState([]);
    const [profesiones, setProfesiones] = useState([]);
    const [tiposCliente, setTiposCliente] = useState([]);

    const [cargando, setCargando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        cargarCatalogos();
    }, []);

    useEffect(() => {
        if (modoEdicion) {
            cargarCliente();
        }
    }, [numrun]);

    async function cargarCatalogos() {
        try {
            const [
                listaRegiones,
                listaProfesiones,
                listaTiposCliente
            ] = await Promise.all([
                obtenerRegiones(),
                obtenerProfesiones(),
                obtenerTiposCliente()
            ]);

            setRegiones(listaRegiones);
            setProfesiones(listaProfesiones);
            setTiposCliente(listaTiposCliente);
        } catch (error) {
            console.error(error);
            setError("No fue posible cargar los datos del formulario.");
        }
    }

    function obtenerCampo(objeto, campo) {
        return objeto?.[campo] ?? objeto?.[campo.toUpperCase()] ?? "";
    }

    function fechaParaInput(valor) {
        if (!valor) return "";

        if (valor instanceof Date) {
            return valor.toISOString().slice(0, 10);
        }

        const texto = String(valor);

        if (/^\d{4}-\d{2}-\d{2}/.test(texto)) {
            return texto.slice(0, 10);
        }

        return "";
    }

    async function cargarCliente() {
        try {
            setCargando(true);
            setError("");

            const cliente = await obtenerClientePorId(numrun);

            const datos = {
                numrun: obtenerCampo(cliente, "numrun"),
                dvrun: obtenerCampo(cliente, "dvrun"),
                pnombre: obtenerCampo(cliente, "pnombre"),
                snombre: obtenerCampo(cliente, "snombre"),
                appaterno: obtenerCampo(cliente, "appaterno"),
                apmaterno: obtenerCampo(cliente, "apmaterno"),
                fecha_nacimiento: fechaParaInput(
                    obtenerCampo(cliente, "fecha_nacimiento")
                ),
                fecha_inscripcion: fechaParaInput(
                    obtenerCampo(cliente, "fecha_inscripcion")
                ),
                correo: obtenerCampo(cliente, "correo"),
                fono_contacto: obtenerCampo(cliente, "fono_contacto"),
                direccion: obtenerCampo(cliente, "direccion"),
                cod_region: obtenerCampo(cliente, "cod_region"),
                cod_provincia: obtenerCampo(cliente, "cod_provincia"),
                cod_comuna: obtenerCampo(cliente, "cod_comuna"),
                cod_prof_ofic: obtenerCampo(cliente, "cod_prof_ofic"),
                cod_tipo_cliente: obtenerCampo(cliente, "cod_tipo_cliente")
            };

            setFormulario(datos);

            if (datos.cod_region) {
                const listaProvincias = await obtenerProvincias(
                    datos.cod_region
                );

                setProvincias(listaProvincias);
            }

            if (datos.cod_region && datos.cod_provincia) {
                const listaComunas = await obtenerComunas(
                    datos.cod_region,
                    datos.cod_provincia
                );

                setComunas(listaComunas);
            }
        } catch (error) {
            console.error(error);
            setError("No fue posible cargar el cliente.");
        } finally {
            setCargando(false);
        }
    }

    async function cambiarRegion(codRegion) {
        setFormulario((actual) => ({
            ...actual,
            cod_region: codRegion,
            cod_provincia: "",
            cod_comuna: ""
        }));

        setProvincias([]);
        setComunas([]);

        if (!codRegion) return;

        try {
            const respuesta = await obtenerProvincias(codRegion);
            setProvincias(respuesta);
        } catch (error) {
            console.error(error);
            setError("No fue posible cargar las provincias.");
        }
    }

    async function cambiarProvincia(codProvincia) {
        setFormulario((actual) => ({
            ...actual,
            cod_provincia: codProvincia,
            cod_comuna: ""
        }));

        setComunas([]);

        if (!codProvincia || !formulario.cod_region) return;

        try {
            const respuesta = await obtenerComunas(
                formulario.cod_region,
                codProvincia
            );

            setComunas(respuesta);
        } catch (error) {
            console.error(error);
            setError("No fue posible cargar las comunas.");
        }
    }

    function manejarCambio(e) {
        const { name, value } = e.target;

        setFormulario((actual) => ({
            ...actual,
            [name]: value
        }));
    }

    async function manejarEnvio(e) {
        e.preventDefault();

        try {
            setGuardando(true);
            setError("");

            if (modoEdicion) {
                const { numrun: run, ...datos } = formulario;
                await actualizarCliente(run, datos);
            } else {
                await registrarCliente(formulario);
            }

            navigate("/clientes");
        } catch (error) {
            console.error(error);
            setError(
                error.message || "No fue posible guardar el cliente."
            );
        } finally {
            setGuardando(false);
        }
    }

    if (cargando) {
        return (
            <main className="page">
                <p className="loading">Cargando información del cliente...</p>
            </main>
        );
    }

    return (
        <main className="page">
            <header className="page-header">
                <div>
                    <h1 className="page-title">
                        {modoEdicion ? "Editar cliente" : "Nuevo cliente"}
                    </h1>

                    <p className="page-description">
                        {modoEdicion
                            ? "Modifica la información del cliente."
                            : "Completa los datos para registrar un cliente."}
                    </p>
                </div>
            </header>

            <section className="card">
                <form className="form" onSubmit={manejarEnvio}>
                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    <section>
                        <div className="card-header">
                            <h2 className="card-title">
                                Información personal
                            </h2>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label" htmlFor="numrun">
                                    RUN
                                </label>
                                <input
                                    id="numrun"
                                    name="numrun"
                                    className="form-control"
                                    value={formulario.numrun}
                                    onChange={manejarCambio}
                                    disabled={modoEdicion}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="dvrun">
                                    Dígito verificador
                                </label>
                                <input
                                    id="dvrun"
                                    name="dvrun"
                                    className="form-control"
                                    value={formulario.dvrun}
                                    onChange={manejarCambio}
                                    maxLength={1}
                                    required
                                />
                            </div>

                            {[
                                ["pnombre", "Primer nombre"],
                                ["snombre", "Segundo nombre"],
                                ["appaterno", "Apellido paterno"],
                                ["apmaterno", "Apellido materno"]
                            ].map(([campo, etiqueta]) => (
                                <div className="form-group" key={campo}>
                                    <label className="form-label" htmlFor={campo}>
                                        {etiqueta}
                                    </label>
                                    <input
                                        id={campo}
                                        name={campo}
                                        className="form-control"
                                        value={formulario[campo]}
                                        onChange={manejarCambio}
                                        required={campo !== "snombre"}
                                    />
                                </div>
                            ))}

                            <div className="form-group">
                                <label className="form-label" htmlFor="fecha_nacimiento">
                                    Fecha de nacimiento
                                </label>
                                <input
                                    id="fecha_nacimiento"
                                    name="fecha_nacimiento"
                                    type="date"
                                    className="form-control"
                                    value={formulario.fecha_nacimiento}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="fecha_inscripcion">
                                    Fecha de inscripción
                                </label>
                                <input
                                    id="fecha_inscripcion"
                                    name="fecha_inscripcion"
                                    type="date"
                                    className="form-control"
                                    value={formulario.fecha_inscripcion}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="correo">
                                    Correo electrónico
                                </label>
                                <input
                                    id="correo"
                                    name="correo"
                                    type="email"
                                    className="form-control"
                                    value={formulario.correo}
                                    onChange={manejarCambio}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="fono_contacto">
                                    Teléfono
                                </label>
                                <input
                                    id="fono_contacto"
                                    name="fono_contacto"
                                    className="form-control"
                                    value={formulario.fono_contacto}
                                    onChange={manejarCambio}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="direccion">
                                    Dirección
                                </label>
                                <input
                                    id="direccion"
                                    name="direccion"
                                    className="form-control"
                                    value={formulario.direccion}
                                    onChange={manejarCambio}
                                />
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="card-header">
                            <h2 className="card-title">
                                Ubicación y clasificación
                            </h2>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label" htmlFor="cod_region">
                                    Región
                                </label>
                                <select
                                    id="cod_region"
                                    name="cod_region"
                                    className="form-control"
                                    value={formulario.cod_region}
                                    onChange={(e) => cambiarRegion(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione una región</option>
                                    {regiones.map((region) => (
                                        <option
                                            key={obtenerCampo(region, "cod_region")}
                                            value={obtenerCampo(region, "cod_region")}
                                        >
                                            {obtenerCampo(region, "nombre_region")}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="cod_provincia">
                                    Provincia
                                </label>
                                <select
                                    id="cod_provincia"
                                    name="cod_provincia"
                                    className="form-control"
                                    value={formulario.cod_provincia}
                                    onChange={(e) => cambiarProvincia(e.target.value)}
                                    disabled={!formulario.cod_region}
                                    required
                                >
                                    <option value="">Seleccione una provincia</option>
                                    {provincias.map((provincia) => (
                                        <option
                                            key={obtenerCampo(provincia, "cod_provincia")}
                                            value={obtenerCampo(provincia, "cod_provincia")}
                                        >
                                            {obtenerCampo(provincia, "nombre_provincia")}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="cod_comuna">
                                    Comuna
                                </label>
                                <select
                                    id="cod_comuna"
                                    name="cod_comuna"
                                    className="form-control"
                                    value={formulario.cod_comuna}
                                    onChange={manejarCambio}
                                    disabled={!formulario.cod_provincia}
                                    required
                                >
                                    <option value="">Seleccione una comuna</option>
                                    {comunas.map((comuna) => (
                                        <option
                                            key={obtenerCampo(comuna, "cod_comuna")}
                                            value={obtenerCampo(comuna, "cod_comuna")}
                                        >
                                            {obtenerCampo(comuna, "nombre_comuna")}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="cod_prof_ofic">
                                    Profesión u oficio
                                </label>
                                <select
                                    id="cod_prof_ofic"
                                    name="cod_prof_ofic"
                                    className="form-control"
                                    value={formulario.cod_prof_ofic}
                                    onChange={manejarCambio}
                                    required
                                >
                                    <option value="">Seleccione una profesión</option>
                                    {profesiones.map((profesion) => (
                                        <option
                                            key={obtenerCampo(profesion, "cod_prof_ofic")}
                                            value={obtenerCampo(profesion, "cod_prof_ofic")}
                                        >
                                            {obtenerCampo(profesion, "desc_prof_ofic")}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="cod_tipo_cliente">
                                    Tipo de cliente
                                </label>
                                <select
                                    id="cod_tipo_cliente"
                                    name="cod_tipo_cliente"
                                    className="form-control"
                                    value={formulario.cod_tipo_cliente}
                                    onChange={manejarCambio}
                                    required
                                >
                                    <option value="">Seleccione un tipo</option>
                                    {tiposCliente.map((tipo) => (
                                        <option
                                            key={obtenerCampo(tipo, "cod_tipo_cliente")}
                                            value={obtenerCampo(tipo, "cod_tipo_cliente")}
                                        >
                                            {obtenerCampo(tipo, "nombre_tipo_cliente")}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    <div className="form-actions">
                        <Link
                            to="/clientes"
                            className="button button-secondary"
                        >
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            className="button button-primary"
                            disabled={guardando}
                        >
                            {guardando
                                ? "Guardando..."
                                : modoEdicion
                                    ? "Guardar cambios"
                                    : "Registrar cliente"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default ClienteForm;