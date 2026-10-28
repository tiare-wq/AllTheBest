import { request } from "./api";

const BASE = "/clientes";

export const obtenerClientes = () => request(BASE);
export const obtenerClientePorId = (numrun) => request(`${BASE}/${encodeURIComponent(numrun)}`);
export const registrarCliente = (cliente) => request(BASE, {
    method: "POST",
    body: JSON.stringify(cliente),
});
export const actualizarCliente = (numrun, cliente) => request(`${BASE}/${encodeURIComponent(numrun)}`, {
    method: "PUT",
    body: JSON.stringify(cliente),
});
