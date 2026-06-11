import { useState, useEffect } from "react";
import { api } from "../services/api";

interface Venta {
  id: string;
  fecha: string;
  total: number;
  clienteId?: number;
  cliente?: { nombres: string; apellidos: string; identificacion: string };
  detalles?: { productoId: number; cantidad: number; producto?: { nombre: string } }[];
  
  // For the form input:
  productoId?: number;
  cantidad?: number;
}

export default function Ventas() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [currentVenta, setCurrentVenta] = useState<Partial<Venta>>({});

  useEffect(() => {
    loadVentas();
  }, []);

  const loadVentas = async () => {
    setIsLoading(true);
    try {
      const data = await api.get("/ventas");
      setVentas(data || []);
    } catch (err: any) {
      setError(err.message || "Error al cargar ventas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentVenta.id) {
        // El backend no tiene update implementado para ventas en el controller
        alert("La edición de ventas no está permitida por el backend.");
        return;
      } else {
        const payload = {
          clienteId: currentVenta.clienteId,
          detalles: [
            {
              productoId: currentVenta.productoId,
              cantidad: currentVenta.cantidad || 1
            }
          ]
        };
        await api.post("/ventas", payload);
      }
      setIsEditing(false);
      setCurrentVenta({});
      loadVentas();
    } catch (err: any) {
      alert(err.message || "Error al guardar venta");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este registro de venta?")) return;
    try {
      await api.delete(`/ventas/${id}`);
      loadVentas();
    } catch (err: any) {
      alert(err.message || "Error al eliminar");
    }
  };

  return (
    <div className="p-xl">
      <div className="flex justify-between items-center mb-lg">
        <h2 className="font-headline-md text-headline-md text-on-surface">Registro de Ventas</h2>
        <button 
          onClick={() => { setIsEditing(true); setCurrentVenta({}); }}
          className="bg-primary hover:bg-primary-container text-on-primary py-sm px-md rounded-lg font-label-md transition-colors"
        >
          Nueva Venta
        </button>
      </div>

      {error && <div className="text-error bg-error-container p-sm rounded-lg mb-md">{error}</div>}

      {isEditing ? (
        <div className="flex items-center justify-center py-lg">
          <div className="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded-xl shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-xl border-b border-outline-variant bg-surface-bright">
              <h2 className="text-headline-md font-headline-md text-on-surface">{currentVenta.id ? "Editar Venta" : "Registrar Nueva Venta"}</h2>
              <p className="text-body-sm text-on-surface-variant mt-xs">Ingrese los detalles de la transacción de venta.</p>
            </div>
            <form onSubmit={handleSave} className="p-xl space-y-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface">Cliente ID</label>
                  <input required type="number" className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface transition-all text-body-md" placeholder="ID del Cliente" value={currentVenta.clienteId || ""} onChange={e => setCurrentVenta({...currentVenta, clienteId: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface">Producto ID</label>
                  <input required type="number" className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface transition-all text-body-md" placeholder="ID del Producto" value={currentVenta.productoId || ""} onChange={e => setCurrentVenta({...currentVenta, productoId: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface">Cantidad</label>
                  <input required type="number" min="1" className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface transition-all text-body-md" placeholder="1" value={currentVenta.cantidad || ""} onChange={e => setCurrentVenta({...currentVenta, cantidad: parseInt(e.target.value)})} />
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
            <div className="text-center py-xl text-outline">Cargando ventas...</div>
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-surface-container border-b border-outline-variant font-label-md text-on-surface-variant">
                  <tr>
                    <th className="p-md">ID Venta</th>
                    <th className="p-md">Fecha</th>
                    <th className="p-md">Cliente</th>
                    <th className="p-md">Total</th>
                    <th className="p-md text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant font-body-sm text-on-surface">
                  {ventas.length === 0 ? (
                    <tr><td colSpan={5} className="p-md text-center text-outline">No hay ventas registradas.</td></tr>
                  ) : ventas.map(v => (
                    <tr key={v.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-md text-outline">#{v.id}</td>
                      <td className="p-md">{new Date(v.fecha).toLocaleDateString()}</td>
                      <td className="p-md">{v.cliente?.nombres} {v.cliente?.apellidos}</td>
                      <td className="p-md font-bold">${v.total}</td>
                      <td className="p-md flex gap-sm justify-end">
                        <button onClick={() => { setIsEditing(true); setCurrentVenta(v); }} className="text-secondary hover:text-primary transition-colors"><span className="material-symbols-outlined">edit</span></button>
                        <button onClick={() => handleDelete(v.id)} className="text-secondary hover:text-error transition-colors"><span className="material-symbols-outlined">delete</span></button>
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
