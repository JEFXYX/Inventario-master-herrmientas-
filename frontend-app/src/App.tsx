import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Categorias from "./pages/Categorias";
import Clientes from "./pages/Clientes";
import Ventas from "./pages/Ventas";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route path="" element={<Admin />}>
              <Route index element={<Dashboard />} />
              <Route path="productos" element={<Productos />} />
              <Route path="categorias" element={<Categorias />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="ventas" element={<Ventas />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
