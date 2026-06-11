import { useState, useEffect } from "react";
import { api } from "../services/api";

interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio?: number;
  categoriaId?: number;
  categoria?: { id: number; nombre: string };
  stock?: number;
  estado?: string;
}

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentProducto, setCurrentProducto] = useState<Partial<Producto>>({});

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    setIsLoading(true);
    try {
      const data = await api.get("/productos");
      setProductos(data || []);
    } catch (err: any) {
      setError(err.message || "Error al cargar productos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentProducto.id) {
        await api.put(`/productos/${currentProducto.id}`, currentProducto);
      } else {
        await api.post("/productos", currentProducto);
      }
      setIsEditing(false);
      setCurrentProducto({});
      loadProductos();
    } catch (err: any) {
      alert(err.message || "Error al guardar producto");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await api.delete(`/productos/${id}`);
      loadProductos();
    } catch (err: any) {
      alert(err.message || "Error al eliminar");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Specific Page Header */}
      <div className="flex flex-col px-xl py-lg">
        <h1 className="text-headline-md font-headline-md font-bold text-primary">Gestión de Productos</h1>
        <nav className="hidden md:flex gap-md mt-1">
          <span className="text-body-sm text-outline">Inventory</span>
          <span className="text-body-sm text-outline">/</span>
          <span className="text-body-sm text-primary font-bold">All Products</span>
        </nav>
      </div>

      <div className="px-xl pb-xl space-y-lg flex-1 overflow-y-auto">
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
          <div className="flex gap-sm">
            <button className="px-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg text-label-md font-label-md hover:bg-surface-container transition-colors flex items-center gap-xs">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>filter_list</span>
              Filter
            </button>
            <button className="px-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg text-label-md font-label-md hover:bg-surface-container transition-colors flex items-center gap-xs">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>download</span>
              Export
            </button>
          </div>
          <button 
            onClick={() => { setIsEditing(true); setCurrentProducto({}); }}
            className="px-xl py-md bg-primary text-on-primary rounded-lg font-headline-md text-[16px] hover:bg-surface-tint shadow-sm transition-all flex items-center gap-sm"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add_circle</span>
            + Añadir Nuevo
          </button>
        </div>

        {error && <div className="text-error bg-error-container p-sm rounded-lg">{error}</div>}

        {isEditing ? (
          <div className="flex items-center justify-center py-lg">
            <div className="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded-xl shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-xl border-b border-outline-variant bg-surface-bright">
                <h2 className="text-headline-md font-headline-md text-on-surface">{currentProducto.id ? "Editar Producto" : "Añadir Nuevo Producto"}</h2>
                <p className="text-body-sm text-on-surface-variant mt-xs">Complete los detalles técnicos del activo para su registro en el inventario global.</p>
              </div>
              <form onSubmit={handleSave} className="p-xl space-y-lg">
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface">Nombre del Producto</label>
                  <input required className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface transition-all text-body-md placeholder:text-outline/50" placeholder="Ej. Taladro Percutor Industrial 18V" value={currentProducto.nombre || ""} onChange={e => setCurrentProducto({...currentProducto, nombre: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="space-y-xs">
                    <label className="font-label-md text-label-md text-on-surface">Categoría ID</label>
                    <input type="number" className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface transition-all text-body-md" placeholder="ID de categoría (opcional)" value={currentProducto.categoriaId || ""} onChange={e => setCurrentProducto({...currentProducto, categoriaId: parseInt(e.target.value) || undefined})} />
                  </div>
                  <div className="space-y-xs">
                    <label className="font-label-md text-label-md text-on-surface">Precio (€)</label>
                    <input required type="number" step="0.01" className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface transition-all text-body-md" placeholder="0.00" value={currentProducto.precio || ""} onChange={e => setCurrentProducto({...currentProducto, precio: parseFloat(e.target.value)})} />
                  </div>
                  <div className="space-y-xs md:col-span-2">
                    <label className="font-label-md text-label-md text-on-surface">Stock Inicial</label>
                    <input type="number" className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface transition-all text-body-md" placeholder="0" value={currentProducto.stock || ""} onChange={e => setCurrentProducto({...currentProducto, stock: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface">Descripción</label>
                  <textarea className="w-full px-md py-sm rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface transition-all text-body-md resize-none" rows={4} placeholder="Detalle las especificaciones técnicas, motor, autonomía y accesorios incluidos..." value={currentProducto.descripcion || ""} onChange={e => setCurrentProducto({...currentProducto, descripcion: e.target.value})}></textarea>
                </div>
                
                <div className="pt-xl flex flex-col-reverse md:flex-row justify-end gap-md border-t border-outline-variant mt-xl">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-xl py-md rounded-lg font-label-md text-label-md text-secondary hover:bg-surface-variant transition-all active:scale-95 text-center">Cancelar</button>
                  <button type="submit" className="px-xl py-md rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:bg-primary-container transition-all shadow-sm active:scale-95 flex items-center justify-center gap-sm">
                    <span className="material-symbols-outlined text-sm">save</span> Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <>
            {/* Bento Style Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
            <p className="text-label-sm text-outline uppercase tracking-wider">Total Herramientas</p>
            <div className="flex items-end justify-between mt-xs">
              <h3 className="text-headline-lg font-headline-lg">{productos.length}</h3>
              <span className="text-tertiary font-bold text-label-sm flex items-center">+12% <span className="material-symbols-outlined text-[14px]">trending_up</span></span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
            <p className="text-label-sm text-outline uppercase tracking-wider">In Stock</p>
            <div className="flex items-end justify-between mt-xs">
              <h3 className="text-headline-lg font-headline-lg text-primary">{productos.filter(p => (p.stock || 0) > 0).length}</h3>
              <div className="w-12 h-1 bg-surface-variant rounded-full overflow-hidden"><div className="bg-primary w-2/3 h-full"></div></div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm border-l-4 border-l-tertiary">
            <p className="text-label-sm text-outline uppercase tracking-wider">Low Stock</p>
            <div className="flex items-end justify-between mt-xs">
              <h3 className="text-headline-lg font-headline-lg text-tertiary">{productos.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 10).length}</h3>
              <span className="material-symbols-outlined text-tertiary">warning</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
            <p className="text-label-sm text-outline uppercase tracking-wider">Valor Inventario</p>
            <div className="flex items-end justify-between mt-xs">
              <h3 className="text-headline-lg font-headline-lg">${productos.reduce((acc, p) => acc + (p.precio || 0) * (p.stock || 0), 0).toFixed(1)}</h3>
              <span className="material-symbols-outlined text-outline">account_balance_wallet</span>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container text-outline border-b border-outline-variant">
                  <th className="px-xl py-md font-label-md text-label-md uppercase tracking-tighter">ID</th>
                  <th className="px-xl py-md font-label-md text-label-md uppercase tracking-tighter">Nombre</th>
                  <th className="px-xl py-md font-label-md text-label-md uppercase tracking-tighter">Categoría</th>
                  <th className="px-xl py-md font-label-md text-label-md uppercase tracking-tighter">Stock</th>
                  <th className="px-xl py-md font-label-md text-label-md uppercase tracking-tighter text-center">Estado</th>
                  <th className="px-xl py-md font-label-md text-label-md uppercase tracking-tighter text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {isLoading ? (
                  <tr><td colSpan={6} className="p-xl text-center text-outline">Cargando productos...</td></tr>
                ) : productos.length === 0 ? (
                  <tr><td colSpan={6} className="p-xl text-center text-outline">No hay productos registrados.</td></tr>
                ) : productos.map((p, idx) => {
                  const stock = p.stock || 0;
                  const isLowStock = stock > 0 && stock <= 10;
                  const isOutOfStock = stock === 0;

                  return (
                    <tr key={p.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-xl py-md text-body-sm font-mono text-outline">#TM-{(idx + 1).toString().padStart(3, '0')}</td>
                      <td className="px-xl py-md font-bold text-on-surface">{p.nombre}</td>
                      <td className="px-xl py-md text-body-sm text-secondary">{p.categoria?.nombre || "Sin Categoría"}</td>
                      <td className="px-xl py-md text-body-sm">{stock} units</td>
                      <td className="px-xl py-md">
                        <div className="flex justify-center">
                          {isOutOfStock ? (
                            <span className="px-sm py-1 bg-red-100 text-red-700 text-label-sm rounded flex items-center gap-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Out of Stock
                            </span>
                          ) : isLowStock ? (
                            <span className="px-sm py-1 bg-amber-100 text-amber-700 text-label-sm rounded flex items-center gap-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Low Stock
                            </span>
                          ) : (
                            <span className="px-sm py-1 bg-green-100 text-green-700 text-label-sm rounded flex items-center gap-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> In Stock
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-xl py-md text-right">
                        <div className="flex justify-end gap-md">
                          <button onClick={() => { setIsEditing(true); setCurrentProducto(p); }} className="text-secondary hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="text-secondary hover:text-error transition-colors">
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Pagination Footer */}
          <div className="px-xl py-md bg-surface-container flex items-center justify-between border-t border-outline-variant">
            <span className="text-body-sm text-outline">Mostrando {productos.length} productos</span>
            <div className="flex gap-xs">
              <button className="w-10 h-10 rounded border border-outline-variant flex items-center justify-center hover:bg-surface-container-lowest transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
              <button className="w-10 h-10 rounded bg-primary text-on-primary font-bold flex items-center justify-center">1</button>
              <button className="w-10 h-10 rounded border border-outline-variant flex items-center justify-center hover:bg-surface-container-lowest transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
          </div>
        </div>

        {/* Subtle Visual Graphic Section (Asymmetric) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg pt-xl">
          <div className="lg:col-span-2 bg-surface-container-lowest p-xl rounded-xl border border-outline-variant flex items-center gap-xl relative overflow-hidden">
            <div className="relative z-10 space-y-md max-w-md">
              <h4 className="text-headline-md font-headline-md text-primary">Análisis de Almacén</h4>
              <p className="text-body-md text-secondary leading-relaxed">Las herramientas neumáticas han mostrado un incremento del 24% en rotación este mes. Considera aumentar el stock de seguridad para evitar quiebres.</p>
              <button className="text-primary font-bold hover:underline flex items-center gap-xs">Ver informe detallado <span className="material-symbols-outlined">arrow_forward</span></button>
            </div>
            <div className="hidden md:block absolute right-[-20px] bottom-[-20px] opacity-10">
              <span className="material-symbols-outlined text-[240px]">query_stats</span>
            </div>
          </div>
          <div className="bg-primary p-xl rounded-xl text-on-primary flex flex-col justify-between shadow-lg">
            <div>
              <span className="material-symbols-outlined text-[48px]">inventory</span>
              <h4 className="text-headline-md font-headline-md mt-md">Inventario Óptimo</h4>
              <p className="text-body-sm opacity-80 mt-xs">Tu salud de inventario está en el 92%.</p>
            </div>
            <div className="w-full h-2 bg-on-primary/20 rounded-full mt-xl">
              <div className="w-[92%] h-full bg-on-primary rounded-full"></div>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
