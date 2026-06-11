import { useState, useEffect } from "react";
import { api } from "../services/api";

interface Cliente {
  id: string;
  identificacion: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [currentCliente, setCurrentCliente] = useState<Partial<Cliente>>({});

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    setIsLoading(true);
    try {
      const data = await api.get("/clientes");
      setClientes(data || []);
    } catch (err: any) {
      setError(err.message || "Error al cargar clientes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentCliente.id) {
        await api.put(`/clientes/${currentCliente.id}`, currentCliente);
      } else {
        await api.post("/clientes", currentCliente);
      }
      setIsEditing(false);
      setCurrentCliente({});
      loadClientes();
    } catch (err: any) {
      alert(err.message || "Error al guardar cliente");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este cliente?")) return;
    try {
      await api.delete(`/clientes/${id}`);
      loadClientes();
    } catch (err: any) {
      alert(err.message || "Error al eliminar");
    }
  };

  return (
    <div className="p-xl">
      <div className="flex justify-between items-center mb-lg">
        <h2 className="font-headline-md text-headline-md text-on-surface">Listado de Clientes</h2>
        <button 
          onClick={() => { setIsEditing(true); setCurrentCliente({}); }}
          className="bg-primary hover:bg-primary-container text-on-primary py-sm px-md rounded-lg font-label-md transition-colors"
        >
          Nuevo Cliente
        </button>
      </div>

      {error && <div className="text-error bg-error-container p-sm rounded-lg mb-md">{error}</div>}

      {isEditing ? (
        <div className="flex items-center justify-center py-lg">
          <div className="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded-xl shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-xl border-b border-outline-variant bg-surface-bright">
              <h2 className="text-headline-md font-headline-md text-on-surface">{currentCliente.id ? "Editar Cliente" : "Añadir Nuevo Cliente"}</h2>
              <p className="text-body-sm text-on-surface-variant mt-xs">Complete los detalles de contacto para registrar un cliente.</p>
            </div>
            <form onSubmit={handleSave} className="p-xl space-y-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface">Identificación (DNI/RUC)</label>
                  <input required className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface transition-all text-body-md" placeholder="Ej. 1234567890" value={currentCliente.identificacion || ""} onChange={e => setCurrentCliente({...currentCliente, identificacion: e.target.value})} />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface">Dirección</label>
                  <input required className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface transition-all text-body-md" placeholder="Ej. Calle Principal 123" value={currentCliente.direccion || ""} onChange={e => setCurrentCliente({...currentCliente, direccion: e.target.value})} />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface">Nombres</label>
                  <input required className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface transition-all text-body-md" placeholder="Ej. Juan" value={currentCliente.nombres || ""} onChange={e => setCurrentCliente({...currentCliente, nombres: e.target.value})} />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface">Apellidos</label>
                  <input required className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface transition-all text-body-md" placeholder="Ej. Pérez" value={currentCliente.apellidos || ""} onChange={e => setCurrentCliente({...currentCliente, apellidos: e.target.value})} />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface">Email</label>
                  <input required type="email" className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface transition-all text-body-md" placeholder="correo@ejemplo.com" value={currentCliente.email || ""} onChange={e => setCurrentCliente({...currentCliente, email: e.target.value})} />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface">Teléfono</label>
                  <input required type="tel" className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface transition-all text-body-md" placeholder="+34 600 000 000" value={currentCliente.telefono || ""} onChange={e => setCurrentCliente({...currentCliente, telefono: e.target.value})} />
                </div>
              </div>
              
              <div className="pt-xl flex flex-col-reverse md:flex-row justify-end gap-md border-t border-outline-variant mt-xl">
                <button type="button" onClick={() => setIsEditing(false)} className="px-xl py-md rounded-lg font-label-md text-label-md text-secondary hover:bg-surface-variant transition-all active:scale-95 text-center">Cancelar</button>
                <button type="submit" className="px-xl py-md rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:bg-primary-container transition-all shadow-sm active:scale-95 flex items-center justify-center gap-sm">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>save</span> Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="text-center py-xl text-outline">Cargando clientes...</div>
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-surface-container border-b border-outline-variant font-label-md text-on-surface-variant">
                  <tr>
                    <th className="p-md">Identificación</th>
                    <th className="p-md">Nombres</th>
                    <th className="p-md">Apellidos</th>
                    <th className="p-md">Email</th>
                    <th className="p-md">Teléfono</th>
                    <th className="p-md">Dirección</th>
                    <th className="p-md text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant font-body-sm text-on-surface">
                  {clientes.length === 0 ? (
                    <tr><td colSpan={4} className="p-md text-center text-outline">No hay clientes registrados.</td></tr>
                  ) : clientes.map(c => (
                    <tr key={c.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-md font-mono text-outline-variant">{c.identificacion}</td>
                      <td className="p-md">{c.nombres}</td>
                      <td className="p-md">{c.apellidos}</td>
                      <td className="p-md">{c.email}</td>
                      <td className="p-md">{c.telefono}</td>
                      <td className="p-md text-sm">{c.direccion}</td>
                      <td className="p-md flex gap-sm justify-end">
                        <button onClick={() => { setIsEditing(true); setCurrentCliente(c); }} className="text-secondary hover:text-primary transition-colors"><span className="material-symbols-outlined">edit</span></button>
                        <button onClick={() => handleDelete(c.id)} className="text-secondary hover:text-error transition-colors"><span className="material-symbols-outlined">delete</span></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
