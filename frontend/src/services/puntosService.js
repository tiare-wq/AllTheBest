import { request } from "./api";

const BASE = "/puntos";

export const obtenerPuntos = () => request(BASE);
export const obtenerPuntosCliente = (numrun) =>
    request(`${BASE}/cliente/${encodeURIComponent(numrun)}`);
export const obtenerPuntosVigentes = (numrun) =>
    request(`${BASE}/cliente/${encodeURIComponent(numrun)}/vigentes`);
export const obtenerResumenPuntos = () => request(`${BASE}/resumen`);
