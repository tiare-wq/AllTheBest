import { request } from "./api";

const BASE = "/transacciones";

export const obtenerTransacciones = () => request(BASE);
export const obtenerTransaccionesPorCliente = (numrun) =>
    request(`${BASE}/cliente/${encodeURIComponent(numrun)}`);
export const obtenerTransaccionPorId = (nroTarjeta, nroTransaccion) =>
    request(`${BASE}/${encodeURIComponent(nroTarjeta)}/${encodeURIComponent(nroTransaccion)}`);
export const registrarTransaccion = (transaccion) => request(BASE, {
    method: "POST",
    body: JSON.stringify(transaccion),
});
export const obtenerCuotas = (nroTarjeta, nroTransaccion) =>
    request(`${BASE}/${encodeURIComponent(nroTarjeta)}/${encodeURIComponent(nroTransaccion)}/cuotas`);
export const registrarPagoCuota = (nroTarjeta, nroTransaccion, nroCuota, pago) =>
    request(`${BASE}/${encodeURIComponent(nroTarjeta)}/${encodeURIComponent(nroTransaccion)}/cuotas/${encodeURIComponent(nroCuota)}/pagos`, {
        method: "POST",
        body: JSON.stringify(pago),
    });
