import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div>
      <h1>Bienvenido al Sistema de Inventario</h1>
      <nav>
        <Link to="/login">Iniciar Sesión</Link>
        <Link to="/admin">Panel Administrativo</Link>
      </nav>
    </div>
  );
}
