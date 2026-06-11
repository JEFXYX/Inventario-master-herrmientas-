import { useState, useEffect } from "react";
import { api } from "../services/api";

interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
}

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategoria, setCurrentCategoria] = useState<Partial<Categoria>>({});

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    setIsLoading(true);
    try {
      const data = await api.get("/categorias");
      setCategorias(data || []);
    } catch (err: any) {
      setError(err.message || "Error al cargar categorías");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentCategoria.id) {
        await api.put(`/categorias/${currentCategoria.id}`, currentCategoria);
      } else {
        await api.post("/categorias", currentCategoria);
      }
      setIsEditing(false);
      setCurrentCategoria({});
      loadCategorias();
    } catch (err: any) {
      alert(err.message || "Error al guardar categoría");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    try {
      await api.delete(`/categorias/${id}`);
      loadCategorias();
    } catch (err: any) {
      alert(err.message || "Error al eliminar");
    }
  };

  return (
    <div className="p-xl">
      <div className="flex justify-between items-center mb-lg">
        <h2 className="font-headline-md text-headline-md text-on-surface">Gestión de Categorías</h2>
        <button 
          onClick={() => { setIsEditing(true); setCurrentCategoria({}); }}
          className="bg-primary hover:bg-primary-container text-on-primary py-sm px-md rounded-lg font-label-md transition-colors"
        >
          Nueva Categoría
        </button>
      </div>

      {error && <div className="text-error bg-error-container p-sm rounded-lg mb-md">{error}</div>}

      {isEditing ? (
        <div className="flex items-center justify-center py-lg">
          <div className="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded-xl shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-xl border-b border-outline-variant bg-surface-bright">
              <h2 className="text-headline-md font-headline-md text-on-surface">{currentCategoria.id ? "Editar Categoría" : "Añadir Nueva Categoría"}</h2>
              <p className="text-body-sm text-on-surface-variant mt-xs">Complete los detalles para registrar una nueva clasificación.</p>
            </div>
            <form onSubmit={handleSave} className="p-xl space-y-lg">
              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-on-surface">Nombre</label>
                <input required className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface transition-all text-body-md placeholder:text-outline/50" placeholder="Ej. Herramientas Eléctricas" value={currentCategoria.nombre || ""} onChange={e => setCurrentCategoria({...currentCategoria, nombre: e.target.value})} />
              </div>
              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-on-surface">Descripción</label>
                <textarea className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface transition-all text-body-md resize-none" rows={4} placeholder="Detalle la categoría..." value={currentCategoria.descripcion || ""} onChange={e => setCurrentCategoria({...currentCategoria, descripcion: e.target.value})}></textarea>
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
            <div className="text-center py-xl text-outline">Cargando categorías...</div>
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-surface-container border-b border-outline-variant font-label-md text-on-surface-variant">
                  <tr>
                    <th className="p-md">Nombre</th>
                    <th className="p-md">Descripción</th>
                    <th className="p-md">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant font-body-sm text-on-surface">
                  {categorias.length === 0 ? (
                    <tr><td colSpan={3} className="p-md text-center text-outline">No hay categorías.</td></tr>
                  ) : categorias.map(c => (
                    <tr key={c.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-md">{c.nombre}</td>
                      <td className="p-md">{c.descripcion}</td>
                      <td className="p-md flex gap-sm">
                        <button onClick={() => { setIsEditing(true); setCurrentCategoria(c); }} className="text-primary hover:underline">Editar</button>
                        <button onClick={() => handleDelete(c.id)} className="text-error hover:underline">Eliminar</button>
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
