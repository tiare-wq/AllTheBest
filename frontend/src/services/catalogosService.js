import { request, queryString } from "./api";

const BASE = "/catalogos";

export const obtenerTiposCliente = () => request(`${BASE}/tipos-cliente`);
export const obtenerProfesiones = () => request(`${BASE}/profesiones`);
export const obtenerRegiones = () => request(`${BASE}/regiones`);
export const obtenerProvincias = (cod_region) =>
    request(`${BASE}/provincias${queryString({ cod_region })}`);
export const obtenerComunas = (cod_region, cod_provincia) =>
    request(`${BASE}/comunas${queryString({ cod_region, cod_provincia })}`);
export const obtenerTiposTransaccion = () => request(`${BASE}/tipos-transaccion`);

// Requiere agregar GET /productos en catalogos.routes.js.
export const obtenerProductos = () => request(`${BASE}/productos`);
