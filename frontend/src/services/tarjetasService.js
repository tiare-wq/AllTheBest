import { request } from "./api";

const BASE = "/tarjetas";

export const obtenerTarjetas = () => request(BASE);
export const obtenerTarjetaPorId = (nroTarjeta) =>
    request(`${BASE}/${encodeURIComponent(nroTarjeta)}`);
export const obtenerTarjetasPorCliente = (numrun) =>
    request(`${BASE}/cliente/${encodeURIComponent(numrun)}`);
export const registrarTarjeta = (tarjeta) => request(BASE, {
    method: "POST",
    body: JSON.stringify(tarjeta),
});
