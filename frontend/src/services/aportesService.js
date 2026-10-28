import { request } from "./api";

const BASE = "/aportes";

export const obtenerTramosAporte = () => request(`${BASE}/tramos`);
export const obtenerAportesCliente = (numrun) =>
    request(`${BASE}/cliente/${encodeURIComponent(numrun)}`);
export const obtenerResumenAportes = () => request(`${BASE}/resumen`);
