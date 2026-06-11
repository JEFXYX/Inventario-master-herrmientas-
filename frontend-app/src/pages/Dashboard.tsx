import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProductos: 0,
    ventasTotal: 0,
    clientesActivos: 0,
    alertasStock: 0
  });
  
  const [recentVentas, setRecentVentas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productos, ventas, clientes] = await Promise.all([
        api.get("/productos").catch(() => []),
        api.get("/ventas").catch(() => []),
        api.get("/clientes").catch(() => [])
      ]);

      const totalProductos = productos.length;
      const ventasTotal = ventas.reduce((acc: number, v: any) => acc + Number(v.total), 0);
      const clientesActivos = clientes.length;
      const alertasStock = productos.filter((p: any) => p.stock <= 10).length;

      setStats({
        totalProductos,
        ventasTotal,
        clientesActivos,
        alertasStock
      });

      // Show top 5 recent ventas
      setRecentVentas(ventas.slice(0, 5));

    } catch (err) {
      console.error("Error loading dashboard data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-lg lg:p-xl space-y-xl w-full">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Dashboard Overview</h2>
          <p className="text-body-md text-on-surface-variant">Real-time operational metrics and inventory health.</p>
        </div>
        <div className="flex gap-md">
          <button className="px-lg py-md rounded-lg border border-outline-variant font-label-md text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-sm">
            <span className="material-symbols-outlined">download</span> Export Reports
          </button>
          <button onClick={loadData} className="px-lg py-md rounded-lg bg-primary text-on-primary font-label-md hover:opacity-90 transition-opacity shadow-lg flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">refresh</span> {isLoading ? "Cargando..." : "Refresh Data"}
          </button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
        {/* Stat Card: Total Productos */}
        <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-label-md font-label-md text-on-surface-variant mb-xs">Total Productos</p>
              <h3 className="text-headline-lg font-headline-lg text-on-surface">{isLoading ? "..." : stats.totalProductos}</h3>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
            </div>
          </div>
        </div>

        {/* Stat Card: Ventas Totales */}
        <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-label-md font-label-md text-on-surface-variant mb-xs">Ventas (Ingresos)</p>
              <h3 className="text-headline-lg font-headline-lg text-on-surface">${isLoading ? "..." : stats.ventasTotal.toFixed(2)}</h3>
            </div>
            <div className="w-12 h-12 rounded-lg bg-tertiary-container/10 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            </div>
          </div>
        </div>

        {/* Stat Card: Clientes Activos */}
        <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-label-md font-label-md text-on-surface-variant mb-xs">Clientes Registrados</p>
              <h3 className="text-headline-lg font-headline-lg text-on-surface">{isLoading ? "..." : stats.clientesActivos}</h3>
            </div>
            <div className="w-12 h-12 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
            </div>
          </div>
        </div>

        {/* Stat Card: Alertas de Stock */}
        <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-label-md font-label-md text-on-surface-variant mb-xs">Alertas de Stock</p>
              <h3 className={`text-headline-lg font-headline-lg ${stats.alertasStock > 0 ? 'text-error' : 'text-green-600'}`}>
                {isLoading ? "..." : stats.alertasStock}
              </h3>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${stats.alertasStock > 0 ? 'bg-error-container/20 text-error' : 'bg-green-100 text-green-600'}`}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{stats.alertasStock > 0 ? 'warning' : 'check_circle'}</span>
            </div>
          </div>
          {stats.alertasStock > 0 && !isLoading && (
            <div className="mt-lg flex items-center gap-xs text-label-sm text-error">
              <span className="material-symbols-outlined text-[16px]">priority_high</span>
              <span>{stats.alertasStock} items con bajo stock</span>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low/30">
          <h3 className="font-headline-md text-headline-md text-on-surface">Ventas Recientes</h3>
          <div className="flex items-center gap-md">
            <span className="text-label-md text-on-surface-variant">Mostrando últimas 5</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-lg py-md font-label-md text-on-surface-variant text-label-md border-b border-outline-variant">ID Venta</th>
                <th className="px-lg py-md font-label-md text-on-surface-variant text-label-md border-b border-outline-variant">Cliente</th>
                <th className="px-lg py-md font-label-md text-on-surface-variant text-label-md border-b border-outline-variant">Total</th>
                <th className="px-lg py-md font-label-md text-on-surface-variant text-label-md border-b border-outline-variant">Fecha</th>
                <th className="px-lg py-md font-label-md text-on-surface-variant text-label-md border-b border-outline-variant text-right">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {isLoading ? (
                <tr><td colSpan={5} className="p-xl text-center text-outline">Cargando actividad...</td></tr>
              ) : recentVentas.length === 0 ? (
                <tr><td colSpan={5} className="p-xl text-center text-outline">No hay ventas recientes.</td></tr>
              ) : recentVentas.map(venta => (
                <tr key={venta.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-lg py-md text-body-sm font-medium">#VNT-{venta.id}</td>
                  <td className="px-lg py-md">
                    <div className="flex items-center gap-md">
                      <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[18px]">person</span>
                      </div>
                      <div>
                        <p className="text-body-sm font-semibold">{venta.cliente?.nombres} {venta.cliente?.apellidos}</p>
                        <p className="text-xs text-on-surface-variant">{venta.cliente?.identificacion}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-lg py-md font-bold text-tertiary">
                    ${Number(venta.total).toFixed(2)}
                  </td>
                  <td className="px-lg py-md text-body-sm text-on-surface-variant">{new Date(venta.fecha).toLocaleDateString()}</td>
                  <td className="px-lg py-md text-right text-body-sm">
                    {venta.detalles?.length || 0} prod.
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
