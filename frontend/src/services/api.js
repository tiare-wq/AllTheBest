const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/$/, "");

export async function request(endpoint, options = {}) {
    const { headers, ...config } = options;

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...config,
        headers: {
            ...(config.body ? { "Content-Type": "application/json" } : {}),
            ...headers,
        },
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        const message = typeof data === "object" && data !== null
            ? data.error || data.mensaje || `Error HTTP ${response.status}`
            : data || `Error HTTP ${response.status}`;
        throw new Error(message);
    }

    return data;
}

export function queryString(params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, value);
        }
    });

    const result = query.toString();
    return result ? `?${result}` : "";
}
