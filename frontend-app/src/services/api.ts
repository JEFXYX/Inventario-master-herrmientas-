export const API_URL = "/api";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  } as Record<string, string>;

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && !endpoint.includes("/auth/")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Sesión expirada o token inválido. Por favor, inicie sesión nuevamente.");
    }

    let errorMsg = "Ocurrió un error en la solicitud";
    try {
      const data = await response.json();
      if (data.message) errorMsg = data.message;
      else if (data.error) errorMsg = data.error;
    } catch (e) {
      // Ignorar error de parsing
    }
    throw new Error(errorMsg);
  }

  // Handle 204 No Content
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  // Si no es JSON, lanzar un error claro en lugar de intentar parsear HTML
  throw new Error("El servidor no devolvió una respuesta válida (se esperaba JSON). Verifica que el backend esté corriendo.");
}

export const api = {
  get: (endpoint: string) => fetchApi(endpoint, { method: "GET" }),
  post: (endpoint: string, body: any) =>
    fetchApi(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: (endpoint: string, body: any) =>
    fetchApi(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: (endpoint: string) => fetchApi(endpoint, { method: "DELETE" }),
};
