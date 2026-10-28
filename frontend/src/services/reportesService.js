import { request } from "./api";

const BASE = "/reportes";

export const obtenerBalanceAnual = () => request(`${BASE}/balance-anual`);
export const obtenerBalancePorAnio = (anio) =>
    request(`${BASE}/balance-anual/${encodeURIComponent(anio)}`);
