import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authService.login(email, password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Credenciales incorrectas o error en el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="flex-grow flex items-center justify-center px-lg py-xl">
      <div className="w-full max-w-md">
        <div className="mb-xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary mb-md shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-on-primary text-[32px]">
              construction
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            ToolMaster Pro
          </h1>
          <p className="font-body-md text-body-md text-secondary">
            Technical Asset Management
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-xl md:p-10">
          <div className="mb-lg">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">
              Iniciar Sesión
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Ingrese sus credenciales para acceder al panel de control.
            </p>
          </div>

          {error && (
            <div className="mb-md p-sm bg-error-container text-on-error-container font-body-sm text-body-sm rounded-lg border border-error/20 text-center">
              {error}
            </div>
          )}

          <form className="space-y-lg" onSubmit={handleLogin}>
            {/* Email */}
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="email">
                Correo electrónico
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  mail
                </span>
                <input
                  className="w-full pl-11 pr-md py-md bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline"
                  id="email"
                  name="email"
                  placeholder="admin"
                  required
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-xs">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">
                  Contraseña
                </label>
                <a className="font-label-md text-label-md text-primary hover:underline transition-all" href="#">
                  ¿Olvidó su contraseña?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  lock
                </span>
                <input
                  className="w-full pl-11 pr-11 py-md bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  onClick={togglePassword}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center gap-sm py-xs">
              <input
                className="w-4 h-4 text-primary bg-surface-container-low border-outline-variant rounded focus:ring-primary focus:ring-offset-0"
                id="remember"
                type="checkbox"
              />
              <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer" htmlFor="remember">
                Recordar mi sesión
              </label>
            </div>

            {/* Submit Button */}
            <button
              className={`w-full text-on-primary font-label-md text-label-md py-md rounded-lg shadow-sm active:scale-[0.98] transition-all flex justify-center items-center gap-sm ${
                isSuccess
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-primary hover:bg-primary-container"
              }`}
              disabled={isLoading || isSuccess}
              type="submit"
            >
              <span>
                {isLoading ? "Validando..." : isSuccess ? "Bienvenido" : "Iniciar Sesión"}
              </span>
              <span className={`material-symbols-outlined text-[20px] ${isLoading ? "animate-spin" : ""}`}>
                {isLoading ? "progress_activity" : isSuccess ? "check_circle" : "login"}
              </span>
            </button>
          </form>

          {/* Social */}
          <div className="mt-xl pt-xl border-t border-outline-variant flex flex-col gap-md items-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">O continuar con</p>
            <div className="flex gap-md w-full">
              <button className="flex-1 flex items-center justify-center gap-sm py-md border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors" type="button">
                <span className="material-symbols-outlined text-[20px]">google</span>
                Google
              </button>
              <button className="flex-1 flex items-center justify-center gap-sm py-md border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors" type="button">
                <span className="material-symbols-outlined text-[20px]">cloud</span>
                SSO
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-xl text-center">
          <p className="font-body-sm text-body-sm text-outline">
            © 2024 ToolMaster Pro Inc. Todos los derechos reservados.
          </p>
          <div className="mt-md flex justify-center gap-lg">
            <a className="font-label-sm text-label-sm text-outline hover:text-primary transition-colors" href="#">
              Privacidad
            </a>
            <a className="font-label-sm text-label-sm text-outline hover:text-primary transition-colors" href="#">
              Términos
            </a>
            <a className="font-label-sm text-label-sm text-outline hover:text-primary transition-colors" href="#">
              Soporte
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
