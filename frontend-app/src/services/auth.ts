import { api } from "./api";

export const authService = {
  login: async (email: string, password: string) => {
    try {
      // Intentar login real
      const data = await api.post("/auth/login", { email, password });
      if (data && data.accessToken) {
        localStorage.setItem("token", data.accessToken);
      }
      return data;
    } catch (err: any) {
      // Si el usuario no existe (primera vez en la bd limpia), lo registramos automáticamente
      if (err.message.includes("Invalid credentials") || err.message.includes("not found")) {
        try {
          const registerData = await api.post("/auth/register", { email, password, rol: "admin" });
          if (registerData && registerData.accessToken) {
            localStorage.setItem("token", registerData.accessToken);
          }
          return registerData;
        } catch (regErr) {
          throw err; // Lanza el error original si el registro también falla
        }
      }
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};
